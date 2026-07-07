# Shell Scripting for DevOps — Part 1 (Comprehensive Study Notes)

## 1. Introduction

This document introduces a **Shell Scripting** course aimed primarily at **DevOps engineers**. The objective is to:

* Understand **what shell scripting is**
* Learn **why it is critical for DevOps**
* Cover **basic to intermediate shell scripting**
* Lay the foundation for **advanced automation use cases**

The instructor emphasizes automation, real-world usage, and interview relevance.

### What You Will Gain from This Material

Shell scripting is not just about writing commands in a file. In DevOps, it is how you:

- automate repetitive operational tasks
- glue together tools in CI/CD pipelines
- troubleshoot production issues quickly
- bootstrap servers before configuration management tools take over

### Who Should Read This

- Beginners starting their DevOps journey
- Engineers preparing for interviews
- Anyone who needs to work on Linux servers, cloud VMs, or CI runners

### How to Use These Notes

1. Read each concept section first.
2. Run every example command on a Linux terminal.
3. Try the real-world scenarios on a practice VM (EC2, VirtualBox, or WSL).
4. Review the interview highlights at the end before mock interviews.

---

## 2. What Is Shell Scripting?

### Definition

Shell scripting is the process of **automating repetitive or manual tasks** on a Linux system by writing a sequence of Linux commands into a file (script) and executing it.

In simple terms:

- A **shell** is the command-line interface you use to talk to Linux (`bash`, `sh`, `zsh`, etc.).
- A **script** is a text file containing commands.
- When you run the script, the shell executes those commands **in order**, just as if you typed them manually.

**Example mental model:**

```text
Manual work:   you type 20 commands every morning
Scripted work: you run 1 script that executes those 20 commands automatically
```

### Automation Concept

Automation means reducing human effort for repetitive tasks, such as:

* Creating thousands of files
* Monitoring servers
* Running maintenance tasks
* Managing infrastructure

Manual tasks become impractical at scale, which is where shell scripting becomes essential.

### Detailed Explanation

Imagine a DevOps engineer who must create a log directory, rotate old logs, and restart a service on 50 servers every night. Doing this manually is:

- slow
- error-prone
- not repeatable at scale

A shell script solves this by encoding the steps once and running them consistently everywhere.

### Real-World Scenario

**Scenario:** A startup deploys a new microservice daily. Before each deployment, the engineer must:

1. stop the old process
2. back up the current release folder
3. extract the new build
4. restart the service
5. verify the health endpoint

Instead of doing this by hand on every server, they write `deploy.sh` and run it from Jenkins, GitHub Actions, or SSH.

### Practical Example

```bash
#!/bin/bash
echo "Starting nightly maintenance..."
mkdir -p /var/log/myapp/archive
mv /var/log/myapp/*.log /var/log/myapp/archive/
echo "Maintenance complete."
```

### Best Practices

- Start with small scripts and grow them gradually.
- Add comments for non-obvious steps.
- Test scripts in a non-production environment first.

### Common Mistakes

- Assuming a script will work on all servers without testing paths or permissions.
- Hardcoding values (IP addresses, passwords) inside scripts.

### Important Notes

Shell scripting is often the **first automation layer** in DevOps. Even when you later use Ansible, Terraform, or Kubernetes, you will still rely on shell commands inside those tools.

---

## 3. Why Shell Scripting Is Important for DevOps Engineers

Shell scripting is heavily used in DevOps for:

* Infrastructure automation
* Configuration management
* Server monitoring
* CI/CD pipelines
* Cron jobs
* Node health checks
* Git and deployment automation

Even when tools like **Ansible, Terraform, or Kubernetes** are used, shell scripting remains foundational.

### Detailed Explanation

DevOps is about speed, reliability, and repeatability. Shell scripts help you:

| Area | How shell scripting helps |
| --- | --- |
| Infrastructure automation | Bootstrap VMs, install packages, configure services |
| Configuration management | Pre-steps before Ansible/Chef/Puppet runs |
| Server monitoring | Collect metrics, check disk/memory, alert on failures |
| CI/CD pipelines | Build, test, package, and deploy applications |
| Cron jobs | Schedule backups, cleanups, and health checks |
| Node health checks | Verify service status across many machines |
| Git and deployment automation | Clone repos, tag releases, run deploy hooks |

### Real-World Scenario

