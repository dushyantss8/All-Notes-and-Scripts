# Advanced Shell Scripting for DevOps — Part 2

## 1. Overview

This document focuses on **advanced Bash scripting concepts** from a **DevOps engineer's perspective**.

### Key Goals

* Strengthen Bash scripting fundamentals using **real-world DevOps use cases**
* Build a **Node Health Monitoring Script**
* Learn **best practices** for writing maintainable and debuggable shell scripts
* Understand commonly used **Linux commands**, **pipes**, **filters**, and **error handling**
* Introduce **process management**, **log analysis**, **loops**, and **signals**

The demo environment used is an **Ubuntu-based AWS EC2 instance**, but the concepts apply to any Linux system.

### What This Module Covers

Part 1 introduced basic commands, shebang, permissions, and your first scripts. **Part 2** goes deeper into:

- writing production-style diagnostic scripts
- debugging and strict error handling
- process inspection and log analysis
- conditionals, loops, and signal traps

### How to Use These Notes

1. Work on a Linux VM (EC2, WSL, or VirtualBox).
2. Build `node-health.sh` step by step as you read.
3. Run every example and observe the output.
4. Review the interview Q&A at the end.

---

### Node Health Commands

These commands help analyze a machine's health:

| Command   | Purpose                              |
| --------- | ------------------------------------ |
| `df -h`   | Disk usage                           |
| `free -g` | Memory usage                         |
| `nproc`   | Number of CPUs                       |
| `top`     | Running processes and resource usage |

These parameters are essential for **infrastructure troubleshooting**.

#### Detailed Explanation

When a service is slow or a node is unhealthy, DevOps engineers check the **"golden signals"** of a machine:

| Metric | Command | What to look for |
| --- | --- | --- |
| Disk | `df -h` | Partitions at or near 100% |
| Memory | `free -g` | Low available memory, high swap usage |
| CPU capacity | `nproc` | How many cores the workload can use |
| Live usage | `top` | Which process is consuming CPU/memory |

#### Real-World Scenario

**Scenario:** A Kubernetes worker node is evicting pods. Before diving into Kubernetes logs, you SSH in and run:

```bash
df -h
free -g
nproc
top
```

In 30 seconds you might discover the root cause is **disk full** or **memory pressure** — not an application bug.

#### Additional Examples

```bash
df -h /                    # disk usage for root filesystem only
df -ih                     # inode usage (disk can be "full" due to inodes)
free -m                    # memory in megabytes
uptime                     # load average vs CPU count
```

#### Best Practices

- Capture baseline metrics when the system is healthy.
- Always check disk **and** memory; either one can cause outages.
- Use `df -h` and `free -g` in scripts; use `top` interactively during live debugging.

#### Common Mistakes

- Looking only at CPU when the real issue is disk or memory.
- Ignoring inode exhaustion (`df -ih`).

---

## 2. Objective: Node Health Monitoring Script

### Use Case

Create a reusable script (`node-health.sh`) that:

* Collects system health information
* Can be stored in GitHub
* Can be executed on any VM for quick diagnostics

### Detailed Explanation

A **node health script** is a portable diagnostic tool. Instead of remembering a dozen commands during an incident, you run one script that collects everything in a consistent format.

Benefits:

- **Repeatable** — same output format on every server
- **Shareable** — store in GitHub for the whole team
- **Automatable** — run via cron, Ansible, or CI/CD
- **Auditable** — log output for post-incident review

### Real-World Scenario

**Scenario:** Your team manages 200 EC2 instances. During an outage, on-call engineers run:

```bash
curl -s https://raw.githubusercontent.com/your-org/scripts/main/node-health.sh | bash
```

Or, more safely (recommended):

```bash
git clone https://github.com/your-org/scripts.git
bash scripts/node-health.sh
```

Everyone gets the same diagnostic snapshot within seconds.

### Complete Sample: `node-health.sh`

Building on concepts from later sections, here is a practical version:

```bash
#!/bin/bash
#
# Author: Abhishek
# Date: 01-Dec-2023
# Version: v1.0
# Purpose: Outputs node health metrics (CPU, Memory, Disk)
# Prerequisites: Bash shell

set -euo pipefail

echo "======================================"
echo "Node Health Report"
echo "Host: $(hostname)"
echo "Date: $(date)"
echo "======================================"

echo ""
echo "Disk Usage:"
df -h

echo ""
echo "Memory Usage:"
free -g

echo ""
echo "CPU Count:"
nproc

echo ""
echo "Load Average:"
uptime

echo ""
echo "Top Processes (snapshot):"
ps -ef | head -n 15

echo "======================================"
echo "Health check complete."
```

