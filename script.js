// ==========================
// STORAGE HANDLER (LocalStorage)
// ==========================
const Storage = {
    saveData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    getData: (key) => JSON.parse(localStorage.getItem(key)) || [],
};

// ==========================
// PAGE INITIALISATION (ON LOAD ----> Event Listener)
// ==========================

// Load tickets automatically based on the current page (filter by status if needed)
document.addEventListener("DOMContentLoaded", function () {
    // Get page type from HTML data attribute (e.g. data-page="completed")
    const page = document.body.dataset.page;

    // Load tickets based on page status
    if (page === "completed") {
        loadTickets("Completed");
    }
    else if (page === "in-progress") {
        loadTickets("In Progress");
    }
    else if (page === "overdue") {
        loadTickets("Overdue");
    }
    else {
        // Default: load all tickets
        loadTickets();
    }
});

// ==========================
// DROPDOWN & DATA INITIALISATION
// ==========================

// Load users into developer dropdown when page loads
document.addEventListener("DOMContentLoaded", loadUsersToDropdown);

// Load projects into project dropdown when page loads
document.addEventListener("DOMContentLoaded", loadProjectsToDropdown);

// Load all projects into the projects page display
document.addEventListener("DOMContentLoaded", loadProjects);

document.addEventListener("DOMContentLoaded", function () {
    // Load searched tickets
    const ticketSearch = document.getElementById("searchTicketInput");
    if (ticketSearch) {
        ticketSearch.addEventListener("input", searchTickets);
    }
    // Load searched projects
    const projectSearch = document.getElementById("searchProjectInput");
    if (projectSearch) {
        projectSearch.addEventListener("input", searchProjects);
    }
});

// Load edit ticket
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("ticket-summary")) {
        editTicket();
    }
});

// clear ticket
document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("ticket-summary")) {
        localStorage.removeItem("editTicketId");
        return;
    }

    editTicket();
});

// Load edit project
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("project-name")) {
        editProject();
    }
});

// clear project
document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("project-name")) {
        localStorage.removeItem("editProjectId");
        return;
    }
    editProject();
});

// Load view ticket
document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.page === "view-ticket") {
        LoadViewTicket();
    }
});

// Load view Project
document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.page === "view-project") {
        loadViewProject();
    }
});


// ==========================
// LOGIN PROTECTION
// ==========================

// Check if user is logged in before allowing access to page
document.addEventListener("DOMContentLoaded", checkLogin);

// ==========================
// CONSTRUCTOR FUNCTIONS (Data Models)
// ==========================

// User model
function User(id, name, surname, username, password, email) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
    this.email = email;
}

// Project model
function Project(id, name, summary, description) {
    this.id = id;
    this.name = name;
    this.summary = summary;
    this.description = description;
    this.status = "Active";
    this.ticketCount = 0;
}

// Ticket model
function Ticket(summary, description, reporter, date, project, developer, status) {
    this.summary = summary;
    this.description = description;
    this.reporter = reporter;
    this.date = date;
    this.project = project;
    this.developer = developer;
    this.status = status;
    this.id = new Date(date).getTime(); // unique ID
}

// Create a new user and save it to storage
// ==========================
// CREATE USER
// ==========================

