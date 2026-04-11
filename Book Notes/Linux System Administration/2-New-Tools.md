## New Tools to Improve the Administrative Experience

This tutorial focuses on tools and techniques that help Linux system administrators work more efficiently. It introduces task management, monitoring tools, automation with Ansible, and alternative ways to configure Linux systems beyond traditional command-line methods.

---

### Task Management

Linux is made up of files and processes that work together to perform system operations. Administrators must understand how to start, stop, and manage these processes. Services are a common way to start processes; for example, starting the Apache web server (`httpd`) creates multiple running processes. Tools such as `systemctl`, `ps`, and other monitoring utilities help administrators verify and manage these running processes.

---

### Process Monitoring Tools

Monitoring system processes is important for diagnosing performance or stability issues.

* **top** – A default tool on most Linux distributions that shows real-time information about CPU usage, memory usage, running tasks, and system load.
* **Alternative tools** include:

  * **atop** – Displays system load and performance information.
  * **htop** – Similar to `top` but more interactive and easier to navigate.
  * **glances** – Shows extensive system information in a single interface.
  * **bpytop** – A visually enhanced text-based monitoring tool.
* **nmon** – Another useful performance monitoring tool that displays CPU, memory, disk, and kernel information.

---

### Killing Processes

Sometimes a process must be terminated due to issues such as hangs or memory leaks. Administrators should first try stopping services using proper service commands before killing processes directly.

Typical process termination steps:

1. Identify the process ID using tools like `ps` or `top`.
2. Attempt a graceful termination using `kill <PID>` (sends the `TERM` signal).
3. If necessary, force termination using `kill -9 <PID>`.

---

### Zombie Processes

A zombie process occurs when a process has finished executing but its parent process has not cleared its exit status. Since the process is already dead, it cannot be killed with normal commands. Zombie processes usually indicate application or system issues and often require investigating the parent process or, in some cases, rebooting the system.

---

### Background Tasks

Services usually run as background tasks so administrators do not need to keep an active session open. If a running process needs to be moved to the background:

1. Press **Ctrl + Z** to suspend the task.
2. Run **`bg`** to resume it in the background.
3. Use **`fg`** to bring it back to the foreground.

---

### Running Long-Running Tasks

#### Screen

`screen` allows users to create terminal sessions that continue running even after disconnecting. Administrators can detach from a session and reconnect later, which is useful for long-running scripts or processes.

Basic usage:

* `screen` – Start a new session
* `Ctrl + A`, then `D` – Detach from session
* `screen -list` – Show active sessions
* `screen -r <session_name>` – Reattach to a session

#### Tmux

`tmux` is a more modern alternative to `screen`. It allows multiple terminal windows, session management, and split-screen views within a single terminal session. Administrators can easily multitask, monitor logs, and run commands simultaneously without leaving the command line.

---

### Introduction to Ansible

Modern Linux system administration increasingly relies on automation. Ansible is a widely used automation tool that allows administrators to automate tasks such as system configuration, software installation, and infrastructure management.

---

### Installing Ansible

Ansible can be installed in two main ways:

* **Package Manager (recommended)**
  Install using tools like `dnf` or `apt`. This method also installs supporting configuration files.

* **pip (Python package manager)**
  Install using Python’s package installer. Administrators should ensure the correct Python environment is used.

---

### Ansible Configuration

Ansible configuration is controlled by the **`ansible.cfg`** file. Configuration files can exist in several locations, which Ansible checks in order:

1. `ansible.cfg` in the current directory
2. `.ansible.cfg` in the user’s home directory
3. `/etc/ansible/ansible.cfg`

The configuration file can also be specified using the `ANSIBLE_CONFIG` environment variable.

---

### Ansible Inventory

Ansible uses an **inventory file** to define the systems it manages. The inventory groups systems and allows tasks to target specific hosts or groups.

Example structure:

```
[webserver]
servera
serverb

[database]
serverc
```

---

### Running Ansible

Two commonly used commands:

* **`ansible`** – Executes single ad hoc commands.
* **`ansible-playbook`** – Runs playbooks containing multiple automated tasks.

Example commands:

```
ansible all -m ping
ansible-playbook -i inventory playbook.yaml
```

---

### Playbooks

A **playbook** is a YAML file that defines multiple automation tasks executed sequentially on specific hosts or groups. Playbooks allow administrators to automate complex system configurations.

---

### Roles

Ansible roles organize reusable automation code. A role performs a specific function, such as installing software or configuring a service, and typically includes directories for tasks, variables, handlers, defaults, and metadata.

Roles can be generated using:

```
ansible-galaxy init <role_name>
```

---

### Modules

Modules are the individual components that perform specific actions in Ansible tasks, such as installing packages or managing services. Most modules are written in Python and should be **idempotent**, meaning repeated execution produces the same result without unintended changes.

---

### Ansible Galaxy

Ansible Galaxy is a community platform for sharing and discovering roles and automation code. It allows administrators to reuse existing automation solutions and contribute their own roles or modules.

---

### Web Consoles for Linux Administration

#### Cockpit

Cockpit is a web-based management interface that allows administrators to configure and monitor Linux systems through a browser. It provides features such as:

* Managing storage and networking
* Viewing logs
* Running terminal sessions
* Managing services and applications

It typically runs on port **9090** and is installed using standard package managers.

**Limitations:**
Cockpit requires the system to be running and cannot resolve boot issues or manage virtual machine installations.

---

### Alternatives to Cockpit

Other web-based administration tools include:

* **Webmin** – A web interface for managing users, services, and system configuration.
* **Ajenti** – A clean and simple web console for managing Linux servers.

All of these tools provide graphical interfaces for managing systems but operate only on the system where they are installed.

---

### Text User Interface (TUI) Tools

Text-based configuration tools provide an easier way to manage system settings when users are unfamiliar with complex command-line options. These tools present configuration options in a menu-driven interface.

For example, **NetworkManager TUI (`nmtui`)** allows administrators to configure network settings quickly without remembering detailed command parameters.

---

Overall, the chapter emphasizes efficient system administration through process management tools, background task utilities, automation with Ansible, and alternative graphical or text-based configuration methods.


Now summarize this entire text properly, remove unnecessary and unrelated stuff and keep only important stuff. Don't add anything extra but also dont make them too short : -