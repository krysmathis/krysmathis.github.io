{

// get the database from local storage, or empty object if null
const blog = JSON.parse(localStorage.getItem("blog")) || {};

// get the blog entries or empty object if null
blog.blogEntries = blog.blogEntries || [];

document.querySelector(".blogForm__gotoBlog").addEventListener("click", function(e){
    window.location.href="../blog/index.html";
});

// Add event listener to the submit button
    document.querySelector(".blogForm__submit").addEventListener("click", function(e){
        /*
            Collect the input elements
            const blogObjectFactory = function (headline, dateAdded, author, imgHeader, content, ...tags) {
        */
        const tags = document.querySelector(".blogForm__tags").value.split(" ")

        const newBlogArticle = blogObjectFactory (
            document.querySelector(".blogForm__headline").value, //headline
            new moment().format("YYYY-MM-DD"), // date added
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

    })
}