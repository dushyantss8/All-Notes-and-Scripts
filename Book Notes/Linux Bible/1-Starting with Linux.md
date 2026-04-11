# Starting with Linux

This chapter introduces Linux by explaining what it is, where it came from, the major distributions available, and the professional opportunities associated with Linux. It also discusses Linux certification and how organizations use Linux in enterprise environments.

Linux has become one of the most important technologies in modern computing. Many major companies rely on Linux infrastructure. Google uses thousands of Linux servers for search systems, Android smartphones run on the Linux kernel, and Chrome OS is also Linux-based. Facebook uses the **LAMP stack** (Linux, Apache, MySQL, PHP) for its platform, and major financial exchanges such as the New York Stock Exchange and Tokyo Stock Exchange rely on Linux systems.

Because of this widespread adoption, there is strong global demand for professionals who understand how to deploy, manage, and maintain Linux systems.

---

# What Linux Is

Linux is an operating system that manages computer hardware and allows applications to run. Like other operating systems, Linux provides several core functions:

* **Hardware management** – Detects system hardware during boot and loads drivers.
* **Process management** – Controls multiple running processes and CPU usage.
* **Memory management** – Allocates RAM and swap space to applications.
* **User interfaces** – Provides both command-line interfaces (shell) and graphical desktops.
* **Filesystem control** – Manages files, directories, ownership, and permissions.
* **User authentication** – Supports user and group accounts with security boundaries.
* **Administrative tools** – Offers many commands and utilities for managing systems.
* **Service management** – Runs background services such as web servers, printing, logging, and networking.
* **Programming tools** – Includes development tools for building applications.

Modern Linux systems also support advanced enterprise features such as:

* **Clustering** – Multiple systems operate as a single system.
* **Virtualization** – Running multiple operating systems on one machine using technologies like KVM or Xen.
* **Real-time computing** – High-priority processes receive predictable CPU scheduling.
* **Advanced storage technologies** – Including iSCSI, Fibre Channel, and InfiniBand.

Although graphical tools exist, Linux administrators typically rely heavily on the **command-line shell**.

---

<div style="page-break-after: always;"></div>

# Linux vs Proprietary Operating Systems

Operating systems such as Microsoft Windows and Apple macOS are **proprietary**, meaning:

* Their source code cannot be viewed.
* Users cannot modify the operating system.
* Internal functionality cannot be examined for bugs or security issues.
* Software integration may be limited.

Linux, however, is part of the **free and open-source software (FOSS)** ecosystem. Anyone can study, modify, and redistribute the software. This openness has accelerated technological innovation and reduced costs, contributing to the growth of the Internet, mobile devices, and many technology companies.

---

# Origins of Linux and UNIX

The origins of Linux trace back to **UNIX**, which was developed at **AT&T Bell Labs** by **Ken Thompson** and **Dennis Ritchie** around 1969 after the failure of the Multics project.

UNIX introduced several influential ideas:

### UNIX Filesystem

A hierarchical directory structure allowed directories to contain subdirectories. Hardware devices were also represented as files, simplifying interaction with hardware.

### Input and Output Redirection

UNIX allowed commands to be combined through redirection and pipes. For example:

```
cat file1 file2 | sort | pr | lpr
```

This design encouraged small modular tools that could be combined to perform complex tasks.

### Portability

UNIX was designed to run on different hardware systems by modifying only the hardware drivers.

---

<div style="page-break-after: always;"></div>

# The Role of the C Programming Language

Dennis Ritchie and Brian Kernighan developed the **C programming language**, which allowed UNIX to be rewritten in a high-level language in 1973.

This greatly improved portability and maintainability. Today, most UNIX-like kernels, including the Linux kernel, are still primarily written in C.

---

# UNIX Documentation

UNIX documentation was distributed as **man pages (manual pages)**, which describe commands, system utilities, and programming tools.

Man pages remain the primary documentation system for UNIX and Linux systems today and can be accessed using the `man` command.

---

# Commercialization of UNIX

Initially, AT&T licensed UNIX source code to universities and research institutions for a small fee. Organizations compiled the system themselves from source code.

