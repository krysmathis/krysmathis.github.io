const Paginator = require("../../pagination/scripts/pagination");
const PersonalETL = require("../../scripts/personalETL");
const ProjectSearch = require("./projects-search");

const ProjectManager = Object.create(PersonalETL, {
    
    "load": {
        value: function() {
            $.ajax({
                url: "https://personal-site-3111d.firebaseio.com/projects.json"
            }).then(result => {
                // from firebase it could either be an array or an object
                if (Array.isArray(result)) {
                    this.data = result;
                } else {
                    this.data = Object.keys(result)
                        .map(key => {
                            // adding an id field here
                            result[key].id = key;
                            return result[key];
                        });
                }

                this.filterBySearchCriteria("");
                // Initialize the event listeners for the projects
                ProjectSearch(this);
            });
        }
    },

    "paginationObj": {
        value: Object.create(Paginator,{}),
        writable: true,
        enumerable: true
    },

    "filterBySearchCriteria": {
        value: function (searchCriteria) {
            this.filteredData = this.data.filter(function(proj){
                
                let inTechnologies = false;
                proj.technologies.forEach(t => {
                    if (t.toLowerCase().includes(searchCriteria)) {
                        inTechnologies = true;
                    }
                });
                
                return proj.description.toLowerCase().includes(searchCriteria) || 
                       proj.name.toLowerCase().includes(searchCriteria) ||
                       inTechnologies;
                       
            });
            this.display(1);
            this.paginate();

        }
    },

    "display": {
        value: function (pageNumber) {

            // Only display the pages in the current page number
            const blogsToDisplay = this.filteredData.slice(
                (pageNumber - 1) * this.displayOptions.itemsPerPage,
                pageNumber * this.displayOptions.itemsPerPage);
            // );  

            const projectsHTML = document.getElementById("projectList");
            projectsHTML.innerHTML = "";

            let sortedProjects = this.filteredData.sort((a, b) => moment(b.dateCompleted) - moment(a.dateCompleted));

            let projects = sortedProjects || [];

            for (let i = 0; i < projects.length; i++) {
                let project = projects[i];

                // grab the first technology listed
                const technology = project.technologies.length > 0 ? project.technologies[0] : "";
                let tagHTML = "";

                for (let i = 0; i < project.technologies.length; i++) {
                    let tag = project.technologies[i];
                    tagHTML += `<li>${tag}</li>`;
                }

                // create the teammate string
                let teammates = "";

                for (let i = 0; i < project.teammates.length; i++) {
                    let teammate = project.teammates[i];
                    teammates += `<a href="${teammate.personalSite}">${teammate.name}</a>`;
                }

                
                // <div class="media">
                // <img class="mr-3" src="..." alt="Generic placeholder image">
                // <div class="media-body">
                //     <h5 class="mt-0">Media heading</h5>
                //     Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                // </div>
                // </div>

                projectsHTML.innerHTML += `
                    
                
                    <article class="project-detail">
                    <div class="row">
                    <div class="col-md-12">
                        <a class="portfolio-item d-block mx-auto" href="#${project.modalId}">
                        <div class="portfolio-item-caption d-flex position-absolute h-100 w-100">
                        <div class="portfolio-item-caption-content my-auto w-100 text-center text-white">
                        <i class="fa fa-search-plus fa-3x"></i>
                        </div>
                        </div>
                        <img class="project-img img-fluid" src="${project.screenshot}">
                        </a>
                    </div>
                    <div class="col-md-12">
                        <div class="project-detail__text">
                            <h3 class="project-title">${project.name}</h3>
                            <p class="project-description">${project.description}</p>
                            <p class="project-completed-date">Date completed: ${moment(project.dateCompleted).format("YYYY-MM-DD")}</p>
                            <br class="project-href"><a href="${project.href}">link</a> | <a href="${project.repo}">repository</a>
                            <div class="project-tag">
                            
                                <p></p>
                                <ul>
                                    ${tagHTML}
                                </ul>
                            </div>
                        </div>
                    </div>
                    </div> <!-- end row -->
                </article>
                    `;
            }
            // Modal popup$(function () {
            $(".portfolio-item").magnificPopup({
                type: "inline",
                preloader: false,
                focus: "#username",
                modal: true
            });
            $(document).on("click", ".portfolio-modal-dismiss", function(e) {
                e.preventDefault();
                $.magnificPopup.close();
            });


        },
        enumerable: true
    },

    "displayOptions": {
        value: {
            "itemsPerPage": 5
        },
        "writable": true
    },

    "search": {
        value: function (searchString) {
            if (searchString.length >= 3) {
                this.filterBySearchCriteria(searchString);
            } else {
                this.filterBySearchCriteria("");
            }
        },
        writable: true,
        enumerable: true
    },

    "paginate": {
    // takes a callback function from the pagination object
        value: function () {

            // const numberOfItems = this.filteredData.length;
            // const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);

            // this.paginationObj.init(numberOfPages, 1);

            // // determine how to handle the pagination display
            // if (numberOfPages > 1) {
            //     document.querySelector(".pagination").style.visibility = "";
            // } else {
            //     document.querySelector(".pagination").style.visibility = "hidden";
            // }
        }
    },



});

/**
 * Init for the blog page
 */
ProjectManager.load();

module.exports = ProjectManager;