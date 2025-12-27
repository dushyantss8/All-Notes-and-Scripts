# Accessing AWS EC2 Instances from Windows Using MobaXterm

**(AWS – Windows Users Guide)**

## 1. Purpose of the Document

The goal of this document is to demonstrate a **simple, fast, and reliable method** to connect to an EC2 Linux instance from a Windows laptop using **MobaXterm**, without installing VirtualBox or any additional VM software.

---

## 2. Overview of the Approach

* Operating System: **Windows**
* EC2 Instance OS: **Ubuntu (Linux)**
* SSH Client: **MobaXterm (Community Edition)**
* Authentication Method: **PEM private key**
* Time Required: **~5 minutes**

MobaXterm is recommended over PuTTY because:

* It supports **PEM files directly**
* It provides a **Unix-like terminal**
* It is easier to configure and more feature-rich

---

## 3. Launching an EC2 Instance (Basic Setup)

### Step 1: Launch a New EC2 Instance

1. Go to **AWS EC2 Dashboard**
2. Click **Launch Instance**
3. Provide an instance name (e.g., `test-windows`)
4. Select **Ubuntu AMI**
5. Choose instance type: `t2.micro` (Free Tier)

---

## 4. Creating and Downloading the Key Pair

### Step 2: Create Key Pair

* Key Pair Name: `windows-demo`
* Key Pair Type: **PEM (.pem)**
* Download the key pair

  > The `.pem` file is automatically downloaded to the **Downloads folder**

**Important Note:**

* PuTTY requires `.ppk` files
* MobaXterm works directly with `.pem`, so no conversion is required

---

## 5. Network & Security Configuration

### Step 3: Verify Network Settings

Ensure the following:

* **Public IP enabled**
* **Security Group allows SSH (port 22)**
* SSH source: `0.0.0.0/0` (for learning/demo purposes)

Then click **Launch Instance**.

---

## 6. Downloading and Installing MobaXterm

### Step 4: Download MobaXterm

1. Open a browser
2. Search for **Download MobaXterm**
3. Choose:

   * **Community (Home) Edition**
   * **Installer version** (recommended over portable)

### Step 5: Install MobaXterm

1. Extract the downloaded ZIP file
2. Open the extracted folder (do not run from ZIP)
3. Run the installer
4. Click **Next → Accept License → Install → Finish**

After installation, search for **MobaXterm** in the Windows search bar and open it.

---

## 7. Connecting to EC2 Using MobaXterm

### Step 6: Collect EC2 Public IP

* Go to **EC2 Instances**
* Copy the **Public IPv4 address** of the instance

---

### Step 7: Configure SSH Session in MobaXterm

1. Open **MobaXterm**
2. Click **Session**
3. Choose **SSH**
4. Enter:

   * **Remote Host**: `<EC2 Public IP>`
   * **Username**: `ubuntu`

---

### Step 8: Configure Private Key

1. Go to **Advanced SSH Settings**
2. Enable **Use private key**
3. Browse and select:

   * `windows-demo.pem` (from Downloads)
4. Click **OK**

---

### Step 9: Connect

* Accept the SSH fingerprint prompt
* Authentication succeeds
* You are now logged into the EC2 instance

---

## 8. Verifying the Connection

Once connected, you can run Linux commands to confirm access.

### Example Commands:

```bash
whoami
```

Output:

```bash
ubuntu
```

```bash
sudo apt update
```

If the command runs successfully, your SSH connection is working correctly.

---

## 9. Key Takeaways

* Windows users **do not need PuTTY** to connect to EC2
* **MobaXterm is simpler, faster, and more powerful**
* `.pem` files work directly—no conversion required
* This method eliminates dependency on AWS browser terminal
* Suitable for beginners and production-like environments

---

## 10. Summary (In One Line)

> Using **MobaXterm**, Windows users can connect to an **Ubuntu EC2 instance via SSH in under 5 minutes**, using a `.pem` key, without PuTTY or virtual machines.

---