### Execute the Script

```bash
chmod +x node-health.sh
./node-health.sh
```

Or:

```bash
bash node-health.sh
```

### Best Practices

- Store the script in version control (GitHub/GitLab).
- Add timestamps and hostname to every report.
- Redirect output to a log file when running on a schedule:

```bash
./node-health.sh >> /var/log/node-health.log 2>&1
```

### Common Mistakes

- Hardcoding paths that only exist on one server.
- Running health checks only during incidents instead of proactively.

---

## 3. Shell Script Structure & Metadata (Best Practice)

Well-structured scripts are easier to maintain, review, and debug — especially when multiple engineers contribute over time.

### Shebang (Executable Declaration)

Always specify the exact shell:

```bash
#!/bin/bash
```

**Why not `/bin/sh`?**
Because `/bin/sh` may point to `dash` instead of `bash`, which can cause compatibility issues.

#### Detailed Explanation

The shebang tells the kernel which interpreter to use when you run `./script.sh`. Using `/bin/bash` ensures Bash-specific features work (`[[ ]]`, arrays, `{1..10}` brace expansion, etc.).

#### Portable Alternative

```bash
#!/usr/bin/env bash
```

`env` finds `bash` in the user's `PATH`, which helps across different Linux distributions.

#### Real-World Scenario

**Scenario:** A CI pipeline script uses Bash arrays. It passes locally but fails on Ubuntu EC2 because the shebang was `#!/bin/sh` (Dash). Changing to `#!/bin/bash` fixes the pipeline.

#### Interview Insight

> `/bin/sh` is POSIX-compliant and may be Dash. `/bin/bash` is the full Bash shell with extended syntax.

---

### Script Metadata (Comments)

Comments improve readability and maintainability.

```bash
# Author: Abhishek
# Date: 01-Dec-2023
# Version: v1.0
# Purpose: Outputs node health metrics (CPU, Memory, Disk)
# Prerequisites: Bash shell
```

**Why Metadata Matters**

* Clarifies intent
* Helps collaborators
* Aids debugging and version tracking

#### What Good Metadata Includes

| Field | Example | Why |
| --- | --- | --- |
| Author | Abhishek | Who to contact for questions |
| Date | 01-Dec-2023 | When it was created or last updated |
| Version | v1.0 | Track changes over time |
| Purpose | Node health metrics | What the script does in one line |
| Prerequisites | Bash shell | Dependencies and requirements |

#### Additional Metadata (Recommended for Production)

```bash
# Usage: ./node-health.sh
# Exit codes: 0 = success, 1 = failure
# Dependencies: df, free, nproc (standard on most Linux systems)
```

#### Real-World Scenario

**Scenario:** A new team member inherits 50 scripts after a departure. Scripts with clear metadata are understood in minutes; scripts without metadata require reverse-engineering.

#### Best Practices

- Update version or date when making meaningful changes.
- Document required tools and expected exit codes.
- Use comments to explain **why**, not just **what** (the code shows what).

#### Common Mistakes

- Outdated metadata (wrong version, wrong purpose).
- Over-commenting obvious lines (`# run ls` above `ls`).

---

## 4. Improving Script Readability

Raw command output is functional but difficult to read — especially when shared with teammates or pasted into incident tickets.

### Basic Script (Raw Output)

```bash
df -h
free -g
nproc
```

This works but is **hard to interpret**.

#### Why It Is Hard to Interpret

- No context labels — you see numbers without knowing which section is disk vs memory.
- No hostname or timestamp — useless when comparing output from multiple servers.
- Mixed output formats — harder to scan quickly under pressure.

---

### Option 1: Using `echo` Statements

```bash
echo "Disk Usage:"
df -h

echo "Memory Usage:"
free -g

echo "CPU Count:"
nproc
```

✔ More readable
✘ Not scalable for large scripts

#### Detailed Explanation

`echo` adds human-readable section headers. This is the simplest way to improve output clarity.

#### Improved Version with Separators

```bash
echo "========== Disk Usage =========="
df -h

echo ""
echo "========== Memory Usage =========="
free -g

echo ""
echo "========== CPU Count =========="
nproc
```

