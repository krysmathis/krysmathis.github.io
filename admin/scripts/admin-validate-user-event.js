const firebase = require("firebase");

const updateNavBasedOnUserStatus = function() {
    // populate the nav bar with a new option
    if (!$(".btn-nav__admin").length) {

        const $adminNav = $("<li/>", {
            "class": "btn-nav__admin nav__link",
            "text": "Admin"
        }).appendTo(".nav__list");

        const $logoutNav = $("<li/>", {
            "class": "btn-nav__logout nav__link",
            "text": "Logout"
        }).appendTo(".nav__list");

        const $adminList = $("<li/>", {
            "class": "menu-list__item",
            "text": "Admin" 
        }).appendTo(".menu-list__list");
        
        const $logoutList = $("<li/>", {
            "class": "menu-list__item",
            "text": "Logout" 
        }).appendTo(".menu-list__list");

        $("menu-list__list").append($logoutList);
    }
    // remove login button
    $(".btn-nav__login").remove();

    const adminActions = () => {
        $(".section-container").hide();
        $(".loginContainer").show();
        $(".loginAdmin").hide();
        $(".blogAdminContainer").show();
        $(".projectsEntryContainer").show();
    };
        
    const logoutFunction = () => {
        firebase.auth().signOut().then(function() {
            // TODO: remove admin and logout and replace login button
        }, function(error) {
            // An error happened.
        });
    };

    $(".btn-nav__admin").on("click",adminActions());
    //$()adminNav.on("click", () => adminActions());
    //$logoutList.on("click", () => logoutFunction());
    $(".btn-nav__logout").on("click", logoutFunction());

    // }
};

// remove login
// add logout function

const addLogin = function() {
    if (!$(".btn-nav__login nav__link").length > 0 && !$(".btn-nav__admin").length > 0) {
        const navList = document.querySelector(".nav__list");
        const loginBtn = document.createElement("li");
        loginBtn.innerHTML = "Login";
        loginBtn.className = "btn-nav__login nav__link";
        navList.appendChild(loginBtn);
    }
};


module.exports = { updateNavBasedOnUserStatus, addLogin };
