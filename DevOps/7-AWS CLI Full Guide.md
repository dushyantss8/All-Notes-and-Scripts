# Efficient Ways to Create and Access Virtual Machines (AWS EC2)

## 1. Connecting to an EC2 Instance via AWS Console (UI Method)

### Steps:

1. Log in to the **AWS Management Console**
2. Navigate to **EC2 → Instances**
3. Select a **running instance**
4. Click **Connect**
5. Use the **browser-based SSH connection**

### Demonstration:

Once connected, basic Linux commands can be executed:

```bash
touch Abhishek
ls
```

This confirms that:

* The connection is successful
* Commands are executed on the remote VM

### Limitations of the UI Method:

* Not scalable (DevOps engineers manage many servers)
* Session timeout issues
* Not suitable for automation
* Slower for daily operational work

**Conclusion:**
UI-based access is acceptable for beginners but **not recommended for professional DevOps workflows**.

---

## 2. Why Use a Local Terminal Instead of AWS UI

DevOps engineers typically:

* Log into **multiple servers daily**
* Prefer **persistent terminal sessions**
* Use tools with better UX and session management

### Recommended Terminal Options

#### macOS

* **iTerm2** (preferred)

#### Windows

* **PuTTY**
* **MobaXterm** (recommended – lightweight, feature-rich)
* **NoMachine**

Any terminal is acceptable as long as it supports SSH.

---

## 3. Connecting to EC2 via SSH from Local Terminal (CLI Method)

### Key Requirements:

* **Public IP address** of the EC2 instance
* **Key Pair (.pem file)**
* Correct **file permissions**

### Step-by-Step SSH Login

#### Step 1: Use the Public IP

Private IPs work only inside AWS (VPC). For external access, always use the **Public IP**.

#### Step 2: Initial SSH Attempt

```bash
ssh ubuntu@<PUBLIC_IP>
```

Result: ❌ Permission denied (expected)

Reason:
AWS requires **key-based authentication**.

---

### Step 3: Use the Identity File (.pem)

```bash
ssh -i test11.pem ubuntu@<PUBLIC_IP>
```

Result: ❌ Permission too open

---

### Step 4: Fix Key File Permissions

```bash
chmod 600 test11.pem
```

Explanation:

* `.pem` files are **sensitive**
* AWS requires restricted permissions to prevent misuse

---

### Step 5: Connect Successfully

```bash
ssh -i test11.pem ubuntu@<PUBLIC_IP>
```

Result: ✅ Logged into EC2 instance

---

### Verification

```bash
ls
touch Abhishek2
ls
```

Files created earlier via UI are still present, confirming:

* Same VM
* Successful CLI access

---

## 4. Managing EC2 Instance Lifecycle

### Stop vs Terminate

* **Stop Instance**

  * VM shuts down
  * No compute charges
  * Data preserved

* **Terminate Instance**

  * VM deleted permanently
  * Cannot be recovered

**Best Practice:**

1. Stop the instance
2. Then terminate if no longer required

This helps control AWS billing.

---

## 5. Introduction to Automation in AWS

Manual VM creation does not scale. Automation improves:

* Speed
* Consistency
* Reliability

### Available Automation Options:

1. AWS CLI
2. AWS CloudFormation Templates (CFT)
3. AWS SDKs / APIs (e.g., Boto3 for Python)
4. AWS CDK
5. Terraform (covered later)

This document focuses primarily on **AWS CLI**.

---

## 6. AWS CLI – Command Line Automation

### What Is AWS CLI?

A command-line tool that allows direct interaction with AWS services via APIs.

---

### Installing AWS CLI

Choose based on OS:

* **Windows**: Download `.msi` installer
* **macOS**: PKG installer
* **Linux**: Package manager or binary

### Verify Installation

```bash
aws --version
```

If a version is returned, AWS CLI is installed.

---

## 7. AWS Authentication Using Access Keys

AWS CLI does not work until authenticated.

### Step 1: Create Access Keys

1. AWS Console → User menu
2. **Security Credentials**
3. **Access Keys → Create Access Key**
4. Store securely (Vault / Secret Manager)

⚠️ **Never share access keys publicly**

---

### Step 2: Configure AWS CLI

```bash
aws configure
```

Enter:

* AWS Access Key ID
* AWS Secret Access Key
* Default region (e.g., `us-east-1`)
* Output format (`json`)

This creates local AWS config files.

---

## 8. Verifying AWS CLI Access

### List S3 Buckets

```bash
aws s3 ls
```

Output should match buckets shown in AWS Console.

---

### Create an S3 Bucket

```bash
aws s3 mb s3://abhishek12345642
```

Notes:

* Bucket names must be **globally unique**

---

## 9. Creating EC2 Instances Using AWS CLI

AWS provides full documentation for EC2 automation.

### Example Concept (Not Fully Executed in Session):

```bash
aws ec2 run-instances \
  --image-id ami-xxxx \
  --instance-type t2.micro \
  --key-name mykey \
  --security-group-ids sg-xxxx \
  --subnet-id subnet-xxxx
```

All required parameters are documented in:

* **AWS CLI EC2 Reference**

---

## 10. AWS CloudFormation Templates (CFT)

### What Is CloudFormation?

* Infrastructure as Code (IaC)
* Uses **YAML or JSON templates**
* Declarative approach to resource creation

### Example Resources:

* EC2
* VPC
* Security Groups
* Load Balancers

### How to Use:

1. AWS Console → CloudFormation
2. Create Stack
3. Upload template (local file or S3)
4. Deploy stack

📌 Detailed explanation is deferred to **IaC-focused sessions**.

---

## 11. Automating AWS Using APIs (Python + Boto3)

### What Is Boto3?

* Official AWS SDK for Python
* Uses AWS CLI credentials automatically

### Installation

```bash
pip install boto3
```

---

### Example: List EC2 Instances

```python
import boto3

ec2 = boto3.client('ec2')
response = ec2.describe_instances()

for reservation in response['Reservations']:
    for instance in reservation['Instances']:
        print(instance['InstanceId'])
```

Use Cases:

* Create EC2 instances
* Monitor resources
* Build automation scripts

---

## 12. Summary of What Was Learned

* How to connect to EC2 via:

  * AWS Console
  * SSH (CLI)
* Why CLI access is essential for DevOps engineers
* How to:

  * Install AWS CLI
  * Authenticate using access keys
  * Interact with AWS services from terminal
* High-level overview of:

  * CloudFormation
  * AWS APIs using Boto3

---