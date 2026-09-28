// =====================================================
// GET UI ELEMENTS
// =====================================================

// Different screens/states
const idleState =
    document.getElementById("idleState");

const scanningState =
    document.getElementById("scanningState");

const resultState =
    document.getElementById("resultState");

const errorState =
    document.getElementById("errorState");


// Buttons
const scanButton =
    document.getElementById("scanButton");

const scanAgainButton =
    document.getElementById("scanAgainButton");

const retryButton =
    document.getElementById("retryButton");

const openButton =
    document.getElementById("openButton");


// Result elements
const bestLinkText =
    document.getElementById("bestLinkText");

const bestLinkDomain =
    document.getElementById("bestLinkDomain");

const bestLinkCard =
    document.getElementById("bestLinkCard");

const otherSection =
    document.getElementById("otherSection");

const otherLinks =
    document.getElementById("otherLinks");



// =====================================================
// CURRENTLY SELECTED LINK
// =====================================================

let selectedURL = null;



// =====================================================
// BUTTON EVENTS
// =====================================================

scanButton.addEventListener(
    "click",
    scanPage
);


scanAgainButton.addEventListener(
    "click",
    scanPage
);


retryButton.addEventListener(
    "click",
    scanPage
);



// =====================================================
// OPEN APPLICATION
// =====================================================

openButton.addEventListener(
    "click",
    function () {

        // Make sure we actually have a URL
        if (!selectedURL) {
            return;
        }


        // Open selected application
        // in a new Chrome tab.
        chrome.tabs.create({

            url: selectedURL

        });

    }
);



// =====================================================
// CHANGE UI STATE
// =====================================================

function showState(stateToShow) {

    // First hide EVERYTHING.

    idleState.classList.add("hidden");

    scanningState.classList.add("hidden");

    resultState.classList.add("hidden");

    errorState.classList.add("hidden");


    // Then show only the requested state.

    stateToShow.classList.remove("hidden");

}



// =====================================================
// MAIN SCANNING FUNCTION
// =====================================================

async function scanPage() {


    // ---------------------------------------------
    // Show loading screen
    // ---------------------------------------------

    showState(scanningState);


    try {


        // -----------------------------------------
        // Find active Chrome tab
        // -----------------------------------------

        const [tab] =
            await chrome.tabs.query({

                active: true,

                currentWindow: true

            });



        // Safety check

        if (!tab || !tab.id) {

            showState(errorState);

            return;

        }



        // -----------------------------------------
        // Execute scanner INSIDE webpage
        // -----------------------------------------

        const executionResults =
            await chrome.scripting.executeScript({

                target: {

                    tabId: tab.id

                },

                func: findApplicationLinks

            });



        // Get result returned by scanner

        const candidates =
            executionResults[0].result;



        // -----------------------------------------
        // Nothing found
        // -----------------------------------------

        if (
            !candidates ||
            candidates.length === 0
        ) {

            showState(errorState);

            return;

        }



        // -----------------------------------------
        // Display results
        // -----------------------------------------

        displayResults(candidates);


    }

    catch (error) {

        console.error(
            "ApplyDirect scan failed:",
            error
        );


        showState(errorState);

    }

}



// =====================================================
// DISPLAY RESULTS
// =====================================================