// Creates a new user and saves them to localStorage
function createUser() {
    // Get input values from the form and remove extra spaces
    const id = document.getElementById("user-id").value.trim();
    const name = document.getElementById("user-name").value.trim();
    const surname = document.getElementById("user-surname").value.trim();
    const username = document.getElementById("user-username").value.trim();
    const password = document.getElementById("user-password").value.trim();
    const confirmPassword = document.getElementById("user-confirm-password").value.trim();
    const email = document.getElementById("user-email").value.trim();

    // Validate that all fields are filled in
    if (!id || !name || !surname || !username || !password || !confirmPassword || !email) {
        alert("Please fill in all fields.");
        return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Load existing users from storage
    let users = Storage.getData("users");

    // Check for duplicate user ID
    const duplicateId = users.some(user => user.id === id);

    // Check for duplicate username (case-insensitive)
    const duplicateUsername = users.some(user => user.username.toLowerCase() === username.toLowerCase());

    // Check for duplicate email (case-insensitive)
    const duplicateEmail = users.some(user => user.email.toLowerCase() === email.toLowerCase());

    // Stop if ID already exists
    if (duplicateId) {
        alert("A user with this ID already exists.");
        return;
    }

    // Stop if username already exists
    if (duplicateUsername) {
        alert("Username already exists.");
        return;
    }

    // Stop if email already exists
    if (duplicateEmail) {
        alert("Email already exists.");
        return;
    }

    // Create new User object
    const newUser = new User(id, name, surname, username, password, email);

    // Add new user to array
    users.push(newUser);

    // Save updated users list to localStorage
    Storage.saveData("users", users);

    // Confirm successful creation
    alert("User created successfully.");

    // Clear the form fields
    clearUserForm();
}

// Reset the user creation form fields
function clearUserForm() {
    document.getElementById("user-id").value = "";
    document.getElementById("user-name").value = "";
    document.getElementById("user-surname").value = "";
    document.getElementById("user-username").value = "";
    document.getElementById("user-password").value = "";
    document.getElementById("user-confirm-password").value = "";
    document.getElementById("user-email").value = "";
}

// ==========================
// CREATE PROJECT
// ==========================

// Creates a new project and saves it to localStorage
function createProject() {
    const id = document.getElementById("project-id").value.trim();
    const name = document.getElementById("project-name").value.trim();
    const summary = document.getElementById("project-summary").value.trim();
    const description = document.getElementById("project-description").value.trim();

    if (!id || !name || !summary || !description) {
        alert("Please fill in all fields.");
        return;
    }

    let projects = Storage.getData("projects");
    let editId = Storage.getData("editProjectId");

    if (editId) {
        // ======================
        // UPDATE PROJECT
        // ======================
        let project = projects.find(p => p.id === editId);

        if (!project) {
            alert("Project not found.");
            return;
        }

        project.name = name;
        project.summary = summary;
        project.description = description;

        Storage.saveData("projects", projects);

        localStorage.removeItem("editProjectId");

        alert("Project updated successfully.");
    } else {
        // ======================
        // CREATE PROJECT
        // ======================
        const duplicateId = projects.some(p => p.id === id);
        const duplicateName = projects.some(p => p.name.toLowerCase() === name.toLowerCase());

        if (duplicateId) {
            alert("Project ID already exists.");
            return;
        }

        if (duplicateName) {
            alert("Project name already exists.");
            return;
        }

        const newProject = new Project(id, name, summary, description);
        projects.push(newProject);
        Storage.saveData("projects", projects);

        alert("Project created successfully.");
    }

    clearProjectForm();
}

// Reset the project creation form fields
function clearProjectForm() {
    document.getElementById("project-id").value = "";
    document.getElementById("project-name").value = "";
    document.getElementById("project-summary").value = "";
    document.getElementById("project-description").value = "";
}


// ==========================
// TICKET FUNCTIONS
// ==========================

function createTicket() {
    const summary = document.getElementById("ticket-summary").value.trim();
    const description = document.getElementById("ticket-description").value.trim();
    const reporter = document.getElementById("ticket-reporter").value.trim();
    const date = document.getElementById("ticket-date").value.trim();
    const project = document.getElementById("ticket-project").value.trim();
    const developer = document.getElementById("ticket-developer").value.trim();

    // Safe status check
    let statusElement = document.querySelector('input[name="status"]:checked');

    if (!statusElement) {
        alert("Please select a status.");
        return;
    }

    const status = statusElement.value.trim();

    // Validate all fields
    if (!summary || !description || !reporter || !date || !project || !developer) {
        alert("Please fill in all fields.");
        return;
    }

    let tickets = Storage.getData("tickets");
    let editId = Storage.getData("editTicketId");

    if (editId) {
        // UPDATE EXISTING TICKET
        let ticket = tickets.find(t => t.id === editId);

        if (!ticket) {
            alert("Ticket not found.");
            return;
        }

        ticket.summary = summary;
        ticket.description = description;
        ticket.reporter = reporter;
        ticket.date = date;
        ticket.project = project;
        ticket.developer = developer;
        ticket.status = status;

        Storage.saveData("tickets", tickets);

        // Clear edit mode
        localStorage.removeItem("editTicketId");

        alert("Ticket updated successfully.");
    } else {
        // CREATE NEW TICKET
        const newTicket = new Ticket(summary, description, reporter, date, project, developer, status);

        tickets.push(newTicket);
        Storage.saveData("tickets", tickets);

        alert("Ticket created successfully.");
    }

    clearTicketForm();
}

// Reset the ticket creation form fields
function clearTicketForm() {
    const summary = document.getElementById("ticket-summary");
    const description = document.getElementById("ticket-description");
    const reporter = document.getElementById("ticket-reporter");
    const date = document.getElementById("ticket-date");
    const project = document.getElementById("ticket-project");
    const developer = document.getElementById("ticket-developer");

    if (summary) summary.value = "";
    if (description) description.value = "";
    if (reporter) reporter.value = "";
    if (date) date.value = "";
    if (project) project.value = "";
    if (developer) developer.value = "";

    const checked = document.querySelector('input[name="status"]:checked');
    if (checked) checked.checked = false;
}

// ==========================
// TICKET DISPLAY
// ==========================

// Loads tickets and displays them on the page
// Optionally filters tickets by status (e.g. "Completed", "In Progress", etc.)
function loadTickets(filterStatus = null) {
    // Retrieve all tickets from localStorage
    let tickets = Storage.getData("tickets");

    // Get the container where tickets will be displayed
    const container = document.getElementById("ticket-container");

    if (!container) {
        return;
    }

    // Clear existing content before rendering
    container.innerHTML = "";

    // If a status filter is applied, filter tickets accordingly
    if (filterStatus) {
        tickets = tickets.filter(ticket =>
            ticket.status.trim().toLowerCase() === filterStatus.trim().toLowerCase()
        );
    }

    // If no tickets exist after filtering, show message and stop
    if (tickets.length === 0) {
        container.innerHTML = "<p style='padding:10px;'>No tickets found.</p>";
        return;
    }

    // Loop through each ticket and create UI row
    tickets.forEach(ticket => {

        // Create profile objects for reporter and developer
        const reporterProfile = createProfile(ticket.reporter);
        const developerProfile = createProfile(ticket.developer);

        // Create a new row element for the ticket
        const row = document.createElement("div");
        row.classList.add("ticket-row");

        // Build ticket display layout
        row.innerHTML = `
            <div>${ticket.summary}</div>

            <div>
                <div class="small-avatar" style="background:${reporterProfile.color}">
                    ${reporterProfile.initials}
                </div>
                ${reporterProfile.name}
            </div>

            <div>
                <div class="small-avatar" style="background:${developerProfile.color}">
                    ${developerProfile.initials}
                </div>
                ${developerProfile.name}
            </div>

            <div>${ticket.status}</div>

            <div><span class="btn btn-blue" onclick=saveEditTicketID(${ticket.id})>Edit</span></div>
            <div><span class="btn btn-blue" onclick="viewTicket(${ticket.id})">View</span></div>
        `;

        // Add ticket row to container
        container.appendChild(row);
    });
}

// ==========================
// PROJECT DISPLAY
// ==========================

// Loads all projects and displays them with their related ticket counts
function loadProjects() {
    // Get all projects from localStorage
    let projects = Storage.getData("projects");

    // Get all tickets from localStorage
    let tickets = Storage.getData("tickets");

    // Get the container where projects will be displayed
    const container = document.getElementById("project-container");

    if (!container) {
        return;
    }

    // Clear existing content before rendering
    container.innerHTML = "";

    // If no projects exist, show message and stop function
    if (projects.length === 0) {
        container.innerHTML = "<p style='padding:10px;'>No projects found.</p>";
        return;
    }

    // Loop through each project
    projects.forEach(project => {

        // Count how many tickets belong to this project
        const ticketCount = tickets.filter(ticket =>
            ticket.project.toLowerCase() === project.name.toLowerCase()
        ).length;

        // Create a new row element for the project
        const row = document.createElement("div");
        row.classList.add("ticket-row");

        // Fill row with project data and ticket count
        row.innerHTML = `
            <div>${project.name}</div>
            <div>${project.id}</div>
            <div>${ticketCount}</div>
            <div>${project.status}</div>
            <div><span class="btn btn-blue" onclick="saveEditProjectID('${project.id}')">Edit</span></div>
            <div><span class="btn btn-blue" onclick="viewProject('${project.id}')">View</span></div>
        `;

        // Add row to the container
        container.appendChild(row);
    });
}


// ==========================
// CREATE PROFILE
// ==========================

// Creates a visual profile object (name, initials, color) from a full name string
function createProfile(name) {
    // Split full name into first and last name parts
    const parts = name.trim().split(" ");

    const firstName = parts[0];
    const lastName = parts[1];

    // Create initials from first letters of first and last name
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

    // Get or generate a consistent color for this user
    const color = getUserColor(name);

    // Return profile object used for UI display
    return {
        name: firstName + " " + lastName,
        initials: initials,
        color: color
    };
}


// ==========================
// USER COLOR ASSIGNMENT
// ==========================

// Assigns a unique persistent color to each user using localStorage
function getUserColor(name) {
    // Retrieve stored user colors or create empty object if none exist
    let userColors = JSON.parse(localStorage.getItem("userColors")) || {};

    // If user already has a saved color, return it
    if (userColors[name]) {
        return userColors[name];
    }

    // Available color options for new users
    const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#FFD93D",
        "#6C5CE7",
        "#00B894",
        "#E17055",
        "#0984E3"
    ];

    // Pick a random color from the list
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Save the assigned color for future use
    userColors[name] = color;
    localStorage.setItem("userColors", JSON.stringify(userColors));

    // Return the assigned color
    return color;
}

