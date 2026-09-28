# ↗ ApplyDirect

> Skip the noise. Find the actual application link.

ApplyDirect is a lightweight Chrome extension that scans job-related webpages and tries to identify the most relevant application link.

I started building it after repeatedly running into job posts where clicking **"Apply"** sends you through third-party pages, advertisements, redirects, or multiple intermediate pages before you finally reach the actual company application.

ApplyDirect is an attempt to make that process simpler.



## The Problem

While searching for jobs, I often came across this:

```text
Job Post
   ↓
Click "Apply"
   ↓
Third-party website
   ↓
Ads / intermediary page
   ↓
Another "Apply" button
   ↓
Finally...
   ↓
Company / ATS application page
```

Sometimes the actual application URL is already somewhere on the page, but it is buried among dozens of other links.

So instead of manually inspecting every link, I wanted something that could help identify the most likely application destination.

That's where **ApplyDirect** came from.


# Install ApplyDirect

ApplyDirect is currently distributed through GitHub rather than the Chrome Web Store.

You can install it locally using Chrome's **Developer Mode**.

### 1. Clone the repository

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/apply-direct.git
```

Then enter the project:

```bash
cd apply-direct
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



# How It Works

A webpage can contain dozens or even hundreds of links.

Simply searching for the first link containing `"Apply"` doesn't work very well.

For example:

```html
<a href="/article">
    AI Internship at XYZ — Apply Now
</a>
```

and:

```html
<a href="https://company.com/jobs/123">
    Apply Here
</a>
```

both contain the word **Apply**, but the second one is much more likely to be the actual application.

ApplyDirect therefore treats link detection as a **ranking problem**.


## Step 1 — Collect Links

When you click **Scan this page**, ApplyDirect uses:

```javascript
document.querySelectorAll("a[href]")
```

to collect links from the current webpage.

The extension uses Chrome's `scripting` API to execute this scanner inside the active webpage.


## Step 2 — Analyze Each Link

Each candidate is inspected for several signals.

### Application-related text

Examples:

```text
Apply
Apply Now
Apply Here
Apply for this job
Submit Application
Start Application
Company Careers
View Job
```

Different phrases contribute different weights to the candidate's score.


### Known Applicant Tracking Systems

ApplyDirect also recognizes common ATS/job platforms such as:

```text
Greenhouse
Lever
Workday
Ashby
SmartRecruiters
iCIMS
Jobvite
BambooHR
Workable
SuccessFactors
```

A URL pointing to a known ATS is a strong indication that it may be an actual application destination.


### Job-related URL patterns

URLs containing patterns such as:

```text
/jobs/
/job/
/careers/
/apply/
/application/
/positions/
/openings/
/opportunities/
```

receive additional weight.

For example:

```text
https://company.com/careers/jobs/123
```

looks considerably more relevant than:

```text
https://somewebsite.com/about
```


## Step 3 — Score Candidates

Instead of making a binary decision:

```text
Apply link
OR
Not an Apply link
```

ApplyDirect gives each candidate a score.

Conceptually:

```text
Candidate Link
      │
      ├── Application text
      │
      ├── ATS domain
      │
      ├── Job URL pattern
      │
      ├── External destination
      │
      ├── Same-page check
      │
      └── Other heuristics
      │
      ▼
    SCORE
```

For example:

```text
"Apply Now"
        +30

Known ATS domain
        +40

Contains /jobs/
        +15

External website
        +10

----------------
Score = 95
```

The candidates are then sorted from highest to lowest score.


## Step 4 — Remove Duplicates

A webpage may contain the same application link several times.

ApplyDirect uses a JavaScript `Set` to prevent duplicate URLs from appearing repeatedly in the results.



## Step 5 — Show the Best Matches

After ranking the links, ApplyDirect returns the highest-scoring candidates.

The best candidate is automatically selected:

```text
✓ Application found

DIRECT APPLICATION

↗ Apply Now
  jobs.company.com

[ Open Application ↗ ]
```

Other possible application links can also be displayed so the user can choose a different destination if necessary.


# Project Structure

```text
apply-direct/
│
├── manifest.json
│
└── popup/
    ├── popup.html
    ├── popup.css
    └── popup.js
```

### `manifest.json`

The configuration file for the Chrome extension.

It defines things such as:

```text
Extension name
Version
Permissions
Popup
Manifest version
```

ApplyDirect uses **Manifest V3**.



### `popup.html`

Defines the structure of the extension popup.

It contains the different UI states:

```text
Idle
Scanning
Result
Error
```


### `popup.css`

Contains the styling for the extension interface.

The UI is designed as a small floating utility panel rather than a traditional webpage.


### `popup.js`

Contains the main functionality of ApplyDirect.

It currently handles:

```text
UI state
   +
Chrome tab access
   +
Page scanning
   +
Link analysis
   +
Candidate scoring
   +
Candidate ranking
   +
Result selection
```


# Permissions

ApplyDirect currently requests:

```json
"permissions": [
    "activeTab",
    "scripting"
]
```

### `activeTab`

Allows the extension to interact with the currently active tab after the user invokes the extension.

### `scripting`

Allows ApplyDirect to execute the link-scanning function inside the current webpage.

The goal is to keep permissions as limited as possible.


# Privacy

ApplyDirect currently performs its link analysis locally inside the browser.

The extension does not require:

```text
❌ Account creation
❌ Login
❌ External backend
❌ Database
```

The current version does not intentionally send the contents of the scanned page to an external server.


# Current Limitations

ApplyDirect is currently an experimental project and is still being improved.

The current version primarily analyzes normal HTML links:

```html
<a href="...">
```

This means it may not correctly detect applications implemented through:

- JavaScript-only buttons
- dynamically generated links
- complex single-page applications
- multi-step redirects
- heavily obfuscated tracking URLs

The highest-ranked result is also a **heuristic prediction**, not a guarantee that the URL is the final application destination.


# Planned Improvements

Some things I want to explore next:

- [ ] Better false-positive detection
- [ ] Redirect URL resolution
- [ ] Tracking/intermediary link detection
- [ ] JavaScript button detection
- [ ] Improved ATS recognition
- [ ] Better handling of dynamic webpages
- [ ] More real-world testing across job websites
- [ ] Debug mode for understanding candidate scores

The long-term goal is:

```text
Job Post
   ↓
ApplyDirect
   ↓
Detect intermediary links
   ↓
Resolve destination
   ↓
Actual company / ATS application
```


# 🤝 Contributing:

This project is still experimental, so contributions and test cases are welcome.

If ApplyDirect fails on a particular job website, feel free to open an issue with:

```text
Website / page type
What ApplyDirect detected
What you expected it to detect
```

Please avoid including private or sensitive information in issues.

# Why I Built This:

This started from a very small annoyance while applying for jobs:

> Why does clicking "Apply" sometimes require clicking "Apply" three more times?

Instead of continuing to complain about it, I decided to see if I could build something that helps.

ApplyDirect is that experiment.


