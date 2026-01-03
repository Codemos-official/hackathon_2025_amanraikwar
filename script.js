let queue = JSON.parse(localStorage.getItem("queue")) || [];
let tokenCounter = parseInt(localStorage.getItem("tokenCounter")) || 1;

function saveToLocalStorage() {
    localStorage.setItem("queue", JSON.stringify(queue));
    localStorage.setItem("tokenCounter", tokenCounter);
}

// Generation of New Token
function generateToken(){
    const token = tokenCounter;
    queue.push(token);
    tokenCounter++;

    saveToLocalStorage();

    console.log("Token Generated : ", token);
    console.log("Queue : ", queue);
}

// Function of serving next token in (first-in, first-out manner)
function serveNext() {
    if (queue.length === 0) {
        console.log("No tokens in queue.");
        return;
    }

    const servedToken = queue.shift();
    saveToLocalStorage();

    console.log("Serving Token : ", servedToken);
    console.log("Updated Queue : ", queue);
}

// Function to check who is currently being served
function getCurrentToken() {
    if (queue.length === 0) {
        console.log("No active token.");
        return;
    }

    console.log("Current Token:", queue[0]);
}

// Function for reseting the queue
function resetQueue() {
    queue = [];
    tokenCounter = 1;
    saveToLocalStorage();

    console.log("Queue reset successfully.");
}


console.log("Queue loaded from LocalStorage:", queue);
