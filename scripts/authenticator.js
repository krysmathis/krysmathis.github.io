//const $ = require("jquery");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const userStatusObserver = require("./userStatusObserver");
const navBar = require("../navbar/scripts/navbar");

const Toaster = require("../toaster/scripts/toaster");

const toaster = Toaster();
// config values for firebase site
var config = {
    apiKey: "AIzaSyBMn85CoL3MFsgIAwMQzwqrpcBaLtVO0PY",
    authDomain: "personal-site-3111d.firebaseapp.com",
    databaseURL: "https://personal-site-3111d.firebaseio.com",
    projectId: "personal-site-3111d",
    storageBucket: "personal-site-3111d.appspot.com",
    messagingSenderId: "785882455269"
};

const Authenticator = Object.create(null, {

    "activeUser": {
        value: null,
        enumerable: true,
        writable: true
    },

    "init": {
        value: function() {
            firebase.initializeApp(config);
            // navBar.init();
            $(".section-container").hide();
            $(".aboutContainer").show();

            // this will handle the event listeners for the login buton
            const btnLogin = document.querySelector(".login__button-login");
            const btnCreate = document.querySelector(".login__button-create");

            $(btnLogin).on("click", () => {
                const email = $(".login__email").val();
                const password = $(".login__password").val();
                this.login(email, password);
            });

            $(btnCreate).on("click", () => {
                const email = $(".login__username").val();
                const password = $(".login__password").val();
                this.createNewUser(email, password);
            });
            userStatusObserver.init();
        }
    },

    "login": {
        value: function (email, password) {

            // pre-validation
            if (email.length < 1) {
                toaster.makeToast("please enter a valid email or password", 3000);
                toaster.makeToast("Oops...", 2000);
                return;
            } else {
                let user = firebase.auth().currentUser;
                if (user) {
                    toaster.makeToast("already signed in", 3000);
                }
            }

            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                toaster.makeToast(`ERR: ${errorCode}:<br> ${errorMessage}`, 3000);
                return;
                // ...
            });
            this.currentUser = firebase.auth().currentUser;
        }
        //an
    },
    "createNewUser": {
        value: function (username, email) {
            firebase.auth().createUserWithEmailAndPassword(username, email).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                toaster.makeToast(`ERR: ${errorCode}:<br> ${errorMessage}`, 3000);
                return;
                // ...
            });
            this.currentUser = firebase.auth().currentUser;

        }
    },

});

module.exports = Authenticator;