function displayResults(candidates) {


    // Clear previous secondary results

    otherLinks.innerHTML = "";



    // ---------------------------------------------
    // BEST RESULT
    // ---------------------------------------------

    const best =
        candidates[0];


    // Select best result automatically

    selectedURL =
        best.url;



    // Display link text

    bestLinkText.textContent =
        best.text || "Application Link";



    // Display only domain instead of giant URL

    bestLinkDomain.textContent =
        getDomain(best.url);



    // Store URL on card

    bestLinkCard.dataset.url =
        best.url;



    // ---------------------------------------------
    // OTHER RESULTS
    // ---------------------------------------------

    if (candidates.length > 1) {


        // Show section

        otherSection.classList.remove(
            "hidden"
        );


        // Candidate #2, #3 etc.

        for (
            let i = 1;
            i < candidates.length;
            i++
        ) {

            createOtherLink(
                candidates[i]
            );

        }

    }

    else {

        otherSection.classList.add(
            "hidden"
        );

    }



    // ---------------------------------------------
    // BEST CARD CLICK
    // ---------------------------------------------

    bestLinkCard.onclick =
        function () {

            selectLink(
                best.url,
                bestLinkCard
            );

        };



    // Make best selected visually

    selectLink(
        best.url,
        bestLinkCard
    );



    // Finally show result screen

    showState(resultState);

}



// =====================================================
// CREATE SECONDARY LINK
// =====================================================

function createOtherLink(candidate) {


    // Main row

    const card =
        document.createElement("div");


    card.className =
        "other-link";


    card.dataset.url =
        candidate.url;



    // ---------------------------------------------
    // ICON
    // ---------------------------------------------

    const icon =
        document.createElement("div");


    icon.className =
        "link-icon";


    icon.textContent =
        "↗";



    // ---------------------------------------------
    // TEXT AREA
    // ---------------------------------------------

    const info =
        document.createElement("div");


    info.className =
        "link-information";



    const title =
        document.createElement("div");


    title.className =
        "link-title";


    title.textContent =
        candidate.text ||
        "Possible application";



    const domain =
        document.createElement("div");


    domain.className =
        "link-domain";


    domain.textContent =
        getDomain(candidate.url);



    // Add title + domain

    info.appendChild(title);

    info.appendChild(domain);



    // ---------------------------------------------
    // BUILD CARD
    // ---------------------------------------------

    card.appendChild(icon);

    card.appendChild(info);



    // ---------------------------------------------
    // CLICK
    // ---------------------------------------------

    card.addEventListener(
        "click",

        function () {

            selectLink(
                candidate.url,
                card
            );

        }

    );



    // Add card to page

    otherLinks.appendChild(card);

}



// =====================================================
// SELECT APPLICATION LINK
// =====================================================

function selectLink(url, selectedCard) {


    // Save selected URL

    selectedURL = url;



    // Remove selected state
    // from every possible card.

    const cards =
        document.querySelectorAll(
            ".link-card, .other-link"
        );


    cards.forEach(
        function (card) {

            card.classList.remove(
                "selected"
            );

        }
    );



    // Highlight selected card

    selectedCard.classList.add(
        "selected"
    );

}



// =====================================================
// GET DOMAIN FROM URL
//
// Example:
//
// https://jobs.lever.co/google/123
//
// becomes:
//
// jobs.lever.co
// =====================================================

function getDomain(url) {

    try {

        return new URL(url).hostname;

    }

    catch (error) {

        return url;

    }

}



// =====================================================
// =====================================================
//
//        WEBPAGE SCANNING ALGORITHM
//
// This entire function runs INSIDE
// the job webpage.
//
// =====================================================
// =====================================================

