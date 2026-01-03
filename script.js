// Queue data Storing
let queue = [];
let tokenCounter = 1;

// Generation of New Token
function generateToken(){
    const token = tokenCounter;
    queue.push(token);
    tokenCounter++;

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