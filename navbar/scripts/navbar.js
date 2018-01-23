const firebase = require("firebase");
const authenticator = require("../../scripts/authenticator");

const displaySection = function(sectionContainerToShow) {
    $(".section-container").hide();
    $(`.${sectionContainerToShow}`).show();
};

// scroll to a part of the page and account for the navbar height
const goToId = function (nav) {
    let navBarHeight = navBar.clientHeight;
    if (nav.targetId.length > 0) {
        document.getElementById(nav.targetId).scrollIntoView();
        window.scrollBy(0, -(navBarHeight + 60));
    }
};

const navs = new Map();
/**
 *   The map will hold the labels and links for the navbar
 **/
// For testing purposes:
navs.set("Home", {
    "label": "Home",
    "container": "aboutContainer",
    "link": "../index.html",
    "buttonClass": "btn-nav__home",
    "targetId": "about",
    "action": function() {
        const aboutController = require("../../about/scripts/controllers/aboutController");
        aboutController.init();
        displaySection(this.container);}
}),
navs.set("Projects", {
    "label": "Projects",
    "container": "projectsContainer",
    "link": "../projects",
    "buttonClass": "btn-nav__projects",
    "targetId": "projects",
    "action": function() {
        const projects = require("../../projects/scripts/projects");
        projects.load();
        displaySection(this.container);
    }
}),
// navs.set("Blog", {
//     "label": "Blog",
//     "container": "blogContainer",
//     "link": "#blogs",
//     "buttonClass": "btn-nav__blog",
//     "targetId": "blogs",
//     "action": function() {
//         displaySection(this.container);
//         const blogManager = require("../../blog/scripts/blogManager");
//         blogManager.load().then(() => { 
//             blogManager.displayBlogs(1);
//             blogManager.paginationInit(1);
//         });
//     }
// }),
// navs.set("Resume", {
//     "label": "Resume",
//     "container": "resumeContainer",
//     "link": "../resume",
//     "buttonClass": "btn-nav__resume",
//     "targetId": "resume",
//     "action": function() {
//         displaySection(this.container);
//         const ResumeManager= require("../../resume/scripts/resume");
//         ResumeManager.load();
//     }
// }),
navs.set("Contact", {
    "label": "Contact",
    "container": "contactContainer",
    "link": "../contact",
    "buttonClass": "btn-nav__contact",
    "targetId": "contact",
    "action": function() {
        displaySection(this.container);
        const ContactManager = require("../../contact/scripts/contact");
        ContactManager.load();
    }
});
navs.set("Login", {
    "label": "Login",
    "container": "loginAdmin",
    "link": "../login",
    "buttonClass": "btn-nav__login",
    "targetId": "",
    "action": function() {
        displaySection(this.container);
        $(".adminContainer").show();
    },
    "requiresAuth": true,
    "displayIfActiveUser": false
});
navs.set("Admin", {
    "label": "Admin",
    "container": "loginContainer",
    "link": "../login",
    "buttonClass": "btn-nav__admin",
    "targetId": "",
    "action": () => {
        // hide all the navs
        navs.forEach(() => {
            $(".section-container").hide();
        });
        $(".adminContainer").show();
        $(".blogAdminContainer").show();
        $(".projectsEntryContainer").show();
        $(".projectsEntryList").show();

        const blogManager = require("../../blog/scripts/blogManager");
        const projectsController = require("../../projects/scripts/projectsAdminController");
        const createBlogList = require("../../admin/scripts/admin-controller");
        const projectsAdminEventListenerAdd = require("../../projects/scripts/projectsAdminEvents");
        blogManager.load().then( function() {
            createBlogList(blogManager.data);
        });
        projectsController.generateForm();
        projectsController.generateList();
        projectsAdminEventListenerAdd();

        
    },
    "requiresAuth": true,
    "displayIfActiveUser": true
});
navs.set("Logout", {
    "label": "Logout",
    "container": "loginContainer",
    "link": "../login",
    "buttonClass": "btn-nav__logout",
    "targetId": "",
    "requiresAuth": true,
    "displayIfActiveUser": true,
    "action": function() {
        firebase.auth().signOut().then(function () {
            // TODO: remove admin and logout and replace login button
            $(".blogAdminContainer").hide();
            $(".section-container").hide();
            $(".aboutContainer").show();
        }, function (error) {
            // An error happened.
        });
    }
});



