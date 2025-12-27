# Shell Scripting –

## 1. Introduction

The document introduces a **Shell Scripting** course aimed primarily at **DevOps engineers**. The objective is to:

* Understand **what shell scripting is**
* Learn **why it is critical for DevOps**
* Cover **basic to intermediate shell scripting**
* Lay the foundation for **advanced automation use cases**

The instructor emphasizes automation, real-world usage, and interview relevance.

---

## 2. What Is Shell Scripting?

### Definition

Shell scripting is the process of **automating repetitive or manual tasks** on a Linux system by writing a sequence of Linux commands into a file (script) and executing it.

### Automation Concept

Automation means reducing human effort for repetitive tasks, such as:

* Creating thousands of files
* Monitoring servers
* Running maintenance tasks
* Managing infrastructure

Manual tasks become impractical at scale, which is where shell scripting becomes essential.

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

---

## 4. Linux Environment Prerequisites

You can practice shell scripting on:

* AWS EC2 Linux instances
* Any cloud-based Linux VM
* Oracle VirtualBox
* Local Linux or macOS terminal
* Windows via SSH tools like **PuTTY**

---

## 5. Basic Linux Commands (Hands-On)

### 5.1 Creating Files – `touch`

Creates an empty file.

```bash
touch first_shell_script.sh
```

Used heavily in automation where opening files interactively is not possible.

---

### 5.2 Listing Files – `ls`

```bash
ls
ls -ltr
```

* `-l`: long listing
* `-t`: sort by time
* `-r`: reverse order

---

### 5.3 Viewing Command Documentation – `man`

```bash
man ls
man touch
```

The `man` command is the built-in Linux manual and is critical when you forget syntax or options.

---

## 6. Editing Files Using VI / Vim

### Opening a File

```bash
vi first_shell_script.sh
```

### Insert Mode

* Press `Esc`
* Press `i` to enter **insert mode**

### Save and Exit

```text
Esc → :wq → Enter
```

### Exit Without Saving

```text
Esc → :q!
```

---

## 7. Viewing File Contents Without Opening – `cat`

```bash
cat first_shell_script.sh
```

Useful for quick inspection of scripts.

---

## 8. Understanding the Shebang (`#!`)

### What Is Shebang?

The **first line** of a shell script that tells Linux **which interpreter** should execute the script.

```bash
#!/bin/bash
```

---

### Common Shell Interpreters

* `bash` (most common)
* `sh`
* `dash`
* `ksh`

---

### Interview-Critical Concept: `/bin/sh` vs `/bin/bash`

* Earlier: `/bin/sh` → symlinked to `bash`
* Now (e.g., Ubuntu): `/bin/sh` → symlinked to `dash`
* `dash` does **not support all bash features**

✅ **Best Practice:**
Always use:

```bash
#!/bin/bash
```

---

## 9. Writing Your First Shell Script

### Example: Print a Message

```bash
#!/bin/bash
echo "My name is Abhishek"
```

---

## 10. Executing a Shell Script

### Method 1: Using `sh`

```bash
sh first_shell_script.sh
```

### Method 2: Using `./`

```bash
./first_shell_script.sh
```

---

## 11. Linux File Permissions & `chmod`

### Why Permissions Are Required

Linux is security-focused. Even file creators must explicitly grant execution rights.

---

### Grant Full Permissions

```bash
chmod 777 first_shell_script.sh
```

---

### Permission Breakdown (4-2-1 Rule)

| Value | Meaning                |
| ----- | ---------------------- |
| 4     | Read                   |
| 2     | Write                  |
| 1     | Execute                |
| 7     | Read + Write + Execute |

Example:

```bash
chmod 444 file.sh   # Read-only for all
chmod 770 file.sh   # Full access to owner & group only
```

---

## 12. Viewing Command History

```bash
history
```

Helps recall previously executed commands, especially in production environments.

---

## 13. Directory Management Commands

### Present Working Directory

```bash
pwd
```

---

### Create Directory

```bash
mkdir my_folder
```

---

### Change Directory

```bash
cd my_folder
cd ..
```

---

## 14. Writing a Practical Automation Script

### Objective

* Create a folder
* Enter the folder
* Create two files

---

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

---

## 15. Monitoring System Health (DevOps Perspective)

### CPU Count

```bash
nproc
```

---

### Memory Usage

```bash
free -m
```

---

### Process Monitoring

```bash
top
```

Used to identify:

* High CPU usage
* Memory leaks
* Running processes
* Performance bottlenecks

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

---

## 17. Advanced Topics (Mentioned, Not Covered)

* Signal trapping (`trap`)
* Handling `Ctrl+C`
* Cron jobs
* Advanced monitoring scripts
* Custom alerts
* Error handling

---

## 18. Key Takeaways

* Shell scripting is **simple but powerful**
* Linux fundamentals are mandatory
* Bash is the preferred shell
* Practice is critical
* Shell scripting is a **core DevOps skill**
* Forms the base before learning Python automation

---

## 19. Interview Highlights

* Difference between `/bin/sh` and `/bin/bash`
* File permissions and `chmod`
* Node health monitoring
* Why shell scripting is used despite automation tools

---