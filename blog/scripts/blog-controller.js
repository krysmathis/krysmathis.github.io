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
            filteredBlogEntries = sortedBlogEntries;
    } else {
            filteredBlogEntries =
            sortedBlogEntries.filter(function (blog) {
                return blog.headline.toLowerCase().includes(searchCriteria) ||
                blog.content.toLowerCase().includes(searchCriteria);
            }) || [];
    }
            // set the global    
            currentBlogs = filteredBlogEntries;
            setInitialPagination();
            return filteredBlogEntries || [];
        
}

const setInitialPagination = function() {
    const numberOfItems = currentBlogs.length;
    const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);
    
    setPagination(numberOfPages,1);
    document.querySelector(".pagination__page").className = "pagination__page--selected";
}

const isValidPagination = function(event) {
    const validElements = ["pagination__page", "pagination__page--selected", "pagination__previous", "pagination__next"]
    let isValid = false;

    validElements.forEach(function(element){
        if (event.target.className === element) { return true }
    })
        
    return false;
}

document.querySelector('.pagination').addEventListener("click", function(e) {
        
        if (!isValidPagination) {return}
        console.log("cleeked");

        const pageNumber = e.target.dataset.pageNum;
        writeBlogs(currentBlogs, pageNumber);
});



const writeBlogs = function (currentBlogs, pageNumber) {

    const blogs = currentBlogs;

    const blogsEl = document.getElementById("blog-posts");
    blogsEl.innerHTML = "";
    // 2.2 Programically generate the pagination section
    if (blogs.length < 1) {
        blogsEl.innerHTML = "No blogs found...";
        // don't display pagination if there are no blogs
        return;
    }

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

writeBlogs(getBlogs(""),1);