#### Real-World Scenario

**Scenario:** You paste script output into a Slack incident channel. Labeled sections help teammates immediately find disk usage without re-running commands.

#### When `echo` Becomes Unscalable

For large scripts, repeating `echo` before every block creates noise. Better approaches:

- Use **functions** with a `print_section()` helper
- Use **`set -x`** only during debugging (not for final output)
- Write structured output (JSON) for automation

```bash
print_section() {
  echo ""
  echo "========== $1 =========="
}

print_section "Disk Usage"
df -h
```

---

### Option 2: Debug Mode with `set -x` (Recommended)

```bash
set -x
df -h
free -g
nproc
```

**Benefits**

* Prints commands before execution
* Ideal for debugging complex scripts

#### Detailed Explanation

`set -x` enables **xtrace** mode. Before each command runs, Bash prints the command to stderr, prefixed with `+`.

Example output:

```text
+ df -h
Filesystem      Size  Used Avail Use% Mounted on
...
+ free -g
              total        used        free
...
```

#### Real-World Scenario

**Scenario:** A deployment script fails on line 47 of a 100-line script. Running with `set -x` (or `bash -x deploy.sh`) shows exactly which command failed and with what arguments.

#### Enable/Disable Selectively

```bash
set -x          # turn on debugging
df -h
free -g
set +x          # turn off debugging
echo "Report complete"
```

Or run externally without modifying the script:

```bash
bash -x node-health.sh
```

#### Best Practices

- Use `set -x` while developing and troubleshooting.
- Turn it **off** in production output unless you want verbose logs.
- Combine with `set -e` so the script stops at the failing command.

#### Common Mistakes

- Leaving `set -x` enabled in production cron jobs, flooding logs.
- Confusing xtrace output with normal script output (xtrace goes to stderr).

---

## 5. Critical Shell Script Flags (Must-Know)

These flags turn a fragile script into a **production-safe** script. They are among the most important Bash concepts for DevOps interviews and real work.

### `set -x` → Debug mode

Prints each command before execution. Essential for troubleshooting.

### `set -e` → Exit on error

Exits immediately if any command returns a non-zero status.

### `set -o pipefail` → Catch pipeline failures

Without `pipefail`, a pipeline only fails if the **last** command fails. With `pipefail`, any failure in the pipeline causes the pipeline to fail.

#### Recommended Combination

```bash
set -x
set -e
set -o pipefail
```

> **Production note:** Many teams use `set -euo pipefail` for production scripts and enable `-x` only when debugging. The `-u` flag (exit on undefined variables) is highly recommended in addition to the flags above.

Compact form:

```bash
set -euo pipefail
# Enable only when debugging:
# set -x
```

### Why These Matter

* Prevents silent failures
* Stops execution if any command fails
* Ensures pipelines fail correctly

#### Detailed Explanation of Each Flag

| Flag | Name | Behavior |
| --- | --- | --- |
| `set -e` | errexit | Exit on first command failure |
| `set -u` | nounset | Exit on undefined variable (recommended add-on) |
| `set -o pipefail` | pipefail | Pipeline fails if any command in the pipe fails |
| `set -x` | xtrace | Print commands as they execute (debug) |

#### Example Problem Without `set -e`

```bash
invalidcommand
echo "Script still runs"
```

With `set -e`, execution stops immediately.

#### Pipefail Example

Without `pipefail`:

```bash
false | echo "still runs"
echo "Exit code: $?"
# Output: still runs, Exit code: 0
```

With `pipefail`:

```bash
set -o pipefail
false | echo "still runs"
echo "Exit code: $?"
# Pipeline exit code is non-zero
```

#### Real-World Scenario

**Scenario:** A backup script runs `mysqldump | gzip > backup.sql.gz`. If `mysqldump` fails but `gzip` succeeds, without `pipefail` the script reports success and you discover the corrupt backup only during restore.

```bash
set -euo pipefail
mysqldump mydb | gzip > backup.sql.gz
echo "Backup successful"
```

### Best Practices

- Start every serious script with `set -euo pipefail`.
- Add `set -x` only when debugging.
- Check exit codes explicitly for commands that may legitimately fail.

### Common Mistakes

- Assuming a script "worked" because it printed a success message.
- Using `set -e` without `pipefail` in pipelines.

### Interview Insight

Be ready to explain all three flags and give a pipefail example.

---

## 6. Process Management in Linux

