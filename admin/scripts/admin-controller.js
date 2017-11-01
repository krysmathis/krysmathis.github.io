{

// get the database from local storage, or empty object if null
const blog = JSON.parse(localStorage.getItem("blog")) || {};

// get the blog entries or empty object if null
blog.blogEntries = blog.blogEntries || [];

let editMode = false;
let currentBlog = null;

const setEditMode = (bool) => {
    editMode = bool;

    const msgBlock = document.querySelector(".messageBlock");
    if (bool) {
         msgBlock.style.display = "block";
        msgBlock.innerHTML = "Edit Mode!"
    }
    else {
        msgBlock.style.display = "none";
    }
}

/*
    ===================================================
    Generate a list of the current blogs for editing
    The records will go into a table
    ===================================================
*/
const listCurrentBlogs = () => {
    let html = ""
    blog.blogEntries
        .sort((a,b)=>b.dateAdded - a.dateAdded)
        .forEach(entry => {
        html += `
        <tr class="blogList__entry">
            <th class="blogList__headline">${entry.headline}</th>
            <td class="blogList__preview">${entry.content.substring(0,30).replace(/<(?:.|\n)*?>/gm, '')}</td>
            <td class="blogList__date">${entry.dateAdded}</td>
            <td class="blogList__button-row"><button class="blogList__btn-edit" data-blog-id="${entry.id}">Edit</button></td>
        </tr>
        `
        let x = 1;
    })

    document.querySelector(".blogList__body").innerHTML = html;
}

// Init blog list
listCurrentBlogs();

const addUpdateBlogArticleToDb = function() {
    
    const tags = document.querySelector(".blogForm__tags").value.split(", ")

    if (editMode) {
        //get index
            // Find the index of the selected article
            const blogIndex = blog.blogEntries.findIndex(
                a => a.id === currentBlog.id
            )

            blog.blogEntries[blogIndex] = blogObjectFactory (
                document.querySelector(".blogForm__headline").value, //headline
                document.querySelector(".blogForm__date").value,
                document.querySelector(".blogForm__author").value, //author
                document.querySelector(".blogForm__image").value, // imgheader
                document.querySelector(".blogForm__content").value, //content
                tags,
                currentBlog.id
            );
            listCurrentBlogs();
            setEditMode(false);
        //modify existing array
    } else {
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
    }
    
    // regardless of edit mode push the changes to the database
    localStorage.setItem("blog",JSON.stringify(blog))

    
}

// store the current blog as the number
const getCurrentBlog = (blogId) => {
    currentBlog = blog.blogEntries.find(function(_blog){
        return _blog.id === parseInt(blogId);
    })
}

const populateBlogForm = () => {
    document.querySelector(".blogForm__tags").value = currentBlog.tags.join(", ");
    document.querySelector(".blogForm__headline").value = currentBlog.headline;
    document.querySelector(".blogForm__author").value = currentBlog.author;
    document.querySelector(".blogForm__date").value = currentBlog.dateAdded;
    document.querySelector(".blogForm__image").value = currentBlog.imgHeader;
    document.querySelector(".blogForm__content").value = currentBlog.content;
    setEditMode(true);
}

/*
    Form validation
    1. All text inputs should have a value
    2. The text area should contain at least three characters
*/
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
        missingParts.push({"field": "blog-contents", "class": blogTextAreaValue.className, "message": "should contain at least 3 characters of content"})
    }
    return missingParts;
}

/*
The missing parts are stored here, extract and display them here
*/
const showErrors = function(missingParts) {
    let message = "<h3>!!!Unacceptable Submission!!!</h3> <ul>";
    const msgBlock = document.querySelector(".messageBlock");

    missingParts.forEach( part => message += `<li class="messageBlock__detail">Your ${part.field} is ${part.message}</li>`)
    message += "</ul>"
    msgBlock.style.display="block";
    msgBlock.innerHTML = message;
}



//---- EVENT LISTENERS ----- 

document.querySelector(".blogForm__btnGoToBlog").addEventListener("click", function(e){
    window.location.href="../blog/index.html";
});

// Click on the edit button
document.querySelector(".blogList__body").addEventListener("click", e => {

    if (e.target.className === "blogList__btn-edit") {
        const blogId = e.target.dataset.blogId;
        getCurrentBlog(blogId);
        populateBlogForm();
    }
    
});

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
        addUpdateBlogArticleToDb();
    } else {
        // display errors, do not add blog
        showErrors(missingParts);
    }
    
    
})

}  // end of castle wall