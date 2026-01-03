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
// User Form Handling
const userForm = document.getElementById('userForm');

const nameInput = document.getElementById('name');
const nameMessage = document.getElementById('nameMessage');

const contactInput = document.getElementById('contact');
const contactMessage = document.getElementById('contactMessage');

// Name validation with real-time message
nameInput.addEventListener('input', () => {
    // Allow only alphabets & space
    nameInput.value = nameInput.value.replace(/[^a-zA-Z ]/g, '');

    // Auto-capitalize
    const words = nameInput.value.split(' ');
    for (let i = 0; i < words.length; i++) {
        if (words[i]) {
            words[i] =
                words[i][0].toUpperCase() +
                words[i].slice(1).toLowerCase();
        }
    }
    nameInput.value = words.join(' ');

    // Max 30 characters
    if (nameInput.value.length > 30) {
        nameInput.value = nameInput.value.slice(0, 30);
    }

    // Green info message
    if (nameInput.value.length > 0) {
        nameMessage.textContent = "Max 30 characters";
        nameMessage.className = "valid";
    } else {
        nameMessage.textContent = "";
        nameMessage.className = "";
    }
});


//---------------------------------------------------------------------------------------------------

// Contact validation with real-time message
contactInput.addEventListener('input', () => {
    // Digits only
    contactInput.value = contactInput.value.replace(/\D/g, '');

    // Max 10 digits
    if (contactInput.value.length > 10) {
        contactInput.value = contactInput.value.slice(0, 10);
    }

    // No message before typing
    if (contactInput.value.length === 0) {
        contactMessage.textContent = "";
        contactMessage.className = "";
        return;
    }

    // Real-time validation
    if (contactInput.value.length === 10) {
        contactMessage.textContent = "Valid contact number";
        contactMessage.className = "valid";
    } else {
        contactMessage.textContent = "Invalid contact number";
        contactMessage.className = "invalid";
    }
});

//===================================================================================================
updateQueueUI();
updateCurrentTokenUI();
showUserScreen(); 