**Scenario:** Your CI pipeline needs to:

1. pull latest code
2. run unit tests
3. build a Docker image
4. push the image to a registry

Most pipeline steps are shell commands wrapped in YAML (GitHub Actions, GitLab CI, Jenkins).

```bash
#!/bin/bash
git pull origin main
./run-tests.sh
docker build -t myapp:latest .
docker push myapp:latest
```

### Why It Still Matters with Modern Tools

- **Ansible** uses shell/command modules internally.
- **Docker** entrypoints and Dockerfiles use shell commands.
- **Kubernetes** init containers and hooks often run shell scripts.
- **Terraform** provisioners can invoke local or remote scripts.

Shell scripting is the **lowest common denominator** available on nearly every Linux server.

### Interview Insight

> "We use Ansible/Terraform, so why learn shell scripting?"

Answer: Those tools orchestrate infrastructure, but the actual work (installing packages, restarting services, parsing logs) is still done with shell commands. Understanding the shell makes you effective with every other DevOps tool.

---

## 4. Linux Environment Prerequisites

You can practice shell scripting on:

* AWS EC2 Linux instances
* Any cloud-based Linux VM
* Oracle VirtualBox
* Local Linux or macOS terminal
* Windows via SSH tools like **PuTTY**

### Detailed Explanation

You do not need a production server to learn shell scripting. Any Linux-like environment with a terminal is enough.

### Setup Options

| Environment | Best for | Notes |
| --- | --- | --- |
| AWS EC2 Linux | Cloud-native practice | Closest to real DevOps work |
| Cloud VM (Azure, GCP) | Multi-cloud learning | Same concepts apply |
| Oracle VirtualBox | Offline/local lab | Free and isolated |
| Local Linux / macOS | Daily practice | Terminal already available |
| Windows + PuTTY / WSL | Windows users | PuTTY for SSH; WSL gives a Linux shell locally |

### Real-World Scenario

**Scenario:** A company gives DevOps engineers an Ubuntu EC2 instance for learning. You SSH in, create scripts under `/home/ubuntu/scripts`, and schedule them with cron. This mirrors how production automation is often managed.

```bash
ssh -i key.pem ubuntu@<public-ip>
mkdir -p ~/scripts
cd ~/scripts
touch first_shell_script.sh
```

### Best Practices

- Use a dedicated practice VM instead of experimenting on production.
- Keep SSH keys secure (`chmod 400 key.pem`).
- Snapshot or destroy lab instances when done to control cloud costs.

### Common Mistakes

- Practicing only on GUI-based systems without using the terminal.
- Using `root` for everything instead of a normal user with `sudo` when needed.

---

## 5. Basic Linux Commands (Hands-On)

Before writing scripts, you must be comfortable with fundamental Linux commands. Scripts are simply **collections of these commands**.

### 5.1 Creating Files – `touch`

Creates an empty file.

```bash
touch first_shell_script.sh
```

Used heavily in automation where opening files interactively is not possible.

#### Detailed Explanation

The `touch` command creates a new empty file if it does not exist. If the file already exists, it updates the file's timestamp without changing content.

#### Real-World Scenario

**Scenario:** A log-rotation script must ensure a log file exists before appending output.

```bash
touch /var/log/app/deploy.log
echo "$(date) deployment started" >> /var/log/app/deploy.log
```

#### Additional Examples

```bash
touch file1.sh file2.sh file3.sh    # create multiple files at once
touch -a file1.sh                   # update access time only
touch -m file1.sh                   # update modification time only
```

#### Best Practices

- Use meaningful filenames (`deploy.sh`, `backup-db.sh`).
- Prefer `.sh` extension for shell scripts (convention, not a strict requirement).

#### Common Mistakes

- Using `touch` to edit file content (it does not open an editor; it only creates/updates timestamps).

---

### 5.2 Listing Files – `ls`

```bash
ls
ls -ltr
```

* `-l`: long listing
* `-t`: sort by time
* `-r`: reverse order

#### Detailed Explanation

`ls` lists directory contents. With options, it becomes one of the most useful troubleshooting commands in DevOps.

#### What `ls -ltr` Shows

Example output:

```text
-rw-r--r-- 1 ubuntu ubuntu  220 Jul  7 09:10 first_shell_script.sh
drwxr-xr-x 2 ubuntu ubuntu 4096 Jul  7 09:15 my_folder
```

