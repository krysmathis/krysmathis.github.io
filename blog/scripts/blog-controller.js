// TODO: verify the database exists

let currentBlogs = [];
let itemsPerPage = 5;

// function to return the blogs to show
const getBlogs = function (searchCriteria) {

    const blogDB = JSON.parse(localStorage.getItem("blog")) || {};
    const blogEntries = blogDB.blogEntries || [];

    // sort in descending order
    const sortedBlogEntries = blogEntries.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded))
    
    let filteredBlogEntries = [];    
    if (searchCriteria === undefined || searchCriteria === "") {
            // just return the sorted blogs
            filteredBlogEntries = sortedBlogEntries;
    } else {
            // return the filtered blogs
            filteredBlogEntries =
                sortedBlogEntries.filter(
                    blog =>
                    blog.headline.toLowerCase().includes(searchCriteria) ||
                    blog.content.toLowerCase().includes(searchCriteria)
                );
    }
    
    // set the global variable  
    currentBlogs = filteredBlogEntries;
    //setInitialPagination();
    return filteredBlogEntries;
        
}

/*
    Set the initial pagination once you have filtered your blog entries
    This call the pagination
*/
const setInitialPagination = function() {
   
    const numberOfItems = currentBlogs.length;
    const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);
    
    setPaginationByEls(numberOfPages,1);
    

    if (numberOfPages > 1) {
        document.querySelector(".pagination").style.visibility = "";
    } else {
        document.querySelector(".pagination").style.visibility = "hidden";
    }
    
}


const writeBlogs = function (pageNumber) {

    const blogs = currentBlogs;

    const blogsEl = document.getElementById("blog-posts");
    blogsEl.innerHTML = "";

    // don't display pagination if there are no blogs
    if (blogs.length < 1) {
        blogsEl.innerHTML = "No blogs found...";
        return;
    }

    // Only display the pages in the current page number
    const blogsToDisplay = blogs.slice(
        (pageNumber - 1) * itemsPerPage,
        pageNumber * itemsPerPage
    );  
        
    blogsToDisplay.forEach(function (entry) {
        let imageSrc = entry.imgHeader.startsWith("images") ? "../" + entry.imgHeader : entry.imgHeader;
        let html = `
            <article class="blog-post">
                <div class="blog-header">
                    <div class="blog-headline">${entry.headline}</div>
                    <div class="blog-date">${moment(entry.dateAdded).format("YYYY-MM-DD")}</div>
                </div>
                <div class="blog-img-header">
                    <img src="${imageSrc}">
                </div>
                <div class="blog-content">
                    ${entry.content}
                </div>
            
        `;

        html += `<div class="blog-footer project-tag"><ul>`;

        entry.tags.forEach((currentTag) => html += `<li>${currentTag}</li>`)


        html += "</ul></div></article>";
        blogsEl.innerHTML += html;

    });

}

// ---- EVENT LISTENER FOR PAGINATION ----
document.querySelector('.pagination').addEventListener("click", function(e) {
    
    if (!isValidPagination(e)) {return}

    const pageNumber = e.target.dataset.pageNum;
    writeBlogs(pageNumber);

});

getBlogs(""); // returns all blogs
writeBlogs(1); // writes the first page of blogs
setInitialPagination(); // initiates the pagination div