/*
Create a resume.js file and include it in your resume.html file.
Build a database object to store the pertinent information about your professional history.
Stringify the database object and store it in local storage.
The first step is to design what each object's properties should be. Consider your written resume, and think about what information your provide to describe each job - title, company, dates, responsibilities. Each object should have those properties.
*/


/*
var job = {
    "headline": "",
    "company": "",
    "startDate": "",
    "endDate": "",
    "title": "",
    "accomplishments": [],
    "skills": [],
    "companyLogoImg": "",
}

var education = {
    "degree": "";
    "school": ;
}
*/

const demandPlanningDir = {
    "headline": "Forecaster, Number-Cruncher, Leader",
    "company": "Dollar General",
    "startDate": new Date("2013-01-01"),
    "endDate": new Date("2017-09-27"),
    "title": "Director of Demand Planing",
    "accomplishments": [
       "The department improved forecast accuracy by 12% during my time leading the department.",
       "Led an 8 person analytical team in providing planned and ad hoc analysis and recommendations to stakeholders ranging from Sr. Executives to Analysts.",
       "Developed custom software application using Python and C# to cluster items based on seasonal trends which enables faster, more frequent review of item seasonality and supports advanced strategies for improving in-stock and inventory turns during seasonal periods." 
        ],
    "skills": ["Leadershipt", "Forecasting", "Demand Planning"],
    "companyLogoImg": "images/dollargeneral.png",
}

var projectManager = {
    "headline": "System Implementater, Project Manager",
    "company": "Dollar General",
    "startDate": new Date("2011-01-01"),
    "endDate": new Date("2013-01-01"),
    "title": "Sr. Project Manager",
    "accomplishments": [
        "Implemented a new Supply Chain system, GOLD, with responsibility for Master Data Management, including capturing requirements, reviewing design documents, training, and process design to support 120,000 items, 11,000 locations and 3,400 vendors.",
        "Led GOLD user training for 200 employees from the Store Support Center and the Hong Kong office, which was highly rated by participants, based on post-event feedback surveys, and supported the timely rollout of the SCS project."
        ],
    "skills": ["Project Management", "User Acceptance Testing", "Design", "Training and Development"],
    "companyLogoImg": "images/dollargeneral.png",
}

var strategicPlanningAndAnalysis = {
    "headline": "Retail Scientist, Store In-stock Guru",
    "company": "Dollar General",
    "startDate": new Date("2009-01-01"),
    "endDate": new Date("2010-01-02"),
    "title": "Strategic Planning and Analysis, Sr. Manager",
    "accomplishments": [
        "Led over 40 business experiments for Senior Management, leveraging statistical and financial analysis to forecast the expected impact to critical financial measures, such as EBITDA, ROI and EPS.",
        "Led the company’s Out-of-Stock Reduction initiative which worked cross-functionally to develop, test and implement solutions aimed at improving store in-stocks and increasing sales by $41.5 million."
    ],
    "skills": ["A B Testing", "Analysis", "Financial Planning", "ROI IRR Analysis"],
    "companyLogoImg": "images/dollargeneral.png",
}

let jobs = [];
jobs.push(demandPlanningDir, projectManager, strategicPlanningAndAnalysis);

let Resume = {
    "jobs": jobs
}

localStorage.setItem("resume", JSON.stringify(Resume));

const resumeDB = JSON.parse(localStorage.getItem("resume"));

// I would use specific formatting for jobs
// and would pull it specifically
const jobsFromDB = resumeDB.jobs;
const jobsSection = document.getElementById("resume-jobs");
// loop through the array of job objects
for (let i = 0; i < jobsFromDB.length; i++) {
    let job = jobsFromDB[i];

    let resumeBullets="";

    for (let accompTracker = 0; accompTracker < job.accomplishments.length; accompTracker++) {
        resumeBullets += 
        `<li>${job.accomplishments[accompTracker]}</li>`;
    }

    jobsSection.innerHTML += `
    <article class="professional-experience">
      <header class="article-header resume-header">
        ${job.headline}
      </header>
      <img src="${job.companyLogoImg}"
      <h3>${job.title}<h3>
      <ul>
        ${resumeBullets}
      </ul>
      </article>
    `
    
}

