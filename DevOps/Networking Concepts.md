# Networking Fundamentals – IP Addressing, Subnets, CIDR, and Ports

## 1. Introduction to Networking Fundamentals

Networking concepts such as **IP addresses, subnets, CIDR ranges, ports, and OSI layers** form the foundation of how devices communicate over local networks and the internet. These concepts are essential for understanding:

* Application traffic flow
* Cloud infrastructure (AWS, Azure, OpenStack)
* DevOps and system design
* Network security and isolation

This tutorial covers:

* IP Addresses (IPv4)
* Binary representation of IPs
* Subnets and their purpose
* CIDR notation and calculations
* Public vs Private subnets
* Ports and application binding

---

## 2. IP Address Fundamentals

### 2.1 What Is an IP Address?

An **IP address** is a **unique identifier** assigned to every device connected to a network. It enables:

* Device identification
* Traffic routing
* Access control (block/allow specific devices)
* Monitoring and logging activity

**Example use cases:**

* Identifying which device made an online payment
* Blocking specific devices from accessing certain websites
* Monitoring device-level network usage

Without IP addresses, it would be impossible to distinguish one device from another on a network.

---

## 3. IPv4 Address Format

### 3.1 Structure of an IPv4 Address

IPv4 addresses follow this format:

```
X.X.X.X
```

Each `X`:

* Is called an **octet**
* Ranges from **0 to 255**
* Is separated by a dot (`.`)

**Valid examples:**

```
192.168.1.1
10.1.2.4
172.16.3.10
```

**Invalid examples:**

```
600.10.2.3   ❌
300.1.1.1    ❌
```

---

### 3.2 Why Is the Range 0–255?

IPv4 addresses are represented internally using **binary**.

* 1 octet = **8 bits**
* IPv4 = **4 octets = 32 bits**

Each octet:

```
11111111 (binary) = 255 (decimal)
```

Therefore, each octet can only range from **0 to 255**.

---

## 4. Binary Representation of IP Addresses

### 4.1 Understanding Bits and Bytes

Each octet consists of 8 bits:

```
128  64  32  16  8  4  2  1
```

**Example: 192**

```
128 + 64 = 192
Binary: 11000000
```

### 4.2 Full IP in Binary

Example IP:

```
192.168.1.1
```

Binary representation:

```
11000000.10101000.00000001.00000001
```

This binary understanding becomes critical for **subnetting and CIDR calculations**.

---

## 5. Subnetting Fundamentals

### 5.1 What Is a Subnet?

A **subnet** (sub-network) is a logical division of a larger network. Subnetting is used to:

* Improve **security**
* Enable **isolation**
* Control **traffic flow**
* Reduce **blast radius** during attacks

---

### 5.2 Why Subnets Are Needed

**Problem scenario:**

* All devices in an office use the same network
* One device accesses a malicious site
* Entire network becomes compromised

**Solution:**

* Split the network into subnets:

  * Finance subnet (secure)
  * General access subnet (employees)

Even if one subnet is compromised, others remain isolated.

---

## 6. Public vs Private Subnets

| Subnet Type    | Internet Access | Use Case                     |
| -------------- | --------------- | ---------------------------- |
| Public Subnet  | Yes             | Web servers, load balancers  |
| Private Subnet | No              | Databases, internal services |

**Key rule:**

* Internet access is controlled via **routing**, not IP address alone

---

## 7. CIDR (Classless Inter-Domain Routing)

### 7.1 What Is CIDR?

CIDR defines:

* **How many IP addresses** are available in a subnet
* Which portion is **network** vs **host**

**Format:**

```
IP_Address / Prefix
```

Example:

```
172.16.3.0/24
```

---

### 7.2 CIDR Calculation Formula

```
Number of IPs = 2^(32 - CIDR)
```

#### Common CIDR Examples

| CIDR | Calculation        | IP Addresses |
| ---- | ------------------ | ------------ |
| /24  | 32 - 24 = 8 → 2⁸   | 256          |
| /27  | 32 - 27 = 5 → 2⁵   | 32           |
| /30  | 32 - 30 = 2 → 2²   | 4            |
| /31  | 32 - 31 = 1 → 2¹   | 2            |
| /16  | 32 - 16 = 16 → 2¹⁶ | 65,536       |
| /8   | 32 - 8 = 24 → 2²⁴  | ~16 million  |

---

### 7.3 Practical Subnet Allocation Example

**VPC Range:**

```
172.16.0.0/16
```

**Finance Subnet (256 IPs):**

```
172.16.3.0/24
```

**Small Subnet (32 IPs):**

```
172.16.5.0/27
```

**Point-to-Point Subnet (2 IPs):**

```
172.16.6.0/31
```

CIDR allows **precise IP allocation**, preventing waste and improving security.

---

## 8. Private IP Address Ranges

Private IPs must fall within specific ranges:

| Range                         | CIDR |
| ----------------------------- | ---- |
| 10.0.0.0 – 10.255.255.255     | /8   |
| 172.16.0.0 – 172.31.255.255   | /12  |
| 192.168.0.0 – 192.168.255.255 | /16  |

**Why this matters:**

* Public IPs (e.g., `8.8.8.8`) are globally reserved
* Using them internally causes conflicts

---

## 9. Ports and Application Access

### 9.1 What Is a Port?

A **port** is a logical identifier used to distinguish applications running on the same machine.

**One IP → Multiple applications → Different ports**

---

### 9.2 Common Port Examples

| Port | Service            |
| ---- | ------------------ |
| 80   | HTTP               |
| 443  | HTTPS              |
| 3306 | MySQL              |
| 8080 | Jenkins / Web apps |
| 22   | SSH                |

**Best practice:**

* Avoid well-known ports unless required
* Use higher ports like `9000`, `9191`, etc.

---

### 9.3 Accessing Applications Using Ports

**Format:**

```
IP:PORT
```

**Example:**

```
54.12.34.56:9191
```

* IP identifies the machine
* Port identifies the application

---

## 10. Topics Covered and Next Steps

### Covered in This Tutorial

* IP addressing (IPv4)
* Binary representation
* Subnetting concepts
* CIDR calculation
* Public vs private subnets
* Ports and application access

### Upcoming Topic

* **OSI Model**

  * Layers 1–7
  * TCP/IP
  * HTTP/HTTPS
  * Network flow analysis

---

## 11. Practice Exercises

1. How many IPs are available in:

   ```
   172.16.3.0/30
   ```
2. How many IPs are available in:

   ```
   10.0.0.0/8
   ```
3. What CIDR is required for **64 IP addresses**?

Use online CIDR calculators to validate your answers.

---

This structured understanding of networking fundamentals is critical for **cloud architecture, DevOps workflows, system security, and application deployment**.
