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

