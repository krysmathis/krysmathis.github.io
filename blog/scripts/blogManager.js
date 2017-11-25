// An object that will control the fetching and posting of blogs
// ETL object for blogs

// callback function for generating pagination
const Paginator = require("../../pagination/scripts/pagination");
const PersonalETL = require("../../scripts/personalETL");
const displayBlogs = require("./blog-controller");
const AdminManager = require("../../admin/scripts/admin-controller");
//const addEvents = require("./blog-admin-events");

const BlogManager = module.exports = Object.create(PersonalETL, {
    
    "load": {
        value: function() {
            $.ajax({url: "https://personal-site-3111d.firebaseio.com/blogs.json"})
                .then(result => {
                    this.data = result;
                    this.filteredData = result;
                    this.filterBySearchCriteria("");
                    AdminManager(this.data);
                    // blogAdmin update goes here
                    //blogAdministrator.update();
                });
        }
    },

    "add": {
        value: function(obj) {
            $.ajax({
                url: "https://personal-site-3111d.firebaseio.com/blogs/.json",
                method: "POST",
                data: JSON.stringify(obj)
            }).then(() => {
                this.load();
            });
    
        }
    },

    "update": {
        value: function(pid, obj) {
            $.ajax({
                url: `https://personal-site-3111d.firebaseio.com/blogs/${pid}/.json`,
                method: "PUT",
                data: JSON.stringify(obj)
            }).then(() => {
                this.load();
            });
        }
    },

    "delete": {
        value: function(pid) {
            $.ajax({
                url: `https://personal-site-3111d.firebaseio.com/blogs/${pid}/.json`,
                method: "DELETE"
            }).then(r => {
                this.load();
            });
        }
    },

    "paginationObj": {
        value: Paginator(document.querySelector(".pagination")),
        writable: true,
        enumerable: true
    },

    "filterBySearchCriteria": {
        value: function(searchCriteria) {
            // sort in descending order
            //const sortedBlogEntries = this.data.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
            if (searchCriteria === undefined || searchCriteria === "") {
                // just return the sorted blogs
                this.filteredData = this.data;
            } else {
                // return the filtered blogs
                this.filteredData =
                        this.data.filter(
                            blog =>
                                blog.headline.toLowerCase().includes(searchCriteria) ||
                                blog.content.toLowerCase().includes(searchCriteria)
                        );
            }
            this.paginate();
            this.display(1);

        }
    },

    "display": {
        value: displayBlogs,
        enumerable: true
    },
    
    "displayOptions": {
        value: {
            "itemsPerPage": 5
        },
        "writable": true
    },

    "search": {
        value: function(searchString) {
            if (searchString.length >=3) {
                this.filterBySearchCriteria(searchString);
            } else {
                this.filterBySearchCriteria("");
            }
        },
        writable: true,
        enumerable: true
    },

    "paginate": {
        // takes a callback function from the pagination object
        value: function() {
            
            const numberOfItems = Object.keys(this.filteredData).length;
            const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);  
            this.paginationObj.init(numberOfPages,1);
            
            // determine how to handle the pagination display
            if (numberOfPages > 1) {
                //document.querySelector(".pagination").style.visibility = "visible";
            } else {
                //document.querySelector(".pagination").style.visibility = "hidden";
            }
        }
    },

});

/**
 * Init for the blog page
 */
//BlogManager.load();

// ---- EVENT LISTENER FOR PAGINATION ----
document.querySelector(".pagination").addEventListener("click", function(e) {
    
    if (!BlogManager.paginationObj.helpers.isValid(e)) {return;}
    // Update the blog posts
    const pageNumber = e.target.dataset.pageNum;
    
    BlogManager.display(pageNumber);
    // Update the pagination to store the new page #'s
    BlogManager.paginationObj.update(e);


});

// ----- EVENT LISTENERS FOR SEARCH FORM ----- //
const searchInput = document.querySelector(".blog__search-input");

// clear the box when the form has the focus
searchInput.addEventListener("focus", () => {
    searchInput.value = "";
});

searchInput.addEventListener("keyup", function(event) {
    let searchString = event.target.value.toLowerCase();
    BlogManager.search(searchString);
});

document.querySelector(".blog__bnt-clear").addEventListener("click", ()=> {
    searchInput.value = "";
    BlogManager.search("");
});

// ----- EVENT LISTENERS FOR ADMIN FORM ---- //

console.log("blog manager from blm", BlogManager);
