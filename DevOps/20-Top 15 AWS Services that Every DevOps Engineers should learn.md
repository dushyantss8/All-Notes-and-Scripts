# AWS Services Every DevOps Engineer Should Know –

## 1. Introduction: Why AWS Knowledge Is Critical for DevOps

* **Amazon Web Services (AWS)** is one of the leading cloud providers with **200+ services**.
* As a DevOps engineer, it is **not practical or necessary** to learn all AWS services.
* The goal is to focus on:

  * **DevOps-relevant AWS services**
  * **Automation**
  * **Operational efficiency**
  * **Security and compliance (guardrails)**

AWS follows a **service-based model**:

* Infrastructure as a Service (IaaS)
* Platform as a Service (PaaS)
* Managed services (e.g., Kubernetes as a service)

---

## 2. Core DevOps Principles on AWS

DevOps responsibilities on AWS revolve around:

* **Automation** – reducing manual effort
* **Efficiency** – faster deployments, scalability
* **Security & Compliance** – enforcing organizational rules
* **Monitoring & Observability**

---

## 3. Essential AWS Services for DevOps Engineers

### 3.1 EC2 – Compute Foundation

**Amazon EC2 (Elastic Compute Cloud)** provides virtual servers.

Key DevOps use cases:

* Hosting applications
* Deploying web and backend services
* Running CI/CD tools or workloads

Key concepts to understand:

* Instance types
* AMIs
* Key pairs
* Security groups
* Scaling strategies

---

### 3.2 VPC – Networking and Security

**Virtual Private Cloud (VPC)** enables secure networking.

Core components:

* CIDR blocks
* Subnets (public/private)
* Route tables
* Internet gateways
* Security groups
* Inbound and outbound rules

Purpose:

* Network isolation
* Secure access to EC2 and other services

---

### 3.3 EBS & Storage Volumes

**Elastic Block Store (EBS)** is block-level storage for EC2.

Why it matters:

* Persistent storage beyond EC2 lifecycle
* Databases and file-heavy applications
* Backup and restore via snapshots

Key concepts:

* Volume attachment/detachment
* Snapshots
* Encryption
* Backup strategies

---

### 3.4 S3 – Object Storage

**Simple Storage Service (S3)** is widely used for scalable, low-cost storage.

Common use cases:

* Application assets
* Logs
* JSON/YAML/CSV files
* Backups and artifacts

Key points:

* Highly durable and scalable
* **Encrypted by default**
* Supports versioning, lifecycle rules, IAM policies

---

### 3.5 IAM – Identity and Access Management

**IAM (Identity and Access Management)** controls permissions.

Responsibilities:

* User and role management
* Least-privilege access
* Policy-based authorization

Examples:

* Developers: EC2 access only
* QA: Read-only access
* Admins: Restricted and limited

IAM is foundational for **security and governance**.

---

### 3.6 CloudWatch – Monitoring and Observability

**CloudWatch** monitors AWS resources and applications.

Capabilities:

* Metrics (CPU, memory, disk)
* Logs
* Alarms
* Event-based triggers

Example:

* Trigger alerts when EC2 CPU exceeds a threshold
* Monitor resource usage and availability

---

### 3.7 AWS Lambda – Serverless Automation

**Lambda** is a serverless compute service.

Key characteristics:

* No server management
* Event-driven execution
* Auto-scale and auto-terminate

Use case example:

* Detect unencrypted EBS volumes
* Automatically encrypt them
* Send email notifications

**Lambda vs EC2**:

* EC2: Long-running workloads
* Lambda: Short-lived, event-based tasks

---

## 4. CI/CD and Build Services on AWS

### 4.1 CodePipeline – Workflow Orchestration

* Similar to Jenkins pipelines
* Defines stages and actions in CI/CD

---

### 4.2 CodeBuild – Build Automation

* Fully managed build service
* Compiles code, runs tests, creates artifacts

---

### 4.3 CodeDeploy – Application Deployment

* Deploys applications to:

  * EC2
  * On-prem servers

Example flow:

1. CodeBuild generates a WAR/JAR
2. CodeDeploy deploys it to EC2

**Important Consideration**:

* AWS CI/CD tools are **AWS-specific**
* Not ideal for multi-cloud portability

---

## 5. Configuration, Governance, and Cost Management

### 5.1 AWS Config – Configuration Compliance

* Tracks AWS resource configurations
* Enforces compliance rules

Examples:

* Block unencrypted EBS volumes
* Detect S3 buckets without versioning

---

### 5.2 Billing and Cost Management

Key responsibilities:

* Monitor spending by service
* Identify cost-heavy resources
* Optimize infrastructure usage

Essential for:

* Budget control
* Cost optimization (FinOps)

---

## 6. Security and Auditing Services

### 6.1 AWS KMS – Key Management Service

Used for:

* Managing encryption keys
* Protecting secrets and certificates
* Enabling encryption for S3, EBS, RDS

Important in enterprise environments.

---

### 6.2 CloudTrail – Audit and API Logging

Purpose:

* Records all AWS API activity
* Supports:

  * Auditing
  * Compliance
  * Risk analysis

Example:

* Identify who created or modified resources
* Investigate incidents from historical logs

---

## 7. Containers and Kubernetes on AWS

### 7.1 EKS – Managed Kubernetes

**Elastic Kubernetes Service (EKS)**:

* AWS-managed Kubernetes
* Ideal if you already know Kubernetes

Key benefit:

* Kubernetes control plane managed by AWS

---

### 7.2 ECS vs EKS

| Feature        | ECS             | EKS                           |
| -------------- | --------------- | ----------------------------- |
| Type           | AWS proprietary | Kubernetes-based              |
| Portability    | AWS-only        | Multi-cloud                   |
| Learning curve | Easier          | Kubernetes knowledge required |

---

### 7.3 Fargate

* Serverless container compute
* Works with ECS and EKS
* No node management required

---

## 8. Logging and Observability Stack

### ELK Stack (Elasticsearch, Logstash, Kibana)

Purpose:

* Centralized logging
* Searching and analyzing logs
* Observability for microservices

Use case:

* Identify frequent application errors
* Analyze logs across hundreds of services

Alternatives:

* Splunk
* Other log aggregation platforms

---

## 9. Summary: AWS Services DevOps Engineers Must Focus On

### Core Services to Master:

1. EC2
2. VPC
3. EBS
4. S3
5. IAM
6. CloudWatch
7. Lambda
8. CodePipeline / CodeBuild / CodeDeploy
9. AWS Config
10. Billing & Cost Management
11. KMS
12. CloudTrail
13. EKS
14. ECS / Fargate
15. ELK Stack

---

## 10. Final Notes

* These services cover **most interview and real-world DevOps requirements**.
* Additional services may be required depending on:

  * Project domain
  * Machine learning workloads
  * Organizational tooling
* Master the **fundamentals first**, then specialize as per project needs.

---