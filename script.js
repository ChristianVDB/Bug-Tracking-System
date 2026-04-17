function User(id, name, surname, username, password, email) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
    this.email = email;
}

function Project(id, name, summary, description) {
    this.id = id;
    this.name = name;
    this.summary = summary;
    this.description = description;
    this.status = "Active";
    this.ticketCount = 0;
}

function Ticket(summary, description, reporter, date, project, developer, status) {
    this.summary = summary;
    this.description = description;
    this.reporter = reporter;
    this.date = date;
    this.project = project;
    this.developer = developer;
    this.status = status;
}

const Storage = {
    saveData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    getData: (key) => JSON.parse(localStorage.getItem(key)) || []
};