// ==========================
// USER DROPDOWN
// ==========================

// Loads all users from localStorage and fills the developer dropdown
function loadUsersToDropdown() {
    let users = Storage.getData("users");

    // Get the dropdown element for selecting a developer
    const dropdown = document.getElementById("ticket-developer");
    if (!dropdown) {
        return;
    }

    // Clear any existing options
    dropdown.innerHTML = "";

    // Create default placeholder option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Developer";
    defaultOption.disabled = true; // cannot be selected
    defaultOption.selected = true; // shown by default
    dropdown.appendChild(defaultOption);

    // Loop through users and add each one as a dropdown option
    users.forEach(user => {
        const option = document.createElement("option");

        // Set full name as both value and display text
        option.value = user.name + " " + user.surname;
        option.textContent = user.name + " " + user.surname;

        // Add option to dropdown
        dropdown.appendChild(option);
    });
}

// ==========================
// PROJECT DROPDOWN
// ==========================

// Loads all projects from localStorage into the project dropdown menu
function loadProjectsToDropdown() {
    // Get projects from storage (fallback to empty array if none exist)
    let projects = Storage.getData("projects") || [];

    // Get the dropdown element
    const dropdown = document.getElementById("ticket-project");

    if (!dropdown) {
        return;
    }

    // Clear existing dropdown options
    dropdown.innerHTML = "";

    // Create and add default placeholder option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Project";
    defaultOption.disabled = true; // cannot be selected
    defaultOption.selected = true; // shown by default
    dropdown.appendChild(defaultOption);

    // Loop through all projects and add them as options
    projects.forEach(project => {
        const option = document.createElement("option");
        
        // Use project name as both value and display text
        option.value = project.name;
        option.textContent = project.name;

        // Add option to dropdown
        dropdown.appendChild(option);
    });
}

