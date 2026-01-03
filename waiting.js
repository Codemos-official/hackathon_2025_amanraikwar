//===================================================================================================
// Constants & State
const yourToken = parseInt(localStorage.getItem("currentUserToken"));
const AVERAGE_TIME_PER_TOKEN = 2; // minutes per token

let countdownInterval = null;
let remainingSeconds = 0;
let lastUserIndex = null;

//===================================================================================================
// DOM Elements
const yourTokenSpan = document.getElementById("yourToken");
const tokensAheadList = document.getElementById("tokensAhead");
const estimatedTimeSpan = document.getElementById("estimatedTime");
const adminRedirectBtn = document.getElementById("adminRedirectBtn");

//===================================================================================================
// Initialize
yourTokenSpan.textContent = yourToken || "None";
updateQueueView();

// Refresh queue status every 5 seconds
setInterval(updateQueueView, 5000);

//===================================================================================================
// Admin Redirect
document.getElementById("adminRedirectBtn").addEventListener("click", function () {
    localStorage.setItem("openAdminScreen", "true");
    window.location.href = "./index.html";
});

//===================================================================================================
// Main Queue Update Logic
function updateQueueView() {
    const queueData = getQueueData();
    tokensAheadList.innerHTML = "";

    if (!yourToken) {
        estimatedTimeSpan.textContent = "No token found";
        stopCountdown();
        return;
    }

    const userIndex = getUserIndex(queueData);

    // Token already served or being served
    if (userIndex === -1) {
        showServingStatus();
        stopCountdown();
        lastUserIndex = null;
        return;
    }

    showTokensBeforeUser(queueData, userIndex);
    showUserToken();

    // Start countdown ONLY if position changed
    if (lastUserIndex === null || userIndex !== lastUserIndex) {
        startCountdown(userIndex);
    }

    lastUserIndex = userIndex;
}

//===================================================================================================
// Countdown Timer Logic
function startCountdown(tokensAhead) {
    stopCountdown();

    remainingSeconds = tokensAhead * AVERAGE_TIME_PER_TOKEN * 60;

    if (remainingSeconds <= 0) {
        estimatedTimeSpan.textContent = "Now";
        return;
    }

    updateCountdownUI();

    countdownInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            estimatedTimeSpan.textContent = "Now";
            stopCountdown();
            return;
        }

        remainingSeconds--;
        updateCountdownUI();
    }, 1000);
}

function updateCountdownUI() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    estimatedTimeSpan.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

//===================================================================================================
// Queue Helpers
function getQueueData() {
    return JSON.parse(localStorage.getItem("queueData")) || [];
}

function getUserIndex(queueData) {
    return queueData.findIndex(item => item.token === yourToken);
}

//===================================================================================================
// UI Rendering
function showTokensBeforeUser(queueData, userIndex) {
    for (let i = 0; i < userIndex; i++) {
        const li = document.createElement("li");
        li.textContent = `Token ${queueData[i].token}`;
        tokensAheadList.appendChild(li);
    }
}

function showUserToken() {
    const li = document.createElement("li");
    li.textContent = `👉 Token ${yourToken} (You)`;
    li.style.fontWeight = "bold";
    li.style.color = "#007bff";
    tokensAheadList.appendChild(li);
}

function showServingStatus() {
    const li = document.createElement("li");
    li.textContent = "🎉 Your token is being served now";
    li.style.fontWeight = "bold";
    li.style.color = "green";
    tokensAheadList.appendChild(li);

    estimatedTimeSpan.textContent = "Now";
}
