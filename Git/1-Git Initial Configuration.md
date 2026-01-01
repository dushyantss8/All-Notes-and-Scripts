## 1. What Is Git Initial Configuration?

When Git is installed on a system, it does **not automatically know**:

* Who you are
* How to format commits
* Which editor to use
* How to handle line endings
* How to authenticate with remote repositories

**Initial configuration** ensures:

* Every commit is properly attributed to you
* Git behaves consistently across projects
* Fewer merge conflicts and formatting issues
* Secure and seamless interaction with remote repositories (GitHub, GitLab, Bitbucket, etc.)

---

## 2. Understanding Git Configuration Levels

Git stores configuration at **three levels**:

| Level      | Scope                    | File Location    |
| ---------- | ------------------------ | ---------------- |
| **System** | All users on the machine | `/etc/gitconfig` |
| **Global** | Current user             | `~/.gitconfig`   |
| **Local**  | Specific repository      | `.git/config`    |

### Priority Order

```
Local > Global > System
```

Example:

```bash
git config --global user.name "Dushyant Vishwakarma"
```

This applies to **all repositories for your user account**.

---

## 3. Verify Git Installation

Before configuration, confirm Git is installed:

```bash
git --version
```

Expected output:

```
git version 2.x.x
```

---

## 4. Configure User Identity (Mandatory)

Git **requires** a username and email to track commits.

### 4.1 Set Global Username

```bash
git config --global user.name "Dushyant Vishwakarma"
```

### 4.2 Set Global Email

```bash
git config --global user.email "dushyant@example.com"
```

### Why This Matters

Each commit will contain metadata:

```
Author: Dushyant Vishwakarma <dushyant@example.com>
```

If you use GitHub or GitLab, **this email should match your account email**.

---

## 5. Verify Current Configuration

To see all active Git settings:

```bash
git config --list
```

To check a specific value:

```bash
git config user.name
git config user.email
```

---

## 6. Set Default Text Editor

Git opens an editor when:

* Writing commit messages
* Resolving merge conflicts
* Editing rebase steps

### Common Editor Configurations

#### VS Code (Recommended)

```bash
git config --global core.editor "code --wait"
```

#### Vim

```bash
git config --global core.editor "vim"
```

#### Nano

```bash
git config --global core.editor "nano"
```

---

## 7. Configure Default Branch Name

Modern Git uses `main` instead of `master`.

```bash
git config --global init.defaultBranch main
```

Now every new repository will start with:

```
main
```

---

## 8. Line Ending Configuration (Very Important)

Different OS handle line endings differently.

### For Linux / macOS

```bash
git config --global core.autocrlf input
```

### For Windows

```bash
git config --global core.autocrlf true
```

### Why?

Prevents errors like:

```
^M
LF will be replaced by CRLF
```

---

## 9. Enable Colored Output

Improves readability in terminal.

```bash
git config --global color.ui auto
```

Example:

* Green → added files
* Red → removed lines
* Yellow → modified content

---

## 10. Set Git Diff and Merge Tools (Optional but Professional)

### Example: VS Code as Diff Tool

```bash
git config --global diff.tool vscode
git config --global difftool.vscode.cmd "code --wait --diff $LOCAL $REMOTE"
```

### Example: Merge Tool

```bash
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd "code --wait $MERGED"
```

---

## 11. Create Useful Git Aliases

Aliases save time and reduce mistakes.

### Common Aliases

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm "commit -m"
git config --global alias.lg "log --oneline --graph --all"
```

Usage:

```bash
git st
git co main
git lg
```

---

## 12. Configure Credential Storage (Avoid Repeated Login)

### Cache Credentials Temporarily

```bash
git config --global credential.helper cache
```

### Store Credentials Permanently (Local Machine Only)

```bash
git config --global credential.helper store
```

> For GitHub, SSH keys are strongly recommended instead of passwords.

---

## 13. Generate and Configure SSH Key (Recommended)

### Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "dushyant@example.com"
```

### Start SSH Agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Add Public Key to GitHub/GitLab

```bash
cat ~/.ssh/id_ed25519.pub
```

Paste this into:

* GitHub → Settings → SSH and GPG Keys
* GitLab → Preferences → SSH Keys

---

## 14. Initialize a Repository (After Configuration)

```bash
mkdir demo-project
cd demo-project
git init
```

Output:

```
Initialized empty Git repository in .../demo-project/.git
```

---

## 15. Validate Setup with a Test Commit

```bash
echo "# Demo Project" > README.md
git add README.md
git commit -m "Initial commit"
```

If no errors occur, your Git configuration is correct.

---

## 16. Where Git Stores These Settings

Global config file:

```bash
~/.gitconfig
```

Example:

```ini
[user]
  name = Dushyant Vishwakarma
  email = dushyant@example.com

[core]
  editor = code --wait
  autocrlf = input

[alias]
  st = status
  lg = log --oneline --graph --all
```

---

## 17. Best Practices Summary

* Always configure `user.name` and `user.email`
* Use SSH instead of HTTPS passwords
* Set `core.autocrlf` correctly for your OS
* Define aliases for daily commands
* Use a proper editor (VS Code / Vim)

---