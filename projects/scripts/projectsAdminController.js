
const ProjectsAdmin = function() {
  
    //do a config and then an assign
    const config = {
        "displayOptions": {
            itemsPerPage: 5
        },
        "defaultPages": 3,
        "dbConnection": "https://personal-site-3111d.firebaseio.com/projects"
    };
        
    const dataFactory = require("../../blog/scripts/databaseManager");
    const paginator = require("../../pagination/scripts/pagination");
    const projectsUpdateController = require("./projectsUpdateController");
    
    return Object.assign({},
        dataFactory(config),
        paginator(config),
        projectsUpdateController(config)
    );


};

const projectsAdmin = new ProjectsAdmin();

module.exports = projectsAdmin;