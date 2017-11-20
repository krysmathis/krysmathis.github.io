// An object that will control the fetching and posting of blogs
// ETL object for blogs

// callback function for generating pagination
//const {setPaginationByEls, isValidPagination, updatePagination} = require("../../pagination/scripts/pagination");
const Paginator = require("../../pagination/scripts/pagination");
const getBlogs = $.ajax({url: "https://personal-site-3111d.firebaseio.com/blogs.json"});
const personalETL = require("../../scripts/personalETL");

const BlogManager = Object.create(null, {

    "data": {
        value: [],
        writable: true,
        enumerable: true
    },

    "filteredData": {
        value: [],
        writable: true,
        enumerable: true
    },

    "paginationObj": {
        value: Paginator,
        writable: true,
        enumerable: true
    },

    "filterBySearchCriteria": {
        value: function(searchCriteria) {
            // sort in descending order
            const sortedBlogEntries = this.data.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
            if (searchCriteria === undefined || searchCriteria === "") {
                // just return the sorted blogs
                this.filteredData = sortedBlogEntries;
            } else {
                // return the filtered blogs
                this.filteredData =
                        sortedBlogEntries.filter(
                            blog =>
                                blog.headline.toLowerCase().includes(searchCriteria) ||
                                blog.content.toLowerCase().includes(searchCriteria)
                        );
            }
            this.paginate();
            this.display(1);

        }
    },
    "filterByTag": {
        value: function(tag) {
            // Get records with matching tags
            const matchedRecords = [];
            this.data.forEach(record => {
                record.tags.forEach(currentTag =>{
                    if (currentTag === tag) 
                        matchedRecords.push(record);
                    return;
                });
            });
            this.filteredData = matchedRecords;
            this.paginate();
            this.display(1);
        }
    },

    "display": {
        value: function(pageNumber) {

            const blogs = this.filteredData;
            
            // Clear out all existing blog elements
            const blogsEl = document.getElementById("blog-posts");
            while (blogsEl.hasChildNodes()) {
                blogsEl.removeChild(blogsEl.lastChild);
            }
                
            // don't display paginate if there are no blogs
            if (blogs.length < 1) {
                blogsEl.innerHTML = "No blogs found...";
                return;
            }
                
            // Only display the pages in the current page number
            const blogsToDisplay = blogs.slice(
                (pageNumber - 1) * this.displayOptions.itemsPerPage,
                pageNumber * this.displayOptions.itemsPerPage
            );  
                        
            blogsToDisplay.forEach( entry => {
                
                let imageSrc = entry.imgHeader.startsWith("images") ? "../" + entry.imgHeader : entry.imgHeader;
                        
                // main element
                let blogPost = document.createElement("article");
                blogPost.className = "blog__post";
            
                let blogHeader = document.createElement("div");
                blogHeader.className = "blog__header";
            
                let blogHeadline = document.createElement("div");
                blogHeadline.className = "blog__headline";
                let blogHeadlineText = document.createTextNode(entry.headline);
                blogHeadline.appendChild(blogHeadlineText);
            
                let blogDate = document.createElement("div");
                blogDate.className = "blog__date";
                let blogDateText = document.createTextNode(moment(entry.dateAdded).format("YYYY-MM-DD"));
                blogDate.appendChild(blogDateText);
            
                // append to the blogHeader div
                blogHeader.appendChild(blogHeadline);
                blogHeader.appendChild(blogDate);
                            
                // append to main div
                blogPost.appendChild(blogHeader);
                        
                // Img div
                let blogImgContainer = document.createElement("div");
                blogImgContainer.className = "blog__img-header";
                // Image
                let blogImg = document.createElement("img");
                blogImg.src = imageSrc;
                blogImgContainer.appendChild(blogImg);
                blogPost.appendChild(blogImgContainer);
            
                // Content
                let blogContent = document.createElement("div");
                blogContent.className = "blog__content";
                blogContent.innerHTML = entry.content;
                blogPost.appendChild(blogContent);
            
                // Tags Container
                let blogTags = document.createElement("div");
                blogTags.className = "blog__footer project-tag";
                let blogTagList = document.createElement("ul");
                        
                // do the tags
                entry.tags.forEach(currentTag => 
                {
                    let tag = document.createElement("li");
                    tag.className = "blog__tag";
                    tag.appendChild(document.createTextNode(currentTag));
                    blogTagList.appendChild(tag);
                            
                    // add event listener for on click
                    tag.addEventListener("click", (e) => {
                        const tagTxt = e.target.innerHTML;
                        this.filterByTag(tagTxt);
                    });
                });
            
                blogTags.appendChild(blogTagList);
                blogPost.appendChild(blogTags);
            
            
                // for loop for adding the tags
                blogsEl.appendChild(blogPost);
            });
            
            
        },
        enumerable: true
    },
    
    "displayOptions": {
        value: {
            "itemsPerPage": 5
        },
        "writable": true
    },

    "paginate": {
        // takes a callback function from the pagination object
        value: function() {
            
            const numberOfItems = this.filteredData.length;
            const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);

            this.paginationObj.init(numberOfPages,1);
            
            // determine how to handle the pagination display
            if (numberOfPages > 1) {
                document.querySelector(".pagination").style.visibility = "";
            } else {
                document.querySelector(".pagination").style.visibility = "hidden";
            }
        }
    },

    "search": {
        value: function(searchString) {
            if (searchString.length >=3) {
                this.filterBySearchCriteria(searchString);
            } else {
                this.filterBySearchCriteria("");
            }
        }
    }
});

/**
 * Init for the blog page
 */
getBlogs
    .then(result => {
        BlogManager.data = result;
        BlogManager.filterBySearchCriteria("");
    });

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

module.export = BlogManager;