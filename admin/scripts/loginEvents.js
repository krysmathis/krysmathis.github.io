/**
 * Krys Mathis
 * The purpose of this function is to navigate the user through the login
 * process.
 */
// const login = require("./login");
// const createNewUser = require("./createNewUser");
// const dashboardInit = require("../dashboardInit");
const Toaster = require("../../toaster/scripts/toaster");
const firebase = require("firebase");

// elements you would click
const btnLogin = document.querySelector(".login__button-login");
const btnCreate = document.querySelector(".login__button-create");
const loginLink = document.querySelector(".welcome__link");

const toaster = Toaster();
// function to navigate through login
const addEvents = () => {

    document.addEventListener("click", (event) => {

        // page elements to toggle visible and invisible
        const welcomePage = document.querySelector(".welcome");
        const loginPage = document.querySelector(".login");

        // Handle navigating to the login page
        if (event.target === loginLink) {
            welcomePage.style.display = "none";
            loginPage.style.display = "flex";
        }

        // get elements and values
        const username = document.querySelector(".login__username").value;
        const usernameEl = document.querySelector(".login__username");
        const email = document.querySelector(".login__email").value;
        const emailEl = document.querySelector(".login__email");

        // function validateEmail(email) {
        //     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //     return re.test(email);
        // }

        // handle the login button errors
        if (event.target === btnLogin) {
            if (username.length < 1) {
                toaster.makeToast("please enter a valid username",3000);
                toaster.makeToast("Oops...",2000);
                usernameEl.focus();
                return;
            } else {
                let user = firebase.auth().currentUser;
                
                if (user) {
                    toaster.makeToast("already signed in", 3000);
                    return;
                } else {
                    // No user is signed in.
                }
                
                firebase.auth().signInWithEmailAndPassword(username, email).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    toaster.makeToast(`ERR: ${errorCode}:<br> ${errorMessage}`,3000);
                    // ...
                });
                  
            }

        }



        // handle the create button errors
        if (event.target === btnCreate) {
            if (username.length === 0) {
                toaster.makeToast("please enter a username",3000);
                usernameEl.focus();
                return;
            } else {
                firebase.auth().createUserWithEmailAndPassword(username, email).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    toaster.makeToast(`ERR: ${errorCode}:<br> ${errorMessage}`,3000);
                    // ...
                });
            }

        }
        
        // event handler for login button
        $(".btn-nav__login").on("click", () => {
            $(".section-container").hide();
            $(".loginContainer").show();
            $(".loginAdmin").show();
    
        });


          
    });
};
addEvents();
module.exports = addEvents;