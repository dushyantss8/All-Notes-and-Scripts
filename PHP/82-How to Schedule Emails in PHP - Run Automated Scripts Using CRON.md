# Building an Email Queue System in PHP Using Cron and CLI Workers

Sending emails synchronously during a user request can significantly slow down response times. A better approach is to **queue emails in the database** and process them asynchronously using a **background worker** executed on a schedule.

This guide walks through implementing an email queue system in PHP using:

* Database-backed email queues
* CLI scripts for background processing
* A mail service abstraction
* Cron jobs for automation
* Docker-based cron execution

---

## 1. Why Queue Emails?

Email delivery can take several seconds due to SMTP latency or third-party providers. Blocking a user request until an email is sent results in poor UX.

**Solution**:

* Save emails to a database queue
* Return the HTTP response immediately
* Send emails asynchronously using a background process

---

## 2. Database Design for Email Queue

Create an `emails` table to store queued messages.

### Example Table Structure

```sql
CREATE TABLE emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    text_body TEXT,
    html_body TEXT,
    metadata JSON NOT NULL,
    status TINYINT NOT NULL,
    created_at DATETIME NOT NULL,
    sent_at DATETIME NULL
);
```

### Metadata Column

The `metadata` JSON column stores sender and recipient details:

```json
{
  "to": { "email": "user@example.com", "name": "" },
  "from": { "email": "support@example.com", "name": "Support" }
}
```

---

## 3. Email Status Enum

Define a backed enum to represent email state.

```php
enum EmailStatus: int
{
    case QUEUED = 0;
    case SENT   = 1;
    case FAILED = 2;
}
```

This ensures type safety and avoids magic numbers.

---

## 4. Email Model: Queueing Emails

Create an `Email` model responsible for interacting with the `emails` table.

### Queue Method

```php
use Symfony\Component\Mime\Address;

class Email
{
    public function queue(
        Address $to,
        Address $from,
        string $subject,
        string $textBody,
        string $htmlBody
    ): void {
        $stmt = $this->db->prepare(
            'INSERT INTO emails (subject, text_body, html_body, metadata, status, created_at)
             VALUES (:subject, :text, :html, :meta, :status, NOW())'
        );

        $stmt->execute([
            'subject' => $subject,
            'text'    => $textBody,
            'html'    => $htmlBody,
            'meta'    => json_encode([
                'to'   => ['email' => $to->getAddress(), 'name' => $to->getName()],
                'from' => ['email' => $from->getAddress(), 'name' => $from->getName()],
            ]),
            'status'  => EmailStatus::QUEUED->value,
        ]);
    }
}
```

---

## 5. Queue Emails Instead of Sending Immediately

In the controller, replace direct email sending with queue insertion.

```php
use Symfony\Component\Mime\Address;

$email->queue(
    new Address($userEmail),
    new Address('support@example.com', 'Support'),
    'Welcome',
    'Welcome to our platform',
    '<h1>Welcome</h1>'
);
```

**Result**:

* Request completes instantly
* Email is stored with status `QUEUED`
* No SMTP call during HTTP request

---

## 6. Creating a CLI Email Worker Script

Emails must be sent by a background process.

### Script Location

```
/scripts/email.php
```

This script runs via CLI, not the browser.

---

## 7. Bootstrapping the Application for CLI

Your application bootstrap must support **non-HTTP execution**.

### App Class Changes

* Make router optional
* Provide default request data
* Add a `boot()` method

```php
class App
{
    public function boot(): self
    {
        $this->config = require BASE_PATH . '/config/app.php';
        $this->bindServices();

        return $this;
    }
}
```

### CLI Script Bootstrap

```php
require __DIR__ . '/../vendor/autoload.php';

$app = new App();
$app->boot();
```

---

## 8. Email Service for Processing Queued Emails

Encapsulate sending logic inside a service class.

### EmailService Constructor

```php
class EmailService
{
    public function __construct(
        private Email $emailModel,
        private MailerInterface $mailer
    ) {}
```

---

### Fetch and Send Queued Emails

```php
public function sendQueuedEmails(): void
{
    $emails = $this->emailModel->getByStatus(EmailStatus::QUEUED);

    foreach ($emails as $email) {
        $meta = json_decode($email['metadata'], true);

        $message = (new EmailMessage())
            ->subject($email['subject'])
            ->from(new Address($meta['from']['email'], $meta['from']['name']))
            ->to(new Address($meta['to']['email'], $meta['to']['name']))
            ->text($email['text_body'])
            ->html($email['html_body']);

        $this->mailer->send($message);

        $this->emailModel->markAsSent($email['id']);
    }
}
```

---

## 9. Updating Email Status After Sending

```php
public function markAsSent(int $id): void
{
    $stmt = $this->db->prepare(
        'UPDATE emails SET status = :status, sent_at = NOW() WHERE id = :id'
    );

    $stmt->execute([
        'status' => EmailStatus::SENT->value,
        'id'     => $id,
    ]);
}
```

---

## 10. Running the Worker Manually

```bash
php scripts/email.php
```

* Emails are sent
* Status changes from `QUEUED` → `SENT`
* `sent_at` timestamp is populated

---

## 11. Automating with Cron

Manual execution is not scalable. Cron solves this.

### Cron Field Breakdown

```
* * * * * command
| | | | |
| | | | └─ Day of week (0–6)
| | | └── Month (1–12)
| | └─── Day of month (1–31)
| └──── Hour (0–23)
└───── Minute (0–59)
```

### Every 2 Minutes

```
*/2 * * * * php /app/scripts/email.php
```

---

## 12. Running Cron in Docker

Cron runs in a **separate container**.

### Dockerfile (cron container)

```dockerfile
FROM php:8.1-fpm-alpine

COPY crontab /etc/crontabs/root

RUN mkdir -p /var/log/cron

CMD ["crond", "-f", "-l", "2"]
```

### crontab File

```
*/2 * * * * php /app/scripts/email.php >> /var/log/cron/cron.log 2>&1
```

### docker-compose.yml (excerpt)

```yaml
cron:
  build: ./docker/cron
  volumes:
    - .:/app
    - ./logs:/var/log/cron
```

---

## 13. End-to-End Flow

1. User submits form
2. Email is queued in database
3. Cron runs every 2 minutes
4. CLI worker fetches queued emails
5. Emails are sent
6. Status updated to `SENT`

---

## 14. Attachments (Design Guidance)

Attachments are **not implemented**, but recommended architecture:

* Save files to filesystem or S3
* Store file paths in:

  * `email_attachments` table
* Load attachments during send phase
* Attach files dynamically

---

## 15. Key Notes, Best Practices, and Considerations

### Architecture

* Always queue emails — never send in controllers
* Use CLI workers for background tasks
* Separate HTTP and background execution paths

### Reliability

* Wrap send logic in `try/catch`
* Mark failed emails with `FAILED` status
* Log exceptions for retries

### Scalability

* Add batch limits when fetching emails
* Run multiple workers if volume grows
* Index `status` column for performance

### Security

* Validate email metadata before sending
* Never trust serialized JSON blindly

### Extensibility

* Add retry counts
* Add delayed scheduling
* Support multiple attachments via related tables

---