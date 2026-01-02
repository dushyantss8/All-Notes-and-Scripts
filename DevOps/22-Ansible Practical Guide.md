# Ansible Practical Tutorial -

## Objective

This tutorial focuses on **practical Ansible usage**, covering:

* Ansible installation
* Passwordless SSH setup
* Ad-hoc commands
* Inventory management
* Writing and executing Ansible playbooks
* Understanding verbosity
* Introduction to Ansible Roles and project structuring

---

## Prerequisites

* Linux system (recommended: Ubuntu)
* Two servers:

  * **Ansible Control Node**
  * **Target Node**
* SSH access between servers
* Basic Linux command-line knowledge

---

## 1. Installing Ansible

### Step 1: Update Package Index

```bash
sudo apt update
```

### Step 2: Install Ansible

```bash
sudo apt install ansible -y
```

### Step 3: Verify Installation

```bash
ansible --version
```

Expected output confirms Ansible version and Python path.

---

## 2. Architecture Overview

* **Control Node**: Machine where Ansible is installed
* **Target Node(s)**: Machines to be configured
* Communication occurs over **SSH**
* **Passwordless SSH authentication is mandatory**

---

## 3. Setting Up Passwordless SSH Authentication

### Step 1: Generate SSH Keys on Control Node

```bash
ssh-keygen
```

(Default location: `/home/ubuntu/.ssh/id_rsa`)

This generates:

* `id_rsa` (private key)
* `id_rsa.pub` (public key)

### Step 2: Copy Public Key

```bash
cat ~/.ssh/id_rsa.pub
```

### Step 3: Add Public Key to Target Server

On the target server:

```bash
mkdir -p ~/.ssh
vi ~/.ssh/authorized_keys
```

Paste the copied public key and save.

### Step 4: Test Passwordless Login

```bash
ssh ubuntu@<target-private-ip>
```

Successful login without password confirms setup.

---

## 4. Inventory File

The inventory file defines target servers.

### Example Inventory File (`inventory`)

```ini
172.31.62.28
```

Default inventory location:

```bash
/etc/ansible/hosts
```

Custom inventory files are recommended for flexibility.

---

## 5. Ansible Ad-Hoc Commands

Ad-hoc commands are used for **single or simple tasks**.

### Basic Syntax

```bash
ansible -i inventory all -m <module> -a "<arguments>"
```

### Example: Create a File

```bash
ansible -i inventory all -m shell -a "touch devops_class"
```

### Verify on Target Node

```bash
ls -ltr
```

---

### Running Other Commands

#### Check CPU Count

```bash
ansible -i inventory all -m shell -a "nproc"
```

#### Disk Usage

```bash
ansible -i inventory all -m shell -a "df -h"
```

---

## 6. Understanding Ansible Modules

* `-m` → module
* `-a` → arguments

Modules are reusable logic units.

Common modules:

* `shell`
* `copy`
* `apt`
* `service`

Example (copy file):

```bash
ansible -i inventory all -m copy -a "src=test.txt dest=/tmp/test.txt"
```

Refer to **official Ansible module documentation** for module-specific arguments.

---

## 7. Grouping Hosts in Inventory

Inventory grouping allows targeted execution.

### Example Inventory with Groups

```ini
[webservers]
172.31.62.100

[dbservers]
172.31.62.101
172.31.62.102
```

### Execute Command on Web Servers Only

```bash
ansible -i inventory webservers -m shell -a "uptime"
```

---

## 8. When to Use Playbooks vs Ad-Hoc Commands

| Use Case                 | Recommendation  |
| ------------------------ | --------------- |
| 1–2 simple tasks         | Ad-hoc commands |
| Multiple dependent tasks | Playbooks       |
| Repeatable automation    | Playbooks       |
| Configuration management | Playbooks       |

---

## 9. Writing Your First Ansible Playbook

### Use Case

* Install Nginx
* Start Nginx service

### Playbook File: `first-playbook.yaml`

```yaml
---
- name: Install and start Nginx
  hosts: all
  become: yes

  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present

    - name: Start nginx service
      service:
        name: nginx
        state: started
```

---

## 10. Executing the Playbook

```bash
ansible-playbook -i inventory first-playbook.yaml
```

### Expected Output

* Gathering facts
* Install nginx
* Start nginx

### Verify on Target Node

```bash
sudo systemctl status nginx
```

---

## 11. Understanding Verbosity (Debugging)

Verbose mode shows **internal Ansible execution details**.

### Verbosity Levels

```bash
ansible-playbook -i inventory first-playbook.yaml -v
ansible-playbook -i inventory first-playbook.yaml -vv
ansible-playbook -i inventory first-playbook.yaml -vvv
```

Use `-vvv` for:

* SSH debugging
* Python dependency checks
* Module execution details

---

## 12. Real-World Use Case: Kubernetes Setup

Typical DevOps workflow:

* **Terraform** → Infrastructure creation (EC2)
* **Ansible** → Configuration

  * Control plane setup
  * Worker node setup

Large configurations involve **50+ tasks**, making single playbooks hard to maintain.

---

## 13. Introduction to Ansible Roles

### Why Roles?

* Improves readability
* Encourages reuse
* Scales for complex setups
* Industry-standard practice

---

## 14. Creating an Ansible Role

### Initialize Role

```bash
ansible-galaxy role init kubernetes
```

### Generated Structure

```
kubernetes/
├── defaults/
├── files/
├── handlers/
├── meta/
├── tasks/
├── templates/
├── tests/
├── vars/
└── README.md
```

---

## 15. Role Directory Breakdown

### `tasks/`

* Main automation logic (`main.yaml`)

### `handlers/`

* Triggered on task failure or changes
* Example: restart service on config change

### `defaults/`

* Default variables (lowest priority)

### `vars/`

* Variables (higher priority than defaults)

### `files/`

* Static files (certificates, HTML files)

### `templates/`

* Jinja2 templates (`.j2`)

### `meta/`

* Metadata
* Author, license, dependencies

### `tests/`

* Test playbooks for role validation

### `README.md`

* Role documentation

---

## 16. Using Roles in a Playbook

### Parent Playbook (`site.yaml`)

```yaml
---
- hosts: all
  roles:
    - kubernetes
```

Tasks are now managed inside the role instead of the playbook.

---

## 17. Learning Path Recommendation

1. Master **SSH passwordless authentication**
2. Practice **Ansible ad-hoc commands**
3. Write **basic playbooks**
4. Use **verbosity for debugging**
5. Move to **roles**
6. Study **real-world examples**
7. Prepare **interview questions (roles, handlers, inventory, modules)**

---

## Conclusion

This tutorial covered:

* End-to-end Ansible practical workflow
* Ad-hoc commands vs playbooks
* Inventory grouping
* Playbook execution and debugging
* Role-based project structuring

Ansible becomes powerful when combined with **Terraform**, **roles**, and **modular design**, which is how it is used in real production environments.

---
