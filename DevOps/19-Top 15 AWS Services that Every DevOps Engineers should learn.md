# Top 15 AWS Services Every DevOps Engineer Should Learn (Comprehensive Study Notes)

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

### Detailed Explanation

AWS is not just "servers in the cloud." It is a collection of managed building blocks for compute, networking, storage, security, monitoring, deployment, and governance. DevOps engineers use these services to automate infrastructure, deploy applications reliably, and keep systems secure and observable.

### Service Model Breakdown

| Model | AWS Example | DevOps Responsibility |
| --- | --- | --- |
| IaaS | EC2, VPC, EBS | You manage OS, patching, scaling logic |
| PaaS | Elastic Beanstalk, managed databases | AWS manages platform; you manage app/config |
| Managed services | EKS, Lambda, CodeBuild | AWS manages infrastructure; you manage workloads/pipelines |

### Real-World Scenario

**Scenario:** A startup starts with one EC2 instance, then grows to containers (EKS), CI/CD (CodePipeline), centralized logs (CloudWatch/ELK), and compliance checks (AWS Config + CloudTrail). A DevOps engineer who knows only EC2 will struggle; one who knows the core 15 services can scale the platform safely.

### Best Practices

- Learn services by **problem category** (compute, network, storage, security, CI/CD).
- Build small hands-on labs for each service.
- Map each service to interview questions and production use cases.

### Common Mistakes

- Trying to memorize all 200+ AWS services.
- Learning services without understanding how they connect (for example, EC2 without VPC and IAM).
- Ignoring cost and security from day one.

### Interview Insight

> "You don't need to know every AWS service. You need to know the core services used in deployment, monitoring, security, and automation."

---

## 2. Core DevOps Principles on AWS

DevOps responsibilities on AWS revolve around:

* **Automation** – reducing manual effort
* **Efficiency** – faster deployments, scalability
* **Security & Compliance** – enforcing organizational rules
* **Monitoring & Observability**

On AWS, DevOps is the bridge between development and operations using cloud-native tooling.

| Principle | What it means on AWS | Example |
| --- | --- | --- |
| Automation | Replace manual clicks with scripts/IaC | Terraform + CodePipeline |
| Efficiency | Deploy faster, scale on demand | Auto Scaling + Lambda |
| Security & Compliance | Enforce guardrails | IAM, KMS, Config, CloudTrail |
| Monitoring & Observability | Detect issues early | CloudWatch, ELK, alarms |

### Real-World Scenario

**Scenario:** A team manually deploys Java apps to EC2. Releases take hours and fail often. After adopting CodeBuild, CodeDeploy, CloudWatch alarms, and IAM roles, deployments become repeatable, auditable, and much faster.

### Best Practices

- Automate everything repeatable (provisioning, deployment, backups, compliance checks).
- Use least-privilege IAM from the beginning.
- Define SLOs and alerts for production workloads.

### Common Mistakes

- Treating AWS console clicks as "automation."
- No monitoring until after production incidents.
- Shared admin credentials across teams.

---

## 3. Essential AWS Services for DevOps Engineers

These are the foundational services you will use most often in real projects and interviews.

---

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

#### Detailed Explanation

EC2 is the most common compute service for traditional application hosting. You choose instance families based on workload (general purpose, compute optimized, memory optimized).

#### Key Concepts Expanded

| Concept | Purpose |
| --- | --- |
| Instance types | Define CPU, memory, network capacity (`t3.micro`, `m6i.large`) |
| AMIs | Template for OS + preinstalled software |
| Key pairs | SSH authentication for Linux instances |
| Security groups | Virtual firewall at instance level |
| Scaling strategies | Manual, Auto Scaling Groups, load-balanced fleets |

#### Practical Examples

```bash
# Launch instance (CLI)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.micro \
  --key-name devops-key \
  --security-group-ids sg-0123456789abcdef0

# List running instances
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running"

# SSH into instance
ssh -i devops-key.pem ec2-user@<public-ip>
```

#### Real-World Scenario

