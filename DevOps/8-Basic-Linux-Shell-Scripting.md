# Shell Scripting for DevOps (Detailed Guide with Scenarios)

## 1. Why This Matters in DevOps

DevOps engineers automate repeatable work. Shell scripting is one of the fastest ways to do that on Linux servers and CI/CD runners.

You use shell scripts to:

- deploy applications
- rotate logs and clean disk space
- take backups and verify them
- run health checks and alerts
- automate server setup and patching
- troubleshoot incidents quickly

If you can write reliable shell scripts, you can reduce manual mistakes, speed up releases, and improve system reliability.

---

## 2. Linux and Shell Basics

### 2.1 What Is an Operating System?

An Operating System (OS) is the layer between hardware and software.

```text
User -> Application -> OS -> Hardware
Hardware -> OS -> Application -> User
```

Without an OS, applications cannot safely access CPU, memory, disk, or network devices.

### 2.2 Why Linux Dominates Production

- Open source and highly customizable
- Stable for long-running workloads
- Strong tooling for networking and automation
- Standard platform for containers and cloud workloads
- Large ecosystem and community support

### 2.3 Linux Layers (High Level)

- **Kernel**: process, memory, device, and system call management
- **Libraries**: common runtime interfaces (for example `glibc`)
- **User space**: shells, tools, apps, daemons, services

---

## 3. What Is Shell Scripting?

A shell is a command interpreter (`bash`, `sh`, `zsh`, `ksh`).
A shell script is a text file containing commands executed in sequence.

Most DevOps servers are managed via terminal, so shell scripting becomes a core skill.

### 3.1 First Script

Create `hello.sh`:

```bash
#!/usr/bin/env bash
echo "Hello from DevOps script"
```

> `#!/usr/bin/env bash` is called a **shebang**. It tells the operating system which interpreter should be used to execute the script. In this case, the script is executed using the **Bash** shell. Other shell interpreters include **sh**, **ksh**, **dash**, and **zsh**. Bash is the most widely used shell for scripting due to its portability and extensive feature set. Personally, I prefer **zsh** for interactive terminal use because it offers useful features such as advanced auto-completion, better tab suggestions, and improved customization. However, for shell scripting, Bash is generally preferred because it is available on most Linux systems by default and provides better compatibility.

Run it:

```bash
chmod +x hello.sh
./hello.sh
```

### 3.2 File Permissions and `chmod`

**`chmod`** (short for **change mode**) is the command used to change the permissions of a file or directory. Every file in Linux has three permission types and three permission groups.

#### Permission Types

| Permission | Symbol | Meaning |
| --- | --- | --- |
| Read | `r` | View file content or list directory contents |
| Write | `w` | Modify file content or create/delete files in a directory |
| Execute | `x` | Run a file as a program or enter a directory |

#### Permission Groups (Who Gets Access)

| Group | Who it applies to |
| --- | --- |
| **User (Owner)** | The user who owns the file |
| **Group** | Users who belong to the file's group |
| **Others (Everyone)** | All remaining users on the system |

You can view current permissions with:

```bash
ls -l hello.sh
```

Example output:

```text
-rwxr-xr-- 1 ubuntu ubuntu 42 Jul  7 10:00 hello.sh
```

Breaking down `-rwxr-xr--`:

- **User (owner):** `rwx` → read, write, execute
- **Group:** `r-x` → read and execute (no write)
- **Others:** `r--` → read only

#### The 4-2-1 Formula (Numeric Permissions)

Linux also supports numeric (octal) permissions. Each permission has a fixed value:

| Value | Permission |
| --- | --- |
| **4** | Read (`r`) |
| **2** | Write (`w`) |
| **1** | Execute (`x`) |

To set permissions, **add the values** for the permissions you want to grant:

| Sum | Permissions granted |
| --- | --- |
| 7 | `rwx` (4 + 2 + 1) — full access |
| 6 | `rw-` (4 + 2) — read and write |
| 5 | `r-x` (4 + 1) — read and execute |
| 4 | `r--` (4) — read only |
| 0 | `---` — no access |

`chmod` uses **three digits**, one for each group:

```text
chmod <user> <group> <others> filename
```

**Example: `chmod 444 hello.sh`**

- **4** (User/Owner) → read only
- **4** (Group) → read only
- **4** (Others/Everyone) → read only

Result: everyone can only read the file; no one can write or execute it.

**Example: `chmod 755 hello.sh`**

- **7** (User) → `rwx` — owner can read, write, and execute
- **5** (Group) → `r-x` — group can read and execute
- **5** (Others) → `r-x` — others can read and execute

This is a common permission for shell scripts and executables.

**Example: `chmod 644 config.env`**

- **6** (User) → `rw-` — owner can read and write
- **4** (Group) → `r--` — group can read only
- **4** (Others) → `r--` — others can read only

This is common for configuration files that should not be executable.

#### Symbolic vs Numeric `chmod`

You can also use symbolic mode (as in `chmod +x hello.sh`):

