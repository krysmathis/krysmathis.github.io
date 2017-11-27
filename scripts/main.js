const authenticator = require("./authenticator");

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

authenticator.init();

// Leave out Storage
//require("firebase/storage");
  
const navbar = require("../navbar/scripts/navbar");
navbar("Krys Mathis");


//const blogs = require("../blog/scripts/blog-controller");
const blogManager= require("../blog/scripts/blogManager");
const ResumeManager= require("../resume/scripts/resume");
const ProjectManager = require("../projects/scripts/projects");
const ContactManager = require("../contact/scripts/contact");
// const loginEvents = require("../admin/scripts/loginEvents");
// const navbarUpdate = require("../admin/scripts/admin-validate-user-event");

// add the admin events
const adminEvents = require("../blog/scripts/blog-admin-events");

console.log("blogger", blogManager);
console.log("Project Manager", ProjectManager);
console.log("ResumeManager", ResumeManager);
console.log("ContactManager", ContactManager);
blogManager.load().then(r => { 
    blogManager.displayBlogs(1);
    blogManager.paginationInit(1);
});
console.log("BlogManager", blogManager);
//blogManager.displayBlogs(1);
ResumeManager.load();
ContactManager.load();
