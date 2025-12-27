# Virtual Machines: Advanced Concepts & Practical Demonstration

---

## 1. Objective

This document focuses on **advanced virtual machine concepts** and covers:

* How to **create virtual machines**
* VM creation on:

  * **AWS**
  * **Microsoft Azure**
  * **On-premise data centers**
* Manual (UI-based) vs **automated VM provisioning**
* DevOps efficiency mindset
* Tools used for **Infrastructure Automation**

---

## 2. High-Level VM Creation Flow (Cloud Perspective)

### Generic Cloud VM Workflow

1. A user (e.g., DevOps Engineer) logs in from a **personal laptop**
2. Opens:

   * AWS Console **OR**
   * Azure Portal
3. Requests a virtual machine
4. Cloud provider provisions the VM
5. User receives:

   * Public IP address
   * Login credentials / key pair
   * VM specifications (CPU, RAM, OS)

### Cloud Terminology

| Platform | VM Name         |
| -------- | --------------- |
| AWS      | EC2 Instance    |
| Azure    | Virtual Machine |
| GCP      | Compute Engine  |

---

## 3. Why Manual VM Creation Is Inefficient in DevOps

### Problem Statement

* Creating **one VM manually** is fine
* Creating **hundreds of VMs daily** via UI is:

  * Time-consuming
  * Error-prone
  * Against DevOps principles

### DevOps Core Principle

> **Efficiency through automation**

Manual steps = human errors
Automation = consistency + speed

---

## 4. Automation Through Cloud APIs

### Key Concept: Cloud APIs

Every cloud service exposes an **API**.

For AWS:

* EC2 → **AWS EC2 API**
* S3 → **AWS S3 API**
* EBS → **AWS EBS API**

### API Request Requirements

For a VM request to succeed, it must be:

1. **Valid** – Correct request format
2. **Authenticated** – User identity verified
3. **Authorized** – User has permission to create resources

Only when all three conditions are met does the cloud provider create the VM.

---

## 5. Automation Approaches for VM Creation on AWS

### 5.1 AWS CLI (Command Line Interface)

* Automate VM creation via terminal
* No programming language required

**Example (conceptual):**

```bash
aws ec2 run-instances \
  --image-id ami-xxxxxxxx \
  --instance-type t2.micro \
  --key-name my-key
```

---

### 5.2 AWS SDK / Direct API Calls

* Use programming languages
* Example: **Python with Boto3**

**Python Example (Boto3):**

```python
import boto3

ec2 = boto3.resource('ec2')

instance = ec2.create_instances(
    ImageId='ami-xxxxxxxx',
    MinCount=1,
    MaxCount=1,
    InstanceType='t2.micro',
    KeyName='my-key'
)
```

---

### 5.3 AWS CloudFormation Templates (CFT)

* Declarative infrastructure
* YAML or JSON-based templates
* AWS-native

**CloudFormation Example (YAML):**

```yaml
Resources:
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t2.micro
      ImageId: ami-xxxxxxxx
```

---

### 5.4 AWS CDK (Cloud Development Kit)

* Infrastructure defined using programming languages
* AWS-first support
* Faster access to new AWS services

**When to choose CDK**

* Organization is **100% AWS**
* Long-term AWS commitment

---

## 6. Terraform (Multi-Cloud Automation Tool)

### Why Terraform Exists

* AWS CLI, CFT, CDK → **AWS-only**
* Terraform → **Cloud-agnostic**

### Terraform Supports

* AWS
* Azure
* Google Cloud
* Hybrid cloud models

### When Terraform Is Ideal

* Hybrid cloud architecture
* Multi-cloud strategy
* Unified automation across providers

---

## 7. Choosing the Right Tool (Interview Perspective)

### Key Interview Tip

> Do not say “Terraform” just because it is popular.

### Tool Selection Logic

| Scenario                                  | Best Choice                  |
| ----------------------------------------- | ---------------------------- |
| Single-cloud AWS                          | CDK / CLI / CFT              |
| Hybrid cloud                              | Terraform                    |
| Need fastest support for new AWS services | CDK                          |
| Azure-specific                            | Azure Resource Manager (ARM) |

---

## 8. Hybrid Cloud Model Explained

### What Is Hybrid Cloud?

* Infrastructure split across multiple cloud providers

**Examples:**

* AI/ML on Google Cloud
* Databases on AWS
* Legacy systems on Azure

### Why Hybrid Cloud?

* Service specialization
* Cost optimization
* Vendor strengths

---

## 9. Practical Demo: Creating VM on AWS (UI)

### Step-by-Step AWS EC2 Creation

1. Visit: **[https://signin.aws.amazon.com](https://signin.aws.amazon.com)**
2. Create AWS account (₹2 INR verification for India)
3. Login to AWS Console
4. Search for **EC2**
5. Click **Launch Instance**
6. Configure:

   * Name: `test`
   * OS: **Ubuntu**
   * Instance Type: **t2.micro (Free Tier)**
7. Create **Key Pair**

   * Type: RSA
   * Format: `.pem`
8. Keep defaults for:

   * VPC
   * Security Group
9. Click **Launch Instance**
10. Wait 1–2 minutes → Instance becomes **Running**

---

## 10. Practical Demo: Creating VM on Azure

### Azure VM Creation Overview

1. Visit: **[https://portal.azure.com](https://portal.azure.com)**
2. Login using:

   * Microsoft account or
   * GitHub integration
3. Click **Create Resource**
4. Select **Virtual Machine**
5. Fill similar details as AWS
6. Free trial is shorter compared to AWS
7. VM is created after submission

### UI Comparison Insight

* Azure UX is often perceived as **more intuitive**
* AWS offers **longer free-tier benefits**

---

## 11. Key Takeaways

* VM creation is fundamentally **API-driven**
* UI-based creation is **manual**, not DevOps-friendly
* Automation is mandatory for:

  * Scale
  * Reliability
  * Speed
* Multiple automation tools exist:

  * Choose based on **organization strategy**
* Understanding **why** a tool is chosen is more important than tool popularity

---