**Scenario:** You host a Node.js API on EC2 behind an Application Load Balancer. DevOps tasks include AMI hardening, patching, autoscaling policy setup, and deployment automation with CodeDeploy.

#### Best Practices

- Use Auto Scaling Groups instead of single instances for production.
- Prefer private subnets for app servers; expose only load balancers publicly.
- Tag instances (`Environment=prod`, `Owner=devops`) for cost and ownership tracking.

#### Common Mistakes

- Running production on a single EC2 with no backups.
- Opening SSH (port 22) to `0.0.0.0/0`.
- Choosing wrong instance type and overpaying (or under-provisioning).

#### Interview Insight

Be ready to explain EC2 components and how security groups differ from NACLs (network ACLs).

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

#### Detailed Explanation

A VPC is your private network in AWS. Every EC2 instance runs inside a VPC. Proper VPC design is critical for secure, scalable architectures.

#### Typical Architecture

```text
VPC (10.0.0.0/16)
├── Public Subnet (10.0.1.0/24)   -> ALB, Bastion
└── Private Subnet (10.0.2.0/24)  -> App servers, databases
```

#### Practical Examples

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnet
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.1.0/24

# Describe security group rules
aws ec2 describe-security-groups --group-ids sg-0123456789abcdef0
```

#### Real-World Scenario

**Scenario:** A payment application stores sensitive data. DevOps places app servers and databases in private subnets, allows inbound traffic only through ALB, and restricts outbound traffic to required endpoints.

#### Best Practices

- Use separate subnets per tier (web, app, db).
- Keep databases in private subnets with no direct internet access.
- Document CIDR planning to avoid overlapping networks during peering.

#### Common Mistakes

- Putting databases in public subnets.
- Overly permissive security group rules (`0.0.0.0/0` everywhere).
- No route table validation after architecture changes.

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

#### Detailed Explanation

EBS volumes attach to EC2 instances like virtual disks. Data persists even if the instance stops (unless configured otherwise).

#### Volume Types (Common)

| Type | Use case |
| --- | --- |
| gp3 | General-purpose SSD (default for many workloads) |
| io2 | High IOPS databases |
| st1 | Throughput-heavy workloads |

#### Practical Examples

```bash
# Create volume
aws ec2 create-volume --availability-zone ap-south-1a --size 50 --volume-type gp3

# Attach volume to instance
aws ec2 attach-volume \
  --volume-id vol-1234567890abcdef0 \
  --instance-id i-1234567890abcdef0 \
  --device /dev/sdf

# Create snapshot
aws ec2 create-snapshot --volume-id vol-1234567890abcdef0 --description "Daily backup"
```

#### Real-World Scenario

**Scenario:** A MySQL database runs on EC2 with data stored on an encrypted EBS volume. DevOps automates daily snapshots and tests restore procedures monthly.

#### Best Practices

- Enable encryption on EBS volumes.
- Automate snapshot lifecycle policies.
- Monitor disk utilization and IOPS, not just CPU/memory.

#### Common Mistakes

- No snapshot strategy ("we'll backup later").
- Attaching volumes across AZs incorrectly.
- Filling disk due to unmanaged logs.

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

#### Detailed Explanation

S3 stores objects (files) in buckets. It is highly durable and commonly used for artifacts, static assets, backups, and data lakes.

#### Practical Examples

```bash
# Create bucket
aws s3 mb s3://devops-learning-bucket-2026

# Upload file
aws s3 cp app.log s3://devops-learning-bucket-2026/logs/

# List objects
aws s3 ls s3://devops-learning-bucket-2026/logs/