After the breakup of AT&T in 1984, UNIX development became more commercialized. AT&T formed **UNIX System Laboratories (USL)** to manage development and licensing.

Two important UNIX standards were introduced:

* **POSIX (Portable Operating System Interface)**
* **System V Interface Definition (SVID)**

These standards later influenced Linux development.

However, commercial UNIX struggled in the desktop market because Microsoft Windows dominated personal computers.

---

# BSD Development

A major UNIX variant called **Berkeley Software Distribution (BSD)** was developed at the University of California, Berkeley.

BSD followed the open and collaborative culture of early UNIX development, while AT&T focused more on commercialization. BSD systems became widely used in technical environments and influenced later operating systems.

---

# Rise of Free Software

As UNIX became more restrictive, **Richard Stallman** founded the **Free Software Foundation (FSF)** in 1984 and launched the **GNU Project**.

The goal of GNU was to recreate a complete UNIX-like operating system composed entirely of free software. GNU developers produced many tools and utilities but lacked one critical component: the **kernel**.

To protect software freedom, the FSF created the **GNU General Public License (GPL)**, which allows users to modify and distribute software while requiring that modified versions remain open source.

---

# Creation of the Linux Kernel

In 1991, **Linus Torvalds**, a student at the University of Helsinki, began developing a UNIX-like kernel called **Linux**.

Torvalds announced the project on August 25, 1991, in the `comp.os.minix` newsgroup. Early versions were designed for Intel 386 processors.

The Linux kernel eventually became the missing component needed to combine with GNU tools to form a complete operating system. Although technically the system is **GNU/Linux**, the name **Linux** became widely used.

---

# Linux Governance

Linux development is coordinated by the **Linux Foundation**, a nonprofit organization supported by major technology companies such as IBM, Intel, Dell, Cisco, Red Hat, SUSE, and Oracle.

The organization promotes Linux development, sets standards, and protects the Linux ecosystem.

---

# Linux Desktop Environments

Linux supports several graphical desktop environments, including:

* **KDE**
* **GNOME**
* **Xfce**
* **LXDE**

These environments provide graphical user interfaces that make Linux accessible to a wider audience.

---

<div style="page-break-after: always;"></div>

# Open Source Licensing

The **Open Source Initiative (OSI)** defines criteria that software licenses must follow to be considered open source. Key principles include free distribution, access to source code, permission to modify software, and no discrimination against users or fields of use.

Common open-source licenses include:

* **GPL**
* **LGPL**
* **BSD License**
* **MIT License**
* **Mozilla License**

---

# Linux Distributions

A **Linux distribution** packages the Linux kernel with system tools, software libraries, installation programs, and optional graphical environments.

Early distributions included Slackware, KNOPPIX, Gentoo, and Mandrake. Two influential distributions were **Red Hat Linux** and **Debian**.

---

# Red Hat and Fedora

**Red Hat Enterprise Linux (RHEL)** is designed for enterprise environments requiring high reliability and support. Red Hat sells subscriptions that include updates, certified hardware compatibility, and technical support.

Red Hat also develops related technologies such as middleware and virtualization platforms.

**Fedora** is a free, community-driven distribution sponsored by Red Hat. It serves as a testing ground for new technologies that may later appear in RHEL.

---

# Debian and Ubuntu

**Debian GNU/Linux** is known for stability and its **deb package management system**.

Many distributions are based on Debian, with **Ubuntu** being the most popular. Ubuntu focuses on ease of installation, user-friendly interfaces, and accessibility for new Linux users.

<div style="page-break-after: always;"></div>

# Business Models for Linux

Companies generate revenue from Linux through several approaches:

* **Software subscriptions** (e.g., Red Hat support services)
* **Training and certification programs**
* **Feature development funding**
* **Donations**
* **Merchandise sales**

---

# Linux Certification

Linux certifications validate system administration skills. Two major certifications from Red Hat include:

### RHCSA (Red Hat Certified System Administrator)

Focuses on fundamental administration tasks such as managing users, filesystems, networking, storage, and security.

### RHCE (Red Hat Certified Engineer)

Covers advanced system administration topics including network services, firewall configuration, system tuning, logging, and security management.

These exams are **performance-based**, requiring candidates to complete real system administration tasks on a live system.

---