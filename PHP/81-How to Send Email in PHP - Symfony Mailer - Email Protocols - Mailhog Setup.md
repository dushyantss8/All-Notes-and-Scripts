# Sending Emails in PHP Using Symfony Mailer

This tutorial explains how to send emails correctly in PHP using **Symfony Mailer**. It covers email protocols, setting up a local SMTP server for testing, composing and sending emails, using HTML and attachments, managing configuration with environment variables, and integrating the mailer cleanly using dependency injection.

---

## 1. Why Not Use PHP’s `mail()` Function?

PHP provides a built-in `mail()` function, but it has several limitations:

* Poor deliverability control
* No native support for attachments
* No support for modern transports (SMTP services, APIs)
* Hard to debug and test locally

For these reasons, modern PHP applications use external libraries.
**SwiftMailer** was widely used in the past but has been retired.
The recommended replacement is **Symfony Mailer**, which is actively maintained and highly extensible.

---

## 2. Email Protocol Basics

Before sending emails, it is important to understand the underlying protocols.

### 2.1 SMTP (Simple Mail Transfer Protocol)

* Used for **sending** emails
* Handles communication between:

  * Email client → Email server
  * Email server → Another email server
* Uses a TCP connection and command-based communication

### 2.2 POP3 (Post Office Protocol v3)

* Used for **receiving** emails
* Downloads emails from the server
* By default, removes emails from the server after retrieval

### 2.3 IMAP (Internet Message Access Protocol)

* Used for **receiving** emails
* Emails remain on the server
* Supports synchronization across multiple devices
* Generally preferred over POP3

**Key takeaway:**

* SMTP → Sending emails
* IMAP / POP3 → Receiving emails

---

## 3. Installing Symfony Mailer

Install Symfony Mailer using Composer:

```bash
composer require symfony/mailer
```

This command installs:

* `symfony/mailer`
* `symfony/mime` (used to construct email messages)

---

## 4. Core Components of Symfony Mailer

To send an email, three components are required:

1. **Email message** – the content of the email
2. **Transport** – how the email is delivered (SMTP, API, etc.)
3. **Mailer** – sends the email using the configured transport

---

## 5. Creating an Email Message

Use the `Email` class from the Mime component.

```php
use Symfony\Component\Mime\Email;

$email = (new Email())
    ->from('no-reply@example.com')
    ->to($userEmail)
    ->subject('Welcome')
    ->text(
        "Welcome to our application.\n\nThank you for registering."
    );
```

This creates a plain-text email.

---

## 6. Sending the Email with a Mailer

The `Mailer` class has a single responsibility: sending messages.

```php
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;

$transport = Transport::fromDsn($dsn);
$mailer = new Mailer($transport);

$mailer->send($email);
```

However, this requires a valid **transport DSN**, which defines how emails are sent.

---

## 7. Understanding Transport DSNs

A **DSN (Data Source Name)** is a string that defines the email transport configuration.

Examples:

```text
smtp://user:pass@smtp.example.com:587
sendmail://default
native://default
```

Symfony Mailer supports:

* Built-in transports (SMTP, Sendmail, Native)
* Third-party services (Gmail, Mailgun, Postmark, SendGrid, etc.)

---

## 8. Using a Local SMTP Server for Development

Emails should not be sent to real inboxes during local development.

### 8.1 Why Use a Local Mail Server?

* Prevents accidental emails
* Allows easy inspection of messages
* Improves development safety

### 8.2 MailHog via Docker

MailHog is a lightweight local SMTP testing server.

#### Docker Compose Configuration

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    container_name: mailhog
    ports:
      - "8025:8025"  # Web UI
      - "1025:1025"  # SMTP
```

Start the container:

```bash
docker compose up -d
```

* SMTP server: `mailhog:1025`
* Web UI: `http://localhost:8025`

---

## 9. Configuring SMTP Transport for MailHog

Use the following DSN:

```text
smtp://mailhog:1025
```

Create the transport:

```php
$transport = Transport::fromDsn('smtp://mailhog:1025');
```

---

## 10. Sending HTML Emails

Most modern emails are HTML-based. Symfony Mailer supports both HTML and plain-text versions.

```php
$email = (new Email())
    ->from('no-reply@example.com')
    ->to($userEmail)
    ->subject('Welcome')
    ->text('Welcome to our application.')
    ->html('
        <h1 style="color: blue; text-align: center;">Welcome!</h1>
        <p>Thank you for registering.</p>
    ');
```

### Why Include Both?

* Some email clients do not support HTML
* Plain text is used as a fallback

---

## 11. Adding Attachments

Attachments can be added directly to the email.

```php
$email->attach(
    'Hello World',
    'welcome.txt',
    'text/plain'
);
```

Attachments can also be loaded from files or streams if needed.

---

## 12. Moving Email Content Out of Controllers

Embedding HTML and email text directly in controllers is discouraged.

Recommended approaches:

* Store email templates in view files
* Render templates into strings
* Pass rendered output to `html()` and `text()`

Example structure:

* `emails/welcome.html.php`
* `emails/welcome.txt.php`

This keeps controllers clean and maintainable.

---

## 13. Using Environment Variables for Configuration

Hardcoding DSNs is unsafe.

### 13.1 Define Environment Variable

In `.env`:

```env
MAILER_DSN=smtp://mailhog:1025
```

### 13.2 Load DSN from Environment

```php
$dsn = $_ENV['MAILER_DSN'];
$transport = Transport::fromDsn($dsn);
```

---

## 14. Integrating with Dependency Injection

Creating transport and mailer instances inside controllers breaks dependency injection principles.

### 14.1 Depend on Interfaces

Symfony Mailer provides a `MailerInterface`.

```php
use Symfony\Component\Mailer\MailerInterface;

class UserController
{
    public function __construct(
        private MailerInterface $mailer
    ) {}

    public function register()
    {
        $this->mailer->send($email);
    }
}
```

---

## 15. Creating a Custom Mailer Implementation

You can implement your own mailer class for flexibility.

```php
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\RawMessage;

class CustomMailer implements MailerInterface
{
    private $transport;

    public function __construct(string $dsn)
    {
        $this->transport = Transport::fromDsn($dsn);
    }

    public function send(RawMessage $message, ?Envelope $envelope = null): void
    {
        $this->transport->send($message, $envelope);
    }
}
```

---

## 16. Binding the Mailer in the Container

Bind the interface to the implementation using a factory or closure.

```php
$container->bind(MailerInterface::class, function () use ($config) {
    return new CustomMailer($config['mailer']['dsn']);
});
```

---

## 17. Configuration Management

Extend the application configuration to support mailer settings.

```php
return [
    'db' => [...],
    'mailer' => [
        'dsn' => $_ENV['MAILER_DSN'],
    ],
];
```

---

## 18. Final Notes, Best Practices, and Key Considerations

* Do **not** use PHP `mail()` in production
* Always use SMTP or API-based transports
* Never hardcode credentials or DSNs
* Use environment variables for configuration
* Always include both HTML and plain-text versions
* Keep email templates out of controllers
* Use dependency injection and interfaces
* Use a local SMTP server (MailHog, Mailtrap) for development
* Custom mailers allow logging, retries, and hooks before/after sending
* Prepare for future enhancements like:

  * Queued emails
  * Background jobs (cron workers)
  * Email retries and failure handling

---