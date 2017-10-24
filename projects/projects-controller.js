const projectsDB = JSON.parse(localStorage.getItem("projects"));

const projectsHTML = document.getElementById("projects");

for(let key in projectsDB) {

    let currentKey = projectsDB[key];

    for (let i = 0; i < currentKey.length; i++) {
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
