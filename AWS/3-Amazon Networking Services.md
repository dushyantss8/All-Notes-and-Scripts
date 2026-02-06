# Amazon Networking Services

## Overview

This document introduces **Amazon cloud networking**, which enables communication between cloud resources and with external networks. Networking is foundational to designing secure, scalable AWS architectures.

Topics covered include:

1. **Computer Network Basics** – Core networking concepts such as IP addresses, subnets, and CIDR notation.
2. **Amazon Virtual Private Cloud (VPC)** – The virtual network where AWS resources (for example, EC2) communicate.
3. **AWS Network Security** – Firewalls and access controls used to protect cloud resources.
4. **AWS Direct Connect** – Dedicated private connectivity between on-premises data centers and AWS.
5. **Amazon DNS (Route 53)** – Scalable domain name resolution and traffic routing.
6. **Amazon CDN (CloudFront)** – Low-latency global content delivery.

Understanding these services builds a strong foundation for designing and operating secure AWS cloud environments.

---

## Reviewing Computer Network Basics

A **computer network** consists of interconnected devices that share resources and exchange data. A **subnet** is a logical subdivision of a network, created to improve performance, security, and manageability.

Each subnet is identified by a **network address**, and every device within it is assigned a unique **IP address** to enable communication.

---

## IP Address

An **IP (Internet Protocol) address** uniquely identifies a device on a network and enables data exchange. Two versions exist:

* **IPv4** – 32-bit addresses written as four decimal numbers (for example, `172.217.9.36`)
* **IPv6** – 128-bit hexadecimal addresses

This chapter focuses on IPv4.

Figure 3.1 illustrates a sample website and its IPv4 address.

![An IP Address](image.png)

An IPv4 address contains **32 bits (4 bytes)**, allowing a theoretical total of 2³² addresses. Since a single network cannot practically contain all these addresses, networks are divided into subnets using **CIDR**.

---

## CIDR

**Classless Inter-Domain Routing (CIDR)** defines IP address ranges and subnet sizes. CIDR notation consists of an IP address followed by a slash (`/`) and the number of fixed network bits.

Example:
`172.217.9.0/24`

* First 24 bits: network portion
* Remaining 8 bits: host portion

This subnet contains **256 IP addresses** (`172.217.9.0` to `172.217.9.255`).

Figure 3.2 shows common CIDR ranges and address capacities.

![CIDR Notations](image-1.png)

CIDR enables flexible network design and efficient IP address allocation.

---

## The Internet

The **internet** is a global system of interconnected networks that exchange data using standardized protocols such as TCP/IP.

Key components include:

* **Routers** – Forward traffic between networks using route tables
* **Switches** – Connect devices within a network using MAC addresses

Each subnet is associated with exactly **one route table**, which determines how traffic is forwarded.

Modern networks, like compute systems, have evolved from physical hardware to **software-defined virtual networks**, such as Amazon VPC.

---

## Understanding Amazon Virtual Private Cloud

An **Amazon VPC** is a logically isolated virtual network in the AWS cloud. It allows full control over IP addressing, subnets, routing, and security.

Key benefits include:

1. **High Availability** – Regional scope with subnets spanning Availability Zones
2. **Flexibility** – Custom CIDR ranges, routing, and network topology
3. **Isolation** – Separation of workloads (for example, production vs development)
4. **Cost Efficiency** – No charge for creating or using VPCs
5. **Security** – Subnet-level and instance-level firewalls
6. **Hybrid Connectivity** – Integration with on-premises networks via VPN or Direct Connect

---

## Part One – Creating a VPC with Subnets

This section demonstrates VPC and subnet creation using both the AWS Management Console and AWS CloudShell.

---

## Creating a VPC and a Subnet Using the AWS Console

Create a VPC named `my-vpc1` with CIDR `10.10.0.0/16` and no IPv6 block.

![VPC Settings](image-2.png)

Create a subnet named `public-subnet` with CIDR `10.10.1.0/24`.

![Subnet Settings](image-3.png)

---

## Creating an AWS Cloud Network Using CloudShell

AWS CloudShell provides CLI-based resource management.

### 1. Create VPC1

```bash
aws ec2 create-vpc --cidr-block 10.10.0.0/16 \
--tag-specifications ResourceType=vpc,Tags='[{Key=Name,Value="VPC1"}]'
```

![Create VPC1](image-4.png)

### 2. Create Public and Private Subnets

```bash
aws ec2 create-subnet --vpc-id vpc-xxxx \
--cidr-block 10.10.1.0/24 \
--tag-specifications ResourceType=subnet,Tags='[{Key=Name,Value="public-subnet"}]'

aws ec2 create-subnet --vpc-id vpc-xxxx \
--cidr-block 10.10.2.0/24 \
--tag-specifications ResourceType=subnet,Tags='[{Key=Name,Value="private-subnet"}]'
```

