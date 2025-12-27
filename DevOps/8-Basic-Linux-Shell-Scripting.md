# Linux Operating System & Shell Scripting Basics

## 1. Overview

* Understand what an **Operating System (OS)** is
* Learn **why Linux is dominant in DevOps**
* Understand **Linux architecture at a high level**
* Learn **fundamental shell commands**
* Get introduced to **basic system monitoring commands**

---

## 2. What Is an Operating System?

### 2.1 Practical Definition

An **Operating System (OS)** acts as a **bridge between software and hardware**.

* **Hardware**: CPU, RAM, Disk (I/O)
* **Software**: Applications like Jenkins, Python, Java, browsers, etc.

Applications **cannot directly communicate with hardware**. The OS acts as a mediator.

### 2.2 Communication Flow

```
User → Application → Operating System → Hardware
Hardware → Operating System → Application → User
```

Without an OS:

* Hardware is unusable
* Applications cannot run

That is why the OS is considered the **core of any computing system**.

---

## 3. Why Linux Is Widely Used in DevOps & Production

Although many users are familiar with Windows, **Linux dominates production environments**.

### 3.1 Key Reasons

1. **Free & Open Source**

   * Linux is open-source
   * Windows is proprietary (licensed by Microsoft)

2. **Security**

   * Linux is inherently more secure
   * No mandatory antivirus required in most cases

3. **Performance**

   * Lightweight and fast
   * Ideal for handling large-scale production traffic

4. **Stability**

   * Rare crashes
   * Suitable for 24×7 production systems

5. **Industry Adoption**

   * ~80–90% of production servers run Linux

---

## 4. Linux Distributions (Distros)

Linux is not a single OS but a **family of distributions**, provided by different vendors.

### Common Distributions:

* **Ubuntu** (most popular in cloud & DevOps)
* **CentOS**
* **Red Hat Enterprise Linux (RHEL)**
* **Debian**
* **Alpine**
* **Fedora**

Each distribution uses the same Linux kernel but may differ in:

* Package managers
* System libraries
* Default tools

---

## 5. High-Level Linux Architecture

The Linux OS can be understood in **three layers**:

### 5.1 Kernel (Heart of the OS)

The **kernel** handles communication between hardware and software.

**Primary responsibilities of the kernel:**

1. **Process Management**
2. **Memory Management**
3. **Device Management**
4. **System Call Handling**

> Interview Tip:
> “The kernel is the core of the operating system responsible for managing CPU, memory, devices, and system calls.”

---

### 5.2 System Libraries

* Provide standard functions for applications
* Act as an interface between user programs and the kernel

**Example:**

* `glibc` (GNU C Library)

---

### 5.3 User Space (Top Layer)

Includes:

* Compilers (Java, Python, GCC)
* User processes
* System utilities and services

---

## 6. Why Shell Scripting Is Essential in DevOps

### 6.1 What Is a Shell?

A **shell** is a **command-line interface** used to interact with the OS.

* Most production servers **do not have GUI**
* Everything is done using **commands**

### 6.2 Popular Shells

* `bash` (most widely used – recommended)
* `sh`
* `zsh`
* `ksh`

---

## 7. Connecting to a Linux Server (AWS EC2 Example)

```bash
ssh -i key.pem ubuntu@<public-ip>
```

* `-i` → Identity (key pair)
* `ubuntu` → Default user for Ubuntu AMI
* `<public-ip>` → EC2 public IP address

---

## 8. Essential Linux Commands (Day-to-Day Usage)

### 8.1 Check Current Location

```bash
pwd
```

**PWD** = Present Working Directory

---

### 8.2 List Files and Directories

```bash
ls
```

Detailed listing with metadata:

```bash
ls -ltr
```

**What it shows:**

* `d` → directory
* `-` → file
* Owner and group
* Permissions
* File size
* Timestamp

---

### 8.3 Change Directory

```bash
cd folder_name
```

Go back one level:

```bash
cd ..
```

Go back two levels:

```bash
cd ../../
```

Go directly to a path:

```bash
cd /home/ubuntu/bundle
```

---

## 9. File and Directory Operations

### 9.1 Create a File

```bash
touch filename
```

---

### 9.2 Create & Edit a File Using `vi`

```bash
vi test.txt
```

**Steps inside `vi`:**

1. Press `i` → Insert mode
2. Write content
3. Press `Esc`
4. Save & exit:

   ```bash
   :wq
   ```

---

### 9.3 Read File Content

```bash
cat test.txt
```

---

### 9.4 Create a Directory

```bash
mkdir directory_name
```

---

### 9.5 Delete Files and Directories

Delete file:

```bash
rm filename
```

Delete directory:

```bash
rm -r directory_name
```

---

## 10. System Monitoring Commands (Very Important)

### 10.1 Memory Usage

```bash
free -m
```

---

### 10.2 CPU Count

```bash
nproc
```

---

### 10.3 Disk Usage

```bash
df -h
```

---

### 10.4 All-in-One Monitoring Command

```bash
top
```

Shows:

* CPU usage
* Memory usage
* Running processes

> Interview Tip:
> “`top` is used to monitor CPU, memory, and process usage in real time.”

---

## 11. Summary of Commands Learned

| Purpose           | Command         |
| ----------------- | --------------- |
| Current directory | `pwd`           |
| List files        | `ls`, `ls -ltr` |
| Change directory  | `cd`            |
| Create file       | `touch`         |
| Edit file         | `vi`            |
| Read file         | `cat`           |
| Create directory  | `mkdir`         |
| Delete file       | `rm`            |
| Delete directory  | `rm -r`         |
| Memory usage      | `free -m`       |
| CPU info          | `nproc`         |
| Disk usage        | `df -h`         |
| Full monitoring   | `top`           |

---