Process management is core to DevOps troubleshooting: finding runaway processes, identifying stuck services, and collecting PIDs for further action.

### Viewing All Processes

```bash
ps -ef
```

* Shows user, PID, CPU, start time, and command
* Essential for server troubleshooting

#### Detailed Explanation

`ps` (process status) shows running processes. The `-e` flag means all processes; `-f` means full-format listing.

Example output columns:

```text
UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 10:00 ?        00:00:01 /sbin/init
ubuntu  12345 12340  2 14:30 ?        00:00:05 java -jar app.jar
```

| Column | Meaning |
| --- | --- |
| UID | User running the process |
| PID | Process ID (unique) |
| PPID | Parent process ID |
| STIME | Start time |
| CMD | Command executed |

#### Additional Useful `ps` Commands

```bash
ps aux                    # BSD-style output (common on Linux)
ps -ef | grep nginx       # find nginx processes
ps -p 12345 -o pid,cmd    # details for a specific PID
```

#### Real-World Scenario

**Scenario:** CPU is at 100%. You run `ps -ef`, sort by CPU usage, and find a runaway Java process that needs a thread dump or restart.

```bash
ps aux --sort=-%cpu | head -n 10
```

---

### Filtering Processes with `grep`

```bash
ps -ef | grep amazon
```

✔ Filters relevant processes
✘ Still verbose

#### Detailed Explanation

`grep` filters lines matching a pattern. Piping `ps -ef` into `grep` is one of the most common DevOps command combinations.

#### Important Note: Exclude `grep` Itself

```bash
ps -ef | grep amazon | grep -v grep
```

Without `grep -v grep`, the `grep` process itself appears in the output.

#### Real-World Scenario

**Scenario:** You need to check if the Amazon SSM agent is running on an EC2 instance:

```bash
ps -ef | grep amazon-ssm-agent | grep -v grep
```

---

### Extracting Process IDs with `awk`

```bash
ps -ef | grep amazon | awk '{print $2}'
```

* `$1` → User
* `$2` → PID
* `$8` → Command

**Why PID Matters**

* Killing processes
* Taking heap/thread dumps
* Monitoring application health

#### Detailed Explanation

`awk` is a text-processing tool. `{print $2}` prints the second field (PID) from each line.

#### Complete Example: Find and Kill a Process

```bash
PID=$(ps -ef | grep amazon | grep -v grep | awk '{print $2}')
echo "PID: $PID"
kill "$PID"          # graceful stop
# kill -9 "$PID"    # force kill (last resort)
```

#### Real-World Scenario

**Scenario:** A deployment leaves a zombie process bound to port 8080. You extract the PID and stop it before redeploying.

```bash
lsof -i :8080
kill -9 <PID>
```

#### Best Practices

- Prefer `kill` (SIGTERM) before `kill -9` (SIGKILL).
- Always verify the PID before killing.
- Use `grep -v grep` to avoid matching the grep process itself.

#### Common Mistakes

- Killing the wrong PID because `grep` matched too broadly.
- Using `kill -9` as the first option (prevents graceful shutdown).

---

## 7. Understanding Pipes (`|`)

Pipes are the foundation of the Unix philosophy: **small tools chained together** to solve complex problems.

### What Pipes Do

Pipes send **stdout of one command** to another command.

```bash
command1 | command2
```

Only **stdout** is piped. **stderr** is not piped unless you redirect it explicitly.

### Example

```bash
echo -e "1\n11\n12\n55\n99" | grep 1
```

**Output**

```
1
11
12
```

#### Detailed Explanation

1. `echo -e` prints multiple lines (`-e` enables escape sequences like `\n`).
2. `grep 1` filters lines containing the character `1`.
3. Lines `1`, `11`, and `12` match; `55` and `99` do not.

#### More Pipe Examples

```bash
ps -ef | grep nginx | wc -l          # count nginx processes
cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr   # top IPs
df -h | grep -v tmpfs                # disk usage excluding tmpfs
```

#### Real-World Scenario

**Scenario:** Find the top 10 IP addresses in an access log:

```bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -10
```

This chains five commands with pipes — classic DevOps log analysis.

---

### Important Interview Question: Pipe with `date`

```bash
date | echo "Today is:"
```

**Why It Fails**

* `date` writes to **stdout**, but `echo` ignores stdin
* `echo` does not consume piped input

#### Detailed Explanation

