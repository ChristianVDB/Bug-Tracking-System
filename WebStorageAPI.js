

function People (FName, LName, id, username, password, email){
    this.Firstname = 'FName',
    this.Lastname = 'LName',
    this.Identification = 'id',
    this.UserName = 'username',
    this.Password = 'password',
    this.Email = 'email'
}

function Tickets(summary, description, reporter, developer, project, date, status){
    this.Summary = 'summary',
    this.Description = 'description',
    this.Reporter = 'reporter',
    this.Developer = 'developer',
    this.Project = 'project',
    this.Date = 'date',
    this.Status = 'status'
}


function Projects(name, identification, summary, description){
    this.Name = 'name',
    this.Identification = 'identification',
    this.Summary = 'summary',
    this.Description = 'description'
}

function saveToStorage(key, dataArray) {
    localStorage.setItem(key, JSON.stringify(dataArray));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}



