# Amazon Cloud Storage Services —

## Overview

This tutorial introduces **AWS storage services** and how they integrate with **Amazon EC2**, covering:

* **Block storage** (EBS)
* **Network file systems** (EFS)
* **Object storage** (S3)
* **Large-scale data transfer services**
* **Secure access to S3 from EC2 using IAM roles**

---

## Storage Types in AWS

### Block Storage

* Data is stored in fixed-size blocks.
* Only modified blocks are updated on write operations.
* Typically formatted by the OS into a filesystem.
* Example use case: operating system disks, databases.

### Filesystem Storage

* Built on block storage.
* Organizes data in directories and files.
* Can be local or shared over a network.

### Object Storage

* Stores data as objects (data + metadata).
* Entire object is replaced on modification.
* Highly scalable and accessed via HTTP APIs.

![Image](https://csc-jsc.com/wp-content/uploads/2021/07/block-file-object.png)

![Image](https://www.devopsschool.com/blog/wp-content/uploads/2023/08/image-716-1024x739.png)

**Figure 2.1:** Relationship between block storage, filesystems, and object storage.

---

## Amazon Elastic Block Store (EBS)

### Key Characteristics

* Block-level storage for EC2 instances.
* Volumes are created independently and attached to EC2.
* Supports dynamic resizing.
* Commonly used as primary storage for EC2.

### Workflow: Creating and Using an EBS Volume

#### 1. Check existing disks on EC2

* Use Linux commands:

  * `sudo su`
  * `fdisk -l`

![Image](https://tachytelic.net/wp-content/uploads/linux_fdisk_heads_cylinders_sectors.png)

![Image](https://i.sstatic.net/9DHZ9.jpg)

**Figure 2.2:** Existing root disk visible on the Linux instance.

#### 2. Create an EBS volume

* AWS Console → EC2 → Elastic Block Store → Volumes → Create Volume
* Choose:

  * Volume size
  * Volume type (SSD, HDD)
  * Availability Zone

![Image](https://tecadmin.net/wp-content/uploads/2014/01/add-ebs-1.png)

![Image](https://thinkcloudly.com/wp-content/uploads/2021/07/pic-1-2.png)

**Figures 2.3–2.4:** Viewing existing volumes and creating a new EBS volume.

#### 3. Attach the volume to EC2

* Actions → Attach Volume
* Select target EC2 instance

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20221123215503/Screenshot202211232025410101.jpg)

![Image](https://docs.bitnami.com/images/img/how_to_guides/attach-ebs-volume-aws/attach-ebs-volume-1.png)

**Figures 2.5–2.6:** Attaching the new EBS volume to the instance.

#### 4. Format and mount the disk

* Detect disk using `fdisk -l`
* Create filesystem: `mkfs`
* Mount to a directory using `mount`

![Image](https://www.tecmint.com/wp-content/uploads/2017/03/Find-New-Partition-Details.png)

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20200919120546/Capture3.JPG)

**Figure 2.7:** New EBS volume formatted and mounted.

#### 5. Resize EBS volume

* Increase volume size in AWS Console.
* Extend filesystem in the guest OS.

---

## Amazon Elastic File System (EFS)

### Key Characteristics

* Fully managed, elastic, shared filesystem.
* Accessible by multiple EC2 instances simultaneously.
* Uses NFS protocol.
* No need to predefine storage size.

### Workflow: Creating and Using EFS

#### 1. Create an EFS filesystem

* AWS Console → EFS → Create file system
* Choose:

  * One Zone (single AZ)
  * Standard (multi-AZ, higher durability)

![Image](https://computingforgeeks.com/wp-content/uploads/2020/10/Create-File-System.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AmfyM-cBPkrF-EFJg0n23kA.png)

**Figures 2.8–2.9:** Creating an EFS filesystem.

#### 2. Mount EFS on a Linux EC2 instance

* Use NFS mount command provided by AWS.
* Mount to a local directory.

![Image](https://miro.medium.com/1%2A7vATESxz_Sf9-Pf3kQmWDg.jpeg)

![Image](https://cloudbytes.dev/images/aws/25000000-architecture-diagram.png)

**Figures 2.10–2.12a:** Attaching EFS to a Linux instance.

#### 3. Verify shared access

* Mount the same EFS on another EC2 instance.
* Files are readable and writable across instances.

![Image](https://miro.medium.com/0%2AC9WjddpYI68K7_pZ.png)

![Image](https://docs.aws.amazon.com/images/efs/latest/ug/images/efs-ec2-how-it-works-Regional_china-world.png)

**Figure 2.12:** Shared EFS across multiple EC2 instances.

---

## Amazon Simple Storage Service (S3)

### Core Concepts

* Object-based storage.
* Globally accessible via public endpoints.
* Data stored in **buckets**.
* Bucket names must be globally unique.
* Object size: **0 bytes to 5 TB**.

### S3 Storage Classes

* **S3 Standard** – high availability and durability.
* **S3 Standard-IA** – lower cost for infrequent access.
* **Reduced Redundancy Storage** – lower durability.
* **S3 Intelligent-Tiering** – automatic tiering.
* **Glacier** – archival storage with very high durability.

### Additional Features

* **Versioning**: Maintains multiple versions of objects.
* **Lifecycle management**:

  * Automatically transitions objects between storage classes.
  * Supports expiration and deletion rules.

![Image](https://cms.cloudoptimo.com/uploads/S3_Lifecycle_Transitions_dfffc45147.png)

![Image](https://d2908q01vomqb2.cloudfront.net/e1822db470e60d090affd0956d743cb0e7cdf113/2024/09/20/1-Solution-overview-of-transitioning-objects-across-storage-classes-using-S3-Batch-Operations-and-S3-Lifecycle.jpg)

**Figure 2.13:** Example of S3 lifecycle transition policy.

---

## Large-Scale Data Transfer Services

### AWS Snowcone

* Small, rugged edge device.
* Supports offline and online data transfer.
* Suitable for edge computing.

### AWS Snowball

* Appliance-based transfer service.
* Up to **80 TB** usable storage.
* Data encrypted using AWS KMS.

### AWS Snowmobile

* Truck-based solution.
* Up to **100 PB** per transfer.
* Designed for massive enterprise migrations.

---

## Accessing S3 from EC2 Instances

### Problem

* EC2 instances cannot access S3 by default, even with a public IP.

### Solution: IAM Roles for EC2

* Assign an IAM role with S3 permissions to the EC2 instance.
* Applications and CLI on EC2 inherit role permissions.

### Workflow: Granting S3 Access

#### 1. Create IAM role

* IAM → Create role
* Trusted entity: **AWS service**
* Use case: **EC2**

![Image](https://d13vhgz95ul9hy.cloudfront.net/blog/wp-content/uploads/2020/08/CreateRoleSelectService-1-1024x726.jpg)

![Image](https://kodekloud.com/kk-media/image/upload/v1752863021/notes-assets/images/AWS-IAM-Demo-Creating-IAM-Role/aws-iam-console-ec2-role-selection.jpg)

**Figures 2.15–2.16:** Creating an EC2 IAM role.

#### 2. Attach S3 permissions

* Add policy: `AmazonS3FullAccess`

![Image](https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2025/02/13/img2.png)

![Image](https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2017/11/15/CC_Diagram2_0717_a1.png)

**Figures 2.17–2.18:** Assigning permissions and creating the role.

#### 3. Attach role to EC2 instance

* EC2 → Instance → Actions → Security → Modify IAM role

![Image](https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2017/02/20/RRI-3.png)

![Image](https://d2908q01vomqb2.cloudfront.net/22d200f8670dbdb3e253a90eee5098477c95c23d/2017/02/20/RRI-4.png)

**Figures 2.19–2.20:** Attaching IAM role to EC2.

#### 4. Verify access

* Run:

  ```
  aws s3 ls
  ```

![Image](https://images.squarespace-cdn.com/content/v1/4f3b434c8754e3c85b69cfb7/1621234335069-G2YZVQCHYYI4TCG1VDDH/AWS_CLI_66.png)

![Image](https://awsfundamentals.com/_next/image?q=75\&url=%2Fassets%2Fblog%2Faws-s3-ls%2Fproperly-configuring-the-aws-cli-for-your-account.webp\&w=3840)

**Figure 2.21:** Successful listing of S3 buckets from EC2.

---

## Chapter Summary

* **EBS**: Block storage for EC2, ideal for low-latency and persistent workloads.
* **EFS**: Shared filesystem for multiple EC2 instances.
* **S3**: Highly scalable, durable object storage.
* **Snowcone/Snowball/Snowmobile**: Physical data migration services.
* **IAM roles**: Secure, credential-free access to S3 from EC2.

These services collectively address diverse storage and data transfer requirements in AWS.

---

## Reference Links

* [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html)
* [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/modify-ebs-volume-on-instance.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/modify-ebs-volume-on-instance.html)
* [https://www.bu.edu/comtech/students/technical-guides/hardware/how-to-format-hard-drives/](https://www.bu.edu/comtech/students/technical-guides/hardware/how-to-format-hard-drives/)