When you pipe `date` to `echo`, the date output is sent to `echo`'s stdin. However, `echo` prints its **arguments** and does not read from stdin by default.

#### Correct Approaches

```bash
echo "Today is: $(date)"
```

```bash
echo -n "Today is: " && date
```

```bash
read -r TODAY && echo "Today is: $TODAY" <<< "$(date)"
```

#### Interview Insight

Not all commands consume stdin. Know which commands read from pipes (`grep`, `awk`, `sort`, `wc`) vs which only print arguments (`echo`).

#### Common Mistakes

- Assuming every command works in a pipeline.
- Forgetting that stderr is not piped by default.

---

## 8. Log File Analysis (Real-World DevOps Task)

Log analysis is one of the most frequent DevOps tasks during incidents, deployments, and audits.

### Searching Errors in Logs

```bash
cat app.log | grep ERROR
```

#### Detailed Explanation

This prints every line in `app.log` that contains the string `ERROR`. In production, logs can be gigabytes — always combine `grep` with other tools.

#### Improved Variants

```bash
grep ERROR app.log                    # grep can read files directly (no cat needed)
grep -i error app.log                 # case-insensitive
grep -c ERROR app.log                 # count error lines
grep ERROR app.log | tail -n 50       # last 50 errors
grep ERROR app.log | wc -l            # total error count
```

#### Real-World Scenario

**Scenario:** After a deployment, error rates spike. You check how many errors appeared in the last hour:

```bash
grep "$(date '+%Y-%m-%d %H')" app.log | grep ERROR | wc -l
```

#### Best Practices

- Prefer `grep PATTERN file` over `cat file | grep PATTERN` (fewer processes, same result).
- Use `zgrep` for compressed logs: `zgrep ERROR app.log.1.gz`
- Combine with `tail -f` for live monitoring: `tail -f app.log | grep ERROR`

#### Common Mistakes

- Running `grep` on huge files without narrowing scope (time range, line limit).
- Searching for `error` case-sensitively when logs use `ERROR` or `Error`.

---

### Using `curl` to Read Remote Logs

```bash
curl https://example.com/app.log | grep ERROR
```

✔ No local storage required
✔ Ideal for S3, GitHub, APIs

#### Detailed Explanation

`curl` fetches content from URLs and prints it to stdout. Piping into `grep` lets you analyze remote logs without downloading the full file locally.

#### Additional Examples

```bash
curl -s https://example.com/app.log | grep ERROR          # silent mode (no progress bar)
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/logs | grep ERROR
curl -sf https://example.com/health || echo "Health check failed"
```

Flags:

- `-s` — silent (hide progress)
- `-f` — fail silently on HTTP errors (4xx, 5xx)
- `-o file` — save to file instead of stdout

#### Real-World Scenario

**Scenario:** Application logs are stored in S3 and exposed via a presigned URL. You fetch and filter without AWS CLI installed:

```bash
curl -s "https://s3.amazonaws.com/bucket/app.log?..." | grep ERROR | tail -n 20
```

---

### `curl` vs `wget` (Interview Favorite)

| Feature        | curl     | wget    |
| -------------- | -------- | ------- |
| Display output | Yes      | No      |
| Download file  | Optional | Yes     |
| API requests   | Yes      | Limited |

```bash
wget https://example.com/app.log
cat app.log | grep ERROR
```

#### Detailed Comparison

| Use case | Better tool | Why |
| --- | --- | --- |
| REST API calls | `curl` | Supports headers, methods (GET/POST), auth |
| Download a file | `wget` | Designed for downloads, recursive fetching |
| Pipe output to another command | `curl` | Prints to stdout by default |
| CI/CD health checks | `curl` | `curl -f https://app/health` fails on HTTP errors |

#### `curl` Download Example

```bash
curl -o app.log https://example.com/app.log
grep ERROR app.log
```

#### `wget` Download Example

```bash
wget https://example.com/app.log
cat app.log | grep ERROR
```

#### Interview Insight

> `curl` is for transferring data with URLs (APIs, health checks, piping). `wget` is for downloading files. In modern DevOps, `curl` is more common in scripts and CI/CD.

---

## 9. File Discovery with `find`

The `find` command searches the filesystem by name, type, size, modification time, and more.

### Searching Entire File System

```bash
sudo find / -name pam.d
```

* `/` → Search root
* `-name` → File name
* `sudo` → Required for permissions

#### Detailed Explanation

