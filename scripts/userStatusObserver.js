const navbar = require("../navbar/scripts/navbar");
const { updateNavBasedOnUserStatus, addLogin } = require("../admin/scripts/admin-validate-user-event");

const firebase = require("firebase");

const userStatusObserver = Object.create(null, {
  
    "init": {
        value: function() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    navbar.update(user);
                } else {
                    navbar.update(false);
                }
            });
        }
    }
});

module.exports = userStatusObserver;