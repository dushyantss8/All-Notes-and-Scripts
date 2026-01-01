# Deploying a Node.js Application on AWS EC2 –

## Overview

This tutorial demonstrates how to deploy a **Node.js application** on an **AWS EC2 instance**, verify it locally, configure a Linux-based remote server, and expose the application to the public internet using **AWS Security Groups**.

The process follows real-world DevOps practices:

* Testing applications locally before deployment
* Using Git for source control
* Creating IAM users for secure AWS access
* Provisioning and configuring EC2 instances
* Managing environment variables securely
* Exposing services via inbound network rules

---

## Prerequisites

Before starting, ensure you have:

* A basic understanding of **Git** and **Linux commands**
* An **AWS account**
* A **GitHub repository** containing a Node.js application
* Local system with:

  * Git
  * Node.js
  * npm

---

## Architecture Flow

1. Clone and test the application locally
2. Create an IAM user in AWS
3. Launch an EC2 instance (Ubuntu)
4. Connect to EC2 using SSH
5. Install dependencies on EC2
6. Configure environment variables
7. Run the application on EC2
8. Expose the application using Security Groups

---

## Step 1: Clone the Application Repository Locally

Clone the GitHub repository to your local system:

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

### Common Git Commands Used

* `git clone` – Creates a local copy of the repository
* `ls` – Lists files and directories
* `cd` – Changes the current directory

---

## Step 2: Configure Environment Variables Locally

Most production-grade applications rely on **environment variables** instead of hardcoded values.

Create a `.env` file:

```bash
touch .env
```

Example `.env` file:

```env
DOMAIN=localhost
PORT=3000
STRIPE_PUBLISHABLE_KEY=your_key_here
STRIPE_SECRET_KEY=your_secret_here
```

**Why `.env` files are used:**

* Store secrets securely
* Avoid exposing credentials in source code
* Support different environments (dev, test, prod)

---

## Step 3: Install Dependencies and Run Locally

Install Node.js dependencies:

```bash
npm install
```

Start the application:

```bash
npm run start
```

Verify locally in the browser:

```
http://localhost:3000
```

If the application works locally, proceed to cloud deployment.

---

## Step 4: Create an IAM User in AWS

In **Amazon Web Services**, avoid using the root account for daily operations.

### Steps

1. Open AWS Console
2. Navigate to **IAM (Identity and Access Management)**
3. Create a new user
4. Enable **Console Access**
5. Assign permissions:

   * For demo: `AdministratorAccess`
   * Recommended practice: Restrict permissions (e.g., EC2 only)

**IAM Benefits**

* Role-based access control
* Improved security
* Prevents accidental deletion of critical resources

---

## Step 5: Launch an EC2 Instance

Navigate to **EC2 → Launch Instance**.

### Configuration

* **AMI (OS):** Ubuntu Server 22.04 LTS
* **Instance Type:** `t2.micro` (Free Tier eligible)
* **Key Pair:** Create and download a `.pem` file
* **Network Settings:** Default (SSH allowed)

Launch the instance.

---

## Step 6: Connect to EC2 Using SSH

Navigate to the directory containing your key file:

```bash
cd Downloads
chmod 400 demo.pem
```

Connect to EC2:

```bash
ssh -i demo.pem ubuntu@<PUBLIC_IP>
```

**Explanation**

* `chmod 400` restricts file access to the owner only
* SSH provides secure remote access to the server

---

## Step 7: Prepare the EC2 Environment

Update system packages:

```bash
sudo apt update
```

Install Node.js:

```bash
sudo apt install nodejs -y
```

Verify installation:

```bash
node -v
```

Install npm:

```bash
sudo apt install npm -y
npm -v
```

---

## Step 8: Clone the Application on EC2

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

---

## Step 9: Configure Environment Variables on EC2

Create `.env` file:

```bash
touch .env
ls -a
```

Edit using Vim:

```bash
vim .env
```

Insert values (press `i` to edit):

```env
DOMAIN=0.0.0.0
PORT=3000
STRIPE_PUBLISHABLE_KEY=your_key_here
STRIPE_SECRET_KEY=your_secret_here
```

Save and exit Vim:

```
Esc
:x
```

Verify contents:

```bash
cat .env
```

---

## Step 10: Install Dependencies and Run the App on EC2

```bash
npm install
npm run start
```

The application now runs on EC2 but is **not yet accessible externally**.

---

## Step 11: Expose the Application to the Internet

### Why It’s Not Accessible Yet

* EC2 blocks inbound traffic by default
* Security Groups control allowed ports

### Update Inbound Rules

1. Go to **EC2 → Security Groups**
2. Edit inbound rules
3. Add rule:

   * **Type:** Custom TCP
   * **Port:** `3000`
   * **Source:** `0.0.0.0/0`

Save changes.

---

## Step 12: Access the Application Publicly

Open a browser:

```
http://<PUBLIC_IP>:3000
```

The Node.js application is now **live on AWS**.

---

## Optional: Payment Gateway Configuration (Stripe)

This application integrates with **Stripe**.

### Steps to Obtain Keys

1. Create a Stripe account
2. Enable **Test Mode**
3. Navigate to **Developers → API Keys**
4. Copy:

   * Publishable key
   * Secret key

Use **test keys only** for demos.

---

## Key Concepts Reinforced

* Local testing before cloud deployment
* Secure handling of credentials using environment variables
* IAM for access control
* EC2 for scalable compute
* SSH for secure remote access
* Security Groups for network exposure

---

## Learning Resources Recommended

* **GitHub** – Source control and project hosting
* **DigitalOcean** – High-quality technical documentation
* AWS Official Documentation – IAM, EC2, Security Groups

---

## Final Outcome

* Node.js application successfully deployed on AWS EC2
* Application accessible globally via public IP
* Real-world DevOps deployment workflow demonstrated end-to-end

This same process can be adapted for **Python, Java, Go**, or any backend framework by changing runtime setup steps.

---