`find` walks the directory tree starting from `/` and prints paths matching the name. Searching from root is powerful but can be slow and may produce "Permission denied" errors without `sudo`.

#### Additional `find` Examples

```bash
find /etc -name "*.conf"                  # all .conf files under /etc
find /var/log -name "*.log" -mtime -1     # logs modified in last 24 hours
find /tmp -type f -size +100M             # files larger than 100MB
find . -name "node-health.sh"             # search from current directory
```

#### Real-World Scenario

**Scenario:** Disk is full. Find large log files older than 7 days:

```bash
sudo find /var/log -type f -name "*.log" -mtime +7 -size +50M -ls
```

**Scenario:** Locate a missing config file:

```bash
sudo find / -name "nginx.conf" 2>/dev/null
```

(`2>/dev/null` hides permission-denied errors.)

#### Best Practices

- Narrow the search path when possible (`/etc` instead of `/`).
- Use `2>/dev/null` or redirect stderr to reduce noise.
- Combine with `-exec` for batch actions:

```bash
find /tmp -name "*.tmp" -mtime +7 -delete
```

#### Common Mistakes

- Running `find /` without `sudo` and misinterpreting incomplete results.
- Using `-name pam.d` without wildcards when searching for partial names (`-name '*pam*'`).

---

## 10. User Privileges & Root Access

Linux security depends on **least privilege** — giving users only the access they need.

### Switching to Root

```bash
sudo su -
```

**Best Practice**

* Avoid root unless required
* Use sudo for specific commands

#### Detailed Explanation

- `sudo` — run a single command as another user (usually root)
- `sudo su -` — switch to a root login shell (full root session)
- `su -` — switch user (requires root password if switching to root)

#### Preferred Pattern: `sudo` for Specific Commands

```bash
sudo systemctl restart nginx
sudo find / -name pam.d
sudo apt update
```

Instead of opening a full root shell.

#### Real-World Scenario

**Scenario:** A junior engineer runs `sudo su -` and accidentally deletes files as root. The team policy changes to: use `sudo` per command, never a persistent root shell.

#### Best Practices

- Use a normal user account for daily work.
- Use `sudo` only for commands that require elevated privileges.
- Audit `sudo` usage via `/var/log/auth.log`.
- In scripts, avoid running as root unless necessary; document why if you do.

#### Common Mistakes

- Running entire scripts as root when only one command needs it.
- Storing scripts with hardcoded root paths that break for non-root users.

#### Interview Insight

> Principle of least privilege: grant minimum permissions required to complete the task.

---

## 11. Conditional Logic – `if / else`

Conditionals let scripts make decisions based on values, command results, or file state.

### Example

```bash
a=4
b=10

if [ $a -gt $b ]; then
  echo "A is greater"
else
  echo "B is greater"
fi
```

✔ Simple
✔ Same logic as other languages
✘ Syntax is Bash-specific

#### Detailed Explanation

- `[ ... ]` is the test command (equivalent to `test ...`)
- `-gt` means "greater than" (for integers)
- `if`, `then`, `else`, `fi` structure the branch

#### Common Test Operators

| Operator | Meaning |
| --- | --- |
| `-eq` | Equal (numbers) |
| `-ne` | Not equal |
| `-gt` | Greater than |
| `-lt` | Less than |
| `-f file` | File exists |
| `-d dir` | Directory exists |
| `-z "$var"` | String is empty |

#### DevOps Example: Disk Alert

```bash
THRESHOLD=80
USAGE=$(df -h / | awk 'NR==2 {gsub("%","",$5); print $5}')

if [ "$USAGE" -gt "$THRESHOLD" ]; then
  echo "ALERT: Disk usage is ${USAGE}%"
else
  echo "Disk usage OK: ${USAGE}%"
fi
```

#### DevOps Example: Check Service Status

```bash
if systemctl is-active --quiet nginx; then
  echo "nginx is running"
else
  echo "nginx is down — attempting restart"
  sudo systemctl restart nginx
fi
```

#### Real-World Scenario

**Scenario:** A deploy script checks free disk space before copying a 2GB artifact. If space is insufficient, it aborts instead of filling the disk.

#### Best Practices

- Always quote variables: `"$a"` not `$a`
- Use `[[ ... ]]` in Bash for safer string comparisons
- Check exit codes: `if command; then`

#### Common Mistakes

