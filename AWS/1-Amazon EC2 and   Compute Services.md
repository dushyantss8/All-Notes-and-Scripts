## Amazon Web Services and Compute

**Amazon Web Services (AWS)** is a global cloud computing platform offering on-demand services such as compute, storage, networking, databases, analytics, machine learning, and security.
This chapter focuses on **AWS Compute services**, starting with **Amazon EC2**, and expanding to load balancing, auto scaling, containers, and serverless computing.

---

## Topics Covered

* Evolution of computing from physical machines to cloud
* AWS Global Cloud Infrastructure
* EC2 instance provisioning (Console and CloudShell)
* Elastic Load Balancers (ELB) and Auto Scaling Groups (ASG)
* AWS compute evolution: EC2 → Containers → Serverless

---

## History of Computing

### The First Computers

The first practical computer, **ENIAC (1945)**, marked the beginning of digital computing. Over 75+ years, computers evolved from massive physical machines into portable, virtual, and disposable resources.

**Figure 1.1 – Computer evolution milestones**

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20250401151341889568/evolution_of_computers.webp)

![Image](https://media.licdn.com/dms/image/v2/D4E12AQGjuizTwCmWCg/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1714517582749?e=2147483647\&t=bL5AxeD45VR846_pH5m0qzvJMRh_tF5yV8piuAEyKfw\&v=beta)

---

### Computer Architecture Basics

A traditional computer consists of:

* CPU
* RAM
* Hard Disk
* Network Interface Card (NIC)

These components operate together with:

* Operating systems (Windows, Linux, macOS)
* Application software (databases, servers, productivity tools)

**Figure 1.2 – Internal computer hardware components**

![Image](https://cdn.shopify.com/s/files/1/0329/9865/3996/t/5/assets/types_of_computer_hardware_components-XjH3vQ.True?v=1707731118)

![Image](https://softwareg.com.au/cdn/shop/articles/computeressentials-2_a091504b-0d8d-48f5-a00a-f8ae6814f554.png?crop=center\&height=2048\&v=1707741758\&width=2048)

---

## Data Centers

Data centers aggregate compute, storage, and networking resources to serve organizational IT needs.
**Limitations of traditional data centers**:

* High capital and maintenance costs
* Long provisioning cycles
* Limited scalability

Large-scale projects (for example, genome analysis) are infeasible without cloud-scale resources.

---

## Virtual Machines (VMs)

Virtualization, popularized by VMware (1998), enabled:

* Multiple VMs on one physical server
* Hardware abstraction via hypervisors
* VM portability and live migration (vMotion)

This abstraction layer made **cloud computing possible**.

---

## Cloud Computing Concept

Cloud computing is based on:

* **On-demand provisioning**
* **Pay-as-you-go pricing**
* **Elastic scalability**

### Pets vs Cattle Model

* **Traditional IT**: servers treated as *pets* (manually repaired)
* **Cloud**: servers treated as *cattle* (automatically replaced)

Cloud infrastructure is:

* Global
* Elastic and scalable
* Highly available
* Secure
* Cost-efficient

Infrastructure is defined programmatically using **Infrastructure as Code (IaC)**.

---

## Amazon EC2 Overview

**EC2 (launched in 2006)** allows users to rent virtual machines with customizable:

* Instance types (CPU, RAM, network)
* Operating systems
* Storage and networking options

Key milestones:

* **2013**: Reserved Instances (cost optimization)
* **2017**: EC2 Fleet (multi-AZ, multi-instance orchestration)

---

## Computer Evolution Path

Computing evolved from:

* Physical machines → Virtual machines → Disposable cloud resources
* Physical data centers → Software-defined, globally deployable infrastructure

---

## Amazon Global Cloud Infrastructure

AWS operates global infrastructure composed of:

* **Regions**: geographic locations
* **Availability Zones (AZs)**: isolated data center groups within regions

Characteristics:

* Fault isolation
* High-speed private networking
* Regional and AZ-level deployment control

Example AZ naming: `us-east-1d`

---

## Building EC2 Instances

### AWS Account Setup (Prerequisites)

* Enable MFA [Multi Factor Authentication]
* Avoid routine use of root account
* Delete unused resources to prevent charges

---

## Launching EC2 via AWS Console

### Step-by-Step Summary

1. **Select AMI (Software Image)**
   AMIs define OS and preinstalled software.

   **Figure 1.3 – Selecting Amazon Linux 2 AMI**

![Image](https://media.amazonwebservices.com/blog/2017/al2_console_launch_1.png)

![Image](https://media.amazonwebservices.com/blog/amazon_linux_ami_final.png)

2. **Select Instance Type (Hardware)**
   Instance families are optimized for different workloads.

   **Figure 1.4 – EC2 instance type categories**

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/0%2AP9ayxQaaxeBdzcfW.png)

![Image](https://www.nops.io/wp-content/uploads/2022/12/instance-img.png)

3. **Configure Networking**
   Use default VPC and subnet; assign public IP if internet access is required.

4. **Attach IAM Role (Optional)**
   Enables EC2 applications to securely access AWS services.

   **Figure 1.5 – IAM role attached to EC2**

![Image](https://matillion-docs.s3-eu-west-1.amazonaws.com/images/2765606/Matillion%2BETL%2B-%2BRoles%2Bto%2BEC2%2BInstance%2B_Newv1.1.png)

![Image](https://devopsideas.com/wp-content/uploads/2016/09/iam-roles.jpg)

5. **User Data Script (Optional)**
   Executes at first boot for configuration or recovery tasks.

6. **Add Storage**
   Configure disk size, type, and encryption.

7. **Add Tags**
   Used for resource management, automation, and cost tracking.

8. **Configure Security Group (Firewall)**
   Define allowed inbound/outbound traffic (e.g., SSH 22, HTTP 80).

9. **Create or Select Key Pair**
   Required for secure access (.pem for Linux/macOS, .ppk for Windows).

---

### Launching a Windows EC2 Instance

**Figure 1.6 – Selecting Windows Server 2022 AMI**

![Image](https://000004.awsstudygroup.com/images/5/0003.png?featherlight=false\&width=90pc)

![Image](https://cdn.document360.io/eb22e69b-92a3-4c63-861d-5b53dc9d04c5/Images/Documentation/image-231DP8O2.png)

---

## Launching EC2 via CloudShell (CLI)

CloudShell is a browser-based, pre-authenticated AWS CLI environment.

**Figures 1.7–1.12 – CloudShell EC2 provisioning workflow**

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20200730162551/runinstance.png)

![Image](https://media.amazonwebservices.com/blog/2015/run_command_output_1.png)

Key steps:

* Identify AMI ID
* Identify security group
* Identify key pair
* Run `aws ec2 run-instances`
* Verify instance details

---

## Logging into EC2 Instances

### Linux EC2

* Protocol: SSH
* Tools: PuTTY (Windows), terminal (Linux/macOS)

**Figures 1.13–1.15 – SSH access using PuTTY**

![Image](https://docs.aws.amazon.com/images/AWSEC2/latest/UserGuide/images/putty-session-config.png)

![Image](https://linux.how2shout.com/wp-content/uploads/2021/08/Use-putty-command-terminal-to-access-ec2-AWS-instance.png)

Command example:

```bash
ssh -i keypair.pem ec2-user@<public-ip>
```

---

### Windows EC2

* Protocol: RDP
* Requires decrypting administrator password using key pair

---

## Elastic Load Balancer (ELB) and Auto Scaling Group (ASG)

### Elastic Load Balancer (ELB)

* Distributes traffic across multiple EC2 instances
* Routes requests only to healthy targets
* Improves availability and performance

### Auto Scaling Group (ASG)

* Automatically adds/removes EC2 instances
* Based on metrics such as CPU utilization
* Replaces unhealthy instances
* Spans multiple AZs

**Figure 1.16 – ELB + ASG architecture**

![Image](https://docs.aws.amazon.com/images/autoscaling/ec2/userguide/images/elb-tutorial-architecture-diagram.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AZ-DC516_NPhaBhs3o0VXVg.png)

---

## AWS Compute Evolution: EC2 → Containers → Serverless

### Containers

* Docker packages applications with dependencies
* Containers share OS kernel and start quickly
* Improve portability and deployment speed

### AWS Container Services

* **Amazon ECS**: AWS-managed container orchestration
* **Amazon EKS**: Managed Kubernetes on AWS

### Serverless Computing

* No server management
* Automatic scaling
* Pay per execution

### AWS Lambda

* Event-driven serverless compute
* Supports multiple languages
* Tight AWS service integration
* High availability and cost efficiency

---

# Essential AWS EC2 CloudShell / CLI Commands

This section documents the **key AWS CLI commands used when provisioning and inspecting EC2 instances via CloudShell**, along with their **purpose and parameter-level explanation**.

---

## 1. Describe AMIs (Amazon Machine Images)

### Command

```bash
aws ec2 describe-images --region us-west-2
```

### Purpose

* Lists all available AMIs in a specific AWS Region.
* Used to identify the **AMI ID** required to launch an EC2 instance.

### Explanation

* `describe-images` queries the EC2 image catalog.
* `--region us-west-2` limits results to the **Oregon (us-west-2)** region.
* Output includes:

  * AMI ID (e.g., `ami-0ef0b498cd3fe129c`)
  * OS type
  * Architecture
  * Owner and creation date

This command is typically executed **before launching an instance** to obtain a valid AMI ID.

---

## 2. Describe Security Groups

### Command

```bash
aws ec2 describe-security-groups
```

### Purpose

* Lists all **Security Groups (SGs)** available in the current account and region.
* Used to identify the **security group name or ID** required during instance creation.

### Explanation

* Security Groups act as **virtual firewalls**.
* Output includes:

  * Security group name (e.g., `launch-wizard-1`)
  * Inbound and outbound rules
  * VPC association

You must supply **at least one security group** when launching an EC2 instance.

---

## 3. Describe Key Pairs

### Command

```bash
aws ec2 describe-key-pairs
```

### Purpose

* Lists all EC2 **key pairs** available in the account.
* Used to select a key pair for **secure SSH or RDP access**.

### Explanation

* Key pairs authenticate users connecting to EC2 instances.
* Output includes:

  * Key pair name (e.g., `mywestkp`)
  * Key fingerprint

If a key pair is not specified during instance creation, **remote access will not be possible**.

---

## 4. Launch an EC2 Instance (Core Command)

### Command

```bash
aws ec2 run-instances \
  --image-id ami-0ef0b498cd3fe129c \
  --count 1 \
  --instance-type t2.micro \
  --key-name mywestkp \
  --security-groups launch-wizard-1 \
  --region us-west-2
```

### Purpose

* **Creates (launches) a new EC2 instance** in the specified region.

### Parameter Explanation

| Parameter                           | Meaning                                   |
| ----------------------------------- | ----------------------------------------- |
| `run-instances`                     | API action to create EC2 instances        |
| `--image-id`                        | Specifies the AMI (OS + base software)    |
| `--count 1`                         | Number of instances to launch             |
| `--instance-type t2.micro`          | Hardware configuration (CPU, RAM)         |
| `--key-name mywestkp`               | Key pair used for secure access           |
| `--security-groups launch-wizard-1` | Firewall rules applied to the instance    |
| `--region us-west-2`                | AWS Region where the instance is launched |

### Output

* Returns metadata including:

  * `InstanceId`
  * Current state (`pending`)
  * Network details

This is the **most important EC2 CLI command** and forms the foundation of infrastructure automation.

---

## 5. Describe EC2 Instances

### Command

```bash
aws ec2 describe-instances
```

### Purpose

* Retrieves detailed information about **all EC2 instances** in the region.

### Explanation

* Used to:

  * Check instance state (running, stopped)
  * Retrieve public/private IP addresses
  * Verify instance configuration

Commonly used **after instance creation** to confirm successful provisioning.

---

## 6. Describe a Specific EC2 Instance

### Command

```bash
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxx
```

### Purpose

* Fetches details for a **specific EC2 instance**.

### Explanation

* `--instance-ids` filters output to a single instance.
* Useful when:

  * Troubleshooting
  * Automating scripts
  * Extracting IP addresses or AZ placement

---

## 7. SSH into a Linux EC2 Instance (Client Side)

### Command

```bash
ssh -i keypair.pem ec2-user@<public-ip>
```

### Purpose

* Establishes a **secure shell (SSH)** connection to a Linux EC2 instance.

### Explanation

* `-i keypair.pem` specifies the private key file
* `ec2-user` is the default Linux username (Amazon Linux)
* `<public-ip>` is the instance’s public IP address

### Required Conditions

* Port **22** must be open in the Security Group
* Key file permissions must be restrictive:

```bash
chmod 400 keypair.pem
```

---

## Why These Commands Matter

These CLI commands enable:

* **Repeatable infrastructure provisioning**
* **Automation and scripting**
* **Infrastructure as Code (IaC) practices**
* Full control without relying on the AWS Console UI

They are foundational for:

* DevOps pipelines
* CI/CD automation
* Production-grade AWS environments

---

## Reference Links

* Infrastructure as Code (AWS):
  [https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html)

* EC2 Auto Scaling with Load Balancers:
  [https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html)
