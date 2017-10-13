/*
Create a projects.js file and include it in your projects.html file.
Build a database object to store the pertinent information about your software projects. At this point, you only have one of note - your personal site.
Stringify the database object and store it in local storage.
The first step is to design what each object's properties should be - name, date completed, technologies used, teammates (if applicable). Each object should have those properties.
*/

/* 
const project = {
    "name": "",
    "dateCompleted": "",
    "technologies": [],
    "teammates": [],
    "repository": ""
}
*/

const project1 = {
    "name": "project one",
    "description": "In this project...",
    "dateCompleted": "2017-10-06",
    "technologies": ["HTML", "CSS", "Javascript"],
    "teammates": [{"name": "Krys Mathis", "personalSite": ""}],
    "href": "#",
    "repository": ""
}

const project2 = {
    "name": "project two",
    "description": "In this other project",
    "dateCompleted": "2017-10-06",
    "technologies": ["CSS", "HTML"],
    "teammates": [{"name": "Krys Mathis", "personalSite": ""}],
    "href": "#",
    "repository": ""
}

let projects = [project1, project2];

let Projects = {
    "projects": projects
}

localStorage.setItem("projects", JSON.stringify(Projects));

const projectsDB = JSON.parse(localStorage.getItem("projects"));

const projectsHTML = document.getElementById("projects");

for(let key in projectsDB) {

    let currentKey = projectsDB[key];

    for (var i = 0; i < currentKey.length; i++) {
        let project = currentKey[i];
        
        // grab the first technology listed
        const technology = project.technologies.length>0 ? project.technologies[0] : "";
        let tagHTML = "";
        
        for (let i = 0; i < project.technologies.length; i++) {
            let tag = project.technologies[i];
            tagHTML += `<li>${tag}</li>`   
        }

        // create the teammate string
        let teammates = "";

        for (let i = 0; i < project.teammates.length; i++) {
            let teammate = project.teammates[i];
            teammates += `<a href="${teammate.personalSite}">${teammate.name}</a>`;
        }

        //let html = "";
        projectsHTML.innerHTML += `
            <article class="project-detail ${technology.toLowerCase()}">
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <p class="project-completed-date">Date completed: ${project.dateCompleted}</p>
                <br class="project-href"><a href="${project.href}">link</a> | <a href="${project.repository}">repository</a>
                <div class="project-tag">
                    <p></p>
                    <ul>
                        ${tagHTML}
                    </ul>
                </div>
            </article>
        `


    }

}
