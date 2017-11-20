(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../../pagination/scripts/pagination":3,"../../scripts/personalETL":5}],2:[function(require,module,exports){
const populateNavBar = (function(brand){
    
    const navs = new Map();
    
    /**
        *   The map will hold the labels and links for the navbar
        **/
    // For testing purposes:
    navs.set("Home", {"label": "Home", "link": "../index.html", "buttonClass": "btn-nav__home","targetId": "about"}),
    navs.set("Projects", {"label": "Projects", "link": "../projects", "buttonClass": "btn-nav__projects", "targetId": "projects"}),
    navs.set("Blog", {"label": "Blog", "link": "#blogs", "buttonClass": "btn-nav__blog", "targetId":"blogs"}),
    navs.set("Resume", {"label": "Resume", "link": "../resume", "buttonClass": "btn-nav__resume", "targetId": "resume"}),
    navs.set("Contact", {"label": "Contact", "link": "../contact", "buttonClass": "btn-nav__contact", "targetId": "contact"});
    
    const navBar = document.querySelector(".nav");
    // create the ul element to stick inside the nav
    const newList = document.createElement("ul");
    newList.className = "nav__list";
        
    const newBrandLi = document.createElement("li");
    newBrandLi.className = "nav__brand";
        
    const brandText = document.createTextNode(brand);
    newBrandLi.appendChild(brandText);
    newList.appendChild(newBrandLi);
        
    newBrandLi.addEventListener("click", () => {
        document.location.href = navs.get("Home").link;
    });

    // scroll to a part of the page and account for the navbar height
    const goToId = function(nav) {
        let navBarHeight = navBar.clientHeight;
        document.getElementById(nav.targetId).scrollIntoView();
        window.scrollBy(0,-(navBarHeight+10));
    };

    navs.forEach(
        nav => {
            // create a new list element
            let newNavItem = document.createElement("li");
            newNavItem.className = nav.buttonClass + " nav__link";
    
            let newNavItemLabel = document.createTextNode(nav.label);
            newNavItem.appendChild(newNavItemLabel);
            
            newNavItem.addEventListener("click",() => {
                // Scroll down and account for the height of the navbar
                // *** JQUERY ****

                // let headerHeight = $(".nav").height()+20;
                goToId(nav);
                
                // $("html, body").animate({
                //     scrollTop: $(nav.targetId).offset().top - headerHeight
                // }, 200);
            });
    
            newList.appendChild(newNavItem);
    
        }
    );
    navBar.appendChild(newList);
    
    /**
         * Building the dropdown menu
         */
    const hamburgerMenu = document.createElement("div");
    hamburgerMenu.className = "menu-col";
    for (let i = 0; i < 3; i++) {
        let newMenuBar = document.createElement("div");
        newMenuBar.className = "menu-col__bar";
        hamburgerMenu.appendChild(newMenuBar);
    }
    newList.appendChild(hamburgerMenu);
    
    const menu = document.createElement("div");
    menu.className = "menu-list";
    const menuList = document.createElement("ul");
    menuList.className = "menu-list__list";
    menu.appendChild(menuList);
    
    navs.forEach(
        nav => {
            let menuItem = document.createElement("li");
            menuItem.innerHTML = `${nav.label}`;
            menuItem.className = "menu-list__item";
            menuList.appendChild(menuItem);
            menuItem.addEventListener("click",() => {
                document.location.href = nav.link;
            });
        }
    );
    
    navBar.appendChild(menu);
    
});

/**
    * Hamburger Menu
    * That will look like something interesting
    */
const addNavbarMenuEventListeners = function() {
    const menu = document.querySelector(".menu-list"); 
    document.querySelector(".menu-col").addEventListener("click", ()=>{
        
        const displayStyle = menu.style.display;
        if (displayStyle === "none" || displayStyle === "") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });
        
    document.querySelector(".menu-list").addEventListener("click", ()=>{
            
        const displayStyle = menu.style.display;
        if (displayStyle === "none" || displayStyle === "") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });
        
    /**
         * If the user resizes the window the drop down menu will disappear
         */
    window.addEventListener("resize", () => {
        menu.style.display = "none";
    });
};

module.exports = function populateNavComponents(brand) {
    populateNavBar(brand);
    addNavbarMenuEventListeners();
};


},{}],3:[function(require,module,exports){
/*
    REQUIREMENTS: 
        HTML: a <section> with the class of "pagination". 
        JS: You'll need to send in the number of pages to display
*/

const Paginator = 

    Object.create(null, {
        
        "init": {
            value: function (numberOfPages, startPage = 1) {
                const paginationEl = document.querySelector(".pagination");
                // reset the pagination by removing all the child nodes
                while (paginationEl.hasChildNodes()) {
                    paginationEl.removeChild(paginationEl.lastChild);
                }
                /*
                        ============================================================
                        Create the pagination elements
                        ============================================================
                    */
                // Start with the previous arrow
                const prev = document.createElement("span");
                prev.dataset.pageNum=(startPage-1).toString();
                prev.className="pagination__previous";
                const prevText = document.createTextNode("<");
                prev.appendChild(prevText);
            
                paginationEl.appendChild(prev);
            
                // create an element to represent each page
                for (let i = 0; i < numberOfPages; i++) {
                        
                    let link = document.createElement("span");
                    link.dataset.pageNum=`${i+startPage}`;
                    link.className="pagination__page";
                    link.appendChild(document.createTextNode(`${i+startPage}`));
                    paginationEl.appendChild(link);
               
                }
                   
                // create the next arrow button
                const next = document.createElement("span");
                next.dataset.pageNum=(startPage+1).toString();
                next.className="pagination__next";
                const nextText = document.createTextNode(">");
                next.appendChild(nextText);
                paginationEl.appendChild(next);
                    
                // set the previous page selector to invisible and the first element to selected
                document.querySelector(".pagination__previous").style.visibility = "hidden";
                document.querySelector(".pagination__page").className = "pagination__page--selected";
            }

        },
        "update": {
            value: function(event) {
                if (!this.helpers.isValid(event)) {
                    return;
                }
            
                // capture the pageNum value from clicked element. Parse it as an int
                // because the program will need to do math with it later
                const clickedPageNumber = parseInt(event.target.dataset.pageNum);
                
                /*  
                    Only loop through the numbered elements excluding the arrows
                    reset the class name to remove the modifier class
                    Also need to capture the number of pages
                */ 
                const pageNums = document.querySelectorAll("[class^='pagination__page'");
                Array.from(pageNums).forEach(function (page) {     
                    page.className = "pagination__page";
                    if (clickedPageNumber.toString() === page.dataset.pageNum) {
                        page.className = "pagination__page--selected";
                    }
                }, this);
                
                const maxPage = parseInt(pageNums[pageNums.length-1].dataset.pageNum);
                const minPage = parseInt(pageNums[0].dataset.pageNum);
                
                const previousEl = document.querySelector(".pagination__previous");
                const nextEl = document.querySelector(".pagination__next");
            
                // Behavior for the arrow keys
                if (clickedPageNumber === minPage) {
                    previousEl.style.visibility = "hidden";
                } else {
                    previousEl.style.visibility = "";
                    previousEl.dataset.pageNum = clickedPageNumber-1;
                }
                
                if (clickedPageNumber + 1 > maxPage) {  
                    nextEl.style.visibility = "hidden";
                } else {
                    nextEl.style.visibility = "";
                    nextEl.dataset.pageNum = clickedPageNumber+1;
                }
            }
        },
        "helpers": {
            value: {

                "isValid": function(event) {
                    const validElements = ["pagination__page", "pagination__page--selected", "pagination__previous", "pagination__next"];
                    let isValid = false;
                
                    validElements.forEach(function(element){
                        if (event.target.className === element) { isValid = true;}
                    });
                        
                    return isValid;
                }
            }
        }
    });


module.exports = Paginator;
},{}],4:[function(require,module,exports){
const navbar = require("../navbar/scripts/navbar");
//const blogs = require("../blog/scripts/blog-controller");
const Blogger = require("../blog/scripts/blogManager");

navbar("Krys Mathis");
},{"../blog/scripts/blogManager":1,"../navbar/scripts/navbar":2}],5:[function(require,module,exports){
const personalETL = 
    Object.create(null,{
            
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

        "filterBySearchCriteria": {
            value: {},
            writable: true,
            enumerable: true
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
            
        "paginationObj": {
            value: {},
            writable: true,
            enumerable: true
        },
        
        "display": {
            value: {},
            writable: true,
            enumerable: true
        },

        "displayOptions": {
            value: {
                "itemsPerPage": 5 
            },
            writable: true
        },
    
        "paginate": {
            // takes a callback function from the pagination object
            value: function() {
                
                const numberOfItems = this.filteredData.length;
                const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);
                
                this.Paginator.init(numberOfPages,1);
                
                // determine how to handle the pagination display
                if (numberOfPages > 1) {
                    document.querySelector(".pagination").style.visibility = "";
                } else {
                    document.querySelector(".pagination").style.visibility = "hidden";
                }
            },
            writable: true
        },
    
        "search": {
            value: function(searchString) {
                if (searchString.length >=3) {
                    this.filterBySearchCriteria(searchString);
                } else {
                    this.filterBySearchCriteria("");
                }
            },
            writable: true
        }



    });
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJibG9nL3NjcmlwdHMvYmxvZ01hbmFnZXIuanMiLCJuYXZiYXIvc2NyaXB0cy9uYXZiYXIuanMiLCJwYWdpbmF0aW9uL3NjcmlwdHMvcGFnaW5hdGlvbi5qcyIsInNjcmlwdHMvbWFpbi5qcyIsInNjcmlwdHMvcGVyc29uYWxFVEwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEFuIG9iamVjdCB0aGF0IHdpbGwgY29udHJvbCB0aGUgZmV0Y2hpbmcgYW5kIHBvc3Rpbmcgb2YgYmxvZ3Ncbi8vIEVUTCBvYmplY3QgZm9yIGJsb2dzXG5cbi8vIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBnZW5lcmF0aW5nIHBhZ2luYXRpb25cbi8vY29uc3Qge3NldFBhZ2luYXRpb25CeUVscywgaXNWYWxpZFBhZ2luYXRpb24sIHVwZGF0ZVBhZ2luYXRpb259ID0gcmVxdWlyZShcIi4uLy4uL3BhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uXCIpO1xuY29uc3QgUGFnaW5hdG9yID0gcmVxdWlyZShcIi4uLy4uL3BhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uXCIpO1xuY29uc3QgZ2V0QmxvZ3MgPSAkLmFqYXgoe3VybDogXCJodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vYmxvZ3MuanNvblwifSk7XG5jb25zdCBwZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuXG5jb25zdCBCbG9nTWFuYWdlciA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuXG4gICAgXCJkYXRhXCI6IHtcbiAgICAgICAgdmFsdWU6IFtdLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlcmVkRGF0YVwiOiB7XG4gICAgICAgIHZhbHVlOiBbXSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgdmFsdWU6IFBhZ2luYXRvcixcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgXCJmaWx0ZXJCeVNlYXJjaENyaXRlcmlhXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHNlYXJjaENyaXRlcmlhKSB7XG4gICAgICAgICAgICAvLyBzb3J0IGluIGRlc2NlbmRpbmcgb3JkZXJcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZEJsb2dFbnRyaWVzID0gdGhpcy5kYXRhLnNvcnQoKGEsIGIpID0+IG1vbWVudChiLmRhdGVBZGRlZCkgLSBtb21lbnQoYS5kYXRlQWRkZWQpKTtcbiAgICAgICAgICAgIGlmIChzZWFyY2hDcml0ZXJpYSA9PT0gdW5kZWZpbmVkIHx8IHNlYXJjaENyaXRlcmlhID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgLy8ganVzdCByZXR1cm4gdGhlIHNvcnRlZCBibG9nc1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gc29ydGVkQmxvZ0VudHJpZXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0aGUgZmlsdGVyZWQgYmxvZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWRCbG9nRW50cmllcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvZyA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9nLmhlYWRsaW5lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2cuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaENyaXRlcmlhKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgxKTtcblxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImZpbHRlckJ5VGFnXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHRhZykge1xuICAgICAgICAgICAgLy8gR2V0IHJlY29yZHMgd2l0aCBtYXRjaGluZyB0YWdzXG4gICAgICAgICAgICBjb25zdCBtYXRjaGVkUmVjb3JkcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5kYXRhLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICByZWNvcmQudGFncy5mb3JFYWNoKGN1cnJlbnRUYWcgPT57XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGFnID09PSB0YWcpIFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZFJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gbWF0Y2hlZFJlY29yZHM7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRlKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJkaXNwbGF5XCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHBhZ2VOdW1iZXIpIHtcblxuICAgICAgICAgICAgY29uc3QgYmxvZ3MgPSB0aGlzLmZpbHRlcmVkRGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2xlYXIgb3V0IGFsbCBleGlzdGluZyBibG9nIGVsZW1lbnRzXG4gICAgICAgICAgICBjb25zdCBibG9nc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJibG9nLXBvc3RzXCIpO1xuICAgICAgICAgICAgd2hpbGUgKGJsb2dzRWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgYmxvZ3NFbC5yZW1vdmVDaGlsZChibG9nc0VsLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBkb24ndCBkaXNwbGF5IHBhZ2luYXRlIGlmIHRoZXJlIGFyZSBubyBibG9nc1xuICAgICAgICAgICAgaWYgKGJsb2dzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICBibG9nc0VsLmlubmVySFRNTCA9IFwiTm8gYmxvZ3MgZm91bmQuLi5cIjtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBPbmx5IGRpc3BsYXkgdGhlIHBhZ2VzIGluIHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyXG4gICAgICAgICAgICBjb25zdCBibG9nc1RvRGlzcGxheSA9IGJsb2dzLnNsaWNlKFxuICAgICAgICAgICAgICAgIChwYWdlTnVtYmVyIC0gMSkgKiB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgICAgICAgICBwYWdlTnVtYmVyICogdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2VcbiAgICAgICAgICAgICk7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgYmxvZ3NUb0Rpc3BsYXkuZm9yRWFjaCggZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBpbWFnZVNyYyA9IGVudHJ5LmltZ0hlYWRlci5zdGFydHNXaXRoKFwiaW1hZ2VzXCIpID8gXCIuLi9cIiArIGVudHJ5LmltZ0hlYWRlciA6IGVudHJ5LmltZ0hlYWRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIG1haW4gZWxlbWVudFxuICAgICAgICAgICAgICAgIGxldCBibG9nUG9zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhcnRpY2xlXCIpO1xuICAgICAgICAgICAgICAgIGJsb2dQb3N0LmNsYXNzTmFtZSA9IFwiYmxvZ19fcG9zdFwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGJsb2dIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2dIZWFkZXIuY2xhc3NOYW1lID0gXCJibG9nX19oZWFkZXJcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBibG9nSGVhZGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2dIZWFkbGluZS5jbGFzc05hbWUgPSBcImJsb2dfX2hlYWRsaW5lXCI7XG4gICAgICAgICAgICAgICAgbGV0IGJsb2dIZWFkbGluZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlbnRyeS5oZWFkbGluZSk7XG4gICAgICAgICAgICAgICAgYmxvZ0hlYWRsaW5lLmFwcGVuZENoaWxkKGJsb2dIZWFkbGluZVRleHQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGJsb2dEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9nRGF0ZS5jbGFzc05hbWUgPSBcImJsb2dfX2RhdGVcIjtcbiAgICAgICAgICAgICAgICBsZXQgYmxvZ0RhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobW9tZW50KGVudHJ5LmRhdGVBZGRlZCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgICAgICAgICAgYmxvZ0RhdGUuYXBwZW5kQ2hpbGQoYmxvZ0RhdGVUZXh0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFwcGVuZCB0byB0aGUgYmxvZ0hlYWRlciBkaXZcbiAgICAgICAgICAgICAgICBibG9nSGVhZGVyLmFwcGVuZENoaWxkKGJsb2dIZWFkbGluZSk7XG4gICAgICAgICAgICAgICAgYmxvZ0hlYWRlci5hcHBlbmRDaGlsZChibG9nRGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYXBwZW5kIHRvIG1haW4gZGl2XG4gICAgICAgICAgICAgICAgYmxvZ1Bvc3QuYXBwZW5kQ2hpbGQoYmxvZ0hlYWRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBJbWcgZGl2XG4gICAgICAgICAgICAgICAgbGV0IGJsb2dJbWdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2dJbWdDb250YWluZXIuY2xhc3NOYW1lID0gXCJibG9nX19pbWctaGVhZGVyXCI7XG4gICAgICAgICAgICAgICAgLy8gSW1hZ2VcbiAgICAgICAgICAgICAgICBsZXQgYmxvZ0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICAgICAgICAgYmxvZ0ltZy5zcmMgPSBpbWFnZVNyYztcbiAgICAgICAgICAgICAgICBibG9nSW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2dJbWcpO1xuICAgICAgICAgICAgICAgIGJsb2dQb3N0LmFwcGVuZENoaWxkKGJsb2dJbWdDb250YWluZXIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQ29udGVudFxuICAgICAgICAgICAgICAgIGxldCBibG9nQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYmxvZ0NvbnRlbnQuY2xhc3NOYW1lID0gXCJibG9nX19jb250ZW50XCI7XG4gICAgICAgICAgICAgICAgYmxvZ0NvbnRlbnQuaW5uZXJIVE1MID0gZW50cnkuY29udGVudDtcbiAgICAgICAgICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nQ29udGVudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBUYWdzIENvbnRhaW5lclxuICAgICAgICAgICAgICAgIGxldCBibG9nVGFncyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYmxvZ1RhZ3MuY2xhc3NOYW1lID0gXCJibG9nX19mb290ZXIgcHJvamVjdC10YWdcIjtcbiAgICAgICAgICAgICAgICBsZXQgYmxvZ1RhZ0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBkbyB0aGUgdGFnc1xuICAgICAgICAgICAgICAgIGVudHJ5LnRhZ3MuZm9yRWFjaChjdXJyZW50VGFnID0+IFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGFnLmNsYXNzTmFtZSA9IFwiYmxvZ19fdGFnXCI7XG4gICAgICAgICAgICAgICAgICAgIHRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjdXJyZW50VGFnKSk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2dUYWdMaXN0LmFwcGVuZENoaWxkKHRhZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lciBmb3Igb24gY2xpY2tcbiAgICAgICAgICAgICAgICAgICAgdGFnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFnVHh0ID0gZS50YXJnZXQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVRhZyh0YWdUeHQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGJsb2dUYWdzLmFwcGVuZENoaWxkKGJsb2dUYWdMaXN0KTtcbiAgICAgICAgICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nVGFncyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGZvciBsb29wIGZvciBhZGRpbmcgdGhlIHRhZ3NcbiAgICAgICAgICAgICAgICBibG9nc0VsLmFwcGVuZENoaWxkKGJsb2dQb3N0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgXG4gICAgXCJkaXNwbGF5T3B0aW9uc1wiOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBcIml0ZW1zUGVyUGFnZVwiOiA1XG4gICAgICAgIH0sXG4gICAgICAgIFwid3JpdGFibGVcIjogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgLy8gdGFrZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIHRoZSBwYWdpbmF0aW9uIG9iamVjdFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG51bWJlck9mSXRlbXMgPSB0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBudW1iZXJPZlBhZ2VzID0gTWF0aC5jZWlsKG51bWJlck9mSXRlbXMgLyB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSk7XG5cbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbk9iai5pbml0KG51bWJlck9mUGFnZXMsMSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGRldGVybWluZSBob3cgdG8gaGFuZGxlIHRoZSBwYWdpbmF0aW9uIGRpc3BsYXlcbiAgICAgICAgICAgIGlmIChudW1iZXJPZlBhZ2VzID4gMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5sZW5ndGggPj0zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIEluaXQgZm9yIHRoZSBibG9nIHBhZ2VcbiAqL1xuZ2V0QmxvZ3NcbiAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBCbG9nTWFuYWdlci5kYXRhID0gcmVzdWx0O1xuICAgICAgICBCbG9nTWFuYWdlci5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgIH0pO1xuXG4vLyAtLS0tIEVWRU5UIExJU1RFTkVSIEZPUiBQQUdJTkFUSU9OIC0tLS1cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIFxuICAgIGlmICghQmxvZ01hbmFnZXIucGFnaW5hdGlvbk9iai5oZWxwZXJzLmlzVmFsaWQoZSkpIHtyZXR1cm47fVxuICAgIC8vIFVwZGF0ZSB0aGUgYmxvZyBwb3N0c1xuICAgIGNvbnN0IHBhZ2VOdW1iZXIgPSBlLnRhcmdldC5kYXRhc2V0LnBhZ2VOdW07XG4gICAgXG4gICAgQmxvZ01hbmFnZXIuZGlzcGxheShwYWdlTnVtYmVyKTtcbiAgICAvLyBVcGRhdGUgdGhlIHBhZ2luYXRpb24gdG8gc3RvcmUgdGhlIG5ldyBwYWdlICMnc1xuICAgIEJsb2dNYW5hZ2VyLnBhZ2luYXRpb25PYmoudXBkYXRlKGUpO1xuXG5cbn0pO1xuXG4vLyAtLS0tLSBFVkVOVCBMSVNURU5FUlMgRk9SIFNFQVJDSCBGT1JNIC0tLS0tIC8vXG5jb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ19fc2VhcmNoLWlucHV0XCIpO1xuXG4vLyBjbGVhciB0aGUgYm94IHdoZW4gdGhlIGZvcm0gaGFzIHRoZSBmb2N1c1xuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHtcbiAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IFwiXCI7XG59KTtcblxuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGV0IHNlYXJjaFN0cmluZyA9IGV2ZW50LnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIEJsb2dNYW5hZ2VyLnNlYXJjaChzZWFyY2hTdHJpbmcpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ19fYm50LWNsZWFyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+IHtcbiAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IFwiXCI7XG4gICAgQmxvZ01hbmFnZXIuc2VhcmNoKFwiXCIpO1xufSk7XG5cbm1vZHVsZS5leHBvcnQgPSBCbG9nTWFuYWdlcjsiLCJjb25zdCBwb3B1bGF0ZU5hdkJhciA9IChmdW5jdGlvbihicmFuZCl7XG4gICAgXG4gICAgY29uc3QgbmF2cyA9IG5ldyBNYXAoKTtcbiAgICBcbiAgICAvKipcbiAgICAgICAgKiAgIFRoZSBtYXAgd2lsbCBob2xkIHRoZSBsYWJlbHMgYW5kIGxpbmtzIGZvciB0aGUgbmF2YmFyXG4gICAgICAgICoqL1xuICAgIC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzOlxuICAgIG5hdnMuc2V0KFwiSG9tZVwiLCB7XCJsYWJlbFwiOiBcIkhvbWVcIiwgXCJsaW5rXCI6IFwiLi4vaW5kZXguaHRtbFwiLCBcImJ1dHRvbkNsYXNzXCI6IFwiYnRuLW5hdl9faG9tZVwiLFwidGFyZ2V0SWRcIjogXCJhYm91dFwifSksXG4gICAgbmF2cy5zZXQoXCJQcm9qZWN0c1wiLCB7XCJsYWJlbFwiOiBcIlByb2plY3RzXCIsIFwibGlua1wiOiBcIi4uL3Byb2plY3RzXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19wcm9qZWN0c1wiLCBcInRhcmdldElkXCI6IFwicHJvamVjdHNcIn0pLFxuICAgIG5hdnMuc2V0KFwiQmxvZ1wiLCB7XCJsYWJlbFwiOiBcIkJsb2dcIiwgXCJsaW5rXCI6IFwiI2Jsb2dzXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19ibG9nXCIsIFwidGFyZ2V0SWRcIjpcImJsb2dzXCJ9KSxcbiAgICBuYXZzLnNldChcIlJlc3VtZVwiLCB7XCJsYWJlbFwiOiBcIlJlc3VtZVwiLCBcImxpbmtcIjogXCIuLi9yZXN1bWVcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX3Jlc3VtZVwiLCBcInRhcmdldElkXCI6IFwicmVzdW1lXCJ9KSxcbiAgICBuYXZzLnNldChcIkNvbnRhY3RcIiwge1wibGFiZWxcIjogXCJDb250YWN0XCIsIFwibGlua1wiOiBcIi4uL2NvbnRhY3RcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX2NvbnRhY3RcIiwgXCJ0YXJnZXRJZFwiOiBcImNvbnRhY3RcIn0pO1xuICAgIFxuICAgIGNvbnN0IG5hdkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2XCIpO1xuICAgIC8vIGNyZWF0ZSB0aGUgdWwgZWxlbWVudCB0byBzdGljayBpbnNpZGUgdGhlIG5hdlxuICAgIGNvbnN0IG5ld0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbmV3TGlzdC5jbGFzc05hbWUgPSBcIm5hdl9fbGlzdFwiO1xuICAgICAgICBcbiAgICBjb25zdCBuZXdCcmFuZExpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgIG5ld0JyYW5kTGkuY2xhc3NOYW1lID0gXCJuYXZfX2JyYW5kXCI7XG4gICAgICAgIFxuICAgIGNvbnN0IGJyYW5kVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJyYW5kKTtcbiAgICBuZXdCcmFuZExpLmFwcGVuZENoaWxkKGJyYW5kVGV4dCk7XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChuZXdCcmFuZExpKTtcbiAgICAgICAgXG4gICAgbmV3QnJhbmRMaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gbmF2cy5nZXQoXCJIb21lXCIpLmxpbms7XG4gICAgfSk7XG5cbiAgICAvLyBzY3JvbGwgdG8gYSBwYXJ0IG9mIHRoZSBwYWdlIGFuZCBhY2NvdW50IGZvciB0aGUgbmF2YmFyIGhlaWdodFxuICAgIGNvbnN0IGdvVG9JZCA9IGZ1bmN0aW9uKG5hdikge1xuICAgICAgICBsZXQgbmF2QmFySGVpZ2h0ID0gbmF2QmFyLmNsaWVudEhlaWdodDtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmF2LnRhcmdldElkKS5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwtKG5hdkJhckhlaWdodCsxMCkpO1xuICAgIH07XG5cbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgbGlzdCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uY2xhc3NOYW1lID0gbmF2LmJ1dHRvbkNsYXNzICsgXCIgbmF2X19saW5rXCI7XG4gICAgXG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmF2LmxhYmVsKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uYXBwZW5kQ2hpbGQobmV3TmF2SXRlbUxhYmVsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3TmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2Nyb2xsIGRvd24gYW5kIGFjY291bnQgZm9yIHRoZSBoZWlnaHQgb2YgdGhlIG5hdmJhclxuICAgICAgICAgICAgICAgIC8vICoqKiBKUVVFUlkgKioqKlxuXG4gICAgICAgICAgICAgICAgLy8gbGV0IGhlYWRlckhlaWdodCA9ICQoXCIubmF2XCIpLmhlaWdodCgpKzIwO1xuICAgICAgICAgICAgICAgIGdvVG9JZChuYXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIC8vICAgICBzY3JvbGxUb3A6ICQobmF2LnRhcmdldElkKS5vZmZzZXQoKS50b3AgLSBoZWFkZXJIZWlnaHRcbiAgICAgICAgICAgICAgICAvLyB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBuZXdMaXN0LmFwcGVuZENoaWxkKG5ld05hdkl0ZW0pO1xuICAgIFxuICAgICAgICB9XG4gICAgKTtcbiAgICBuYXZCYXIuYXBwZW5kQ2hpbGQobmV3TGlzdCk7XG4gICAgXG4gICAgLyoqXG4gICAgICAgICAqIEJ1aWxkaW5nIHRoZSBkcm9wZG93biBtZW51XG4gICAgICAgICAqL1xuICAgIGNvbnN0IGhhbWJ1cmdlck1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhhbWJ1cmdlck1lbnUuY2xhc3NOYW1lID0gXCJtZW51LWNvbFwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGxldCBuZXdNZW51QmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbmV3TWVudUJhci5jbGFzc05hbWUgPSBcIm1lbnUtY29sX19iYXJcIjtcbiAgICAgICAgaGFtYnVyZ2VyTWVudS5hcHBlbmRDaGlsZChuZXdNZW51QmFyKTtcbiAgICB9XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChoYW1idXJnZXJNZW51KTtcbiAgICBcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtZW51LmNsYXNzTmFtZSA9IFwibWVudS1saXN0XCI7XG4gICAgY29uc3QgbWVudUxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbWVudUxpc3QuY2xhc3NOYW1lID0gXCJtZW51LWxpc3RfX2xpc3RcIjtcbiAgICBtZW51LmFwcGVuZENoaWxkKG1lbnVMaXN0KTtcbiAgICBcbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICBsZXQgbWVudUl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBtZW51SXRlbS5pbm5lckhUTUwgPSBgJHtuYXYubGFiZWx9YDtcbiAgICAgICAgICAgIG1lbnVJdGVtLmNsYXNzTmFtZSA9IFwibWVudS1saXN0X19pdGVtXCI7XG4gICAgICAgICAgICBtZW51TGlzdC5hcHBlbmRDaGlsZChtZW51SXRlbSk7XG4gICAgICAgICAgICBtZW51SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IG5hdi5saW5rO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIG5hdkJhci5hcHBlbmRDaGlsZChtZW51KTtcbiAgICBcbn0pO1xuXG4vKipcbiAgICAqIEhhbWJ1cmdlciBNZW51XG4gICAgKiBUaGF0IHdpbGwgbG9vayBsaWtlIHNvbWV0aGluZyBpbnRlcmVzdGluZ1xuICAgICovXG5jb25zdCBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIik7IFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1jb2xcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXNwbGF5U3R5bGUgPSBtZW51LnN0eWxlLmRpc3BsYXk7XG4gICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT09IFwibm9uZVwiIHx8IGRpc3BsYXlTdHlsZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgICAgXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgICAgICBcbiAgICAgICAgY29uc3QgZGlzcGxheVN0eWxlID0gbWVudS5zdHlsZS5kaXNwbGF5O1xuICAgICAgICBpZiAoZGlzcGxheVN0eWxlID09PSBcIm5vbmVcIiB8fCBkaXNwbGF5U3R5bGUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgICAgIFxuICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgdXNlciByZXNpemVzIHRoZSB3aW5kb3cgdGhlIGRyb3AgZG93biBtZW51IHdpbGwgZGlzYXBwZWFyXG4gICAgICAgICAqL1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcbiAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBvcHVsYXRlTmF2Q29tcG9uZW50cyhicmFuZCkge1xuICAgIHBvcHVsYXRlTmF2QmFyKGJyYW5kKTtcbiAgICBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMoKTtcbn07XG5cbiIsIi8qXG4gICAgUkVRVUlSRU1FTlRTOiBcbiAgICAgICAgSFRNTDogYSA8c2VjdGlvbj4gd2l0aCB0aGUgY2xhc3Mgb2YgXCJwYWdpbmF0aW9uXCIuIFxuICAgICAgICBKUzogWW91J2xsIG5lZWQgdG8gc2VuZCBpbiB0aGUgbnVtYmVyIG9mIHBhZ2VzIHRvIGRpc3BsYXlcbiovXG5cbmNvbnN0IFBhZ2luYXRvciA9IFxuXG4gICAgT2JqZWN0LmNyZWF0ZShudWxsLCB7XG4gICAgICAgIFxuICAgICAgICBcImluaXRcIjoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChudW1iZXJPZlBhZ2VzLCBzdGFydFBhZ2UgPSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFnaW5hdGlvbkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpO1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBwYWdpbmF0aW9uIGJ5IHJlbW92aW5nIGFsbCB0aGUgY2hpbGQgbm9kZXNcbiAgICAgICAgICAgICAgICB3aGlsZSAocGFnaW5hdGlvbkVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uRWwucmVtb3ZlQ2hpbGQocGFnaW5hdGlvbkVsLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICAgICAgICAgICAgICAgIENyZWF0ZSB0aGUgcGFnaW5hdGlvbiBlbGVtZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgd2l0aCB0aGUgcHJldmlvdXMgYXJyb3dcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgcHJldi5kYXRhc2V0LnBhZ2VOdW09KHN0YXJ0UGFnZS0xKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIHByZXYuY2xhc3NOYW1lPVwicGFnaW5hdGlvbl9fcHJldmlvdXNcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2VGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiPFwiKTtcbiAgICAgICAgICAgICAgICBwcmV2LmFwcGVuZENoaWxkKHByZXZUZXh0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25FbC5hcHBlbmRDaGlsZChwcmV2KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhbiBlbGVtZW50IHRvIHJlcHJlc2VudCBlYWNoIHBhZ2VcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mUGFnZXM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuZGF0YXNldC5wYWdlTnVtPWAke2krc3RhcnRQYWdlfWA7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuY2xhc3NOYW1lPVwicGFnaW5hdGlvbl9fcGFnZVwiO1xuICAgICAgICAgICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGAke2krc3RhcnRQYWdlfWApKTtcbiAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbkVsLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgbmV4dCBhcnJvdyBidXR0b25cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgbmV4dC5kYXRhc2V0LnBhZ2VOdW09KHN0YXJ0UGFnZSsxKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIG5leHQuY2xhc3NOYW1lPVwicGFnaW5hdGlvbl9fbmV4dFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCI+XCIpO1xuICAgICAgICAgICAgICAgIG5leHQuYXBwZW5kQ2hpbGQobmV4dFRleHQpO1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25FbC5hcHBlbmRDaGlsZChuZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSBwcmV2aW91cyBwYWdlIHNlbGVjdG9yIHRvIGludmlzaWJsZSBhbmQgdGhlIGZpcnN0IGVsZW1lbnQgdG8gc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX3ByZXZpb3VzXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvbl9fcGFnZVwiKS5jbGFzc05hbWUgPSBcInBhZ2luYXRpb25fX3BhZ2UtLXNlbGVjdGVkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcbiAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmhlbHBlcnMuaXNWYWxpZChldmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNhcHR1cmUgdGhlIHBhZ2VOdW0gdmFsdWUgZnJvbSBjbGlja2VkIGVsZW1lbnQuIFBhcnNlIGl0IGFzIGFuIGludFxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIHByb2dyYW0gd2lsbCBuZWVkIHRvIGRvIG1hdGggd2l0aCBpdCBsYXRlclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRQYWdlTnVtYmVyID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQucGFnZU51bSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLyogIFxuICAgICAgICAgICAgICAgICAgICBPbmx5IGxvb3AgdGhyb3VnaCB0aGUgbnVtYmVyZWQgZWxlbWVudHMgZXhjbHVkaW5nIHRoZSBhcnJvd3NcbiAgICAgICAgICAgICAgICAgICAgcmVzZXQgdGhlIGNsYXNzIG5hbWUgdG8gcmVtb3ZlIHRoZSBtb2RpZmllciBjbGFzc1xuICAgICAgICAgICAgICAgICAgICBBbHNvIG5lZWQgdG8gY2FwdHVyZSB0aGUgbnVtYmVyIG9mIHBhZ2VzXG4gICAgICAgICAgICAgICAgKi8gXG4gICAgICAgICAgICAgICAgY29uc3QgcGFnZU51bXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2NsYXNzXj0ncGFnaW5hdGlvbl9fcGFnZSdcIik7XG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShwYWdlTnVtcykuZm9yRWFjaChmdW5jdGlvbiAocGFnZSkgeyAgICAgXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UuY2xhc3NOYW1lID0gXCJwYWdpbmF0aW9uX19wYWdlXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGlja2VkUGFnZU51bWJlci50b1N0cmluZygpID09PSBwYWdlLmRhdGFzZXQucGFnZU51bSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZS5jbGFzc05hbWUgPSBcInBhZ2luYXRpb25fX3BhZ2UtLXNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhQYWdlID0gcGFyc2VJbnQocGFnZU51bXNbcGFnZU51bXMubGVuZ3RoLTFdLmRhdGFzZXQucGFnZU51bSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWluUGFnZSA9IHBhcnNlSW50KHBhZ2VOdW1zWzBdLmRhdGFzZXQucGFnZU51bSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvbl9fcHJldmlvdXNcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19uZXh0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQmVoYXZpb3IgZm9yIHRoZSBhcnJvdyBrZXlzXG4gICAgICAgICAgICAgICAgaWYgKGNsaWNrZWRQYWdlTnVtYmVyID09PSBtaW5QYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNFbC5kYXRhc2V0LnBhZ2VOdW0gPSBjbGlja2VkUGFnZU51bWJlci0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoY2xpY2tlZFBhZ2VOdW1iZXIgKyAxID4gbWF4UGFnZSkgeyAgXG4gICAgICAgICAgICAgICAgICAgIG5leHRFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXh0RWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIG5leHRFbC5kYXRhc2V0LnBhZ2VOdW0gPSBjbGlja2VkUGFnZU51bWJlcisxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoZWxwZXJzXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7XG5cbiAgICAgICAgICAgICAgICBcImlzVmFsaWRcIjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRFbGVtZW50cyA9IFtcInBhZ2luYXRpb25fX3BhZ2VcIiwgXCJwYWdpbmF0aW9uX19wYWdlLS1zZWxlY3RlZFwiLCBcInBhZ2luYXRpb25fX3ByZXZpb3VzXCIsIFwicGFnaW5hdGlvbl9fbmV4dFwiXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09IGVsZW1lbnQpIHsgaXNWYWxpZCA9IHRydWU7fVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2luYXRvcjsiLCJjb25zdCBuYXZiYXIgPSByZXF1aXJlKFwiLi4vbmF2YmFyL3NjcmlwdHMvbmF2YmFyXCIpO1xuLy9jb25zdCBibG9ncyA9IHJlcXVpcmUoXCIuLi9ibG9nL3NjcmlwdHMvYmxvZy1jb250cm9sbGVyXCIpO1xuY29uc3QgQmxvZ2dlciA9IHJlcXVpcmUoXCIuLi9ibG9nL3NjcmlwdHMvYmxvZ01hbmFnZXJcIik7XG5cbm5hdmJhcihcIktyeXMgTWF0aGlzXCIpOyIsImNvbnN0IHBlcnNvbmFsRVRMID0gXG4gICAgT2JqZWN0LmNyZWF0ZShudWxsLHtcbiAgICAgICAgICAgIFxuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgdmFsdWU6IFtdLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgXCJmaWx0ZXJlZERhdGFcIjoge1xuICAgICAgICAgICAgdmFsdWU6IFtdLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgXCJmaWx0ZXJCeVNlYXJjaENyaXRlcmlhXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIFwiZmlsdGVyQnlUYWdcIjoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHRhZykge1xuICAgICAgICAgICAgICAgIC8vIEdldCByZWNvcmRzIHdpdGggbWF0Y2hpbmcgdGFnc1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRSZWNvcmRzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnRhZ3MuZm9yRWFjaChjdXJyZW50VGFnID0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUYWcgPT09IHRhZykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZFJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IG1hdGNoZWRSZWNvcmRzO1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICAgICBcbiAgICAgICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgXCJkaXNwbGF5XCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIFwiZGlzcGxheU9wdGlvbnNcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBcIml0ZW1zUGVyUGFnZVwiOiA1IFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgXG4gICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgLy8gdGFrZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIHRoZSBwYWdpbmF0aW9uIG9iamVjdFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG51bWJlck9mSXRlbXMgPSB0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgbnVtYmVyT2ZQYWdlcyA9IE1hdGguY2VpbChudW1iZXJPZkl0ZW1zIC8gdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuUGFnaW5hdG9yLmluaXQobnVtYmVyT2ZQYWdlcywxKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBkZXRlcm1pbmUgaG93IHRvIGhhbmRsZSB0aGUgcGFnaW5hdGlvbiBkaXNwbGF5XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlck9mUGFnZXMgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgXG4gICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmxlbmd0aCA+PTMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICB9XG5cblxuXG4gICAgfSk7Il19