```bash
chmod u+x hello.sh      # add execute for user (owner)
chmod g-w hello.sh      # remove write for group
chmod o=r hello.sh      # set others to read only
chmod a+r hello.sh      # add read for all (a = all)
```

For DevOps work, numeric mode is faster for setting exact permissions in scripts, while symbolic mode is handy for quick one-off changes.

---

## 4. Essential Day-to-Day Linux Commands

### 4.1 Navigation and Listing

```bash
pwd
ls
ls -ltrh
cd /path/to/project
cd ..
```

### 4.2 File and Directory Operations

```bash
touch app.log
mkdir backups
cp app.log backups/
mv app.log app-old.log
rm app-old.log
rm -r old-folder
```

### 4.3 View File Content

```bash
cat file.txt
less file.txt
tail -f app.log
```

### 4.4 Search and Text Processing

```bash
grep "ERROR" app.log
awk '{print $1, $5}' access.log
sed 's/staging/prod/g' config.txt
```

### 4.5 System Monitoring

```bash
free -m
nproc
df -h
top
ps aux
uptime
```

---

## 5. Script Structure and Good Defaults

Use this structure for production-grade scripts:

```bash
#!/usr/bin/env bash
set -euo pipefail

main() {
  echo "Script started"
}

main "$@"
```

### Why `set -euo pipefail`?

- `-e`: exit on command failure
- `-u`: fail on undefined variables
- `-o pipefail`: fail a pipeline when any command fails

This makes scripts safer and easier to debug.

---

## 6. Variables and Input

### 6.1 Variables

```bash
#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="staging"
APP_NAME="payment-service"
echo "Deploying $APP_NAME to $ENVIRONMENT"
```

### 6.2 Read User Input

```bash
read -r -p "Enter release version: " VERSION
echo "Release version is $VERSION"
```

### 6.3 Command-Line Arguments

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${1:-my-app}"
ENVIRONMENT="${2:-dev}"

echo "App: $APP_NAME"
echo "Environment: $ENVIRONMENT"
```

Run:

```bash
./deploy.sh user-api prod
```

---

## 7. Conditions, Loops, and Functions

### 7.1 Conditionals

```bash
if [[ -f "/etc/nginx/nginx.conf" ]]; then
  echo "Nginx config exists"
else
  echo "Nginx config missing"
fi
```

### 7.2 Loops

```bash
for host in app1 app2 app3; do
  echo "Checking $host"
done
```

```bash
COUNT=1
while [[ $COUNT -le 3 ]]; do
  echo "Retry $COUNT"
  COUNT=$((COUNT + 1))
done
```

### 7.3 Functions

```bash
log_info() {
  local msg="$1"
  echo "[INFO] $msg"
}

check_file() {
  local file="$1"
  [[ -f "$file" ]]
}
```

---

## 8. Exit Codes, Error Handling, and Logging

### 8.1 Exit Codes

- `0` means success
- non-zero means failure

```bash
if systemctl is-active --quiet nginx; then
  echo "nginx is running"
else
  echo "nginx is not running"
  exit 1
fi
```

### 8.2 Trap Errors for Cleanup

```bash
cleanup() {
  echo "Cleaning temporary files..."
  rm -f /tmp/deploy.lock
}

trap cleanup EXIT
```

### 8.3 Write Logs to File

```bash
LOG_FILE="/var/log/deploy-script.log"
echo "$(date '+%F %T') deployment started" | tee -a "$LOG_FILE"
```

---

## 9. Real DevOps Scenarios with Examples

### Scenario 1: Zero-Downtime Style Deployment Steps

Use case: You want a repeatable deployment process for a service.

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/myapp"
RELEASE_DIR="$APP_DIR/releases/$(date +%Y%m%d%H%M%S)"
CURRENT_LINK="$APP_DIR/current"
PACKAGE="/tmp/myapp.tar.gz"

echo "Creating release dir: $RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

echo "Extracting package"
tar -xzf "$PACKAGE" -C "$RELEASE_DIR"

echo "Updating current symlink"
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

echo "Restarting service"
sudo systemctl restart myapp

echo "Health check"
curl -fsS http://localhost:8080/healthz >/dev/null

echo "Deployment successful"
```

Why this works:

- keeps release history
- switches with symlink (quick rollback possible)
- fails fast if health check fails

---

### Scenario 2: Automatic Backup with Retention

Use case: Daily database dumps with old backups deleted.

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/mysql"
DATE="$(date +%F_%H%M)"
FILE="$BACKUP_DIR/db_$DATE.sql.gz"

mkdir -p "$BACKUP_DIR"
mysqldump -u root -p'StrongPassword' mydb | gzip > "$FILE"

find "$BACKUP_DIR" -type f -name "db_*.sql.gz" -mtime +7 -delete
echo "Backup complete: $FILE"
```

Important production note: use secrets manager or environment variables for passwords, not plain text in scripts.

---

### Scenario 3: Disk Usage Alert Script

Use case: Alert when root partition exceeds 80%.

```bash
#!/usr/bin/env bash
set -euo pipefail

