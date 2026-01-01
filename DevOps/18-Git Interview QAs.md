## Git Commands for DevOps Engineers — Practical, End-to-End Tutorial

![Image](https://nvie.com/img/git-model%402x.png)

![Image](https://blog.dbins.com.br/thumbs/git-add-commit.png)

![Image](https://wac-cdn.atlassian.com/dam/jcr%3Ac6db91c1-1343-4d45-8c93-bdba910b9506/02%20Branch-1%20kopiera.png?cdnVersion=3145)

![Image](https://wac-cdn.atlassian.com/dam/jcr%3A1896adb1-5d49-419a-9b50-3a36adac186c/09.svg?cdnVersion=3145)

---

## 1. Objective of This Tutorial

This tutorial explains **core Git commands and workflows** used daily by DevOps engineers and software developers. It focuses on **hands-on CLI usage**, practical scenarios, and **interview-relevant concepts**, including repository initialization, tracking changes, pushing to remote repositories, cloning, branching, merging, rebasing, and conflict resolution.

---

## 2. Initial Setup and Repository Creation

### 2.1 Creating a Working Directory

```bash
mkdir git-demo
cd git-demo
```

Assume the directory is empty.

---

## 3. Initializing a Git Repository

### 3.1 Initialize Local Repository

```bash
git init
```

**What this does:**

* Creates a hidden `.git/` directory
* Enables version tracking in the current folder

### 3.2 Verifying Initialization

```bash
ls -a
```

You will see:

```text
.git/
```

### 3.3 Interview Insight

* **Command to initialize a Git repository:** `git init`
* **Purpose of `.git` directory:**
  Stores metadata, commit history, hooks, configuration, and tracking data.

---

## 4. Adding and Tracking Files

### 4.1 Create a Sample File

```bash
touch calculator.sh
```

### 4.2 Check Repository Status

```bash
git status
```

Output indicates:

```text
Untracked files: calculator.sh
```

### 4.3 Start Tracking the File

```bash
git add calculator.sh
```

### 4.4 Verify Tracking State

```bash
git status
```

File now appears under **“Changes to be committed”**.

---

## 5. Understanding File Changes

### 5.1 Modify the File

```bash
echo "x=$((1+2))" >> calculator.sh
```

### 5.2 View Changes

```bash
git diff
```

Shows line-by-line differences since the last commit.

---

## 6. Committing Changes

### 6.1 Commit Tracked Changes

```bash
git commit -m "Initial calculator addition functionality"
```

### 6.2 Viewing Commit History

```bash
git log
```

Or concise format:

```bash
git log --oneline
```

### 6.3 Why Commits Matter

* Enables rollback
* Identifies *who* made *what* change
* Forms the foundation of auditability and collaboration

---

## 7. Git Workflow (Daily Usage)

**Standard workflow used in most organizations:**

```bash
git add .
git commit -m "Meaningful message"
git push
```

---

## 8. Remote Repositories and Git Push

### 8.1 Why `git push` May Fail

If the repository has **no remote configured**, `git push` does nothing.

### 8.2 Check Remote Configuration

```bash
git remote -v
```

If empty, no remote is configured.

### 8.3 Add a Remote Repository

```bash
git remote add origin https://github.com/<username>/<repo>.git
```

Verify:

```bash
git remote -v
```

### 8.4 Push Changes

```bash
git push origin main
```

---

## 9. Cloning Existing Repositories

### 9.1 Purpose of `git clone`

* Downloads an existing repository
* Automatically configures the remote

### 9.2 Clone Using HTTPS

```bash
git clone https://github.com/org/project.git
```

Authentication: GitHub username + token/password

### 9.3 Clone Using SSH (Recommended)

#### Generate SSH Key (if not present)

```bash
ssh-keygen -t rsa
```

#### Locate Public Key

```bash
cat ~/.ssh/id_rsa.pub
```

#### Add Key in GitHub

* Settings → SSH and GPG keys → Add new key

#### Clone Using SSH

```bash
git clone git@github.com:org/project.git
```

**Advantage:** No password required for future operations.

---

## 10. Git Clone vs Git Fork (Interview Critical)

### 10.1 Git Clone

* Downloads a repository to local machine
* Tracks original remote

```bash
git clone <repo-url>
```

### 10.2 Git Fork

* Creates a **server-side copy** of a repository
* Common in open-source collaboration
* Fork remains independent of the original unless synced manually

### 10.3 Summary

| Feature          | Clone            | Fork                     |
| ---------------- | ---------------- | ------------------------ |
| Location         | Local            | GitHub account           |
| Use Case         | Work on code     | Independent development  |
| Typical Scenario | Company projects | Open-source contribution |

---

## 11. Branching Fundamentals

### 11.1 Why Branches Exist

* Isolate features
* Prevent unstable code from breaking production
* Enable parallel development

### 11.2 Create a Branch

```bash
git checkout -b division
```

### 11.3 List Branches

```bash
git branch
```

### 11.4 Switch Branches

```bash
git checkout main
```

---

## 12. Merging Changes Between Branches

## 12.1 Cherry Pick (Selective Commits)

### Use Case

* When only **specific commits** are required

```bash
git log division
git cherry-pick <commit-id>
```

**Limitation:** Not scalable for many commits.

---

## 12.2 Git Merge

### Use Case

* Combine entire branch into another
* Preserves branch history

```bash
git checkout main
git merge merge-example
```

### Result

* Creates a merge commit
* Non-linear commit history

---

## 12.3 Git Rebase

### Use Case

* Maintain clean, linear commit history
* Preferred in large projects

```bash
git checkout main
git rebase rebase-example
```

### Result

* Rewrites commit history
* Commits appear as if developed sequentially

---

## 13. Merge Conflicts

### 13.1 Why Conflicts Occur

* Same file modified in multiple branches

### 13.2 Conflict Resolution Steps

1. Open conflicted file
2. Review conflict markers
3. Decide correct changes
4. Remove conflict markers
5. Stage and continue

```bash
git add calculator.sh
git rebase --continue
```

---

## 14. Git Merge vs Git Rebase — Key Difference

| Aspect         | Merge                | Rebase                  |
| -------------- | -------------------- | ----------------------- |
| History        | Non-linear           | Linear                  |
| Commits        | Preserved            | Rewritten               |
| Ease           | Simpler              | Cleaner                 |
| Preferred When | History not critical | History clarity matters |

---

## 15. Core Git Commands You Use Daily

```bash
git init
git status
git add
git diff
git commit
git log
git push
git pull
git clone
git branch
git checkout
git merge
git rebase
git cherry-pick
```

---

## 16. Interview Takeaways

* Understand **Git lifecycle**
* Know **clone vs fork**
* Be clear on **merge vs rebase**
* Be able to explain **conflict resolution**
* Practice workflows, not just commands

---

## 17. Final Notes

These commands cover **90% of real-world Git usage** in DevOps and development roles. Advanced commands are used occasionally and can be referenced when required. Mastery comes from **practice**, not memorization.

---
