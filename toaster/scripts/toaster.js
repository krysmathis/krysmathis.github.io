console.log('connected...')

/*
    1. requires a section or div called toaster

*/

const DeluxeToaster = function() {
    // Get the toaster element
    const toastContainer = document.querySelector(".toaster__container");

    return  Object.create(null, {
        "makeToast": {value: "test", enumerable: true}
    })
       
}   



// Get the toaster element
const toastContainer = document.querySelector(".toaster__container");

// clear the existing toaster
while(toastContainer.hasChildNodes()){
    toastContainer.removeChild(toastContainer.lastChild)
}

// append the ul element
const toasterUl = document.createElement("ul");
toasterUl.className = ("toaster")
toastContainer.appendChild(toasterUl);


// get the toast

const createToast = function(message, timeout) {
    
    const toaster = document.querySelector(".toaster");
    // get the toaster
    const toast = document.createElement("li");
    
    toastMessage = document.createTextNode(message);
    toast.appendChild(toastMessage);
    toast.className = "toaster__toast";

    if (toaster.hasChildNodes()) {
         toaster.insertBefore(toast, toaster.firstChild);
    } else {
        toaster.appendChild(toast);
    }

    // set expiration timing for the toast
    setTimeout(function() {
        toaster.removeChild(toast);
    }, timeout);
}

createToast("this is a message", 10000);
createToast("another message", 10000);

document.addEventListener("click", function(e) {
    if (e.target.id === "btn"){
        console.log("button clicked");
        createToast(Date.now(), 5000);
        return;
    }

    if (e.target.className === "toaster__toast") {
        const toaster = e.target.parentNode;
        // Make sure the toaster still has a child node
        if (toaster.hasChildNodes()) e.target.parentNode.removeChild(e.target);
        return;
    }
})

