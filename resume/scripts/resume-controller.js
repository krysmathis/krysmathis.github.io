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
        `<li class="resume__accomplishment">${job.accomplishments[accompTracker]}</li>`;
    }

    jobsSection.innerHTML += `
    <article class="professional-experience">
      <header class="article-header resume__header">
        <span class="resume__headline">${job.headline}</span>
        <span class="resume__date">${moment(job.startDate).format("YYYY")}-${moment(job.endDate).format("YYYY")}</span>
      </header>
      <img src="${job.companyLogoImg}"
      <h3 class="resume__job-title">${job.title}<h3>
      <ul class="resume__job-list">
        ${resumeBullets}
      </ul>
      </article>
    `;
    
}

