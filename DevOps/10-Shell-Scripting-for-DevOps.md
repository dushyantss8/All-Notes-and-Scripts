# Advanced Shell Scripting for DevOps – Detailed Summary

## 1. Overview

This document focuses on **advanced Bash scripting concepts** from a **DevOps engineer’s perspective**.

### Key Goals

* Strengthen Bash scripting fundamentals using **real-world DevOps use cases**
* Build a **Node Health Monitoring Script**
* Learn **best practices** for writing maintainable and debuggable shell scripts
* Understand commonly used **Linux commands**, **pipes**, **filters**, and **error handling**
* Introduce **process management**, **log analysis**, **loops**, and **signals**

The demo environment used is an **Ubuntu-based AWS EC2 instance**, but the concepts apply to any Linux system.

---

### Node Health Commands

These commands help analyze a machine’s health:

| Command   | Purpose                              |
| --------- | ------------------------------------ |
| `df -h`   | Disk usage                           |
| `free -g` | Memory usage                         |
| `nproc`   | Number of CPUs                       |
| `top`     | Running processes and resource usage |

These parameters are essential for **infrastructure troubleshooting**.

---

## 2. Objective: Node Health Monitoring Script

### Use Case

Create a reusable script (`node-health.sh`) that:

* Collects system health information
* Can be stored in GitHub
* Can be executed on any VM for quick diagnostics

---

## 3. Shell Script Structure & Metadata (Best Practice)

### Shebang (Executable Declaration)

Always specify the exact shell:

```bash
#!/bin/bash
```

**Why not `/bin/sh`?**
Because `/bin/sh` may point to `dash` instead of `bash`, which can cause compatibility issues.

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

---

## 4. Improving Script Readability

### Basic Script (Raw Output)

```bash
df -h
free -g
nproc
```

This works but is **hard to interpret**.

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

---

## 5. Critical Shell Script Flags (Must-Know)

### `set -x` → Debug mode

### `set -e` → Exit on error

### `set -o pipefail` → Catch pipeline failures

#### Recommended Combination

```bash
set -x
set -e
set -o pipefail
```

### Why These Matter

* Prevents silent failures
* Stops execution if any command fails
* Ensures pipelines fail correctly

#### Example Problem Without `set -e`

```bash
invalidcommand
echo "Script still runs"
```

With `set -e`, execution stops immediately.

---

## 6. Process Management in Linux

### Viewing All Processes

```bash
ps -ef
```

* Shows user, PID, CPU, start time, and command
* Essential for server troubleshooting

---

### Filtering Processes with `grep`

```bash
ps -ef | grep amazon
```

✔ Filters relevant processes
✘ Still verbose

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

---

## 7. Understanding Pipes (`|`)

### What Pipes Do

Pipes send **stdout of one command** to another command.

```bash
command1 | command2
```

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

---

### Important Interview Question: Pipe with `date`

```bash
date | echo "Today is:"
```

**Why It Fails**

* `date` writes to **stdout**, but `echo` ignores stdin
* `echo` does not consume piped input

---

## 8. Log File Analysis (Real-World DevOps Task)

### Searching Errors in Logs

```bash
cat app.log | grep ERROR
```

---

### Using `curl` to Read Remote Logs

```bash
curl https://example.com/app.log | grep ERROR
```

✔ No local storage required
✔ Ideal for S3, GitHub, APIs

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

---

## 9. File Discovery with `find`

### Searching Entire File System

```bash
sudo find / -name pam.d
```

* `/` → Search root
* `-name` → File name
* `sudo` → Required for permissions

---

## 10. User Privileges & Root Access

### Switching to Root

```bash
sudo su -
```

**Best Practice**

* Avoid root unless required
* Use sudo for specific commands

---

## 11. Conditional Logic – `if / else`

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

---

## 12. Looping with `for`

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

---

## 13. Signals & the `trap` Command

### What Are Signals?

* `Ctrl+C` → `SIGINT`
* `kill -9` → `SIGKILL`

---

### Prevent Script Termination

```bash
trap "echo 'Ctrl+C is disabled'" SIGINT
```

### Advanced Use Case

Rollback on interruption:

```bash
trap "rm -rf /tmp/data" SIGINT
```

**Why Important**

* Prevent partial data writes
* Maintain system consistency

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

---