![Create Subnets](image-5.png)

### 3. Launch EC2 Instances

One instance is launched in each subnet.

![Create Instances](image-6.png)

Figure 3.8 shows the resulting VPC architecture.

![VPC Network](image-7.png)

---

## Accessing EC2 Instances from the Internet

Public subnet instances require an **Internet Gateway (IGW)** and appropriate routing.

### 1. Create and Attach an Internet Gateway

![Create IGW1](image-8.png)

![Attach IGW1 to VPC1](image-9.png)

### 2. Update Route Table

Add a default route (`0.0.0.0/0`) pointing to the IGW.

![ Route table for VPC1](image-10.png)

![Add internet route to route table](image-11.png)

![Associate route table to subnet](image-12.png)

### 3. SSH Access

SSH into the public EC2 instance.

![ SSH to EC2-1 from the internet](image-13.png)

![AWS cloud with internet access](image-14.png)

---

## Part Two – Connecting Multiple VPCs

Additional VPCs can be connected using **VPC Peering**.

![ VPC network architecture](image-15.png)

---

## Peering the VPCs

Create a peering connection between VPC1 and VPC2.

![VPC Peering](image-16.png)

Update route tables on both VPCs.

![Edit routes for the VPC1 route table](image-17.png)

Update security groups to allow ICMP.

![Edit SG inbound rules for EC2-8](image-18.png)

![Ping EC2-8 from EC2-1](image-19.png)

![VPC network with peering](image-20.png)

---

## Creating a NAT Gateway

A **NAT Gateway** enables outbound internet access for private subnet instances.

![Create NAT gateway](image-21.png)

![Edit routes for the private subnet route table](image-22.png)

![Access www.google.com from EC2-2](image-23.png)

![AWS VPC architecture](image-24.png)

---

## Part Three – Hardening AWS Network Security

### VPC Firewalls

**Security Groups (SGs)** are stateful, instance-level firewalls.

![SG is stateful - 1](image-25.png)

![SG is stateful - 2](image-26.png)

**Network ACLs (NACLs)** are stateless, subnet-level firewalls.

![NACL is stateless (1)](image-27.png)

![NACL is stateless (2)](image-28.png)

---

## VPC Endpoints

VPC endpoints allow private access to AWS services (such as S3) without internet exposure.

![VPC network diagram](image-29.png)

![VPC endpoint settings](image-30.png)

---

## Understanding Amazon Direct Connect

**AWS Direct Connect** provides a private, dedicated connection between on-premises data centers and AWS with predictable performance.

Setup steps include requesting a connection, selecting a partner, configuring routers, and validating connectivity.

---

## Understanding Amazon DNS – Route 53

**Amazon Route 53** is a scalable DNS service offering:

* Domain name resolution
* Traffic routing
* Health checks and failover

Supported routing policies include simple, weighted, latency-based, geolocation, failover, and multivalue routing.

---

## Understanding the Amazon CDN

**Amazon CloudFront** is AWS’s global CDN service, providing secure, low-latency delivery of static and dynamic content through worldwide edge locations.

---

# Essential Commands Explained

| Command                           | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `aws ec2 create-vpc`              | Creates a new VPC with a specified CIDR block        |
| `aws ec2 create-subnet`           | Creates a subnet within a VPC                        |
| `aws ec2 run-instances`           | Launches EC2 instances                               |
| `aws ec2 create-internet-gateway` | Creates an Internet Gateway                          |
| `aws ec2 create-nat-gateway`      | Enables outbound internet access for private subnets |
| `ping`                            | Tests network connectivity                           |
| `ssh`                             | Securely connects to EC2 instances                   |
| `curl`                            | Tests outbound internet access                       |

---

# Reference Links

* AWS VPC: [https://aws.amazon.com/vpc/](https://aws.amazon.com/vpc/)
* AWS EC2: [https://aws.amazon.com/ec2/](https://aws.amazon.com/ec2/)
* AWS Direct Connect: [https://docs.aws.amazon.com/directconnect/latest/UserGuide/getting_started.html](https://docs.aws.amazon.com/directconnect/latest/UserGuide/getting_started.html)
* VPN over Direct Connect: [https://aws.amazon.com/premiumsupport/knowledge-center/create-vpn-direct-connect/](https://aws.amazon.com/premiumsupport/knowledge-center/create-vpn-direct-connect/)
* Amazon Route 53: [https://aws.amazon.com/route53/](https://aws.amazon.com/route53/)
* Amazon CloudFront: [https://aws.amazon.com/cloudfront/](https://aws.amazon.com/cloudfront/)

---