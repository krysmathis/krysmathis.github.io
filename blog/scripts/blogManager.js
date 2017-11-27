// An object that will control the fetching and posting of blogs
// ETL object for blogs

// callback function for generating pagination
const Paginator = require("../../pagination/scripts/pagination");
const PersonalETL = require("../../scripts/personalETL");
const displayBlogs = require("./blog-controller");
const AdminManager = require("../../admin/scripts/admin-controller");
//const addEvents = require("./blog-admin-events");

const BlogManager = module.exports = function() {
    
    const config = {
        "displayOptions": {
            itemsPerPage: 5
        },
        "defaultPages": 3,
        "paginationEl": document.querySelector(".pagination"),
        "searchableProperties": ["headline", "content"],
        "dbConnection": "https://personal-site-3111d.firebaseio.com/blogs"
    };
    
    const dataFactory = require("./databaseManager");
    const transformer = require("./transformer");
    const blogDisplayer = require("./blog-controller");
    const paginator = require("../../pagination/scripts/pagination");

    return Object.assign({},
        dataFactory(config),
        transformer(config),
        blogDisplayer(config),
        paginator(config)

    );


};

const blogManager = BlogManager();

// ---- EVENT LISTENER FOR PAGINATION ----
document.querySelector(".pagination").addEventListener("click", function(e) {
    
    if (!blogManager.paginationHelpers.isValid(e)) {return;}
    // Update the blog posts
    const pageNumber = e.target.dataset.pageNum;
    
    blogManager.displayBlogs(pageNumber);
    // Update the pagination to store the new page #'s
    blogManager.paginationUpdate(e);


});

// ----- EVENT LISTENERS FOR SEARCH FORM ----- //
const searchInput = document.querySelector(".blog__search-input");

// clear the box when the form has the focus
searchInput.addEventListener("focus", () => {
    searchInput.value = "";
});

searchInput.addEventListener("keyup", function(event) {
    let searchString = event.target.value.toLowerCase();
    blogManager.search(searchString);
    blogManager.displayBlogs(1);
    blogManager.paginationInit(1);
});

document.querySelector(".blog__bnt-clear").addEventListener("click", ()=> {
    searchInput.value = "";
    blogManager.search("");
    blogManager.displayBlogs(1);
    blogManager.paginationInit();
});

// ----- EVENT LISTENERS FOR ADMIN FORM ---- //

console.log("blog manager from blm", blogManager);

    
module.exports = blogManager;