- Forgetting spaces around `[` and `]`: `[ $a -gt $b ]` not `[$a -gt $b]`
- Unquoted variables breaking on empty values or spaces

---

## 12. Looping with `for`

Loops automate repetitive operations — essential when managing multiple servers, services, or files.

### Example

```bash
for i in {1..10}
do
  echo $i
done
```

**Use Cases**

* Batch operations
* Monitoring multiple services
* Automating repetitive tasks

#### Detailed Explanation

`{1..10}` is brace expansion — it expands to 1 2 3 4 5 6 7 8 9 10. The loop variable `i` takes each value in turn.

#### Additional Loop Forms

```bash
# Loop over a list
for service in nginx redis mysql; do
  systemctl is-active --quiet "$service" && echo "$service: OK" || echo "$service: DOWN"
done

# Loop over files
for file in /var/log/*.log; do
  echo "Processing $file"
done

# C-style loop
for ((i=1; i<=10; i++)); do
  echo $i
done
```

#### Real-World Scenario

**Scenario:** Check health on multiple application servers:

```bash
for host in app1 app2 app3; do
  echo "===== $host ====="
  ssh ubuntu@"$host" 'df -h / && free -g'
done
```

#### Real-World Scenario: Monitor Multiple Services

```bash
for svc in nginx docker kubelet; do
  if systemctl is-active --quiet "$svc"; then
    echo "$svc: running"
  else
    echo "$svc: STOPPED"
  fi
done
```

#### Best Practices

- Quote loop variables: `"$i"`, `"$file"`, `"$host"`
- Use `set -e` carefully in loops — a failure may exit the entire script
- Consider parallel execution (`xargs -P`) for large server lists

#### Common Mistakes

- Unquoted `"$host"` breaking on hostnames with special characters
- Looping over globs that match nothing (use `shopt -s nullglob`)

---

## 13. Signals & the `trap` Command

Signals let the OS (and users) notify processes about events. `trap` lets scripts **handle** those events gracefully.

### What Are Signals?

* `Ctrl+C` → `SIGINT`
* `kill -9` → `SIGKILL`

#### Common Signals

| Signal | Number | Trigger | Can be caught? |
| --- | --- | --- | --- |
| SIGINT | 2 | `Ctrl+C` | Yes |
| SIGTERM | 15 | `kill <PID>` (default) | Yes |
| SIGKILL | 9 | `kill -9 <PID>` | **No** |
| SIGHUP | 1 | Terminal hangup | Yes |

#### Detailed Explanation

- **SIGINT** — user interrupts (Ctrl+C); scripts can trap and clean up
- **SIGTERM** — polite request to stop; services should shut down gracefully
- **SIGKILL** — force kill; process cannot trap or ignore it

---

### Prevent Script Termination

```bash
trap "echo 'Ctrl+C is disabled'" SIGINT
```

#### What This Does

When the user presses Ctrl+C, instead of immediately terminating, the script runs the trap command and continues (unless the trap exits).

#### Real-World Use

Long-running batch jobs where accidental Ctrl+C would leave inconsistent state.

---

### Advanced Use Case

Rollback on interruption:

```bash
trap "rm -rf /tmp/data" SIGINT
```

**Why Important**

* Prevent partial data writes
* Maintain system consistency

#### Detailed Explanation

If a script is writing to `/tmp/data` and the user hits Ctrl+C mid-write, partial data may remain. The trap removes the incomplete directory so the next run starts clean.

#### Production-Style Trap Pattern

```bash
#!/bin/bash
set -euo pipefail

TEMP_DIR="/tmp/deploy-$$"
mkdir -p "$TEMP_DIR"

cleanup() {
  echo "Cleaning up $TEMP_DIR"
  rm -rf "$TEMP_DIR"
}

trap cleanup EXIT SIGINT SIGTERM

# ... deployment steps using $TEMP_DIR ...
echo "Deploy complete"
```

This runs `cleanup` on:

- normal exit (`EXIT`)
- Ctrl+C (`SIGINT`)
- kill (`SIGTERM`)

#### Real-World Scenario

**Scenario:** A database migration script creates a lock file at start. If interrupted, the trap removes the lock file so the next run is not blocked.

```bash
LOCK="/var/run/migrate.lock"
trap 'rm -f "$LOCK"; echo "Migration interrupted"' EXIT SIGINT SIGTERM
touch "$LOCK"
# ... migration ...
rm -f "$LOCK"
```

#### Best Practices

