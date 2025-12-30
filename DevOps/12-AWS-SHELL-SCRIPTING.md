# Shell Script for DevOps (AWS Resource Tracking)

## 1. Overview : -

* Track AWS resource usage
* Generate daily reports
* Automate execution using **Cron jobs**
* Combine **Shell Scripting + AWS CLI**

---

## 2. Why Organizations Move to the Cloud

### 2.1 Reduced Maintenance Overhead

Maintaining on-premise infrastructure requires:

* Dedicated data centers
* System engineering teams
* Regular patching, upgrades, and security fixes

Cloud providers (AWS, Azure, GCP) eliminate most of this operational burden.

### 2.2 Cost Effectiveness (Pay-As-You-Go)

Cloud services operate on a **usage-based pricing model**:

* You only pay for resources you use
* No upfront hardware investment

However, **unused resources still incur costs**, which leads to the next problem.

---

## 3. The Cost Management Problem in Cloud Environments

Common real-world issues:

* Developers create EC2 instances and forget to terminate them
* EBS volumes remain unattached
* Unused Lambda functions or S3 buckets continue to exist

### DevOps Responsibility

One of the **primary responsibilities of a DevOps Engineer or AWS Admin** is:

* Monitoring resource usage
* Preventing unnecessary cloud spending

This project addresses exactly that problem.

---

## 4. Project Objective

### Goal

Create a **shell script** that:

* Collects AWS resource usage data
* Generates a daily report
* Runs automatically at a fixed time (e.g., 6 PM)

### Resources Tracked

For simplicity, the script tracks:

* EC2 instances
* S3 buckets
* Lambda functions
* IAM users

In real organizations, this data is usually pushed to **dashboards**, but for learning purposes, the report is generated as a file.

---

## 5. Automation Using Cron Jobs

### What Is a Cron Job?

A **Cron job** is a Linux scheduler that runs commands or scripts at predefined times.

**Real-world analogy:**
Scheduling a YouTube video to publish at 7 PM automatically.

### Why Cron Is Needed

* Manual execution is unreliable
* You may miss deadlines
* Automation ensures consistency

**Interview-ready answer:**

> “I use Linux Cron jobs to schedule scripts to run automatically at fixed times.”

---

## 6. Prerequisites for the Project

Before writing the script, ensure:

1. **AWS CLI is installed**
2. **AWS CLI is configured**
3. **Bash shell is used**

### AWS CLI Configuration

```bash
aws configure
```

You will be prompted for:

* Access Key
* Secret Access Key
* Default Region
* Output format (JSON recommended)

---

## 7. Script Creation: AWS Resource Tracker

### Script Name

```bash
aws_resource_tracker.sh
```

### Shebang (Always Use Bash)

```bash
#!/bin/bash
```

Avoid using `/bin/sh` as it may point to `dash`, which has syntax differences.

---

## 8. Script Documentation (Best Practice)

```bash
# Author: Abhishek
# Date: 11-Jan
# Version: v1
# Description: Reports AWS resource usage
```

**Why this matters:**

* Helps future maintainers
* Enables version tracking
* Improves readability and professionalism

---

## 9. AWS Resources Tracked in the Script

### 9.1 List S3 Buckets

```bash
aws s3 ls
```

### 9.2 List EC2 Instances

```bash
aws ec2 describe-instances
```

### 9.3 List Lambda Functions

```bash
aws lambda list-functions
```

### 9.4 List IAM Users

```bash
aws iam list-users
```

---

## 10. Improving Readability with Echo Statements

Without labels, output becomes confusing. Add clear headings:

```bash
echo "Print list of S3 buckets"
aws s3 ls

echo "Print list of EC2 instances"
aws ec2 describe-instances

echo "Print list of Lambda functions"
aws lambda list-functions

echo "Print list of IAM users"
aws iam list-users
```

This significantly improves the **user experience**.

---

## 11. Debugging with `set -x`

### Enable Debug Mode

```bash
set -x
```

This prints:

* Each command being executed
* Helps troubleshoot script issues

Commonly used in production-grade scripts for debugging.

---

## 12. Simplifying Output Using JQ (JSON Parsing)

### Problem

`aws ec2 describe-instances` returns **too much data**.

### Solution

Use **JQ**, a JSON parser.

### Extract Only EC2 Instance IDs

```bash
aws ec2 describe-instances \
| jq '.Reservations[].Instances[].InstanceId'
```

### Why JQ Is Important

* AWS CLI outputs JSON
* DevOps engineers frequently work with JSON and YAML
* JQ (JSON) and YQ (YAML) are essential tools

---

## 13. Final Improved Script Output

After using `echo`, `set -x`, and `jq`:

* Output is concise
* Relevant
* Manager-friendly

Example:

* S3 bucket names
* EC2 instance IDs only
* IAM user list
* Lambda function list

---

## 14. Redirecting Output to a File

To generate a daily report file:

```bash
./aws_resource_tracker.sh > resource_tracker.txt
```

This file can be:

* Shared with managers
* Sent to dashboards
* Archived for auditing

---

## 15. Integrating with Cron Job (Assignment)

### Task for Learners

1. Integrate the script with **Crontab**
2. Schedule it to run daily at a fixed time
3. Generate the resource report automatically

Example Cron entry (6 PM daily):

```bash
0 18 * * * /path/aws_resource_tracker.sh > /path/resource_tracker.txt
```

---

## 16. Key Takeaways

* This project reflects **real DevOps work**
* Demonstrates automation, cost awareness, and scripting
* Combines:

  * Bash scripting
  * AWS CLI
  * JQ
  * Cron jobs
* Suitable to showcase in resumes and interviews

---