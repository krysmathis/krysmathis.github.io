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

const uniqueResumeIdGenerator = function*() {
    let i = 0;
    while (true) {
        yield i;
        i++;
    }
};

const uniqueResumeIdFactory = uniqueResumeIdGenerator();

let professionalExperience = function(headline, company, startDate, endDate, title, accomplishments, skills, logo){
    return Object.create({},{
        "id": {value: uniqueResumeIdFactory.next().value, enumerable: false},
        "headline": {value: headline, enumerable: true},
        "company": {value: company, enumerable: true},
        "startDate": {value: startDate, enumerable: true},
        "endDate": {value: endDate, enumerable: true},
        "title": {value: title, enumerable: true},
        "accomplishments": {value: accomplishments, enumerable: true},
        "skills": {value: skills, enumerable: true},
        "companyLogoImg": {value: logo, enumerable: true}
    });
};

const demandPlanningDir = professionalExperience (
    "Forecaster, Number-Cruncher, Leader",
    "Dollar General",
    new Date("2013-01-01"),
    new Date("2017-09-27"),
    "Director of Demand Planing",
    [
        "Led an 8 person analytical team in providing planned and ad hoc analysis and recommendations to stakeholders ranging from Analysts to Sr. Executives.",
        "Oversaw a 12% increase in overall forecast accuracy during my time leading the department.",
        "Developed custom software application using Python and C# to cluster items based on seasonal trends which enables faster, more frequent review of item seasonality and supports advanced strategies for improving in-stock and inventory turns during seasonal periods." 
    ],
    ["Leadership", "Forecasting", "Demand Planning"],
    "../../images/dollargeneral.png"
);


var projectManager = professionalExperience(
    "System Subject Matter Expert, Project Manager",
    "Dollar General",
    new Date("2011-01-01"),
    new Date("2013-01-01"),
    "Sr. Project Manager",
    [
        "Implemented a new Supply Chain system, GOLD, with responsibility for Master Data Management, including capturing requirements, reviewing design documents, training, and process design to support 120,000 items, 11,000 locations and 3,400 vendors.",
        "Led GOLD user training for 200 employees from the Store Support Center and the Hong Kong office, which was highly rated by participants, based on post-event feedback surveys, and supported the timely rollout of the SCS project."
    ],
    ["Project Management", "User Acceptance Testing", "Design", "Training and Development"],
    "../../images/dollargeneral.png"
);

var strategicPlanningAndAnalysis = professionalExperience(
    "Retail Scientist, Store In-stock Guru",
    "Dollar General",
    new Date("2009-01-01"),
    new Date("2010-01-02"),
    "Strategic Planning and Analysis, Sr. Manager",
    [
        "Led over 40 business experiments for Senior Management, leveraging statistical and financial analysis to forecast the expected impact to critical financial measures, such as EBITDA, ROI and EPS.",
        "Led the company’s Out-of-Stock Reduction initiative which worked cross-functionally to develop, test and implement solutions aimed at improving store in-stocks and increasing sales by $41.5 million."
    ],
    ["A B Testing", "Analysis", "Financial Planning", "ROI IRR Analysis"],
    "../../images/dollargeneral.png"
);

let jobs = [];
jobs.push(demandPlanningDir, projectManager, strategicPlanningAndAnalysis);

let Resume = {
    "jobs": jobs
};

localStorage.setItem("resume", JSON.stringify(Resume));