- First character: `-` = file, `d` = directory
- Next 9 characters: permissions (`rwx`)
- Owner and group
- Size and last modified time

#### Additional Useful Variants

```bash
ls -la          # include hidden files
ls -lh          # human-readable sizes
ls -ltrh        # long + time-sorted + human-readable
ls -l *.sh      # list only shell scripts
```

#### Real-World Scenario

**Scenario:** After a deployment, you need to confirm the latest release artifact landed in the directory. `ls -ltr` shows the newest file at the bottom.

#### Best Practices

- Use `ls -l` when debugging permission issues.
- Combine with `grep` for filtering: `ls -l | grep ".sh"`.

---

### 5.3 Viewing Command Documentation – `man`

```bash
man ls
man touch
```

The `man` command is the built-in Linux manual and is critical when you forget syntax or options.

#### Detailed Explanation

`man` (manual) displays documentation for commands, system calls, and configuration formats. In production, you often cannot search the internet, so `man` is your on-server reference.

#### How to Navigate `man` Pages

| Key | Action |
| --- | --- |
| `Space` / `f` | Page down |
| `b` | Page back |
| `/pattern` | Search forward |
| `q` | Quit |

#### Additional Examples

```bash
man chmod
man crontab
man bash
whatis ls         # short one-line description
ls --help         # quick help without full man page
```

#### Real-World Scenario

**Scenario:** You need to find the correct flag for recursive copy. Instead of guessing, run:

```bash
man cp
```

Search for "recursive" inside the manual.

#### Interview Insight

Strong engineers know how to **read documentation quickly** using `man`, not memorize every flag.

---

## 6. Editing Files Using VI / Vim

Text editors are essential because scripts are plain text files. On many servers, `vi`/`vim` is guaranteed to be available.

### Opening a File

```bash
vi first_shell_script.sh
```

### Insert Mode

* Press `Esc` to return to **command mode** (if you are already typing)
* Press `i` to enter **insert mode** and start writing

> **Note:** When you first open `vi`, you are already in command mode. Press `i` to begin inserting text. Press `Esc` when you want to stop editing and run commands like save or quit.

### Save and Exit

```text
Esc → :wq → Enter
```

- `:w` = write (save)
- `:q` = quit
- `:wq` = save and quit

### Exit Without Saving

```text
Esc → :q!
```

- `:q!` = quit without saving changes

### Detailed Explanation

`vi`/`vim` has two primary modes:

1. **Command mode** — move cursor, delete, copy, save, quit
2. **Insert mode** — type script content

This modal design feels unusual at first but is extremely efficient once learned.

### Additional Useful Vim Commands

| Command | Purpose |
| --- | --- |
| `o` | Open new line below and enter insert mode |
| `dd` | Delete current line |
| `yy` | Copy (yank) current line |
| `p` | Paste |
| `G` | Go to end of file |
| `:set number` | Show line numbers |

### Real-World Scenario

**Scenario:** You SSH into a production server and must fix a one-line bug in a script. No GUI editor is installed. `vi` is the reliable option.

```bash
vi /opt/scripts/health-check.sh
# Press i, fix the line, press Esc, type :wq
```

### Best Practices

- Always press `Esc` before `:wq` or `:q!`.
- Consider learning `nano` as a simpler alternative on personal machines, but still know `vi` for servers.

### Common Mistakes

- Getting stuck in insert mode and typing `:wq` as text instead of a command.
- Forgetting to press `Esc` before saving or quitting.

---

## 7. Viewing File Contents Without Opening – `cat`

```bash
cat first_shell_script.sh
```

Useful for quick inspection of scripts.

### Detailed Explanation

`cat` (concatenate) prints file contents to the terminal. It is ideal for small files like scripts and config snippets.

### Additional Examples

```bash
cat /etc/os-release          # check OS version
cat file1 file2              # print multiple files
cat -n script.sh             # show line numbers
```

### Related Commands (Very Useful in DevOps)

```bash
less script.sh               # scroll through large files
head -n 20 app.log           # first 20 lines
tail -n 50 app.log           # last 50 lines
tail -f app.log              # follow log in real time
```

### Real-World Scenario

**Scenario:** A deployment fails. You quickly inspect the deploy script and the last lines of the log without opening an editor.

```bash
cat deploy.sh
tail -n 100 /var/log/deploy.log
```

