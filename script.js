//===================================================================================================
// Initialize queue arrays
let queueData = JSON.parse(localStorage.getItem("queueData")) || [];
let tokenCounter = parseInt(localStorage.getItem("tokenCounter")) || 1;

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("queueData", JSON.stringify(queueData));
    localStorage.setItem("tokenCounter", tokenCounter);
}

//===================================================================================================
// Screen toggle
function showUserScreen() {
    document.getElementById("userScreen").style.display = "block";
    document.getElementById("adminScreen").style.display = "none";
}

function showAdminScreen() {
    document.getElementById("userScreen").style.display = "none";
    document.getElementById("adminScreen").style.display = "block";
}

//===================================================================================================
// Generate Token
function generateToken(userName, userContact) {
    const token = tokenCounter;
    queueData.push({ token: token, name: userName, contact: userContact });

    tokenCounter++;
    saveToLocalStorage();

    // Update user screen
    document.getElementById("userToken").textContent = token;

    // Update admin UI
    updateAdminTable();

    // Save current user data for waiting page
    localStorage.setItem("currentUserToken", token);            
    localStorage.setItem("currentQueueSnapshot", JSON.stringify(queueData)); // snapshot of queue at this moment

    // Redirect user to waiting page
    const thankYouDiv = document.getElementById("thankYouMessage");
    thankYouDiv.style.display = "block";    

    // Hide the form
    userForm.style.display = "none";

    // show back Button
    backBtn.style.display = "inline-block";

}

//===================================================================================================
// Serve Next Token
function serveNext() {
    if (queueData.length === 0) {
        alert("No tokens in queue.");
        return;
    }

    // Remove first user
    queueData.shift();
    saveToLocalStorage();

    // Update admin UI
    updateAdminTable();
}

//===================================================================================================
// Reset Queue
function resetQueue() {
    if (!confirm("Are you sure you want to reset the queue?")) return;

    queueData = [];
    tokenCounter = 1;
    saveToLocalStorage();

    document.getElementById("userToken").textContent = "None";
    updateAdminTable();
}

//===================================================================================================
// Update Admin Table
function updateAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    tbody.innerHTML = "";

    queueData.forEach(item => {
        const tr = document.createElement("tr");

        const tdToken = document.createElement("td");
        tdToken.textContent = item.token;

        const tdName = document.createElement("td");
        tdName.textContent = item.name;

        const tdContact = document.createElement("td");
        tdContact.textContent = item.contact;

        tr.appendChild(tdToken);
        tr.appendChild(tdName);
        tr.appendChild(tdContact);

        tbody.appendChild(tr);
    });
}

//===================================================================================================
// User Form Handling
const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const contactInput = document.getElementById("contact");
const contactMessage = document.getElementById("contactMessage");

// Name Real-time validation
nameInput.addEventListener("input", () => {
    const originalValue = nameInput.value;

    // Only alphabets and spaces
    nameInput.value = nameInput.value.replace(/[^a-zA-Z ]/g, "");

    // Auto capitalize
    const words = nameInput.value.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i]) words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
    }
    nameInput.value = words.join(" ");

    // Max 30 chars
    if (nameInput.value.length > 30) nameInput.value = nameInput.value.slice(0, 30);

    // Real-time message below input
    if (nameInput.value.length > 0) {
        nameMessage.textContent = "Max 30 characters";
        nameMessage.className = "valid";
    } else {
        nameMessage.textContent = "";
        nameMessage.className = "";
    }
});

// Contact Real-time validation
contactInput.addEventListener("input", () => {
    contactInput.value = contactInput.value.replace(/\D/g, "");

    if (contactInput.value.length > 10) contactInput.value = contactInput.value.slice(0, 10);

    if (contactInput.value.length === 10) {
        contactMessage.textContent = "Valid contact number";
        contactMessage.className = "valid";
    } else if (contactInput.value.length === 0) {
        contactMessage.textContent = "";
        contactMessage.className = "";
    } else {
        contactMessage.textContent = "Invalid contact number";
        contactMessage.className = "invalid";
    }
});

// Form Submit
userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const contact = contactInput.value.trim();

    // Validate name
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    // Validate contact length
    if (contact.length !== 10) {
        contactMessage.textContent = "Please enter a valid 10-digit contact number";
        contactMessage.className = "invalid";
        contactInput.focus();
        return;
    } else {
        // Show green valid message on submit
        contactMessage.textContent = "Valid contact number";
        contactMessage.className = "valid";
    }

    // Generate token
    generateToken(name, contact);

    // Reset form
    userForm.reset();
    contactMessage.textContent = "";
    nameInput.style.borderColor = "";
});


//===================================================================================================
// Initialize
updateAdminTable();
showUserScreen();

//===================================================================================================
// Redirect to Waiting Page Button
const goToWaitingBtn = document.getElementById("goToWaiting");

goToWaitingBtn.addEventListener("click", () => {
    const currentToken = localStorage.getItem("currentUserToken");

    if (!currentToken) {
        alert("You don’t have a token yet. Please generate a token first.");
        return;
    }

    window.location.href = "waiting.html";
});

//===================================================================================================
// Back Button
const backBtn = document.getElementById("backToForm");

backBtn.addEventListener("click", () => {
    // Show form again
    userForm.style.display = "block";

    // Hide thank you message
    const thankYouDiv = document.getElementById("thankYouMessage");
    thankYouDiv.style.display = "none";

    // Hide Go to Waiting Page button
    goToWaitingBtn.style.display = "none";

    // Hide Back button itself
    backBtn.style.display = "none";
});

//===================================================================================================
// Open Admin Screen directly if redirected from waiting page
if (localStorage.getItem("openAdminScreen") === "true") {
    showAdminScreen();
    localStorage.removeItem("openAdminScreen");
}

//===================================================================================================
// Open Waiting List
function openWaitingList() {
    window.location.href = "waiting.html";
}

