# Software Development Life Cycle (SDLC) Explained with DevOps Perspective

## 1. What is SDLC (Software Development Life Cycle)?

**SDLC** stands for **Software Development Life Cycle**.

It is:

* A **standardized process**
* Followed by **every organization** (startups, MNCs, unicorns)
* Used to **design, develop, test, and deliver high-quality software**

### Why SDLC is Important

* Ensures **quality**
* Ensures **customer satisfaction**
* Brings **discipline and predictability** to software delivery
* Helps teams work together using **common standards**

> Whether you are a **developer, tester, DevOps engineer, or manager**, you must understand SDLC.

---

## 2. High-Level Goal of SDLC

The **ultimate objective** of SDLC is:

> **To deliver a high-quality, reliable, and scalable product to the customer**

Without:

* Design → Development becomes chaotic
* Testing → Quality cannot be guaranteed

Hence, **all phases are mandatory**.

---

## 3. SDLC as a Continuous Cycle

SDLC is **not a one-time process**.
It follows a **circular approach**, repeated for **every new feature**.

Typical SDLC flow:

1. Planning & Requirement Gathering
2. Defining Requirements
3. Designing
4. Building (Development)
5. Testing
6. Deployment
7. Maintenance / Enhancements → back to planning again

---

## 4. Practical Example: E-Commerce Application

To explain SDLC practically, the instructor uses an example:

* Organization: `example.com` (any e-commerce platform like Amazon/Flipkart)
* Scenario: Launching a **Kids Clothing Catalog**

Initially, the platform supports:

* Men
* Women

Now, the business wants to add:

* **Kids Section**

This feature will go through the **entire SDLC cycle**.

---

## 5. Phase 1: Planning & Requirement Gathering

### Purpose

* Decide **whether a feature is worth building**
* Collect **business and customer inputs**

### Who is involved?

* Product Owner
* Business Analyst
* Senior Stakeholders
* Sometimes CTO / Leadership

### Example (Kids Catalog)

Questions asked:

* Are customers interested in kids clothing?
* What age group?

  * 1–4 years?
  * 6–12 years?
* How many customers want this feature?

If **customer interest is low**, the idea can be **discarded early**, saving time and cost.

> This makes planning the **most critical phase**.

---

## 6. Phase 2: Defining Requirements (Documentation)

Once planning is approved, requirements are **formally documented**.

### Key Document

**Software Requirement Specification (SRS)**

### What does SRS contain?

* Customer research results
* Feature expectations
* Business rules
* Functional requirements

Example:

* 16 customers want clothing for age 1–4
* 4 customers want clothing for age 6–12

This document becomes the **single source of truth**.

---

## 7. Phase 3: Designing (HLD & LLD)

Designing is divided into two levels:

---

### 7.1 High-Level Design (HLD)

Focuses on **architecture and scalability**.

Includes:

* System architecture
* Technology stack
* Scalability strategy
* High availability
* Database choice
* Load handling (e.g., festivals like Christmas)

Example:

* Use MySQL with replicas
* Application should scale during high traffic
* Multiple instances behind a load balancer

---

### 7.2 Low-Level Design (LLD)

Focuses on **implementation details**.

Includes:

* Modules
* Functions
* APIs
* Method signatures
* Input/output formats

Example:

* Which function fetches kids products
* What arguments are passed
* What response is returned
* Which SQL queries are used

LLD is usually prepared by:

* Architects
* Senior developers

---

## 8. DevOps Entry Point in SDLC

Up to this point:

* Planning → Business/Product
* Designing → Architects/Senior Devs

Now comes the **core DevOps-centric phases**:

👉 **Build, Test, Deploy**

These are the phases where **DevOps adds maximum value**.

---

## 9. Phase 4: Building (Development)

### What happens?

* Developers write application code
* Follow design documents (HLD & LLD)
* Use organization’s programming language

### Tools Used

* Git (source code repository)

### Process

1. Developer writes code locally
2. Code is reviewed by peers (PR review)
3. Code is pushed to Git repository

Why Git?

* Centralized/shared access
* Collaboration
* Version control

---

## 10. Phase 5: Testing

### Why testing is required?

“Works on my machine” is **not acceptable**.

### Who performs testing?

* **Quality Assurance (QA / QE) Engineers**

### What happens?

* Application is deployed to:

  * Development
  * QA
  * Staging environment
* Functional, regression, and other tests are executed

Goal:

* Ensure the software meets requirements
* Ensure no defects reach customers

---

## 11. Phase 6: Deployment

### What is Deployment?

* Promoting tested code to **Production**
* Making the feature live for customers

### Key Point

* Production = Customers use it

Deployment must be:

* Reliable
* Fast
* Error-free

---

## 12. Where DevOps Truly Fits In

DevOps is **not a role**, it is a **culture**.

### DevOps Engineer’s Responsibility

* Improve **organizational efficiency**
* Reduce **manual effort**
* Speed up **delivery**

### Core Focus Areas

* Build automation
* Test automation
* Deployment automation

---

## 13. DevOps = Automation of SDLC Phases

A DevOps engineer:

* Does NOT manually develop
* Does NOT manually test
* Does NOT manually deploy

Instead, they:

* Write automation scripts
* Build CI/CD pipelines
* Ensure repeatability and consistency

### Automation Benefits

* Faster releases
* Fewer human errors
* Higher efficiency
* Reduced deployment time

> **Automation is directly proportional to efficiency**

---

## 14. SDLC Models (High-Level Mention)

Different project management models exist:

* Waterfall
* Iterative
* Agile

### Industry Reality

* **Agile is most commonly used**

In Agile:

* Work is divided into **small sprints**
* SDLC cycle is repeated frequently
* Faster feedback and delivery

(Details to be covered in project management sessions)

---

## 15. DevOps Interview-Ready Summary Answer

If asked in an interview:

**“What is SDLC and which phases are important for DevOps?”**

### Ideal Answer:

> SDLC is a standardized process followed by the software industry to plan, design, develop, test, and deploy high-quality software.
> As a DevOps engineer, my primary focus is on automating and improving the efficiency of the **build, test, and deployment phases** to enable faster and reliable delivery.

---

## 16. Key Takeaways

* SDLC is **mandatory knowledge** for all IT roles
* Every organization follows SDLC (cloud or on-prem)
* DevOps improves SDLC through **automation**
* Build, Test, Deploy are **DevOps-centric phases**
* Understanding SDLC strengthens **interview confidence**

---