THRESHOLD=80
USAGE="$(df -h / | awk 'NR==2 {gsub("%","",$5); print $5}')"

if (( USAGE > THRESHOLD )); then
  echo "ALERT: Disk usage is ${USAGE}% on /"
  # Example: send email/slack/webhook here
else
  echo "Disk usage healthy: ${USAGE}%"
fi
```

---

### Scenario 4: Service Auto-Recovery

Use case: Restart a failed service and record action.

```bash
#!/usr/bin/env bash
set -euo pipefail

SERVICE="nginx"
LOG="/var/log/service-watchdog.log"

if ! systemctl is-active --quiet "$SERVICE"; then
  echo "$(date '+%F %T') $SERVICE is down. Restarting..." | tee -a "$LOG"
  sudo systemctl restart "$SERVICE"
  sleep 2
  systemctl is-active --quiet "$SERVICE" && \
    echo "$(date '+%F %T') $SERVICE restarted successfully" | tee -a "$LOG"
else
  echo "$(date '+%F %T') $SERVICE is healthy" >> "$LOG"
fi
```

---

### Scenario 5: Remote Command Execution via SSH

Use case: Run a quick command on multiple servers.

```bash
#!/usr/bin/env bash
set -euo pipefail

for host in app1.example.com app2.example.com app3.example.com; do
  echo "----- $host -----"
  ssh -o StrictHostKeyChecking=no "ubuntu@$host" "uptime && df -h /"
done
```

---

## 10. Scheduling Scripts with Cron

Run script every day at 2:30 AM:

```bash
30 2 * * * /opt/scripts/backup.sh >> /var/log/backup-cron.log 2>&1
```

Check cron jobs:

```bash
crontab -l
```

Edit cron jobs:

```bash
crontab -e
```

DevOps tip: Always redirect cron output to logs for troubleshooting.

---

## 11. Shell Scripting in CI/CD Pipelines

Shell scripts are heavily used in Jenkins, GitHub Actions, GitLab CI, and Azure DevOps.

Example CI step:

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Running tests..."
./scripts/run-tests.sh

echo "Building image..."
docker build -t myapp:${GIT_COMMIT:-latest} .

echo "Pushing image..."
docker push myapp:${GIT_COMMIT:-latest}
```

Why scripts in pipelines:

- keep logic version-controlled
- reusable across tools
- easier local debugging

---

## 12. Security and Reliability Best Practices

1. Use `set -euo pipefail` in serious scripts.
2. Validate inputs before using them.
3. Quote variables: `"$VAR"` to avoid word-splitting issues.
4. Never hardcode credentials; use secret managers or env variables.
5. Keep scripts idempotent (safe to run multiple times).
6. Add logs with timestamps.
7. Use least-privilege permissions and avoid unnecessary `sudo`.
8. Test in staging before production.

---

## 13. Common Mistakes and Fixes

### Mistake: Unquoted variables

Bad:

```bash
rm -rf $TARGET_DIR
```

Better:

```bash
rm -rf "$TARGET_DIR"
```

### Mistake: Ignoring command failures

Add strict mode and explicit checks:

```bash
set -euo pipefail
command_that_must_succeed
```

### Mistake: No rollback strategy

For deployments, keep previous release and switch symlink back on failure.

---

## 14. Practical Interview and Real-World Q&A

### Q1: Why use shell script when we have Python?

Because shell scripts are lightweight, available by default on Linux, and perfect for command orchestration, especially in CI/CD and server automation.

### Q2: How do you make scripts production-safe?

Use strict mode, input validation, logs, alerts, idempotency, and staged testing.

### Q3: How do you debug script failures quickly?

Run with tracing:

```bash
bash -x deploy.sh
```

Add logs around risky operations and check exit codes.

---

## 15. Command Cheat Sheet

| Purpose | Command |
| --- | --- |
| Present directory | `pwd` |
| List files | `ls -ltrh` |
| Change directory | `cd` |
| Create file | `touch` |
| Create directory | `mkdir -p` |
| Delete file | `rm` |
| Delete directory | `rm -r` |
| Show memory | `free -m` |
| CPU count | `nproc` |
| Disk usage | `df -h` |
| Processes | `ps aux` |
| Real-time usage | `top` |
| Follow logs | `tail -f` |
| Search text | `grep` |
| Schedule task | `crontab -e` |

---

## 16. Mini Practice Tasks

1. Write a script to check if `docker` service is running; restart if stopped.
2. Write a script to archive logs older than 3 days into `.tar.gz`.
3. Write a script that reads an environment name (`dev`, `staging`, `prod`) and deploys to matching host.
4. Write a script that fails if free disk is less than 20%.
5. Schedule one of the scripts using cron and log output to a file.

---

## 17. Final Takeaway

Shell scripting is one of the most valuable DevOps skills because it turns repetitive operations into reliable automation.
Start small, apply strict and secure scripting habits, and gradually build reusable scripts for deployment, monitoring, backup, and incident response.

The more real production scenarios you automate, the stronger your DevOps foundation becomes.

---