### Best Practices

- Use `cat` for small files only.
- Use `less` or `tail` for large logs to avoid flooding the terminal.

### Common Mistakes

- Using `cat` on very large log files, which can freeze or flood the terminal.

---

## 8. Understanding the Shebang (`#!`)

### What Is Shebang?

The **first line** of a shell script that tells Linux **which interpreter** should execute the script.

```bash
#!/bin/bash
```

The `#!` combination is called a **shebang** (or hash-bang). It must be the **very first line** of the script.

### Detailed Explanation

When you run `./script.sh`, the kernel reads the shebang line and starts the specified interpreter (`/bin/bash`) to execute the remaining lines.

Without a shebang:

- `./script.sh` may fail or behave unexpectedly
- `bash script.sh` still works because you explicitly choose the interpreter

### Common Shell Interpreters

* `bash` (most common)
* `sh`
* `dash`
* `ksh`

| Shell | Typical path | Notes |
| --- | --- | --- |
| Bash | `/bin/bash` | Full-featured; best for scripting |
| POSIX sh | `/bin/sh` | Lightweight; fewer features |
| Dash | `/bin/dash` | Fast; default `/bin/sh` on many Ubuntu systems |
| Korn shell | `/bin/ksh` | Used in some enterprise environments |

### Interview-Critical Concept: `/bin/sh` vs `/bin/bash`

* Earlier: `/bin/sh` → symlinked to `bash`
* Now (e.g., Ubuntu): `/bin/sh` → symlinked to `dash`
* `dash` does **not support all bash features**

✅ **Best Practice:**
Always use:

```bash
#!/bin/bash
```

Or, for better portability across systems where Bash may live in different paths:

```bash
#!/usr/bin/env bash
```

### Real-World Scenario

**Scenario:** A script uses Bash arrays and `[[ ]]`. It works on your laptop but fails on an Ubuntu server because the shebang was `#!/bin/sh` (Dash). Fixing the shebang to `#!/bin/bash` resolves the issue.

### Example Showing the Difference

```bash
#!/bin/bash
echo "Bash version: $BASH_VERSION"
```

### Best Practices

- Be explicit: use `#!/bin/bash` or `#!/usr/bin/env bash`.
- Do not assume `/bin/sh` is Bash on modern Linux.

### Interview Insight

Be ready to explain: **`/bin/sh` is a POSIX shell link; `/bin/bash` is the Bash shell with extended features.**

---

## 9. Writing Your First Shell Script

### Example: Print a Message

```bash
#!/bin/bash
echo "My name is Abhishek"
```

### Detailed Explanation

This script does three important things:

1. Declares the interpreter (`#!/bin/bash`)
2. Uses `echo` to print text to the terminal
3. Demonstrates the basic structure of any script: shebang + commands

### Step-by-Step: Create and Run

```bash
touch first_shell_script.sh
vi first_shell_script.sh
# Add the two lines above, save with :wq
cat first_shell_script.sh
```

### Real-World Scenario

**Scenario:** A CI pipeline prints build metadata before running tests.

```bash
#!/bin/bash
echo "Build started at: $(date)"
echo "Running on host: $(hostname)"
echo "My name is Abhishek"
```

### Best Practices

- Add a short comment at the top describing the script's purpose.
- Keep your first scripts simple; complexity comes later.

### Common Mistakes

- Forgetting the shebang.
- Saving the file with Windows line endings (`CRLF`), which can cause errors on Linux. Use Unix line endings (`LF`).

---

## 10. Executing a Shell Script

### Method 1: Using `sh`

```bash
sh first_shell_script.sh
```

This explicitly tells the system to run the script using the `sh` interpreter. The shebang line is **ignored** in this method because you are choosing the interpreter yourself.

### Method 2: Using `./`

```bash
./first_shell_script.sh
```

This executes the script from the current directory. Requirements:

1. The file must have execute permission (`chmod +x` or `chmod 755`, etc.)
2. The shebang line determines which interpreter runs

### Detailed Comparison

| Method | Command | Uses shebang? | Needs execute permission? |
| --- | --- | --- | --- |
| Explicit interpreter | `sh script.sh` | No | No |
| Direct execution | `./script.sh` | Yes | Yes |
| Bash explicit | `bash script.sh` | No | No |

### Real-World Scenario

