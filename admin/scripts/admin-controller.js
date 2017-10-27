{

// get the database from local storage, or empty object if null
const blog = JSON.parse(localStorage.getItem("blog")) || {};

// get the blog entries or empty object if null
blog.blogEntries = blog.blogEntries || [];

const getMissingParts = function() {
    // check inputs
    const blogParts = Array.from(document.querySelectorAll("input[class^='blogForm']"));
    const missingParts = [];
    blogParts.forEach( part => {
        if (part.value.length === 0 ){missingParts.push({"field": part.name, "class": part.className, "message": "missing " + part.name })}
    })
    // check text area
    const blogTextAreaValue = document.querySelector("textarea[name='blog-content']").value;
    if (blogTextAreaValue.length < 3) {
        missingParts.push({"field": "blog-contents", "class": blogTextAreaValue.className, "message": "...at least 3 characters of content"})
    }
    
    return missingParts;
}

const addNewBlogArticleToDb = function() {
    
    const tags = document.querySelector(".blogForm__tags").value.split(" ")
    
    const newBlogArticle = blogObjectFactory (
        document.querySelector(".blogForm__headline").value, //headline
        new moment(), // date added
        document.querySelector(".blogForm__author").value, //author
        document.querySelector(".blogForm__image").value, // imgheader
        document.querySelector(".blogForm__content").value, //content
        tags
    )
    /*         
    Add the article to the blog array, then add it to the db in
    Add it to local storage 
    */
    blog.blogEntries.unshift(newBlogArticle);
    localStorage.setItem("blog",JSON.stringify(blog))
    
}

/*
The missing parts are stored here, extract and display them here
*/
const showErrors = function(missingParts) {
    let message = "!!!Unacceptable Submission!!!\n";
    missingParts.forEach( part => message += `${part.field}: ${part.message}\n`)
    alert(message);
}

// Add event listener to the submit button
document.querySelector(".blogForm__btnSave").addEventListener("click", function(e){
    /*
    Collect the input elements
    const blogObjectFactory = function (headline, dateAdded, author, imgHeader, content, ...tags)
    
    Objective is to determine whether or not to accept or reject this submission
    */
    const missingParts = getMissingParts();
    
    if (missingParts.length === 0) {
        // no errors proceed to add blog
        addNewBlogArticleToDb();
    } else {
        // display errors, do not add blog
        showErrors(missingParts);
    }
    
    
})

document.querySelector(".blogForm__btnGoToBlog").addEventListener("click", function(e){
    window.location.href="../blog/index.html";
});

}  // end of castle wall