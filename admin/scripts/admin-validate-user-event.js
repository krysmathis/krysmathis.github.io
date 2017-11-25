const firebase = require("firebase");

const updateNavBasedOnUserStatus = function() {
    // populate the nav bar with a new option
    if (!$(".nav__admin").length) {
        const $adminNav = $(".nav__list").append(
            $("<li/>", {
                "class": "nav__admin",
                "text": "Admin"
            }));

        // remove login button
        $(".nav__list").remove($(".btn-nav__login"));

        $(".nav__admin").on("click",function(e){
            $(".section-container").hide();
            $(".loginContainer").show();
            $(".loginAdmin").hide();
            $(".blogAdminContainer").show();
        });
    }
};
// remove login
// add logout function


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        updateNavBasedOnUserStatus();
    } else {
        // No user is signed in.
    }
});
