const navbar = require("../navbar/scripts/navbar");
//const blogs = require("../blog/scripts/blog-controller");
const BlogManager= require("../blog/scripts/blogManager");
const ResumeManager= require("../resume/scripts/resume");
const ProjectManager = require("../projects/scripts/projects");
const ContactManager = require("../contact/scripts/contact");


navbar("Krys Mathis");
console.log("Project Manager", ProjectManager);
console.log("BlogManager", BlogManager);
console.log("ResumeManager", ResumeManager);
console.log("ContactManager", ContactManager);
BlogManager.load();
ResumeManager.load();
ContactManager.load();

