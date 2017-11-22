var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

// Leave out Storage
//require("firebase/storage");

var config = {
    apiKey: "AIzaSyBMn85CoL3MFsgIAwMQzwqrpcBaLtVO0PY",
    authDomain: "personal-site-3111d.firebaseapp.com",
    databaseURL: "https://personal-site-3111d.firebaseio.com",
    projectId: "personal-site-3111d",
    storageBucket: "personal-site-3111d.appspot.com",
    messagingSenderId: "785882455269"
};
firebase.initializeApp(config);
  



const navbar = require("../navbar/scripts/navbar");




//const blogs = require("../blog/scripts/blog-controller");
const BlogManager= require("../blog/scripts/blogManager");
const ResumeManager= require("../resume/scripts/resume");
const ProjectManager = require("../projects/scripts/projects");
const ContactManager = require("../contact/scripts/contact");
const loginEvents = require("../admin/scripts/loginEvents");

// add the admin events
const adminEvents = require("../blog/scripts/blog-admin-events");

console.log("blogger", BlogManager);

navbar("Krys Mathis");
console.log("Project Manager", ProjectManager);
console.log("BlogManager", BlogManager);
console.log("ResumeManager", ResumeManager);
console.log("ContactManager", ContactManager);
BlogManager.load();
ResumeManager.load();
ContactManager.load();

