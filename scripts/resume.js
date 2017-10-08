/*
Create a resume.js file and include it in your resume.html file.
Build a database object to store the pertinent information about your professional history.
Stringify the database object and store it in local storage.
The first step is to design what each object's properties should be. Consider your written resume, and think about what information your provide to describe each job - title, company, dates, responsibilities. Each object should have those properties.
*/



var job = {
    "headline": "",
    "company": "",
    "startDate": "",
    "endDate": "",
    "title": "",
    "responsibilities": [],
    "skills": [],
    "logo-url": "",
    duration: function() {
        
        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24

        // Convert both dates to milliseconds
        var startDate_ms = this.startDate.getTime()
        var endDate_ms = this.endDate.getTime()

        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(startDate_ms - endDate_ms)

        // Convert back to days and return
        return Math.round(difference_ms/ONE_DAY)

        }
}

var demandPlanningDir = Object.create(job);
demandPlanningDir.headline = "";
demandPlanningDir.company = "";
demandPlanningDir.startDate = new Date("2011-06-01");
demandPlanningDir.endDate = new Date("2011-07-01");
console.log(demandPlanningDir.duration());
