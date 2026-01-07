# Node.js Installation and First Project Setup –

## 1. Overview of Required Tools

To start working with Node.js, the following tools are required:

1. **Node.js** – One-time installation (runtime environment + npm).
2. **Code Editor** – Visual Studio Code (VS Code), a free editor.
3. **Express.js Project** – Installed separately for each project (covered in the next video).

This tutorial covers **Node.js and VS Code installation** and creating a **basic Node.js project**.

---

## 2. Downloading Node.js

### Steps:

1. Open a web browser and go to **google.com**.
2. Search for **Node.js**.
3. Open the official website: **nodejs.org**.
4. Download the Node.js setup file suitable for your operating system.
5. Save the installer file to your system.

---

## 3. Installing Node.js

### Installation Steps:

1. Double-click the downloaded Node.js installer.
2. Click **Next**.
3. Accept the license agreement and click **Next**.
4. Choose the installation location (default:
   `C:\Program Files\nodejs`).
5. Continue with **Next**.

### What Node.js Installer Sets Up:

* Node.js runtime environment
* npm (Node Package Manager)
* Automatically configures **Environment Variables (PATH)**

6. Click **Install** and allow permissions if prompted.
7. Once installation completes, click **Finish**.

> Optional: If extra tools were selected during installation, PowerShell may open and complete additional setup automatically.

---

## 4. Verifying Node.js and npm Installation

### Steps:

1. Open **Command Prompt (CMD)**.
2. Run the following commands:

```bash
node -v
```

✔ Displays Node.js version if installed correctly.

```bash
npm -v
```

✔ Displays npm version.

If version numbers appear, Node.js and npm are installed successfully.

---

## 5. Fixing Environment Variable (PATH) Issues (If Node Is Not Recognized)

### Steps:

1. Search for **Edit the system environment variables**.
2. Open **System Properties** → **Environment Variables**.
3. Under **System Variables**, find and double-click **Path**.
4. Ensure the Node.js path exists, for example:

   ```
   C:\Program Files\nodejs\
   ```
5. If missing, add it manually.
6. Click **OK** on all windows.
7. Restart Command Prompt and recheck:

```bash
node -v
```

---

## 6. Installing Visual Studio Code (VS Code)

### Steps:

1. Download VS Code from its official website.
2. Run the installer.
3. Accept the license agreement.
4. Click **Next** through default settings.
5. Enable the following options:

   * Open with Code (right-click menu)
   * Add to PATH
   * Desktop icon (optional)
6. Click **Install**.

Once installed, open **Visual Studio Code** from the Start Menu.

---

## 7. Recommended VS Code Extensions for Node.js & Express

> Extensions are optional but improve productivity.

### Suggested Extensions:

* **Express JS Snippets**
* **Express JS Snippets (alternate versions)**
* **EJS Language Support** (for template engine usage)
* **MongoDB for VS Code**
* **Path IntelliSense**
* **ESLint** (JavaScript error detection)

### Benefits:

* Auto-generate large code blocks using short commands (snippets)
* Faster coding
* Early error detection
* Better project navigation

---

## 8. Creating a New Node.js Project

### Step 1: Create and Open a Project Folder

1. Open VS Code.
2. Click **Open Folder**.
3. Create a new folder (e.g., `first-node-project`).
4. Open and trust the folder.

---

## 9. Initializing Node.js Project (`package.json`)

### Open Terminal in VS Code:

* Menu → **Terminal** → **New Terminal**

### Run Command:

```bash
npm init -y
```

### Purpose:

* Initializes a new Node.js project
* Automatically creates `package.json`
* Skips manual questions using `-y`

### `package.json` Contains:

* Project name
* Version
* Entry file (`index.js`)
* Author
* Scripts
* Dependencies (installed packages)

> `package.json` is mandatory for any Node.js project.

---

## 10. Fixing PowerShell Execution Policy Error (If Occurs)

### Error:

PowerShell blocks npm commands due to security restrictions.

### Solution:

1. Check current policy:

```bash
Get-ExecutionPolicy
```

2. Set policy for current user:

```bash
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

3. Verify:

```bash
Get-ExecutionPolicy -List
```

After this, npm commands will work correctly.

---

## 11. Creating and Running First Node.js File

### Step 1: Create File

Create a file named:

```text
index.js
```

### Step 2: Add JavaScript Code

```javascript
console.log("Hello");
```

### Step 3: Run the File

In terminal:

```bash
node index.js
```

✔ Output:

```text
Hello
```

You can also run:

```bash
node index
```

---

## 12. Testing Code Changes

Modify the file:

```javascript
console.log("Hello World");
```

Save the file and rerun:

```bash
node index.js
```

✔ Output updates accordingly.

---