**Scenario:** A Jenkins job runs `bash deploy.sh` so it does not depend on the execute bit. A cron job might run `/opt/scripts/backup.sh` directly, which requires execute permission and a valid shebang.

### Additional Examples

```bash
bash first_shell_script.sh
source first_shell_script.sh    # runs in current shell (advanced use)
```

### Best Practices

- For production scripts: use shebang + `chmod +x` + `./script.sh` or absolute path.
- For CI pipelines: `bash script.sh` is common and explicit.

### Common Mistakes

- Running `./script.sh` without execute permission → `Permission denied`
- Running `./script.sh` when the shebang points to a missing interpreter

---

## 11. Linux File Permissions & `chmod`

### Why Permissions Are Required

Linux is security-focused. Even file creators must explicitly grant execution rights.

Every file and directory has permissions for three groups:

| Group | Meaning |
| --- | --- |
| **User (Owner)** | The file owner |
| **Group** | Users in the file's group |
| **Others** | Everyone else |

Each group can have:

- **Read (`r`)** — view content or list directory
- **Write (`w`)** — modify content
- **Execute (`x`)** — run a file or enter a directory

View permissions:

```bash
ls -l first_shell_script.sh
```

Example:

```text
-rw-r--r-- 1 ubuntu ubuntu 45 Jul  7 10:00 first_shell_script.sh
```

This file is readable/writable by owner, but **not executable** — so `./first_shell_script.sh` will fail until execute permission is added.

### Grant Full Permissions

```bash
chmod 777 first_shell_script.sh
```

`777` means read, write, and execute for user, group, and others.

> **Important security note:** `chmod 777` grants full access to everyone on the system. It is useful for learning and labs, but **avoid `777` in production**. Prefer tighter permissions like `755` for scripts and `644` for config files.

### Permission Breakdown (4-2-1 Rule)

| Value | Meaning                |
| ----- | ---------------------- |
| 4     | Read                   |
| 2     | Write                  |
| 1     | Execute                |
| 7     | Read + Write + Execute |

To build a permission digit, **add the values** you need:

| Sum | Result |
| --- | --- |
| 7 | `rwx` (4+2+1) |
| 6 | `rw-` (4+2) |
| 5 | `r-x` (4+1) |
| 4 | `r--` (4) |
| 0 | `---` |

The three digits in `chmod` map to **user, group, others**:

```text
chmod <user> <group> <others> filename
```

Example:

```bash
chmod 444 file.sh   # Read-only for all
chmod 770 file.sh   # Full access to owner & group only
```

#### Breaking Down the Examples

**`chmod 444 file.sh`**

- User: 4 → read only
- Group: 4 → read only
- Others: 4 → read only

**`chmod 770 file.sh`**

- User: 7 → read, write, execute
- Group: 7 → read, write, execute
- Others: 0 → no access

### Additional Permission Examples

```bash
chmod 755 first_shell_script.sh   # common for executable scripts
chmod 644 config.env              # common for config files
chmod +x first_shell_script.sh    # add execute for all (symbolic mode)
chmod u+x first_shell_script.sh   # add execute for user only
```

### Real-World Scenario

**Scenario:** A deploy script must be runnable by the `ubuntu` user but should not be writable by others.

```bash
chmod 750 deploy.sh
```

- Owner: full access
- Group: read + execute
- Others: no access

### Best Practices

- Use the **principle of least privilege** — grant only what is needed.
- Scripts: typically `755` or `750`
- Secrets and configs: `600` or `640`

### Common Mistakes

- Using `777` in production
- Forgetting that directories need execute (`x`) permission to be entered with `cd`

### Interview Insight

Be ready to explain the 4-2-1 rule and translate between symbolic (`rwx`) and numeric (`755`) permissions.

---

## 12. Viewing Command History

```bash
history
```

Helps recall previously executed commands, especially in production environments.

### Detailed Explanation

The shell stores previously run commands in a history file. This is invaluable when you ran a long command hours ago and need to run it again.

### Additional Examples

```bash
history | tail -20              # last 20 commands
history | grep "chmod"          # search history
!105                            # re-run command number 105
!!                              # re-run last command
```

### Real-World Scenario

**Scenario:** During an incident, you ran a complex `kubectl` or `docker` command. Instead of reconstructing it, you search history:

```bash
history | grep docker
```

### Best Practices