- Always define a `cleanup` function for temp files, locks, and mounts.
- Trap `EXIT` in addition to `SIGINT`/`SIGTERM`.
- Never rely on trapping SIGKILL — it cannot be caught.

#### Common Mistakes

- Using `trap` without quoting variables in the cleanup command.
- Forgetting that `kill -9` bypasses all traps.

---

## 14. Key Takeaways

### Commands You Must Master

* `df`, `free`, `nproc`, `top`
* `ps`, `grep`, `awk`
* `curl`, `wget`
* `find`
* `trap`

### Best Practices

* Always use metadata
* Enable `set -e`, `set -x`, `set -o pipefail`
* Prefer pipelines with filters
* Automate diagnostics with scripts

### Expanded Summary

| Area | Key lesson |
| --- | --- |
| Node health | `df`, `free`, `nproc`, `top` are your first diagnostic commands |
| Script structure | Shebang + metadata + strict mode = maintainable scripts |
| Readability | Use labeled output for humans; `set -x` for debugging |
| Error handling | `set -e` and `pipefail` prevent silent failures |
| Processes | `ps -ef`, `grep`, `awk` to find and manage PIDs |
| Pipes | Chain small tools; know which commands consume stdin |
| Logs | `grep` locally; `curl` for remote logs |
| Files | `find` for discovery; narrow search paths when possible |
| Privileges | Prefer `sudo` per command over full root shell |
| Logic | `if/else` for decisions; `for` loops for batch work |
| Signals | `trap` for cleanup on interrupt or exit |

### Suggested Practice Path

1. Build and run `node-health.sh` on an EC2 instance.
2. Add disk threshold alerting with `if/else`.
3. Loop over multiple log files with `for` and `grep ERROR`.
4. Add `trap` cleanup to a script that uses `/tmp`.
5. Run a failing pipeline with and without `pipefail` and compare exit codes.

---

## 15. Interview Highlights (Expanded)

### Q1: What is the difference between `set -e`, `set -x`, and `set -o pipefail`?

**Answer:** `-e` exits on error; `-x` prints commands for debugging; `pipefail` makes a pipeline fail if any command in it fails.

### Q2: Why does `date | echo "Today is:"` not work?

**Answer:** `echo` prints its arguments and does not read from stdin. Use `echo "Today is: $(date)"` instead.

### Q3: `curl` vs `wget` — when to use which?

**Answer:** `curl` for APIs, health checks, and piping output. `wget` for downloading files. DevOps scripts and CI/CD favor `curl`.

### Q4: What is `trap` used for?

**Answer:** To run cleanup commands when a script receives signals (SIGINT, SIGTERM) or exits. Prevents orphaned temp files and lock files.

### Q5: How do you find a process PID and stop it?

**Answer:** `ps -ef | grep <name> | grep -v grep | awk '{print $2}'` then `kill <PID>`.

### Q6: Why not use `#!/bin/sh`?

**Answer:** On many systems `/bin/sh` is Dash, which lacks Bash features. Use `#!/bin/bash` for Bash scripts.

---

## 16. Quick Reference Cheat Sheet

| Task | Command |
| --- | --- |
| Disk usage | `df -h` |
| Memory | `free -g` |
| CPU count | `nproc` |
| Live processes | `top` / `ps -ef` |
| Filter output | `grep pattern` |
| Extract column | `awk '{print $2}'` |
| Fetch URL | `curl -s URL` |
| Download file | `wget URL` |
| Find files | `find /path -name "pattern"` |
| Strict script mode | `set -euo pipefail` |
| Debug script | `bash -x script.sh` |
| Cleanup on exit | `trap cleanup EXIT` |

---

## 17. Practice Exercises

1. Build `node-health.sh` with metadata, labeled output, and `set -euo pipefail`.
2. Add an `if` block that alerts when disk usage on `/` exceeds 80%.
3. Write a `for` loop that checks whether `nginx`, `docker`, and `ssh` are active.
4. Use `ps -ef | grep | awk` to find the PID of a running process.
5. Create a script with a `trap` that removes a temp directory on Ctrl+C.
6. Fetch a remote URL with `curl` and count lines containing `ERROR`.
7. Run `false | echo ok` with and without `set -o pipefail` and compare `$?`.

---

*End of Part 2 — Advanced Shell Scripting for DevOps. Continue to cron jobs, functions, argument parsing, and advanced automation in the next module.*
