/*
    1. requires a section or div called toaster
    2. There are three toast timings
        a.  In miliseconds
        b.  0 = the user clicks it to close it
        c.  -1 = this will only go away when triggered
*/
const Toaster = function() {

    const initToaster = function() {
        // Get the toaster element
        const toastContainer = document.querySelector(".toaster__container");
        // clear the existing toaster
        while(toastContainer.hasChildNodes()){
            toastContainer.removeChild(toastContainer.lastChild);
        }

        // append the ul element
        const toasterUl = document.createElement("ul");
        toasterUl.className = ("toaster");
        toastContainer.appendChild(toasterUl);
    };

    initToaster();

    const createToast = function(message, timeout) {
        
        const toaster = document.querySelector(".toaster");
        // get the toaster
        const toast = document.createElement("li");
        
        let toastMessage = document.createTextNode(message);
        toast.appendChild(toastMessage);
        toast.className = "toaster__toast";
        toast.dataset.timeout = timeout;
    
        if (toaster.hasChildNodes()) {
            toaster.insertBefore(toast, toaster.firstChild);
        } else {
            toaster.appendChild(toast);
        }
    
        if (timeout > 0) {
            // set expiration timing for the toast
            setTimeout(function() {
                if (toaster.contains(toast)) {
                    toaster.removeChild(toast);
                }
            }, timeout);
        }
        
    };

    return Object.create(null, {
        "makeToast": {
            value: (message,time) => {createToast(message, time);},
            enumerable: true}
    });
       
};


document.addEventListener("click", function(e) {
    if (e.target.id === "btn"){
        toaster.makeToast(Date.now(), 5000);
        return;
    }

    if (e.target.className === "toaster__toast") {
        const toaster = e.target.parentNode;
       
        const timeout = e.target.dataset.timeout;
        if (timeout === "-1") {
            return;
        }
        // Make sure the toaster still has a child node
        if (toaster.contains(e.target)) {
            toaster.removeChild(e.target);
        }
        return;
    }
});

// to use the toaster you need the code below in your javascript
let toaster = Toaster();

