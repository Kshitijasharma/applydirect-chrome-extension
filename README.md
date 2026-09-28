<div align="center">
   
# ↗️ ApplyDirect

Skip the noise. Get to the application.

A lightweight Chrome extension that scans job pages and finds the  
**most likely direct application link** without making you hunt through the page.

<br>

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Manifest](https://img.shields.io/badge/Manifest-V3-8A2BE2?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Experimental-FF8C00?style=for-the-badge)

<br>

<img width="944" alt="ApplyDirect Preview" src="https://github.com/user-attachments/assets/84f7eda2-bb61-4df7-b9cf-adb77e2b3234" />

<br>

I started building it after repeatedly running into job posts where clicking **"Apply"** sends you through third-party pages, advertisements, redirects, or multiple intermediate pages before you finally reach the actual company application.

ApplyDirect is an attempt to make that process simpler.


</div>

---

## The Problem

While searching for jobs, I often came across websites that are loaded with multiple running ads, articles, some dozens of random links. And somewhere in between thoselinks, actual "Apply" exists.

So instead of manually inspecting every link, I wanted something that could help identify the most likely application destination.
 That why I built this project.


# Install ApplyDirect

ApplyDirect is currently distributed through GitHub rather than the Chrome Web Store.

You can install it locally using Chrome's **Developer Mode**, inside your own browser.

### 1. Clone the repository

Open your terminal and run:

```bash
git clone https://github.com/Kshitijasharma/applydirect-chrome-extension.git
```

Then enter the project:

```bash
cd applydirect-chrome-extension
```

Alternatively, you can download the project without Git:

**Code → Download ZIP → Extract the ZIP**



### 2. Open Chrome Extensions

Open Google Chrome and enter:

```text
chrome://extensions/
```

in the address bar.



### 3. Enable Developer Mode

On the Extensions page, enable:

```text
Developer mode
```

from the top-right corner.

You should now see options such as:

```text
Load unpacked
Pack extension
Update
```

### 4. Load ApplyDirect

Click:

```text
Load unpacked
```

Then select the **root folder of this project** — the folder containing:

```text
manifest.json
```

For example:

```text
apply-direct/
│
├── manifest.json   ← Chrome needs this
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
└── ...
```

Do **not** select only the `popup/` folder.

Chrome should now add **ApplyDirect** to your installed extensions.



### 5. Pin ApplyDirect

Click the Extensions icon (`🧩`) in Chrome's toolbar.

Find:

```text
ApplyDirect
```

and click the pin icon.

ApplyDirect will now appear directly in your browser toolbar.



# Using ApplyDirect

Open a webpage containing a job listing.

Then:

```text
Open job page
      ↓
Click ApplyDirect
      ↓
Click "Scan this page"
      ↓
ApplyDirect analyzes links
      ↓
Best application link is shown
      ↓
Click "Open Application"
```

That's it.

No account or sign-in is required.


# 🤝 Contributing:

This project is still experimental, so contributions and test cases are welcome.

If ApplyDirect fails on a particular job website, feel free to open an issue with:

```text
Website / page type
What ApplyDirect detected
What you expected it to detect
```

Please avoid including private or sensitive information in issues.