- Be careful with history on shared systems — it may contain sensitive commands.
- Consider `HISTTIMEFORMAT` to show when commands were run (Bash).

### Common Mistakes

- Pasting commands from history without reviewing them, especially destructive ones (`rm -rf`).

---

## 13. Directory Management Commands

Scripts constantly create, enter, and navigate directories. These commands are building blocks for automation.

### Present Working Directory

```bash
pwd
```

**PWD** = Present Working Directory. Shows your current location in the filesystem.

Example output:

```text
/home/ubuntu/scripts
```

### Create Directory

```bash
mkdir my_folder
```

Create parent directories as needed:

```bash
mkdir -p projects/devops/scripts
```

`-p` creates missing parent directories and does not error if the directory already exists (useful in scripts).

### Change Directory

```bash
cd my_folder
cd ..
```

Additional navigation:

```bash
cd ~                  # go to home directory
cd /opt/scripts       # absolute path
cd -                  # go back to previous directory
```

### Real-World Scenario

**Scenario:** A script sets up a standard project layout:

```bash
#!/bin/bash
mkdir -p /opt/myapp/{releases,logs,config}
cd /opt/myapp/releases
pwd
```

### Best Practices

- Use absolute paths in production scripts when possible (`/opt/scripts/deploy.sh`) to avoid ambiguity.
- Use `mkdir -p` in scripts to avoid failures when parent folders are missing.

### Common Mistakes

- Using relative paths after `cd` in a script without confirming the starting directory.
- Forgetting that `cd` in a script only affects that script's subshell unless you `source` the script.

---

## 14. Writing a Practical Automation Script

### Objective

* Create a folder
* Enter the folder
* Create two files

### Sample Script

```bash
#!/bin/bash

# Create directory
mkdir Abhishek

# Move into directory
cd Abhishek

# Create files
touch first_file
touch second_file
```

### Execute

```bash
chmod 777 sample_shell_script.sh
./sample_shell_script.sh
```

### Detailed Walkthrough

1. `mkdir Abhishek` — creates a directory named `Abhishek` in the current path
2. `cd Abhishek` — moves into that directory
3. `touch first_file` and `touch second_file` — creates two empty files inside it

Verify the result:

```bash
ls -l Abhishek
```

Expected:

```text
first_file
second_file
```

### Improved Production-Style Version

```bash
#!/bin/bash
set -euo pipefail

DIR_NAME="Abhishek"

mkdir -p "$DIR_NAME"
cd "$DIR_NAME"

touch first_file second_file

echo "Created files in $(pwd):"
ls -l
```

Improvements:

- `set -euo pipefail` — exit on errors, catch undefined variables
- `mkdir -p` — safer if folder already exists
- Quoted `"$DIR_NAME"` — handles names with spaces
- Final `ls` — confirms success

### Real-World Scenario

**Scenario:** Onboarding a new application server requires a standard folder structure before deployment.

```bash
#!/bin/bash
APP="payments"
mkdir -p /opt/$APP/{bin,logs,config,releases}
touch /opt/$APP/logs/app.log
```

### Best Practices

- Add error handling for production scripts.
- Log what the script did and where.

### Common Mistakes

- Running the script from the wrong directory and creating folders in unexpected locations.
- Using `chmod 777` instead of `chmod 755` for executable scripts.

---

## 15. Monitoring System Health (DevOps Perspective)

DevOps engineers must quickly answer: **Is the server healthy?** These commands are the first line of investigation.

### CPU Count

```bash
nproc
```

Returns the number of processing units available to the current process.

Example output:

```text
4
```

#### Additional CPU Commands

```bash
lscpu
uptime
```

`uptime` shows load averages — high load on a low-CPU machine can indicate trouble.

### Memory Usage

```bash
free -m
```

Shows memory in megabytes.

Example output:

```text
              total        used        free      shared  buff/cache   available
Mem:           7941        1200        4100         120        2640        6400
Swap:          2047           0        2047
```

Focus on:

- **used** — memory in active use
- **available** — memory available for new workloads (more reliable than `free` alone on modern Linux)

#### Additional Examples

```bash
free -h          # human-readable (GB/MB)
vmstat 1 5       # sample every 1 second, 5 times
```

### Process Monitoring

```bash
top
```

Used to identify:

* High CPU usage
* Memory leaks
* Running processes
* Performance bottlenecks

#### How to Read `top`

