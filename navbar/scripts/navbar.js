const firebase = require("firebase");

const displaySection = function(sectionContainerToShow) {
    navs.forEach(nav => {
        $(".section-container").hide();
    });
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
    "action": () => displaySection(this.container)

}),
navs.set("Projects", {
    "label": "Projects",
    "container": "projectsContainer",
    "link": "../projects",
    "buttonClass": "btn-nav__projects",
    "targetId": "projects",
    "action": () => displaySection(this.container)
}),
navs.set("Blog", {
    "label": "Blog",
    "container": "blogContainer",
    "link": "#blogs",
    "buttonClass": "btn-nav__blog",
    "targetId": "blogs",
    "action": () => displaySection(this.container)
}),
navs.set("Resume", {
    "label": "Resume",
    "container": "resumeContainer",
    "link": "../resume",
    "buttonClass": "btn-nav__resume",
    "targetId": "resume",
    "action": () => displaySection(this.container)
}),
navs.set("Contact", {
    "label": "Contact",
    "container": "contactContainer",
    "link": "../contact",
    "buttonClass": "btn-nav__contact",
    "targetId": "contact",
    "action": () => displaySection(this.container)
});
navs.set("Login", {
    "label": "Login",
    "container": "loginContainer",
    "link": "../login",
    "buttonClass": "btn-nav__login",
    "targetId": "",
    "action": () => displaySection(this.container),
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
        $(".loginContainer").show();
        $(".blogAdminContainer").show();
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
    "displayIfActiveUser": true
});



const navBar = Object.create(null, {

    "brand": {
        value: "Krys Mathis",
        enumerable: true
    },

    "init": {
        value: () => {
            let user = firebase.auth().currentUser;

            //this.populateNavBar(user);
            //this.populuateNavList(user);
            addNavbarMenuEventListeners();
            
        },
        enumerable: true
    },

    "populateNavBar": { 
        value: function(user) {
        
            const navBar = document.querySelector(".nav");
            // create the ul element to stick inside the nav
            const newList = document.createElement("ul");
            newList.className = "nav__list";
    
            const newBrandLi = document.createElement("li");
            newBrandLi.className = "nav__brand";
    
            const brandText = document.createTextNode(this.brand);
            newBrandLi.appendChild(brandText);
            newList.appendChild(newBrandLi);
    
            newBrandLi.addEventListener("click", () => {
                document.location.href = navs.get("Home").link;
            });
    
            navs.forEach(
                nav => {
                // create a new list element
                    let newNavItem = document.createElement("li");
                    newNavItem.className = nav.buttonClass + " nav__link";
    
                    let newNavItemLabel = document.createTextNode(nav.label);
                    newNavItem.appendChild(newNavItemLabel);
    
                    newNavItem.addEventListener("click", () => {

                        if (nav.hasOwnProperty("action")) {
                            nav.action();
                        } else {
                            $(".section-container").hide();
                            $(`.${nav.container}`).show();
                            goToId(nav);
                        }
                    
                        // handle those actions related to login
                        if (nav.hasOwnProperty("displayIfActiveUser")) {
                            if (nav.displayIfActiveUser && user) {
                                nav.show();
                            } else {
                                nav.hide();
                            }

                        }

                    });

                    // set the options
                    newList.appendChild(newNavItem);
    
                }
            );
            navBar.appendChild(newList);

        }, enumerable: true
    },

    "populuateNavList": {
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
        
            navs.forEach(
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
        
                    navBar.appendChild(menu);
        
                });

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
