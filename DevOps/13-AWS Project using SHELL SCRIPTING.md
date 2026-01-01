# Real-Time AWS Resource Tracking Using Shell Scripting

## 1. Problem Context: Why Cloud Cost Monitoring Is Required

### 1.1 Reasons Organizations Move to Cloud

Organizations migrate to cloud platforms such as AWS or Azure primarily due to:

1. **Reduced Maintenance Overhead**

   * No need to manage physical data centers.
   * No responsibility for server patching, hardware upgrades, or infrastructure maintenance.
   * Eliminates the need for a large, dedicated systems engineering team.

2. **Cost Efficiency (Pay-as-You-Go Model)**

   * Resources are billed only when they are used.
   * Unlike physical infrastructure, unused resources can (and should) be removed to avoid unnecessary costs.

### 1.2 The Cost Management Challenge

In real-world scenarios:

* Developers may create resources (EC2 instances, EBS volumes, S3 buckets, Lambda functions) and forget to delete them.
* Unused resources continue to incur costs.
* Cloud providers do not automatically assume a resource is unused.

**Responsibility of a DevOps Engineer / Cloud Administrator:**

* Continuously monitor cloud resource usage.
* Identify unused or excessive resources.
* Ensure cost optimization across the organization.

---

## 2. Project Objective

### 2.1 Goal of the Shell Script

Create a **daily AWS resource usage report** that includes:

* EC2 instances
* S3 buckets
* Lambda functions
* IAM users

The report is generated automatically and can be:

* Sent to a manager, or
* Integrated into a reporting or monitoring dashboard (common in real organizations).

---

## 3. Automation Requirement: Cron Jobs

### 3.1 Why Automation Is Necessary

Manually running scripts daily is unreliable:

* The engineer may be unavailable.
* Reporting deadlines may be missed.

### 3.2 What Is a Cron Job?

A **cron job** is a Linux scheduling mechanism that:

* Executes commands or scripts at predefined times.
* Eliminates the need for manual execution.

**Example Use Case:**
Run a script every day at 6:00 PM to generate a cloud usage report.

---

## 4. Technical Prerequisites

### 4.1 Required Tools

1. **Linux System**
2. **Bash Shell**

   * Preferred over `sh` because `sh` may point to `dash`, which has syntax differences.
3. **AWS CLI**
4. **AWS Account with Configured Credentials**
5. **jq (JSON Parser)**

---

## 5. AWS CLI Configuration

### 5.1 Verify AWS CLI Installation

```bash
aws --version
```

### 5.2 Configure AWS Credentials

```bash
aws configure
```

You will be prompted for:

* AWS Access Key ID
* AWS Secret Access Key
* Default region
* Output format (recommended: json)

Once configured, the system can communicate with AWS services.

---

## 6. Script Design Overview

### 6.1 Script Name

```text
aws_resource_tracker.sh
```

### 6.2 Script Responsibilities

* Collect AWS resource data
* Display clear, readable output
* Be suitable for cron-based automation

---

## 7. Creating the Shell Script

### 7.1 Script Header and Metadata

```bash
#!/bin/bash

# Author: Abhishek
# Date: 11-Jan
# Version: v1
# Description: Reports AWS resource usage (EC2, S3, Lambda, IAM)
```

Including metadata improves:

* Maintainability
* Ownership tracking
* Version control clarity

---

## 8. Resources Tracked by the Script

* S3 Buckets
* EC2 Instances
* Lambda Functions
* IAM Users

---

## 9. AWS CLI Commands Used

### 9.1 List S3 Buckets

```bash
aws s3 ls
```

### 9.2 List EC2 Instances (Raw Output)

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

## 10. Improving Script Readability with Echo Statements

To clearly identify output sections:

```bash
echo "Listing S3 Buckets"
aws s3 ls

echo "Listing EC2 Instances"
aws ec2 describe-instances

echo "Listing Lambda Functions"
aws lambda list-functions

echo "Listing IAM Users"
aws iam list-users
```

---

## 11. Debugging with `set -x`

### 11.1 Enable Debug Mode

```bash
set -x
```

This prints:

* Each command before execution
* Useful for debugging and learning command flow

### 11.2 Disable Debug Mode

```bash
set +x
```

---

## 12. Filtering AWS Output Using `jq`

### 12.1 Problem with Raw Output

* `describe-instances` returns large JSON data.
* Managers typically need only **Instance IDs**, not full metadata.

### 12.2 Installing jq

```bash
sudo apt install jq -y
```

### 12.3 Extract EC2 Instance IDs

```bash
aws ec2 describe-instances | jq '.Reservations[].Instances[].InstanceId'
```

### 12.4 Updated EC2 Section in Script

```bash
echo "Listing EC2 Instance IDs"
aws ec2 describe-instances | jq '.Reservations[].Instances[].InstanceId'
```

This results in:

* Clean, readable output
* Focused reporting

---

## 13. Redirecting Output to a File

### 13.1 Purpose

* Store reports persistently
* Share or archive daily usage data

### 13.2 Example Output Redirection

```bash
./aws_resource_tracker.sh > resource_report.txt
```

Or directly within the script:

```bash
echo "Listing S3 Buckets" >> resource_report.txt
aws s3 ls >> resource_report.txt
```

---

## 14. Automating the Script Using Cron

### 14.1 Edit Cron Table

```bash
crontab -e
```

### 14.2 Example Cron Entry (Daily at 6 PM)

```bash
0 18 * * * /path/to/aws_resource_tracker.sh >> /path/to/resource_report.txt
```

---

## 15. Real-World Relevance

### 15.1 Industry Practices

* Similar logic is often implemented using:

  * AWS Lambda
  * Python scripts
  * Cloud monitoring dashboards
* Shell scripting remains valid when:

  * Teams prefer CLI-based automation
  * Lightweight solutions are required

### 15.2 Resume Value

This project demonstrates:

* AWS CLI proficiency
* Bash scripting skills
* Cost optimization awareness
* Automation using cron jobs

---