# Sync local folder to S3
aws s3 sync ./build/ s3://devops-learning-bucket-2026/artifacts/
```

#### Real-World Scenario

**Scenario:** CI pipeline uploads build artifacts (`app-v1.2.3.jar`) to S3. CodeDeploy pulls the artifact for deployment. Lifecycle rules move old artifacts to cheaper storage and delete them after 90 days.

#### Best Practices

- Block public access unless explicitly required.
- Enable versioning for critical buckets.
- Use lifecycle policies for log and backup retention.
- Apply least-privilege bucket policies.

#### Common Mistakes

- Accidentally making buckets public.
- No lifecycle management -> uncontrolled storage cost.
- Storing secrets in S3 without proper access controls.

#### Important Note on Encryption

S3 supports default encryption, but DevOps teams should still verify bucket encryption settings, KMS key policies, and compliance requirements explicitly.

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

#### Detailed Explanation

IAM answers: **Who can do what, on which AWS resources, under which conditions?** It is the security backbone of every AWS environment.

#### Core IAM Components

| Component | Purpose |
| --- | --- |
| Users | Human identities (prefer SSO in enterprise) |
| Groups | Collection of users with shared permissions |
| Roles | Temporary credentials for services/users |
| Policies | JSON documents defining allow/deny actions |

#### Practical Examples

```bash
# List IAM users
aws iam list-users

# Attach policy to role
aws iam attach-role-policy \
  --role-name CodeBuildServiceRole \
  --policy-arn arn:aws:iam::aws:policy/AWSCodeBuildDeveloperAccess

# Simulate policy effect
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123456789012:role/DevOpsRole \
  --action-names s3:ListBucket
```

#### Real-World Scenario

**Scenario:** CodeBuild needs S3 read access and CloudWatch Logs write access. Instead of sharing admin keys, DevOps creates a dedicated IAM role with least-privilege permissions and attaches it to CodeBuild.

#### Best Practices

- Prefer roles over long-lived access keys.
- Enforce MFA for human users.
- Use permission boundaries and regular access reviews.
- Follow least privilege always.

#### Common Mistakes

- Using root account for daily operations.
- `AdministratorAccess` everywhere.
- Hardcoding access keys in Git repositories.

#### Interview Insight

Know difference between **IAM user**, **role**, and **policy**, and when to use each.

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

#### Detailed Explanation

CloudWatch is AWS's primary monitoring service. It collects metrics and logs, triggers alarms, and integrates with automation (for example, auto recovery or Lambda actions).

#### Practical Examples

```bash
# Put custom metric
aws cloudwatch put-metric-data \
  --namespace "DevOps/App" \
  --metric-data MetricName=FailedJobs,Value=1,Unit=Count

# Create CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "ec2-high-cpu" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

#### Real-World Scenario

**Scenario:** Production EC2 CPU stays above 85% for 10 minutes. CloudWatch alarm triggers SNS notification to on-call engineer and optionally scales out the Auto Scaling Group.

#### Best Practices

- Define actionable alarms (avoid alert fatigue).
- Centralize application logs in CloudWatch Logs.
- Create dashboards per environment (dev/staging/prod).

#### Common Mistakes

- Monitoring only infrastructure, not application metrics.
- No alert runbooks ("we got paged, now what?").
- Retaining logs forever without cost planning.

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

#### Detailed Explanation

Lambda runs code in response to events (S3 upload, API call, schedule, CloudWatch alarm) without managing servers. You pay for execution time and requests.

#### Practical Example (Conceptual Flow)

```text
Event (new S3 object) -> Lambda function -> process file -> write result to DynamoDB/S3
```

#### Real-World Scenario

**Scenario:** When a new log file lands in S3, Lambda parses errors and sends a Slack summary. No always-on server required.

#### Best Practices

- Keep functions small and single-purpose.
- Use environment variables/secrets manager for secrets.
- Set timeouts and memory appropriately.
- Handle retries and dead-letter queues (DLQ).

#### Common Mistakes

- Running long-running jobs unsuitable for Lambda.
- Putting large dependencies into deployment package without optimization.
- No observability (missing structured logs/metrics).

#### Interview Insight

Explain when to choose Lambda over EC2: event-driven, short duration, variable traffic, minimal ops overhead.

---

## 4. CI/CD and Build Services on AWS

AWS provides native CI/CD services that integrate tightly with the AWS ecosystem.

### 4.1 CodePipeline – Workflow Orchestration

* Similar to Jenkins pipelines
* Defines stages and actions in CI/CD

#### Detailed Explanation

CodePipeline orchestrates the release workflow (source -> build -> test -> deploy). It connects AWS services and third-party tools into one pipeline.