- `%CPU` — CPU used per process
- `%MEM` — memory used per process
- `COMMAND` — process name
- Press `M` to sort by memory, `P` to sort by CPU, `q` to quit

#### Additional Tools

```bash
htop            # improved interactive view (if installed)
ps aux          # snapshot of all processes
ps aux | grep nginx
```

### Real-World Scenario

**Scenario:** Developers report slow API response. You SSH in and run:

```bash
uptime
free -m
top
df -h
```

This quickly tells you if the problem is CPU, memory, or disk.

### Sample Health-Check Script

```bash
#!/bin/bash
echo "===== System Health ====="
echo "Host: $(hostname)"
echo "Uptime: $(uptime)"
echo "CPU cores: $(nproc)"
echo "Memory (MB):"
free -m
echo "Disk usage:"
df -h /
```

### Best Practices

- Collect baseline metrics when the system is healthy.
- Automate health checks with cron and alert when thresholds are exceeded.

### Interview Insight

Know the difference between **investigating** (`top`, `free`, `df`) and **automating** (scripts + cron + alerts).

---

## 16. Real-World DevOps Use Case

**Scenario:**

* 10,000 Linux VMs
* Developers report performance issues

**Solution Using Shell Script:**

* SSH into machines
* Collect CPU & memory stats
* Identify abnormal nodes
* Send automated email alerts
* Run scripts via cron jobs

This demonstrates why shell scripting is **mandatory for DevOps engineers**.

### Expanded Scenario Walkthrough

At scale, you cannot manually log into 10,000 VMs. You automate:

1. **Discovery** — list of servers from inventory or cloud API
2. **Collection** — run a script on each node to gather metrics
3. **Analysis** — flag nodes where CPU > 90% or memory is critically low
4. **Alerting** — email, Slack, or PagerDuty notification
5. **Scheduling** — cron runs the script every 5 minutes

### Example: Simple Node Health Script

```bash
#!/bin/bash
THRESHOLD=90

CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
MEM=$(free | awk '/Mem:/ {printf("%.0f", $3/$2 * 100)}')

echo "CPU usage: ${CPU}%"
echo "Memory usage: ${MEM}%"

if [ "$CPU" -gt "$THRESHOLD" ] || [ "$MEM" -gt "$THRESHOLD" ]; then
  echo "ALERT: High resource usage on $(hostname)"
  # mail -s "Alert on $(hostname)" ops@company.com < /tmp/alert.txt
fi
```

### Example: Running Across Many Servers

```bash
#!/bin/bash
for host in app{1..10}.example.com; do
  echo "===== $host ====="
  ssh ubuntu@"$host" 'bash -s' < ./node-health.sh
done
```

### Why Shell Scripting Fits This Problem

- Available on every Linux VM without extra installation
- Fast to write and modify during incidents
- Easy to schedule with cron
- Works alongside Ansible, Prometheus, and other tools

### Best Practices

- Store scripts in version control (Git).
- Centralize logs from all nodes.
- Define clear alert thresholds to avoid noise.

---

## 17. Advanced Topics (Mentioned, Not Covered)

The following topics are introduced here for awareness. They are covered in later sessions but are important to know as a DevOps engineer.

* Signal trapping (`trap`)
* Handling `Ctrl+C`
* Cron jobs
* Advanced monitoring scripts
* Custom alerts
* Error handling

### Brief Preview of Each Topic

| Topic | What it means | Why it matters |
| --- | --- | --- |
| **Signal trapping (`trap`)** | Run cleanup code when a script receives signals (e.g., interrupt) | Prevents leaving temp files or locks on failure |
| **Handling `Ctrl+C`** | User sends SIGINT to stop a running script | Scripts should exit cleanly |
| **Cron jobs** | Schedule scripts at fixed times | Backups, health checks, log rotation |
| **Advanced monitoring** | Scripts that parse logs, check endpoints, measure latency | Proactive reliability |
| **Custom alerts** | Notify Slack/email when checks fail | Faster incident response |
| **Error handling** | `set -e`, exit codes, retries, logging | Production-grade reliability |

### Mini Preview Example: `trap`

```bash
#!/bin/bash
cleanup() {
  echo "Cleaning up before exit..."
  rm -f /tmp/deploy.lock
}
trap cleanup EXIT
```

### Mini Preview Example: Cron

