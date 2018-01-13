//updateNavBar("resume");

// callback function for generating pagination
//const Paginator = require("../../pagination/scripts/pagination");
const PersonalETL = require("../../scripts/personalETL");

const ResumeManager = Object.create(PersonalETL, {
    
    "load": {
        value: function() {
            $.ajax({url: "https://personal-site-3111d.firebaseio.com/resume.json"})
                .then(result => {
                    this.data = result;
                    this.filteredData = result;
                    this.display();
                });
        }
    },

    "display": {
        value: function() {
            
            const jobsSection = document.getElementById("resume-jobs");
            jobsSection.innerHTML = "";
            // loop through the array of job objects
            let jobs = this.filteredData.jobs;
            for (let i = 0; i < jobs.length; i++) {
                
                // TO DO THIS WILL NOW CONTAIN OBJECTS
                let job = jobs[i];
            
                let resumeBullets="";
            
                for (let accompTracker = 0; accompTracker < job.accomplishments.length; accompTracker++) {
                    resumeBullets += 
                    `<li class="resume__accomplishment">${job.accomplishments[accompTracker]}</li>`;
                }
            
                jobsSection.innerHTML += `
                <article class="professional-experience">
                  <header class="article-header resume__header">
                    <span class="resume__headline">${job.headline}</span>
                    <span class="resume__date">${moment(job.startDate).format("YYYY")}-${moment(job.endDate).format("YYYY")}</span>
                  </header>
                  <img src="${job.companyLogoImg}"
                  <h3 class="resume__job-title">${job.title}</h3>
                  <ul class="resume__job-list">
                    ${resumeBullets}
                  </ul>
                  </article>
                `;
                
            }
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
        value: function(searchString) {
            if (searchString.length >=3) {
                this.filterBySearchCriteria(searchString);
            } else {
                this.filterBySearchCriteria("");
            }
        },
        writable: true,
        enumerable: true
    }
    
});

module.exports = ResumeManager;
