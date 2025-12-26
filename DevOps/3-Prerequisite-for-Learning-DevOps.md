# How a DevOps Engineer Works in a Real Organization

### Roles, SDLC, Requirement Flow, and Jira Explained

## 1. Example Organization Assumption

To simplify understanding, the instructor uses a **hypothetical scenario**:

* Company: **Amazon**
* Project: **Amazon Fresh**
* Role: **DevOps Engineer**

Key clarification:

> You are hired by a company, but you work on **one specific project or vertical**, not the entire company.

---

## 2. Why DevOps Engineers Don’t Get Requirements Directly

* DevOps engineers **do not interact with customers**
* Requirements pass through **multiple roles**
* Understanding these roles helps:

  * Day-to-day work clarity
  * Interview confidence
  * Better collaboration

---

## 3. Key Roles in an Organization (Top to Bottom)

### 3.1 Customers (Source of Requirements)

* Customers provide:

  * Feature requests
  * Feedback
  * Market expectations

**Example requirement**:

> “Amazon Fresh should deliver groceries within 15 minutes across all pin codes.”

---

### 3.2 Business Analyst (BA)

**Responsibilities**:

* Interacts with customers
* Understands business needs
* Converts ideas into formal documentation

**Key Artifact**:

* **BRD (Business Requirement Document)**

**Important Note for DevOps**:

* You don’t write BRDs
* But you **must understand what they are**

---

### 3.3 Product Manager (PM)

**Responsibilities**:

* Defines product vision
* Prioritizes requirements
* Decides *what to build and when*

**Example**:

* Chooses between:

  * 15-minute delivery
  * New payment gateway (UPI/Stripe)
* Schedules work for **Q1 (Jan–Mar)**

PM decisions are influenced by:

* Market
* Competitors
* Organizational capability

---

### 3.4 Product Owner (PO)

**Responsibilities**:

* Converts vision into **actionable items**
* Manages **product backlog**
* Defines **acceptance criteria**

**Key Concept**:

* Requirements are broken into **Epics**

**Epic Example**:

```
Epic: 15-Minute Delivery Service
Definition of Done:
- Mobile UI support
- Desktop UI support
- Enable/disable option
- Backend service support
```

---

### 3.5 Solution / Software Architect

**Responsibilities**:

* Highly technical role
* Designs:

  * **HLD (High-Level Design)**
  * **LLD (Low-Level Design)**

Architect validates:

* Feasibility
* Skill availability
* Infrastructure readiness

This is where **technical reality meets planning**.

---

## 4. Where DevOps Engineers Enter the Picture

### 4.1 Development Team Analysis

Developers review designs and identify needs:

* Infrastructure
* Containers
* CI/CD
* Kubernetes
* Git repositories
* Cloud resources (AWS, GCP, Azure)

These needs are **converted into DevOps tasks**.

---

### 4.2 Typical DevOps Requirements

Examples:

* Create Kubernetes cluster
* Write Dockerfiles
* Setup CI/CD pipelines
* Provision AWS resources
* Configure monitoring

**Example DevOps Task (Terraform – Simplified)**

```hcl
resource "aws_eks_cluster" "amazon_fresh" {
  name     = "amazon-fresh-cluster"
  role_arn = aws_iam_role.eks_role.arn
}
```

---

## 5. Scrum Team Concept

A **Scrum Team** typically includes:

* Developers
* DevOps Engineers
* QA Engineers
* Database Administrators
* Technical Writers (sometimes)

> No single role can complete a feature alone.

---

## 6. QA, SRE, and Technical Writers

### 6.1 QA Engineers

* Test features
* Write automation scripts
* Work closely with DevOps

### 6.2 Site Reliability Engineers (SRE)

* Monitor production
* Ensure:

  * Reliability
  * Availability
  * Performance
* Create dashboards and alerts

### 6.3 Technical Writers

* Document features
* Write product and API documentation
* Enable user adoption

---

## 7. SDLC Explained with Real Mapping

### Software Development Life Cycle Phases

1. **Planning**

   * Requirements gathered (BA, PM)
2. **Analysis**

   * Feasibility check
3. **Design**

   * HLD / LLD (Architect)
4. **Implementation**

   * Dev, DevOps, QA
5. **Testing & Integration**

   * Automated + manual tests
6. **Maintenance**

   * SRE monitoring, alerts, fixes

> SDLC looks simple in diagrams but is **highly complex in reality**.

---

## 8. Extra Responsibility of DevOps Engineers

DevOps engineers **optimize SDLC**, not just execute tasks.

### Examples:

* Automate testing via CI/CD
* Reduce deployment time
* Integrate security scans
* Improve developer productivity

**CI/CD Example (Conceptual)**

```yaml
stages:
  - build
  - test
  - deploy

test:
  script:
    - npm test
```

Goal:

> Reduce delivery time from 3 months → 2 months.

---

## 9. Why Project Management Tools Are Needed

Challenges:

* Multiple teams
* Dependencies
* Blockers
* Accountability

**Example Problem**:

> Kubernetes cluster blocked → Developers blocked → Release delayed → Customer impacted

Solution:
👉 **Central visibility using Jira**

---

## 10. Jira: How Work Is Tracked

### 10.1 Jira Setup (Demo Overview)

* Create Atlassian account
* Create organization
* Create project (Amazon Fresh)

---

### 10.2 Jira Hierarchy

* **Epic** – Large feature
* **Story** – Small task
* **Task** – Actionable work

---

### 10.3 Epic Example in Jira

```
Epic: 15-Minute Delivery Service
Status: To Do → In Progress → Review → Done
```

Used by management for tracking.

---

### 10.4 How DevOps Engineers Get Tasks

1. Epic is created by PO
2. Sprint planning happens
3. Developers identify infra needs
4. Story is created:

   * “Create Kubernetes cluster”
5. Assigned to DevOps engineer

If bandwidth exists → current sprint
Otherwise → backlog

---

## 11. Sprint and Agile Basics (Simplified)

* **Sprint duration**: 2–3 weeks
* Sprint planning:

  * Select tasks from backlog
* Sprint retrospective:

  * Review completed vs committed work

DevOps engineers participate **actively**.

---

## 12. Daily DevOps Work in Jira

As a DevOps engineer:

* Update task comments daily
* Change task status
* Mention blockers clearly

This ensures:

* Transparency
* Accountability
* Trust with management

---

## 13. Final Takeaways

* DevOps engineers **do not receive customer requirements directly**
* Requirements flow through:

  ```
  Customer → BA → PM → PO → Architect → Dev Team → DevOps
  ```
* Jira is **central to daily work**
* DevOps improves:

  * Speed
  * Reliability
  * Automation
* Understanding this flow:

  * Improves interviews
  * Builds real-world confidence

---
