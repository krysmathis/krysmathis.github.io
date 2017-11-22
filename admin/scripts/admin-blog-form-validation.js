/*
    Form validation
    1. All text inputs should have a value
    2. The text area should contain at least three characters
    */
const getMissingParts = function () {
        
    // check inputs
    const blogParts = Array.from(document.querySelectorAll("input[class^='blogForm']"));
    const missingParts = [];
        
    blogParts.forEach(part => {
        if (part.value.length === 0) {
            missingParts.push({
                "field": part.name,
                "class": part.className,
                "message": "missing " + part.name
            });
        }
    });
        
    // check text area
    const blogTextAreaValue = document.querySelector("textarea[name='blog-content']").value;
    if (blogTextAreaValue.length < 3) {
        missingParts.push({
            "field": "blog-contents",
            "class": blogTextAreaValue.className,
            "message": "should contain at least 3 characters of content"
        });
    }
    return missingParts;
};
    
    /*
    The missing parts are stored here, extract and display them here
    */
const showErrors = function (missingParts) {
    let message = "<h3>!!!Unacceptable Submission!!!</h3> <ul>";
    const msgBlock = document.querySelector(".messageBlock");
        
    missingParts.forEach(part => message += `<li class="messageBlock__detail">Your ${part.field} is ${part.message}</li>`);
    message += "</ul>";
    msgBlock.style.display = "block";
    msgBlock.style.backgroundColor = "red";
    msgBlock.innerHTML = message;
};
    
const showSuccess = () => {
    const msgBlock = document.querySelector(".messageBlock");
    msgBlock.style.backgroundColor = "rgba(255,255,0,.75)";
    msgBlock.innerHTML = "You've created a new blog!";
    msgBlock.style.display = "block"; //show the element
    setTimeout(function () {
        msgBlock.style.display = "none";
    }, 10000);
};

module.exports = {showSuccess, showErrors, getMissingParts};