// ==========================
// LOGIN FUNCTION
// ==========================
// Checks username + password and logs user in if correct
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate input fields
    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    // Hardcoded admin login check
    if (username === "admin" && password === "admin") {
        // Save login state in localStorage
        Storage.saveData("loggedIn", true);

        // Redirect to main page
        window.location.href = "view-all.html";
    } else {
        // Wrong credentials message
        alert("Incorrect username or password.");
    }
}

// ==========================
// LOGIN PROTECTION (GUARD)
// ==========================
// Prevents users from accessing pages without logging in
function checkLogin() {
    // Get login state from storage
    const loggedIn = Storage.getData("loggedIn");

    // Don't run redirect logic on login page itself
    if (window.location.pathname.includes("login.html")) {
        Storage.saveData("loggedIn", false);
        return;
    }

    // If not logged in, force redirect to login page
    if (loggedIn !== true) {
        Storage.saveData("loggedIn", false);
        window.location.href = "login.html";
    }
}


// ==========================
// CLEAR LOGIN FORM
// ==========================
// Resets username + password inputs
function clearLogin() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function searchTickets() {
    let tickets = Storage.getData("tickets");
    const searchValue = document.getElementById("searchTicketInput").value.toLowerCase();
    const page = document.body.dataset.page;

    const container = document.getElementById("ticket-container");

    if (!searchValue || !container) {
        return;
    }

    container.innerHTML = "";

    // Apply page filter 
    if (page === "completed") {
        tickets = tickets.filter(ticket =>
            ticket.status.toLowerCase().includes("completed")
        );
    }
    else if (page === "in-progress") {
        tickets = tickets.filter(ticket =>
            ticket.status.toLowerCase().includes("in progress")
        );
    }
    else if (page === "overdue") {
        tickets = tickets.filter(ticket =>
            ticket.status.toLowerCase().includes("overdue")
        );
    }

    // Apply search filter
    let filteredTickets = tickets.filter(ticket =>
        ticket.summary.toLowerCase().includes(searchValue) ||
        ticket.description.toLowerCase().includes(searchValue) ||
        ticket.reporter.toLowerCase().includes(searchValue) ||
        ticket.developer.toLowerCase().includes(searchValue) ||
        ticket.status.toLowerCase().includes(searchValue)
    );

    if (filteredTickets.length === 0) {
        container.innerHTML = "<p style='padding:10px;'>No tickets found.</p>";
        return;
    }

    filteredTickets.forEach(ticket => {
        const reporterProfile = createProfile(ticket.reporter);
        const developerProfile = createProfile(ticket.developer);

        const row = document.createElement("div");
        row.classList.add("ticket-row");

        row.innerHTML = `
            <div>${ticket.summary}</div>

            <div>
                <div class="small-avatar" style="background:${reporterProfile.color}">
                    ${reporterProfile.initials}
                </div>
                ${reporterProfile.name}
            </div>

            <div>
                <div class="small-avatar" style="background:${developerProfile.color}">
                    ${developerProfile.initials}
                </div>
                ${developerProfile.name}
            </div>

            <div>${ticket.status}</div>

            <div><span class="btn btn-blue" onclick=saveEditTicketID(${ticket.id})>Edit</span></div>
            <div><span class="btn btn-blue" onclick="viewTicket(${ticket.id})">View</span></div>
        `;

        container.appendChild(row);
    });
}

