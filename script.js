let queue = JSON.parse(localStorage.getItem("queue")) || [];
let tokenCounter = parseInt(localStorage.getItem("tokenCounter")) || 1;

function saveToLocalStorage() {
    localStorage.setItem("queue", JSON.stringify(queue));
    localStorage.setItem("tokenCounter", tokenCounter);
}

//===================================================================================================
//Screen toggle functions
function showUserScreen() {
    document.getElementById("userScreen").style.display = "block";
    document.getElementById("adminScreen").style.display = "none";
}

function showAdminScreen() {
    document.getElementById("userScreen").style.display = "none";
    document.getElementById("adminScreen").style.display = "block";
}

//===================================================================================================
// Generation of New Token
function generateToken(){
    const token = tokenCounter;
    queue.push(token);
    tokenCounter++;

    saveToLocalStorage();

    document.getElementById("userToken").textContent = token;

    updateQueueUI();
    updateCurrentTokenUI();
}

//===================================================================================================
// Function of serving next token in (first-in, first-out manner)
function serveNext() {
    if (queue.length === 0) {
        console.log("No tokens in queue.");
        return;
    }

    const servedToken = queue.shift();
    saveToLocalStorage();

    updateQueueUI();
    updateCurrentTokenUI();
}

//===================================================================================================
// Function for reseting the queue
function resetQueue() {
    if (!confirm("Are you sure you want to reset the queue?")) {
        return;
    }

    queue = [];
    tokenCounter = 1;

    localStorage.removeItem("queue");
    localStorage.removeItem("tokenCounter");

    updateQueueUI();
    updateCurrentTokenUI();

    document.getElementById("userToken").textContent = "None";

    console.log("Queue has been reset successfully.");
}

//===================================================================================================
// Function for updating UI
function updateCurrentTokenUI() {
    const currentTokenElement = document.getElementById("currentToken");

    if (queue.length === 0) {
        currentTokenElement.textContent = "None";
    } else {
        currentTokenElement.textContent = queue[0];
    }
}

function updateQueueUI() {
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = "";

    queue.forEach(token => {
        const li = document.createElement("li");
        li.textContent = `Token ${token}`;
        queueList.appendChild(li);
    });
}

//===================================================================================================

updateQueueUI();
updateCurrentTokenUI();
showUserScreen(); // default view