const navBar = Object.create(null, {

    "brand": {
        value: "Krys Mathis",
        enumerable: true
    },

    "update": {
        value: function(user) {
            // update function will populate the nav bar based on 
            // the status of the user
            this.populateNavBar(user);
            addNavbarMenuEventListeners();
        },
        enumerable: true
    },
    "activeAdminRequest": {
        value: () => {return localStorage.getItem("admin") !== null ? true : false;},
        enumerable: true,
    },
    "populateNavBar": { 
        value: function(user) {

            const navBar = document.querySelector("#navbarResponsive");
            navBar.innerHTML = "";
            // create the ul element to stick inside the nav
            const newList = document.createElement("ul");
            newList.className = "nav__list navbar-nav ml-auto";
            newList.id="navbarResponsive";
    
            document.querySelector(".navbar-brand").addEventListener("click", function() {
                const aboutController = require("../../about/scripts/controllers/aboutController");
                aboutController.init();
                displaySection("aboutContainer");
            });

            const activeAdminRequest = this.activeAdminRequest();
            const filteredNavs = [];
            navs.forEach(n => {
                

                if (!n.hasOwnProperty("requiresAuth")){
                    filteredNavs.push(n);
                }

                if (activeAdminRequest && n.hasOwnProperty("requiresAuth") && user && n.displayIfActiveUser) {
                    filteredNavs.push(n);
                }

                if (activeAdminRequest && n.hasOwnProperty("requiresAuth") && !user && !n.displayIfActiveUser) {
                    filteredNavs.push(n);
                }
            });
            filteredNavs.forEach(
                nav => {

                    // create a new list element
                    let newNavItem = document.createElement("li");
                    newNavItem.className = nav.buttonClass + " nav__link nav-item mx-0 mx-lg-1";
    
                    let newNavItemLabel = document.createTextNode(nav.label);
                    newNavItem.appendChild(newNavItemLabel);
    
                    newNavItem.addEventListener("click", () => {

                        if (nav.hasOwnProperty("action")) {
                            nav.action();
                        }
                    
                    });

                    // set the options
                    newList.appendChild(newNavItem);
    
                }
            );
            navBar.appendChild(newList);

        }, enumerable: true
    },

    "populateNavList": {
        value: function(user) {
            // Hamburger Menu
            const hamburgerMenu = document.createElement("div");
            hamburgerMenu.className = "menu-col";
            for (let i = 0; i < 3; i++) {
                let newMenuBar = document.createElement("div");
                newMenuBar.className = "menu-col__bar";
                hamburgerMenu.appendChild(newMenuBar);
            }
            const newList = document.querySelector(".nav__list");
            newList.appendChild(hamburgerMenu);
            const menu = document.createElement("div");
            menu.className = "menu-list";
            const menuList = document.createElement("ul");
            menuList.className = "menu-list__list";
            menu.appendChild(menuList);
            
            const activeAdminRequest = this.activeAdminRequest();
            const filteredNavs = [];

            navs.forEach(n => {
                if (!n.hasOwnProperty("requiresAuth")){
                    filteredNavs.push(n);
                }
                if (activeAdminRequest && n.hasOwnProperty("requiresAuth") && user && n.displayIfActiveUser) {
                    filteredNavs.push(n);
                }
                if (activeAdminRequest && n.hasOwnProperty("requiresAuth") && !user && !n.displayIfActiveUser) {
                    filteredNavs.push(n);
                }
            });
            filteredNavs.forEach(
                nav => {
                    let menuItem = document.createElement("li");
                    menuItem.innerHTML = `${nav.label}`;
                    menuItem.className = "menu-list__item";
                    menuList.appendChild(menuItem);
                    menuItem.addEventListener("click", () => {
        
                        if (nav.hasOwnProperty("action")) {
                            nav.action();
                        } else {
                            $(".section-container").hide();
                            $(`.${nav.container}`).show();
                            goToId(nav);
                        }
                    });
                });
            const navBar = document.querySelector(".nav");
            navBar.appendChild(menu);
    

        },
        enumerable: true
    }
});
    


const addNavbarMenuEventListeners = function () {

    const menu = document.querySelector(".menu-list");
    document.querySelector(".menu-col").addEventListener("click", () => {

        const displayStyle = menu.style.display;
        if (displayStyle === "none" || displayStyle === "") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });

    document.querySelector(".menu-list").addEventListener("click", () => {

        const displayStyle = menu.style.display;
        if (displayStyle === "none" || displayStyle === "") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });

    $("menu__list").on("click", function (e) {
        if (e.target.className.includes("admin")) {
            $("section-container").hide();
            $("admin-container").show();
        }
    });

    /**
     * If the user resizes the window the drop down menu will disappear
     */
    window.addEventListener("resize", () => {
        menu.style.display = "none";
    });

};

module.exports = navBar;