function searchProjects() {
    let projects = Storage.getData("projects");
    let tickets = Storage.getData("tickets");

    const searchValue = document.getElementById("searchProjectInput").value.toLowerCase();
    const container = document.getElementById("project-container");

    if (!searchValue || !container) {
        return;
    }

    container.innerHTML = "";

    // Filter projects based on search input
    let filteredProjects = projects.filter(project =>
        project.id.toLowerCase().includes(searchValue) ||
        project.name.toLowerCase().includes(searchValue) ||
        project.summary.toLowerCase().includes(searchValue) ||
        project.description.toLowerCase().includes(searchValue) ||
        project.status.toLowerCase().includes(searchValue)
    );

    // No results
    if (filteredProjects.length === 0) {
        container.innerHTML = "<p style='padding:10px;'>No projects found.</p>";
        return;
    }

    // Render filtered projects (same logic as loadProjects)
    filteredProjects.forEach(project => {

        const ticketCount = tickets.filter(ticket =>
            ticket.project.toLowerCase() === project.name.toLowerCase()
        ).length;

        const row = document.createElement("div");
        row.classList.add("ticket-row");

        row.innerHTML = `
            <div>${project.name}</div>
            <div>${project.id}</div>
            <div>${ticketCount}</div>
            <div>${project.status}</div>
            <div><span class="btn btn-blue" onclick="saveEditProjectID('${project.id}')">Edit</span></div>
            <div><span class="btn btn-blue" onclick="viewProject('${project.id}')">View</span></div>
        `;

        container.appendChild(row);
    });
}

// ==========================
// EDIT TICKET 
// ==========================

// Save ticket ID before navigating to edit page
function saveEditTicketID(id) {
    // Store selected ticket ID in localStorage
    Storage.saveData("editTicketId", id);

    // Redirect to ticket creation/edit form page
    window.location.href = "create-ticket.html";
}

