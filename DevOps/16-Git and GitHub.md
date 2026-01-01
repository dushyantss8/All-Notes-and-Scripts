# Git and GitHub Fundamentals

## 1. Version Control Systems (VCS)

### 1.1 What Is a Version Control System?

A **Version Control System (VCS)** is a tool that helps track changes to files over time and enables multiple developers to collaborate on the same codebase efficiently.

### 1.2 Core Problems Solved by Version Control

#### Problem 1: Code Sharing

* In real-world applications, projects consist of **hundreds or thousands of files**.
* Multiple developers modify different files simultaneously.
* Sharing code via email or messaging tools is impractical due to:

  * Large number of files
  * Dependency files
  * Tracking who changed what and when

A VCS provides a **centralized and systematic way** to share code changes.

#### Problem 2: Versioning (Change History)

* Requirements often change over time.
* Developers may need to:

  * Revert to an older version
  * Identify changes made on a specific day
  * Discard recent changes while keeping older stable code

A VCS maintains **multiple versions (history)** of the codebase, enabling rollback and comparison.

---

## 2. Types of Version Control Systems

### 2.1 Centralized Version Control Systems

Examples: **SVN, CVS**

**Characteristics:**

* Single central server stores the code.
* All developers must communicate through this server.

**Problems:**

* Single point of failure.
* If the central server is down, developers cannot collaborate.
* Limited offline capabilities.

---

### 2.2 Distributed Version Control Systems

Example: **Git**

**Characteristics:**

* Every developer has a **complete copy of the repository**, including full history.
* Developers can work independently and offline.
* Multiple copies of the repository exist.

**Key Advantage:**

* No single point of failure.
* High availability and better collaboration.

---

## 3. Forking in Distributed Systems

### 3.1 What Is a Fork?

A **fork** is a complete copy of an existing repository.

**Use Case:**

* Developers create their own copy of a repository.
* Changes can be made independently.
* Code can later be shared back with the original repository.

---

## 4. Git vs GitHub

### 4.1 What Is Git?

* Git is an **open-source distributed version control system**.
* Can be installed locally or on a private server.
* Tracks file changes and manages versions.

### 4.2 What Is GitHub?

* GitHub is a **platform built on top of Git**.
* Adds:

  * Web UI
  * Code reviews
  * Issues and pull requests
  * Collaboration tools
  * Project management
  * CI/CD integrations

### 4.3 Summary

| Git                    | GitHub                           |
| ---------------------- | -------------------------------- |
| Version control system | Hosting & collaboration platform |
| Command-line tool      | Web-based service                |
| Manages versions       | Manages teams, reviews, CI/CD    |

---

## 5. Installing Git

### 5.1 Verify Installation

```bash
git
```

If Git is installed, a list of available Git commands is displayed.

---

## 6. Creating a Git Repository

### 6.1 Initialize a Repository

```bash
git init
```

This creates a hidden `.git` directory that stores all versioning metadata.

### 6.2 Verify Repository

```bash
ls -la
```

You should see a `.git` directory.

---

## 7. Understanding the `.git` Directory

| Component | Purpose                                                               |
| --------- | --------------------------------------------------------------------- |
| objects   | Stores file versions as objects                                       |
| refs      | References to commits                                                 |
| hooks     | Scripts to enforce rules (e.g., prevent secrets from being committed) |
| config    | Repository configuration                                              |
| HEAD      | Points to the current branch                                          |

Deleting `.git` removes version control from the folder.

---

## 8. Git Lifecycle and Core Commands

### 8.1 Git Status

Checks repository state.

```bash
git status
```

---

### 8.2 Tracking Files – `git add`

Adds files to Git tracking.

```bash
git add calculator.sh
```

---

### 8.3 Viewing Changes – `git diff`

Shows line-by-line differences between versions.

```bash
git diff
```

---

### 8.4 Saving Versions – `git commit`

Commits changes with a message.

```bash
git commit -m "Initial addition functionality"
```

---

### 8.5 Viewing Commit History – `git log`

Displays commit history.

```bash
git log
```

Each commit includes:

* Commit ID (hash)
* Author
* Timestamp
* Commit message

---

## 9. Example: Versioning a File

### 9.1 Initial File

```bash
X = A + B
```

### 9.2 Commit First Version

```bash
git add calculator.sh
git commit -m "Addition of two numbers"
```

---

### 9.3 Modify File

```bash
Y = A - B
```

Check changes:

```bash
git diff
```

---

### 9.4 Commit Second Version

```bash
git add calculator.sh
git commit -m "Added subtraction functionality"
```

---

## 10. Reverting to a Previous Version

### 10.1 Identify Commit

```bash
git log
```

### 10.2 Reset to Older Commit

```bash
git reset --hard <commit_id>
```

This restores the code exactly as it was at that commit.

---

## 11. Sharing Code Using GitHub

### 11.1 Why GitHub Is Needed

* Local Git repositories are private to your machine.
* GitHub enables:

  * Team collaboration
  * Central distributed access
  * Code sharing

---

### 11.2 Creating a GitHub Repository

Steps:

1. Create a GitHub account.
2. Click **New Repository**.
3. Enter repository name and description.
4. Choose **Public** or **Private**.
5. (Optional) Initialize with `README.md`.
6. Create repository.

---

### 11.3 Collaboration Features

* Fork repositories
* Share code with teams
* Manage access control
* Track issues and pull requests

---

## 12. Key Git Commands Summary

| Command          | Purpose                    |
| ---------------- | -------------------------- |
| git init         | Initialize repository      |
| git status       | Check repository status    |
| git add          | Track files                |
| git commit       | Save changes               |
| git diff         | View changes               |
| git log          | View commit history        |
| git reset --hard | Revert to previous version |

---

## 13. Key Takeaways

* Git solves **versioning and collaboration** problems.
* Git is **distributed**, unlike SVN/CVS.
* GitHub extends Git with **collaboration, CI/CD, and project management**.
* Understanding Git basics is essential for **developers and DevOps engineers**.

---