#### Typical Stages

```text
Source (GitHub/CodeCommit) -> Build (CodeBuild) -> Deploy (CodeDeploy/ECS/EKS)
```

#### Real-World Scenario

**Scenario:** Every push to `main` triggers CodePipeline, which builds the app, runs tests, and deploys to staging automatically.

#### Best Practices

- Add manual approval before production deploy.
- Fail fast at build/test stages.
- Store pipeline definitions as code where possible.

#### Common Mistakes

- No rollback strategy.
- Deploying to production without staging validation.

---

### 4.2 CodeBuild – Build Automation

* Fully managed build service
* Compiles code, runs tests, creates artifacts

#### Detailed Explanation

CodeBuild replaces self-hosted build servers. It reads `buildspec.yml` and performs compile/test/package steps in ephemeral build environments.

#### Sample `buildspec.yml`

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  build:
    commands:
      - npm install
      - npm test
      - npm run build
artifacts:
  files:
    - dist/**/*
```

#### Best Practices

- Cache dependencies to reduce build time.
- Keep build images/runtimes versioned.
- Publish test reports and build logs.

#### Common Mistakes

- Hardcoding secrets in `buildspec.yml`.
- No unit tests in CI.

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

#### Detailed Explanation

CodeDeploy automates application deployments with strategies like in-place or blue/green (depending on target). It reduces manual copy/restart steps.

#### Example Deployment Flow

```text
CodeBuild artifact (app.jar) -> S3 -> CodeDeploy -> EC2 instances
```

#### Real-World Scenario

**Scenario:** A Java team ships WAR files to EC2 Tomcat instances. CodeDeploy handles rolling updates and health checks during deployment.

#### Best Practices

- Use deployment hooks (`BeforeInstall`, `AfterInstall`) for graceful startup/shutdown.
- Monitor deployment events and instance health.
- Keep deployment configuration in version control.

#### Common Mistakes

- Assuming CodePipeline/CodeDeploy replaces all Jenkins use cases.
- No health check validation after deployment.

#### Multi-Cloud Note

If your organization uses Azure/GCP too, many teams keep Jenkins/GitHub Actions/GitLab CI for portability and use AWS-native tools only where AWS integration benefits are high.

---

## 5. Configuration, Governance, and Cost Management

### 5.1 AWS Config – Configuration Compliance

* Tracks AWS resource configurations
* Enforces compliance rules

Examples:

* Block unencrypted EBS volumes
* Detect S3 buckets without versioning

#### Detailed Explanation

AWS Config continuously records resource configuration changes and evaluates compliance against rules. It is essential for governance in regulated environments.

#### Real-World Scenario

**Scenario:** Security policy requires all S3 buckets to block public access. AWS Config rule flags non-compliant buckets and triggers remediation via Lambda.

#### Practical Example (Conceptual)

```text
New S3 bucket created -> AWS Config evaluates rule -> non-compliant -> alert/remediate
```

#### Best Practices

- Start with a small set of high-value compliance rules.
- Integrate Config findings with Security Hub or ticketing systems.
- Review compliance reports regularly.

#### Common Mistakes

- Enabling Config without planning storage costs of configuration history.
- Creating rules with no remediation workflow.

---

### 5.2 Billing and Cost Management

Key responsibilities:

* Monitor spending by service
* Identify cost-heavy resources
* Optimize infrastructure usage

Essential for:

* Budget control
* Cost optimization (FinOps)

#### Detailed Explanation

Cloud costs can grow quickly without visibility. DevOps engineers should understand billing dashboards, budgets, tags, and optimization levers.

#### Key Tools

| Tool | Purpose |
| --- | --- |
| AWS Cost Explorer | Analyze spend trends |
| AWS Budgets | Alerts on cost thresholds |
| Cost Allocation Tags | Attribute cost to teams/projects |

#### Real-World Scenario

**Scenario:** Monthly bill jumps 40%. Cost Explorer shows idle EC2 instances and unattached EBS volumes left after tests. DevOps automates cleanup and sets budget alerts.

#### Best Practices

- Enforce tagging policy (`Project`, `Environment`, `Owner`).
- Shut down non-prod resources outside business hours.
- Rightsize instances and use reserved/savings plans where appropriate.

#### Common Mistakes

- No budget alarms.
- Leaving test environments running 24/7.
- Ignoring storage costs (S3, snapshots, logs).

---

## 6. Security and Auditing Services

### 6.1 AWS KMS – Key Management Service

Used for:

* Managing encryption keys
* Protecting secrets and certificates
* Enabling encryption for S3, EBS, RDS

Important in enterprise environments.

#### Detailed Explanation

KMS provides centralized control over encryption keys used by AWS services and your applications. It supports key rotation, access policies, and auditability.

#### Real-World Scenario

**Scenario:** Company policy requires all production EBS volumes and S3 buckets to use CMKs (customer managed keys). DevOps configures KMS keys and IAM policies for each service.

#### Best Practices

- Separate keys per environment or data classification.
- Restrict key administration from key usage roles.
- Monitor key usage in CloudTrail.

#### Common Mistakes

- Overly broad KMS key policies.
- Deleting keys without understanding data recovery impact.

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

#### Detailed Explanation

CloudTrail answers **who did what, when, and from where** in AWS APIs. It is critical for security investigations and compliance audits.

#### Practical Examples

```bash
# Lookup recent events
aws cloudtrail lookup-events --max-results 10

