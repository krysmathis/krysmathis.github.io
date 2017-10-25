
let getProjects = function(searchString) {

    const projectsDB = JSON.parse(localStorage.getItem("projects")) || {};

    if (searchString === undefined) {
        return projectsDB.projects || [];
        
    } else {
        return projectsDB.projects.filter(function(proj){
            return proj.description.toLowerCase().includes(searchString) || proj.name.toLowerCase().includes(searchString);
        }) || [];
    }

}

/*
Sort the projects in descending order according to the dateCompleted property
*/
function updateProjectsInDOM(searchString) {
    
    const projectsHTML = document.getElementById("projects");
    projectsHTML.innerHTML = "";
    
    let sortedProjects = getProjects(searchString).sort((a,b) => moment(b.dateCompleted) - moment(a.dateCompleted));

    let projects = sortedProjects || [];


    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];  
        
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
                <p class="project-completed-date">Date completed: ${moment(project.dateCompleted).format("YYYY-MM-DD")}</p>
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

updateProjectsInDOM();