```bash
# Run health check every 5 minutes
*/5 * * * * /opt/scripts/node-health.sh >> /var/log/health.log 2>&1
```

---

## 18. Key Takeaways

* Shell scripting is **simple but powerful**
* Linux fundamentals are mandatory
* Bash is the preferred shell
* Practice is critical
* Shell scripting is a **core DevOps skill**
* Forms the base before learning Python automation

### Expanded Summary

| Takeaway | Practical meaning |
| --- | --- |
| Simple but powerful | A 10-line script can save hours of manual work |
| Linux fundamentals mandatory | You cannot script well without knowing `ls`, `chmod`, `cd`, `cat`, etc. |
| Bash is preferred | Use `#!/bin/bash` for compatibility with Bash features |
| Practice is critical | Build small scripts daily; muscle memory matters |
| Core DevOps skill | Used in CI/CD, cloud, monitoring, and troubleshooting |
| Base before Python | Master shell first; Python adds power for complex logic |

### Suggested Learning Path

1. Master basic commands (`touch`, `ls`, `cat`, `chmod`, `mkdir`, `cd`)
2. Write and execute simple scripts with shebang
3. Add permissions, logging, and error handling
4. Automate monitoring and scheduling with cron
5. Move to Python/Ansible/Terraform for larger workflows

---

## 19. Interview Highlights

* Difference between `/bin/sh` and `/bin/bash`
* File permissions and `chmod`
* Node health monitoring
* Why shell scripting is used despite automation tools

### Expanded Interview Q&A

#### Q1: What is the difference between `/bin/sh` and `/bin/bash`?

**Answer:** `/bin/bash` is the Bourne Again Shell with advanced features (arrays, `[[ ]]`, etc.). `/bin/sh` is often a POSIX-compliant shell; on modern Ubuntu it may link to `dash`, which does not support all Bash syntax. For DevOps scripts, prefer `#!/bin/bash`.

#### Q2: Explain file permissions and `chmod`.

**Answer:** Linux files have read, write, and execute permissions for user, group, and others. Numeric mode uses the 4-2-1 rule: 4=read, 2=write, 1=execute. Example: `chmod 755 script.sh` gives the owner full access and others read/execute.

#### Q3: How do you monitor node health?

**Answer:** Use `nproc`, `free -m`, `df -h`, `uptime`, `top`, and `ps`. For production, wrap these in a script, schedule with cron, and alert when thresholds are breached.

#### Q4: Why use shell scripting when Ansible/Terraform/Kubernetes exist?

**Answer:** Those tools orchestrate infrastructure and deployments, but the underlying operations (installing packages, restarting services, parsing logs) are still shell commands. Shell scripting is universal, lightweight, and available on every Linux server.

#### Q5: What is a shebang and why is it important?

**Answer:** The shebang (`#!/bin/bash`) on line 1 tells the OS which interpreter to use when you run `./script.sh`. Without it, the system does not know how to execute the file.

#### Q6: How do you execute a shell script?

**Answer:** Either `bash script.sh` / `sh script.sh` (explicit interpreter) or `./script.sh` (requires execute permission and a valid shebang).

---

## 20. Quick Reference Cheat Sheet

| Task | Command |
| --- | --- |
| Create file | `touch file.sh` |
| List files | `ls -ltr` |
| Read file | `cat file.sh` |
| Edit file | `vi file.sh` |
| Make executable | `chmod +x file.sh` or `chmod 755 file.sh` |
| Run script | `./file.sh` or `bash file.sh` |
| Current directory | `pwd` |
| Create directory | `mkdir -p dir` |
| Change directory | `cd dir` |
| Command history | `history` |
| Manual page | `man command` |
| CPU cores | `nproc` |
| Memory | `free -m` |
| Processes | `top` / `ps aux` |

---

## 21. Practice Exercises

1. Create `first_shell_script.sh`, add a shebang, print your name, and run it with both `bash` and `./`.
2. Use `chmod 444`, then try to execute the script. Observe the error. Fix permissions with `chmod 755`.
3. Write a script that creates a folder and three files inside it (based on Section 14).
4. Run `free -m`, `nproc`, and `df -h` and explain the output in your own words.
5. Use `history | grep` to find a previous command and re-run it with `!`.

---

*End of Part 1 — Shell Scripting for DevOps. Continue to advanced topics (variables, loops, conditionals, cron, traps, and error handling) in the next module.*
