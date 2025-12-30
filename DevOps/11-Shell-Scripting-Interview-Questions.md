# Shell Scripting Interview Questions –

## 1. Most Commonly Used Shell Commands (Interview Perspective)

### Key Interview Advice

Interviewers assess whether you **actually work on Linux systems daily**. Always mention **commands you genuinely use**, not rare debugging tools.

### Frequently Used Commands

```bash
ls        # List files
cd        # Change directory
mkdir     # Create directories
touch     # Create files
cp        # Copy files
mv        # Move/rename files
rm        # Remove files
vim       # Edit files
grep      # Filter output
find      # Search files
df -h     # Disk usage
top       # System monitoring
ps -ef    # Process listing
```

### Important Note

Commands like `netcat`, `traceroute`, and `tcpdump` are **debugging tools**, not daily-use commands. Mention them only as **advanced or situational tools**.

---

## 2. Script to List All Running Processes

### Command Used

```bash
ps -ef
```

This lists:

* All processes
* User
* PID
* Parent PID
* CPU start time
* Command

### Extract Only Process IDs (PID)

```bash
ps -ef | awk '{print $2}'
```

**Explanation:**

* `ps -ef` → Full process list
* `awk` → Column-based filtering
* `$2` → Second column (PID)

---

## 3. Print Only Error Logs from a Remote File

### Concept

Logs may be stored remotely (S3, GCS, GitHub, servers). Instead of downloading full logs, filter required entries.

### Example: Fetch and Filter Logs

```bash
curl <log_file_url> | grep ERROR
```

### Breakdown

| Command | Purpose                              |                                       |
| ------- | ------------------------------------ | ------------------------------------- |
| `curl`  | Fetch remote file                    |                                       |
| `grep`  | Filter specific text (ERROR / TRACE) |                                       |
| `       | ` (pipe)                             | Send output of one command to another |

### Why Pipe Is Mandatory

Without `|`, the shell treats commands independently and fails.

---

## 4. Script: Print Numbers Divisible by 3 or 5 but NOT 15

### Interview Strategy

Always:

1. Clarify the range
2. Break conditions logically
3. Explain before coding

### Problem Breakdown

* Divisible by **3 OR 5**
* NOT divisible by **15**
* Range: `1–100`

### Shell Script

```bash
#!/bin/bash

for i in {1..100}
do
  if (( (i % 3 == 0 || i % 5 == 0) && i % 15 != 0 ))
  then
    echo $i
  fi
done
```

### Key Concepts Used

* `for` loop
* Modulo operator `%`
* Logical OR `||`
* Logical AND `&&`

---

## 5. Count Occurrence of Character (‘s’) in a Word

### Example Word

`Mississippi`

### Expected Output

`s` occurs **4 times**

### Script

```bash
#!/bin/bash

word="mississippi"
grep -o "s" <<< "$word" | wc -l
```

### Explanation

| Command   | Role                             |
| --------- | -------------------------------- |
| `grep -o` | Extract only matching characters |
| `<<<`     | Here-string (stdin redirection)  |
| `wc -l`   | Count lines                      |

Change the word to test:

```bash
word="singapore"
```

---

## 6. Debugging a Shell Script

### Enable Debug Mode

```bash
set -x
```

### Purpose

* Prints each command before execution
* Helps identify logic and syntax errors

---

## 7. Cron Tab (Scheduled Jobs in Linux)

### What Is Crontab?

A **task scheduler** for Linux.

### Use Case Example

* Daily health report at 6 PM
* Automated backups
* Log rotation

### Crontab Syntax

```bash
crontab -e
```

Example:

```bash
0 18 * * * /path/to/script.sh
```

This runs the script **every day at 6 PM**.

---

## 8. Open a File in Read-Only Mode

```bash
vim -R file.txt
```

---

## 9. Difference Between Soft Link and Hard Link

### Hard Link

* Points to the **same inode**
* File survives even if original is deleted
* Acts as a backup

```bash
ln original.txt hardlink.txt
```

### Soft Link (Symbolic Link)

* Acts as a shortcut
* Breaks if original file is deleted

```bash
ln -s python3 python
```

---

## 10. Difference Between `break` and `continue`

### `break`

* Terminates loop execution entirely

### `continue`

* Skips current iteration
* Moves to next loop cycle

### Example

```bash
for i in {1..10}
do
  if [ $i -eq 5 ]; then
    continue
  fi
  echo $i
done
```

---

## 11. Disadvantages of Shell Scripting

Common Interview Points:

* Not statically typed
* Weak error handling
* Difficult to manage large applications
* Debugging complexity without `set -x`
* Performance limitations

---

## 12. Types of Loops in Shell Scripting

* `for`
* `while`
* `until`
* `select`

Each is chosen based on:

* Fixed range
* Condition-based execution
* User-driven input

---

## 13. Is Bash Dynamically or Statically Typed?

**Answer:** Dynamically Typed

Example:

```bash
x=5
x="hello"
```

No type enforcement unless explicitly checked.

---

## 14. Networking Troubleshooting Tools

### `traceroute`

```bash
traceroute google.com
```

Shows:

* Network hops
* Latency per hop

### `tracepath`

* Similar to traceroute
* No root privileges required

---

## 15. Sort a List of Names in a File

### Simple and Correct Answer

```bash
sort names.txt
```

Avoid overengineering unless asked.

---

## 16. Log Management for High-Volume Systems

### Problem

Logs grow rapidly → disk fills up

### Solution: Logrotate

* Compress logs
* Rotate daily
* Auto-delete old logs

### Features

* Gzip / tar compression
* Retention policy (e.g., 30 days)
* Automated cleanup

---