function findApplicationLinks() {


    // =================================================
    // TEXT SIGNALS
    // =================================================


    const strongKeywords = [

        "apply now",
        "apply here",
        "apply link",
        "apply for this job",
        "apply for this position",
        "submit application",
        "start application",
        "continue to apply",
        "apply on company site",
        "apply on company website",
        "apply on official portal"

    ];



    const mediumKeywords = [

        "apply",
        "application",
        "view job",
        "view opening",
        "job opening",
        "view position",
        "company careers",
        "career page",
        "company website",
        "view opportunity"

    ];



    const weakKeywords = [

        "continue",
        "proceed",
        "visit website",
        "learn more",
        "read more",
        "click here"

    ];



    // =================================================
    // KNOWN ATS PLATFORMS
    // =================================================

    const atsDomains = [

        "greenhouse.io",
        "lever.co",
        "myworkdayjobs.com",
        "workday.com",
        "ashbyhq.com",
        "smartrecruiters.com",
        "icims.com",
        "jobvite.com",
        "bamboohr.com",
        "workable.com",
        "successfactors.com"

    ];



    // =================================================
    // JOB URL PATTERNS
    // =================================================

    const jobURLKeywords = [

        "/jobs/",
        "/job/",
        "/careers/",
        "/career/",
        "/apply/",
        "/application/",
        "/positions/",
        "/position/",
        "/openings/",
        "/opportunities/"

    ];



    // =================================================
    // GET ALL LINKS
    // =================================================

    const links =
        document.querySelectorAll(
            "a[href]"
        );


    const candidates = [];


    const currentURL =
        window.location.href;


    const currentDomain =
        window.location.hostname;



    // =================================================
    // ANALYZE EVERY LINK
    // =================================================

    for (const link of links) {


        // Visible text

        const originalText =
            link.innerText.trim();


        const text =
            originalText.toLowerCase();


        // Destination

        const url =
            link.href;



        // Ignore invalid URLs

        if (!url) {
            continue;
        }


        if (
            url.startsWith("javascript:")
        ) {
            continue;
        }



        // =================================================
        // START SCORE
        // =================================================

        let score = 0;



        // =================================================
        // STRONG KEYWORDS
        // =================================================

        for (
            const keyword of strongKeywords
        ) {

            if (
                text.includes(keyword)
            ) {

                score += 30;

                break;

            }

        }



        // =================================================
        // MEDIUM KEYWORDS
        // =================================================

        for (
            const keyword of mediumKeywords
        ) {

            if (
                text.includes(keyword)
            ) {

                score += 15;

                break;

            }

        }



        // =================================================
        // WEAK KEYWORDS
        // =================================================

        for (
            const keyword of weakKeywords
        ) {

            if (
                text.includes(keyword)
            ) {

                score += 5;

                break;

            }

        }



        const lowerURL =
            url.toLowerCase();



        // =================================================
        // ATS DOMAIN
        // =================================================

        for (
            const domain of atsDomains
        ) {

            if (
                lowerURL.includes(domain)
            ) {

                score += 40;

                break;

            }

        }



        // =================================================
        // JOB URL
        // =================================================

        for (
            const keyword of jobURLKeywords
        ) {

            if (
                lowerURL.includes(keyword)
            ) {

                score += 15;

                break;

            }

        }



        // =================================================
        // EXTERNAL DOMAIN
        // =================================================

        try {

            const candidateDomain =
                new URL(url).hostname;


            if (
                candidateDomain !==
                currentDomain
            ) {

                score += 10;

            }

        }

        catch (error) {

            continue;

        }



        // =================================================
        // SAME PAGE PENALTY
        // =================================================

        if (
            url === currentURL
        ) {

            score -= 50;

        }



        // =================================================
        // LONG HEADING PENALTY
        // =================================================

        if (
            originalText.length > 60
        ) {

            score -= 15;

        }



        // =================================================
        // KEEP ONLY USEFUL CANDIDATES
        // =================================================

        if (
            score > 0
        ) {

            candidates.push({

                text:
                    originalText ||
                    "Application Link",

                url:
                    url,

                score:
                    score

            });

        }

    }



    // =================================================
    // REMOVE DUPLICATES
    // =================================================

    const uniqueCandidates = [];

    const seenURLs =
        new Set();



    for (
        const candidate of candidates
    ) {

        if (
            !seenURLs.has(
                candidate.url
            )
        ) {

            seenURLs.add(
                candidate.url
            );


            uniqueCandidates.push(
                candidate
            );

        }

    }



    // =================================================
    // SORT BEST → WORST
    // =================================================

    uniqueCandidates.sort(

        function (a, b) {

            return (
                b.score -
                a.score
            );

        }

    );



    // Return best 3

    return uniqueCandidates.slice(
        0,
        3
    );

}