// Load ticket data into edit form
function editTicket() {
    // Retrieve stored ticket ID
    let id = Storage.getData("editTicketId");

    // Stop if no ID exists
    if (!id) return;

    // Get all tickets from storage
    let tickets = Storage.getData("tickets");

    // Find the ticket with matching ID
    let ticket = tickets.find(ticket => ticket.id === id);

    // If ticket not found, log error
    if (!ticket) {
        console.log("Ticket not found");
        return;
    }

    // Get form input elements
    const summary = document.getElementById("ticket-summary");
    const description = document.getElementById("ticket-description");
    const reporter = document.getElementById("ticket-reporter");
    const date = document.getElementById("ticket-date");
    const project = document.getElementById("ticket-project");
    const developer = document.getElementById("ticket-developer");

    // Stop execution if form elements are missing (wrong page check)
    if (!summary || !description || !reporter || !date || !project || !developer) {
        return;
    }

    // Fill form fields with ticket data
    summary.value = ticket.summary;
    description.value = ticket.description;
    reporter.value = ticket.reporter;
    date.value = ticket.date;
    project.value = ticket.project;
    developer.value = ticket.developer;

    // Get ticket status (cleaned string)
    let status = (ticket.status || "").trim();

    // Get all status radio buttons
    let radios = document.querySelectorAll('input[name="status"]');

    // Check the matching status radio button
    radios.forEach(radio => {
        if (radio.value === status) {
            radio.checked = true;
        }
    });
}

// ==========================
// EDIT PROJECT 
// ==========================

// Save project ID before navigating to edit page
function saveEditProjectID(id) {
    // Store selected project ID
    Storage.saveData("editProjectId", id);

    // Redirect to project creation/edit page
    window.location.href = "create-project.html";
}

// Load project data into edit form
function editProject() {
    // Retrieve stored project ID
    let id = Storage.getData("editProjectId");

    // Stop if no ID exists
    if (!id) return;

    // Get all projects from storage
    let projects = Storage.getData("projects");

    // Find matching project
    let project = projects.find(p => p.id === id);

    // If not found, log error
    if (!project) {
        console.log("Project not found");
        return;
    }

    // Get form elements
    const name = document.getElementById("project-name");
    const projectId = document.getElementById("project-id");
    const summary = document.getElementById("project-summary");
    const description = document.getElementById("project-description");

    // Stop if form is not loaded
    if (!name || !summary || !description) return;

    // Fill form with project data
    name.value = project.name;
    projectId.value = project.id;
    summary.value = project.summary;
    description.value = project.description;
}

// ==========================
// VIEW TICKET
// ==========================

// Save ticket ID before navigating to view page
function viewTicket(id) {
    // Store selected ticket ID
    Storage.saveData("viewTicketId", id);

    // Redirect to view page
    window.location.href = "view-ticket.html";
}

// Load ticket details onto view page
function LoadViewTicket() {
    // Retrieve stored ticket ID
    let id = Storage.getData("viewTicketId");

    // Stop if no ID exists
    if (!id) return;

    // Get all tickets
    let tickets = Storage.getData("tickets");

    // Find matching ticket
    let ticket = tickets.find(ticket => ticket.id === id);

    // If not found, log error
    if (!ticket) {
        console.log("Ticket not found");
        return;
    }

    // Display ticket details in HTML
    document.getElementById("view-summary").textContent = ticket.summary;
    document.getElementById("view-description").textContent = ticket.description;
    document.getElementById("view-reporter").textContent = ticket.reporter;
    document.getElementById("view-date").textContent = ticket.date;
    document.getElementById("view-project").textContent = ticket.project;
    document.getElementById("view-developer").textContent = ticket.developer;
    document.getElementById("view-status").textContent = ticket.status;
}

// ==========================
// VIEW PROJECT
// ==========================

// Save project ID before navigating to view page
function viewProject(id) {
    // Store selected project ID
    Storage.saveData("viewProjectId", id);

    // Redirect to project view page
    window.location.href = "view-project.html";
}

// Load project details onto view page
function loadViewProject() {
    // Retrieve stored project ID
    let id = Storage.getData("viewProjectId");

    // Stop if no ID exists
    if (!id) return;

    // Get projects and tickets from storage
    let projects = Storage.getData("projects");
    let tickets = Storage.getData("tickets");

    // Find matching project
    let project = projects.find(project => project.id === id);

    // If not found, log error
    if (!project) {
        console.log("Project not found");
        return;
    }

    // Count how many tickets belong to this project
    let ticketCount = tickets.filter(ticket =>
        ticket.project.toLowerCase() === project.name.toLowerCase()
    ).length;

    // Display project details in HTML
    document.getElementById("view-name").textContent = project.name;
    document.getElementById("view-status").textContent = project.status;
    document.getElementById("view-count").textContent = ticketCount;
    document.getElementById("view-id").textContent = project.id;
    document.getElementById("view-summary").textContent = project.summary;
    document.getElementById("view-description").textContent = project.description;
}

window.location.href = "/Bug-Tracking-System/login.html";
