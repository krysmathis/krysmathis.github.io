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
    "dateCompleted": new Date("2017-10-06"),
    "technologies": ["HTML", "CSS", "Javascript"],
    "teammates": [{"name": "Krys Mathis", "personalSite": ""}],
    "repository": ""
}

let projects = [project1];

let Projects = {
    "projects": projects
}

localStorage.setItem("projects", JSON.stringify(Projects));