# Create trail (conceptual setup)
aws cloudtrail create-trail \
  --name org-audit-trail \
  --s3-bucket-name my-cloudtrail-logs-bucket
```

#### Real-World Scenario

**Scenario:** An S3 bucket became public. CloudTrail shows which IAM user changed the bucket policy and when, enabling rapid incident response.

#### Best Practices

- Enable CloudTrail in all regions (or organization trail).
- Protect CloudTrail logs with strict S3 bucket policies.
- Integrate with SIEM for alerting and retention.

#### Common Mistakes

- CloudTrail enabled but logs not monitored.
- No log integrity validation or retention policy.

---

## 7. Containers and Kubernetes on AWS

### 7.1 EKS – Managed Kubernetes

**Elastic Kubernetes Service (EKS)**:

* AWS-managed Kubernetes
* Ideal if you already know Kubernetes

Key benefit:

* Kubernetes control plane managed by AWS

#### Detailed Explanation

EKS runs Kubernetes control plane components with AWS managing availability and upgrades. DevOps teams deploy microservices using Kubernetes primitives (Deployments, Services, Ingress, HPA).

#### Real-World Scenario

**Scenario:** A microservices platform with 50+ services runs on EKS. DevOps manages cluster add-ons, node groups, CI/CD to EKS, and observability integrations.

#### Best Practices

- Use Infrastructure as Code (Terraform/CDK) for cluster resources.
- Separate node groups per workload type.
- Implement RBAC and network policies.

#### Common Mistakes

- Running EKS without understanding Kubernetes fundamentals.
- No cluster autoscaling or resource limits/requests.

---

### 7.2 ECS vs EKS

| Feature        | ECS             | EKS                           |
| -------------- | --------------- | ----------------------------- |
| Type           | AWS proprietary | Kubernetes-based              |
| Portability    | AWS-only        | Multi-cloud                   |
| Learning curve | Easier          | Kubernetes knowledge required |

#### Expanded Comparison

| Area | ECS | EKS |
| --- | --- | --- |
| Orchestration model | AWS-native tasks/services | Kubernetes API/objects |
| Ecosystem | AWS-centric | CNCF/Kubernetes ecosystem |
| Team skill requirement | Lower | Higher |
| Multi-cloud strategy | Weak | Strong |

#### Real-World Scenario

**Scenario:** A team already skilled in Kubernetes chooses EKS for portability. A smaller team wanting faster AWS-native container deployment may start with ECS.

#### Interview Insight

Be ready to justify ECS vs EKS based on team skills, portability needs, and operational complexity.

---

### 7.3 Fargate

* Serverless container compute
* Works with ECS and EKS
* No node management required

#### Detailed Explanation

Fargate removes EC2 node management for containers. You define task/pod compute requirements; AWS provisions infrastructure automatically.

#### Real-World Scenario

**Scenario:** A batch processing service runs periodically. Fargate tasks spin up, process jobs, and stop — no idle server costs.

#### Best Practices

- Right-size CPU/memory per task/pod.
- Use Fargate for variable or intermittent workloads.
- Monitor per-task costs closely.

#### Common Mistakes

- Assuming Fargate is always cheaper than managed node groups.
- No autoscaling policies for spiky workloads.

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

#### Detailed Explanation

ELK is a popular open-source observability stack:

- **Elasticsearch**: stores and indexes logs
- **Logstash**: ingests and transforms logs
- **Kibana**: visualizes and searches logs

#### Real-World Scenario

**Scenario:** A microservices system generates logs from 100+ services. DevOps centralizes logs in ELK, creates Kibana dashboards for error rates, and alerts on critical exceptions.

#### AWS Alternative Note

Many AWS teams use **CloudWatch Logs** + OpenSearch Service (managed Elasticsearch/OpenSearch) for similar capabilities with tighter AWS integration.

#### Best Practices

- Standardize log format (JSON structured logs).
- Include correlation IDs/request IDs.
- Define retention and indexing policies to control cost.

#### Common Mistakes

- Logging sensitive data (passwords, tokens, PAN).
- No log retention strategy -> high storage cost.
- Creating dashboards with no actionable alerts.

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

### Learning Roadmap (Suggested Order)

| Phase | Services | Goal |
| --- | --- | --- |
| Foundation | IAM, VPC, EC2, EBS | Secure compute baseline |
| Storage & Data | S3, snapshots, lifecycle | Artifacts, backups, logs |
| Operations | CloudWatch, CloudTrail, Config | Monitor, audit, comply |
| Delivery | CodePipeline, CodeBuild, CodeDeploy | Automated releases |
| Modern workloads | Lambda, ECS/EKS, Fargate | Scalable app platforms |
| Observability | ELK / OpenSearch | Centralized troubleshooting |

### Service-to-Responsibility Map

| DevOps Responsibility | Primary AWS Services |
| --- | --- |
| Provision infrastructure | EC2, VPC, EBS |
| Secure access | IAM, KMS |
| Deploy applications | CodePipeline, CodeBuild, CodeDeploy |
| Monitor systems | CloudWatch, ELK |
| Audit activity | CloudTrail |
| Enforce compliance | AWS Config |
| Control cost | Billing, Budgets, Cost Explorer |
| Run containers | ECS, EKS, Fargate |

---

## 10. Final Notes

* These services cover **most interview and real-world DevOps requirements**.
* Additional services may be required depending on:

  * Project domain
  * Machine learning workloads
  * Organizational tooling
* Master the **fundamentals first**, then specialize as per project needs.

### Additional Services You May Encounter Later

Depending on project needs, you may also use:

- **RDS / DynamoDB** for databases
- **Route 53** for DNS
- **ALB / NLB** for load balancing
- **Secrets Manager / Parameter Store** for secrets
- **Terraform / CloudFormation** for Infrastructure as Code

### Interview Preparation Checklist

- [ ] Explain EC2 + VPC + IAM together
- [ ] Describe CI/CD flow with CodePipeline/CodeBuild/CodeDeploy
- [ ] Explain S3 use cases and security controls
- [ ] Compare Lambda vs EC2
- [ ] Compare ECS vs EKS vs Fargate
- [ ] Explain CloudWatch vs CloudTrail vs AWS Config
- [ ] Describe cost optimization strategies

### Practice Project Idea

Build an end-to-end DevOps lab:

1. Launch EC2 in VPC with IAM role
2. Store build artifacts in S3
3. Deploy using CodeDeploy
4. Monitor with CloudWatch alarms
5. Audit changes with CloudTrail
6. Enforce one AWS Config rule (for example, encrypted volumes)

This single project touches most of the top 15 services and is excellent for interviews.

---

*End of study notes — Top 15 AWS Services for DevOps Engineers.*
