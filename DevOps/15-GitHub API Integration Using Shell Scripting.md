# GitHub API Integration Using Shell Scripting

## 1. Objective of the Project

This project demonstrates a **real-world DevOps automation use case**:

* Programmatically **list users who have access to a GitHub repository**
* Use **Shell scripting** with **GitHub REST APIs**
* Automate a task commonly performed by DevOps engineers when:

  * Employees resign
  * Access reviews are required
  * Repository permissions need auditing

Instead of repeatedly navigating the GitHub UI, this approach enables **CLI-based automation**.

---

## 2. Real-World DevOps Use Case

In an organization:

* DevOps engineers manage **multiple repositories** across teams.
* Responsibilities include:

  * Creating repositories
  * Managing access (read/write/admin)
  * Revoking access for departing employees
  * Supporting CI/CD pipelines

### Problem

Manually checking repository access via UI is inefficient and error-prone.

### Solution

Use a **shell script integrated with GitHub APIs** to:

* Fetch repository collaborators
* Identify who has access
* Filter users based on permission levels

---

## 3. API vs CLI in DevOps Automation

### Two Ways to Interact with Platforms

1. **CLI (Command Line Interface)**

   * Example: `kubectl` for Kubernetes, `aws` CLI for AWS
2. **API (Application Programming Interface)**

   * Programmatic access using HTTP requests

### Key Concept

DevOps engineers:

* **Do not write APIs**
* **Consume APIs** using tools like:

  * `curl` (Shell)
  * `requests` (Python)
  * SDKs (e.g., boto3 for AWS)

---

## 4. What Is an API (Conceptual Explanation)

* **UI-based interaction**: Using a browser to access github.com
* **API-based interaction**: Using HTTP requests to fetch the same data programmatically

Example:

* UI: Click “Pull Requests” tab
* API: Call a REST endpoint that returns pull request data in JSON

---

## 5. Understanding GitHub REST API Documentation

GitHub provides comprehensive REST API documentation.

### Example: List Pull Requests

**API Endpoint**

```
GET https://api.github.com/repos/{owner}/{repo}/pulls
```

**Shell (curl) Example**

```bash
curl -H "Authorization: token <TOKEN>" \
https://api.github.com/repos/OWNER/REPO/pulls
```

### Example: List Issues

**API Endpoint**

```
GET https://api.github.com/repos/{owner}/{repo}/issues
```

Key takeaway:

* Capitalized placeholders (`OWNER`, `REPO`) must be replaced with actual values.
* API responses are returned in **JSON format**.

---

## 6. Project Goal: List Repository Collaborators

### What the Script Does

* Lists users who have access to a repository
* Filters users based on permissions
* Excludes repository owners/admins if required

---

## 7. Prerequisites

### Infrastructure

* Linux system (EC2 instance recommended)

You may use:

* Amazon Web Services EC2
* Ubuntu AMI

### Software

```bash
sudo apt update
sudo apt install jq -y
```

### Tools Used

* `bash`
* `curl`
* `jq` (for JSON parsing)

---

## 8. GitHub Authentication Setup

GitHub APIs require **Personal Access Tokens (PAT)**.

### Steps to Generate Token

1. Go to GitHub → Settings
2. Developer Settings
3. Personal Access Tokens (Classic)
4. Generate new token
5. Assign required scopes (repo access)

### Export Credentials (Do NOT hardcode)

```bash
export USERNAME="your_github_username"
export TOKEN="your_personal_access_token"
```

---

## 9. Cloning the Shell Script Project

```bash
git clone <repository-url>
cd shell-script-projects/github-api
ls
```

Expected file:

```bash
list-users.sh
```

---

## 10. Script Execution

### Grant Execute Permission

```bash
chmod +x list-users.sh
```

### Run the Script

```bash
./list-users.sh <ORG_NAME> <REPO_NAME>
```

Example:

```bash
./list-users.sh devops-by-examples python
```

### Sample Output

```text
User mohit has access to the repository
```

---

## 11. Why Some Users Are Not Displayed

* Repository **owners/admins** may not appear
* Script filters users based on permission flags:

  * `admin: false`
  * `pull: true` (read access)

This ensures focus on **non-admin collaborators**, which is often required during audits.

---

## 12. Script Breakdown (Core Logic)

### 12.1 Shebang

```bash
#!/bin/bash
```

Specifies Bash interpreter.

---

### 12.2 Environment Variables

```bash
API_URL="https://api.github.com"
USERNAME=$USERNAME
TOKEN=$TOKEN
```

Sensitive values are read from environment variables.

---

### 12.3 Command-Line Arguments

```bash
ORG_NAME=$1
REPO_NAME=$2
```

* `$1` → Organization / Owner
* `$2` → Repository name

---

### 12.4 Curl Command Construction

```bash
curl -s -u "$USERNAME:$TOKEN" \
"$API_URL/repos/$ORG_NAME/$REPO_NAME/collaborators"
```

---

### 12.5 JSON Parsing with `jq`

```bash
jq -r '.[] | select(.permissions.pull == true) | .login'
```

Explanation:

* `.[]` → Iterate over JSON array
* `select()` → Filter based on permission
* `.login` → Extract username

---

### 12.6 Conditional Output

```bash
if [[ -z "$COLLABORATORS" ]]; then
  echo "No users have read access"
else
  echo "$COLLABORATORS"
fi
```

---

## 13. Why `jq` Is Required

* GitHub API responses are JSON
* Shell scripting alone cannot easily parse JSON
* `jq` allows:

  * Field selection
  * Filtering
  * Clean output

---

## 14. Error Handling Example

If you do not have access to a repository:

```text
Cannot index string with string "permissions"
```

Reason:

* GitHub API denies collaborator details if you lack permissions
* Same limitation exists in UI and API

---

## 15. Enhancements and Improvements (Recommended)

### 15.1 Add Script Documentation

```bash
# Script Name: list-users.sh
# Description: Lists users with access to a GitHub repository
# Inputs:
#   1. Organization name
#   2. Repository name
# Prerequisites:
#   - Export USERNAME and TOKEN
```

---

### 15.2 Add Helper / Validation Function

```bash
EXPECTED_ARGS=2

if [[ $# -ne $EXPECTED_ARGS ]]; then
  echo "Usage: ./list-users.sh <ORG_NAME> <REPO_NAME>"
  exit 1
fi
```

Prevents incorrect execution.

---

### 15.3 Scalability Improvement

* Loop over multiple repositories
* Integrate with:

  * Employee offboarding automation
  * Scheduled audits (cron jobs)

---

## 16. Summary

This project demonstrates:

* Practical GitHub API usage for DevOps engineers
* Secure authentication using tokens
* JSON parsing with `jq`
* Real-world automation for repository access management

This approach is directly applicable in enterprise DevOps environments and can be extended to GitHub, GitLab, Bitbucket, or similar platforms.

---
