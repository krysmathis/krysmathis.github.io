(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// An object that will control the fetching and posting of blogs
// ETL object for blogs

// callback function for generating pagination
const {setPaginationByEls, isValidPagination, updatePagination} = require("../../pagination/scripts/pagination");
const getBlogs = $.ajax({url: "https://personal-site-3111d.firebaseio.com/blogs.json"});


const Blogger = Object.create(null, {

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
        value: {},
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

        }
    },
    "filterByTag": {
        value: function(event) {
            // Get blogs with matching tags
            const tag = event.target.innerHTML;
            const matchedBlogPosts = [];
            this.data.forEach(blog => {
                blog.tags.forEach(currentTag =>{
                    if (currentTag === tag) 
                        matchedBlogPosts.push(blog);
                    return;
                });
            });
            this.filteredData = matchedBlogPosts;
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
                
            // don't display pagination if there are no blogs
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
                        this.filterByTag(e);
                        console.log(this.fiteredData);
                        Blogger.display(1);
                        this.pagination(setPaginationByEls);
                        console.log(this.filteredData);
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
            "itemsPerPage": 5, 
            "writable": true
        }
    },

    "pagination": {
        // takes a callback function from the pagination object
        value: function(makePaginator) {
            
            const numberOfItems = this.filteredData.length;
            const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);
            
            makePaginator(numberOfPages,1);
            
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
            this.display(1);
            this.pagination(setPaginationByEls);
        }
    }
});

/**
 * Init for the blog page
 */
getBlogs
    .then(result => {
        Blogger.data = result;
        Blogger.filterBySearchCriteria("");
        Blogger.pagination(setPaginationByEls);
        Blogger.display(1);
    });

// ---- EVENT LISTENER FOR PAGINATION ----
document.querySelector(".pagination").addEventListener("click", function(e) {
    
    if (!isValidPagination(e)) {return;}
    
    // Update the blog posts
    const pageNumber = e.target.dataset.pageNum;
    Blogger.display(pageNumber);
    // Update the pagination to store the new page #'s
    updatePagination(e);


});

// ----- EVENT LISTENERS FOR SEARCH FORM ----- //
const searchInput = document.querySelector(".blog__search-input");

// clear the box when the form has the focus
searchInput.addEventListener("focus", () => {
    searchInput.value = "";
});

searchInput.addEventListener("keyup", function(event) {
    let searchString = event.target.value.toLowerCase();
    Blogger.search(searchString);
});

document.querySelector(".blog__bnt-clear").addEventListener("click", ()=> {
    searchInput.value = "";
    Blogger.search("");
});

module.export = Blogger;
},{"../../pagination/scripts/pagination":3}],2:[function(require,module,exports){
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


// want to make sure we're clicking on a part of the pagination with a button
const isValidPagination = function(event) {
    const validElements = ["pagination__page", "pagination__page--selected", "pagination__previous", "pagination__next"];
    let isValid = false;

    validElements.forEach(function(element){
        if (event.target.className === element) { isValid = true;}
    });
        
    return isValid;
};

/* 
    This handles the styling modifications for the pagination
    1.  The active page is set with the --selected modifier
    2.  If the active page is the first or last element, hide or show the
        arrow keys
*/
const updatePagination = function(event) {

    if (!isValidPagination(event)) {
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
    
    return;
};

const setPaginationByEls = function (numberOfPages, startPage = 1) {

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
    
};

// document.querySelector('.pagination').addEventListener("click", updatePagination);
setPaginationByEls(10,5);

module.exports = {setPaginationByEls, isValidPagination, updatePagination};
/*
const Paginator = function() {
    
    let _totalPages = 0;
    let _currentRange = null;
    let _span = 0;
    let _currentPage;

    const printOut = function() {
        //console.log("test");
    };

    return Object.create({},{
            
        "init": {
            value: function(pages, span) { 
                _totalPages = pages,
                _span = span;
            },
            enumerable: true
        },
        "currentPage": {
            configurable: false,
            value: function(value) {
                _currentPage = value;
            },
            enumerable: true
        },
        "span": {
            get: () => _span
        },
        "page": {
            get: () => _currentPage
        },
        "printer": {
            value: () => printOut(),
            enumerable: false
        }

    });
    
};

*/

/* 
    Deprecated but keeping this as a fall-back
*/

// const setPagination = function (numberOfPages, startPage = 1) {
    
//         const paginationEl = document.querySelector(".pagination");
//         /*
//             ============================================================
//             Writing the HTML for the pagination 

//             ============================================================
//         */
//         // Start with the previous arrow
//         let pagination = `<span class="pagination__previous" data-page-num="0">&lt</span>`;

//         // Loop through the number of pages and write a span or li for each one with the
//         // class of "blog-page-link"
//         for (let i = 0; i < numberOfPages; i++) {
//             pagination += `<span class="pagination__page" data-page-num="${i+1}">${i+1}</span>`;
//         }
//         // code for the next arrow
//         pagination += `<span class="pagination__next" data-page-num="2">&gt</span>`;
//         // // 2.2.3 Update the innerHTML
//         paginationEl.innerHTML = pagination;

//         // set the previous page selector to invisible
//         document.querySelector(".pagination__previous").style.visibility = "hidden";
//         document.querySelector(".pagination__page").className = "pagination__page--selected";
    
// }
},{}],4:[function(require,module,exports){
const navbar = require("../navbar/scripts/navbar");
//const blogs = require("../blog/scripts/blog-controller");
const Blogger = require("../blog/scripts/blogger");

navbar("Krys Mathis");
},{"../blog/scripts/blogger":1,"../navbar/scripts/navbar":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJibG9nL3NjcmlwdHMvYmxvZ2dlci5qcyIsIm5hdmJhci9zY3JpcHRzL25hdmJhci5qcyIsInBhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uLmpzIiwic2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQW4gb2JqZWN0IHRoYXQgd2lsbCBjb250cm9sIHRoZSBmZXRjaGluZyBhbmQgcG9zdGluZyBvZiBibG9nc1xuLy8gRVRMIG9iamVjdCBmb3IgYmxvZ3NcblxuLy8gY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGdlbmVyYXRpbmcgcGFnaW5hdGlvblxuY29uc3Qge3NldFBhZ2luYXRpb25CeUVscywgaXNWYWxpZFBhZ2luYXRpb24sIHVwZGF0ZVBhZ2luYXRpb259ID0gcmVxdWlyZShcIi4uLy4uL3BhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uXCIpO1xuY29uc3QgZ2V0QmxvZ3MgPSAkLmFqYXgoe3VybDogXCJodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vYmxvZ3MuanNvblwifSk7XG5cblxuY29uc3QgQmxvZ2dlciA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuXG4gICAgXCJkYXRhXCI6IHtcbiAgICAgICAgdmFsdWU6IFtdLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlcmVkRGF0YVwiOiB7XG4gICAgICAgIHZhbHVlOiBbXSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlckJ5U2VhcmNoQ3JpdGVyaWFcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoQ3JpdGVyaWEpIHtcbiAgICAgICAgICAgIC8vIHNvcnQgaW4gZGVzY2VuZGluZyBvcmRlclxuICAgICAgICAgICAgY29uc3Qgc29ydGVkQmxvZ0VudHJpZXMgPSB0aGlzLmRhdGEuc29ydCgoYSwgYikgPT4gbW9tZW50KGIuZGF0ZUFkZGVkKSAtIG1vbWVudChhLmRhdGVBZGRlZCkpO1xuICAgICAgICAgICAgaWYgKHNlYXJjaENyaXRlcmlhID09PSB1bmRlZmluZWQgfHwgc2VhcmNoQ3JpdGVyaWEgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBqdXN0IHJldHVybiB0aGUgc29ydGVkIGJsb2dzXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSBzb3J0ZWRCbG9nRW50cmllcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBmaWx0ZXJlZCBibG9nc1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZEJsb2dFbnRyaWVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9nID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2cuaGVhZGxpbmUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hDcml0ZXJpYSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvZy5jb250ZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiZmlsdGVyQnlUYWdcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIEdldCBibG9ncyB3aXRoIG1hdGNoaW5nIHRhZ3NcbiAgICAgICAgICAgIGNvbnN0IHRhZyA9IGV2ZW50LnRhcmdldC5pbm5lckhUTUw7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGVkQmxvZ1Bvc3RzID0gW107XG4gICAgICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaChibG9nID0+IHtcbiAgICAgICAgICAgICAgICBibG9nLnRhZ3MuZm9yRWFjaChjdXJyZW50VGFnID0+e1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRhZyA9PT0gdGFnKSBcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRCbG9nUG9zdHMucHVzaChibG9nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IG1hdGNoZWRCbG9nUG9zdHM7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJkaXNwbGF5XCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHBhZ2VOdW1iZXIpIHtcblxuICAgICAgICAgICAgY29uc3QgYmxvZ3MgPSB0aGlzLmZpbHRlcmVkRGF0YTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2xlYXIgb3V0IGFsbCBleGlzdGluZyBibG9nIGVsZW1lbnRzXG4gICAgICAgICAgICBjb25zdCBibG9nc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJibG9nLXBvc3RzXCIpO1xuICAgICAgICAgICAgd2hpbGUgKGJsb2dzRWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgYmxvZ3NFbC5yZW1vdmVDaGlsZChibG9nc0VsLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBkb24ndCBkaXNwbGF5IHBhZ2luYXRpb24gaWYgdGhlcmUgYXJlIG5vIGJsb2dzXG4gICAgICAgICAgICBpZiAoYmxvZ3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIGJsb2dzRWwuaW5uZXJIVE1MID0gXCJObyBibG9ncyBmb3VuZC4uLlwiO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIE9ubHkgZGlzcGxheSB0aGUgcGFnZXMgaW4gdGhlIGN1cnJlbnQgcGFnZSBudW1iZXJcbiAgICAgICAgICAgIGNvbnN0IGJsb2dzVG9EaXNwbGF5ID0gYmxvZ3Muc2xpY2UoXG4gICAgICAgICAgICAgICAgKHBhZ2VOdW1iZXIgLSAxKSAqIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlLFxuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgKiB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZVxuICAgICAgICAgICAgKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBibG9nc1RvRGlzcGxheS5mb3JFYWNoKCBlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGltYWdlU3JjID0gZW50cnkuaW1nSGVhZGVyLnN0YXJ0c1dpdGgoXCJpbWFnZXNcIikgPyBcIi4uL1wiICsgZW50cnkuaW1nSGVhZGVyIDogZW50cnkuaW1nSGVhZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gbWFpbiBlbGVtZW50XG4gICAgICAgICAgICAgICAgbGV0IGJsb2dQb3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFydGljbGVcIik7XG4gICAgICAgICAgICAgICAgYmxvZ1Bvc3QuY2xhc3NOYW1lID0gXCJibG9nX19wb3N0XCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgYmxvZ0hlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYmxvZ0hlYWRlci5jbGFzc05hbWUgPSBcImJsb2dfX2hlYWRlclwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGJsb2dIZWFkbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYmxvZ0hlYWRsaW5lLmNsYXNzTmFtZSA9IFwiYmxvZ19faGVhZGxpbmVcIjtcbiAgICAgICAgICAgICAgICBsZXQgYmxvZ0hlYWRsaW5lVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVudHJ5LmhlYWRsaW5lKTtcbiAgICAgICAgICAgICAgICBibG9nSGVhZGxpbmUuYXBwZW5kQ2hpbGQoYmxvZ0hlYWRsaW5lVGV4dCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgYmxvZ0RhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2dEYXRlLmNsYXNzTmFtZSA9IFwiYmxvZ19fZGF0ZVwiO1xuICAgICAgICAgICAgICAgIGxldCBibG9nRGF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtb21lbnQoZW50cnkuZGF0ZUFkZGVkKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgICBibG9nRGF0ZS5hcHBlbmRDaGlsZChibG9nRGF0ZVRleHQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYXBwZW5kIHRvIHRoZSBibG9nSGVhZGVyIGRpdlxuICAgICAgICAgICAgICAgIGJsb2dIZWFkZXIuYXBwZW5kQ2hpbGQoYmxvZ0hlYWRsaW5lKTtcbiAgICAgICAgICAgICAgICBibG9nSGVhZGVyLmFwcGVuZENoaWxkKGJsb2dEYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhcHBlbmQgdG8gbWFpbiBkaXZcbiAgICAgICAgICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nSGVhZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEltZyBkaXZcbiAgICAgICAgICAgICAgICBsZXQgYmxvZ0ltZ0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYmxvZ0ltZ0NvbnRhaW5lci5jbGFzc05hbWUgPSBcImJsb2dfX2ltZy1oZWFkZXJcIjtcbiAgICAgICAgICAgICAgICAvLyBJbWFnZVxuICAgICAgICAgICAgICAgIGxldCBibG9nSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgICBibG9nSW1nLnNyYyA9IGltYWdlU3JjO1xuICAgICAgICAgICAgICAgIGJsb2dJbWdDb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvZ0ltZyk7XG4gICAgICAgICAgICAgICAgYmxvZ1Bvc3QuYXBwZW5kQ2hpbGQoYmxvZ0ltZ0NvbnRhaW5lcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBDb250ZW50XG4gICAgICAgICAgICAgICAgbGV0IGJsb2dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9nQ29udGVudC5jbGFzc05hbWUgPSBcImJsb2dfX2NvbnRlbnRcIjtcbiAgICAgICAgICAgICAgICBibG9nQ29udGVudC5pbm5lckhUTUwgPSBlbnRyeS5jb250ZW50O1xuICAgICAgICAgICAgICAgIGJsb2dQb3N0LmFwcGVuZENoaWxkKGJsb2dDb250ZW50KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFRhZ3MgQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgbGV0IGJsb2dUYWdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9nVGFncy5jbGFzc05hbWUgPSBcImJsb2dfX2Zvb3RlciBwcm9qZWN0LXRhZ1wiO1xuICAgICAgICAgICAgICAgIGxldCBibG9nVGFnTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGRvIHRoZSB0YWdzXG4gICAgICAgICAgICAgICAgZW50cnkudGFncy5mb3JFYWNoKGN1cnJlbnRUYWcgPT4gXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICAgICAgICAgICAgICB0YWcuY2xhc3NOYW1lID0gXCJibG9nX190YWdcIjtcbiAgICAgICAgICAgICAgICAgICAgdGFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGN1cnJlbnRUYWcpKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvZ1RhZ0xpc3QuYXBwZW5kQ2hpbGQodGFnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGV2ZW50IGxpc3RlbmVyIGZvciBvbiBjbGlja1xuICAgICAgICAgICAgICAgICAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5VGFnKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5maXRlcmVkRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBCbG9nZ2VyLmRpc3BsYXkoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24oc2V0UGFnaW5hdGlvbkJ5RWxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmlsdGVyZWREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBibG9nVGFncy5hcHBlbmRDaGlsZChibG9nVGFnTGlzdCk7XG4gICAgICAgICAgICAgICAgYmxvZ1Bvc3QuYXBwZW5kQ2hpbGQoYmxvZ1RhZ3MpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBmb3IgbG9vcCBmb3IgYWRkaW5nIHRoZSB0YWdzXG4gICAgICAgICAgICAgICAgYmxvZ3NFbC5hcHBlbmRDaGlsZChibG9nUG9zdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIFxuICAgIFwiZGlzcGxheU9wdGlvbnNcIjoge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgXCJpdGVtc1BlclBhZ2VcIjogNSwgXG4gICAgICAgICAgICBcIndyaXRhYmxlXCI6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRpb25cIjoge1xuICAgICAgICAvLyB0YWtlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGZyb20gdGhlIHBhZ2luYXRpb24gb2JqZWN0XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihtYWtlUGFnaW5hdG9yKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG51bWJlck9mSXRlbXMgPSB0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBudW1iZXJPZlBhZ2VzID0gTWF0aC5jZWlsKG51bWJlck9mSXRlbXMgLyB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1ha2VQYWdpbmF0b3IobnVtYmVyT2ZQYWdlcywxKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG51bWJlck9mUGFnZXMgPiAxKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJzZWFyY2hcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmxlbmd0aCA+PTMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KDEpO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uKHNldFBhZ2luYXRpb25CeUVscyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLyoqXG4gKiBJbml0IGZvciB0aGUgYmxvZyBwYWdlXG4gKi9cbmdldEJsb2dzXG4gICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgQmxvZ2dlci5kYXRhID0gcmVzdWx0O1xuICAgICAgICBCbG9nZ2VyLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoXCJcIik7XG4gICAgICAgIEJsb2dnZXIucGFnaW5hdGlvbihzZXRQYWdpbmF0aW9uQnlFbHMpO1xuICAgICAgICBCbG9nZ2VyLmRpc3BsYXkoMSk7XG4gICAgfSk7XG5cbi8vIC0tLS0gRVZFTlQgTElTVEVORVIgRk9SIFBBR0lOQVRJT04gLS0tLVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgXG4gICAgaWYgKCFpc1ZhbGlkUGFnaW5hdGlvbihlKSkge3JldHVybjt9XG4gICAgXG4gICAgLy8gVXBkYXRlIHRoZSBibG9nIHBvc3RzXG4gICAgY29uc3QgcGFnZU51bWJlciA9IGUudGFyZ2V0LmRhdGFzZXQucGFnZU51bTtcbiAgICBCbG9nZ2VyLmRpc3BsYXkocGFnZU51bWJlcik7XG4gICAgLy8gVXBkYXRlIHRoZSBwYWdpbmF0aW9uIHRvIHN0b3JlIHRoZSBuZXcgcGFnZSAjJ3NcbiAgICB1cGRhdGVQYWdpbmF0aW9uKGUpO1xuXG5cbn0pO1xuXG4vLyAtLS0tLSBFVkVOVCBMSVNURU5FUlMgRk9SIFNFQVJDSCBGT1JNIC0tLS0tIC8vXG5jb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ19fc2VhcmNoLWlucHV0XCIpO1xuXG4vLyBjbGVhciB0aGUgYm94IHdoZW4gdGhlIGZvcm0gaGFzIHRoZSBmb2N1c1xuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHtcbiAgICBzZWFyY2hJbnB1dC52YWx1ZSA9IFwiXCI7XG59KTtcblxuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGV0IHNlYXJjaFN0cmluZyA9IGV2ZW50LnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIEJsb2dnZXIuc2VhcmNoKHNlYXJjaFN0cmluZyk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nX19ibnQtY2xlYXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT4ge1xuICAgIHNlYXJjaElucHV0LnZhbHVlID0gXCJcIjtcbiAgICBCbG9nZ2VyLnNlYXJjaChcIlwiKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0ID0gQmxvZ2dlcjsiLCJjb25zdCBwb3B1bGF0ZU5hdkJhciA9IChmdW5jdGlvbihicmFuZCl7XG4gICAgXG4gICAgY29uc3QgbmF2cyA9IG5ldyBNYXAoKTtcbiAgICBcbiAgICAvKipcbiAgICAgICAgKiAgIFRoZSBtYXAgd2lsbCBob2xkIHRoZSBsYWJlbHMgYW5kIGxpbmtzIGZvciB0aGUgbmF2YmFyXG4gICAgICAgICoqL1xuICAgIC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzOlxuICAgIG5hdnMuc2V0KFwiSG9tZVwiLCB7XCJsYWJlbFwiOiBcIkhvbWVcIiwgXCJsaW5rXCI6IFwiLi4vaW5kZXguaHRtbFwiLCBcImJ1dHRvbkNsYXNzXCI6IFwiYnRuLW5hdl9faG9tZVwiLFwidGFyZ2V0SWRcIjogXCJhYm91dFwifSksXG4gICAgbmF2cy5zZXQoXCJQcm9qZWN0c1wiLCB7XCJsYWJlbFwiOiBcIlByb2plY3RzXCIsIFwibGlua1wiOiBcIi4uL3Byb2plY3RzXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19wcm9qZWN0c1wiLCBcInRhcmdldElkXCI6IFwicHJvamVjdHNcIn0pLFxuICAgIG5hdnMuc2V0KFwiQmxvZ1wiLCB7XCJsYWJlbFwiOiBcIkJsb2dcIiwgXCJsaW5rXCI6IFwiI2Jsb2dzXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19ibG9nXCIsIFwidGFyZ2V0SWRcIjpcImJsb2dzXCJ9KSxcbiAgICBuYXZzLnNldChcIlJlc3VtZVwiLCB7XCJsYWJlbFwiOiBcIlJlc3VtZVwiLCBcImxpbmtcIjogXCIuLi9yZXN1bWVcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX3Jlc3VtZVwiLCBcInRhcmdldElkXCI6IFwicmVzdW1lXCJ9KSxcbiAgICBuYXZzLnNldChcIkNvbnRhY3RcIiwge1wibGFiZWxcIjogXCJDb250YWN0XCIsIFwibGlua1wiOiBcIi4uL2NvbnRhY3RcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX2NvbnRhY3RcIiwgXCJ0YXJnZXRJZFwiOiBcImNvbnRhY3RcIn0pO1xuICAgIFxuICAgIGNvbnN0IG5hdkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2XCIpO1xuICAgIC8vIGNyZWF0ZSB0aGUgdWwgZWxlbWVudCB0byBzdGljayBpbnNpZGUgdGhlIG5hdlxuICAgIGNvbnN0IG5ld0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbmV3TGlzdC5jbGFzc05hbWUgPSBcIm5hdl9fbGlzdFwiO1xuICAgICAgICBcbiAgICBjb25zdCBuZXdCcmFuZExpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgIG5ld0JyYW5kTGkuY2xhc3NOYW1lID0gXCJuYXZfX2JyYW5kXCI7XG4gICAgICAgIFxuICAgIGNvbnN0IGJyYW5kVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJyYW5kKTtcbiAgICBuZXdCcmFuZExpLmFwcGVuZENoaWxkKGJyYW5kVGV4dCk7XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChuZXdCcmFuZExpKTtcbiAgICAgICAgXG4gICAgbmV3QnJhbmRMaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gbmF2cy5nZXQoXCJIb21lXCIpLmxpbms7XG4gICAgfSk7XG5cbiAgICAvLyBzY3JvbGwgdG8gYSBwYXJ0IG9mIHRoZSBwYWdlIGFuZCBhY2NvdW50IGZvciB0aGUgbmF2YmFyIGhlaWdodFxuICAgIGNvbnN0IGdvVG9JZCA9IGZ1bmN0aW9uKG5hdikge1xuICAgICAgICBsZXQgbmF2QmFySGVpZ2h0ID0gbmF2QmFyLmNsaWVudEhlaWdodDtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmF2LnRhcmdldElkKS5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwtKG5hdkJhckhlaWdodCsxMCkpO1xuICAgIH07XG5cbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgbGlzdCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uY2xhc3NOYW1lID0gbmF2LmJ1dHRvbkNsYXNzICsgXCIgbmF2X19saW5rXCI7XG4gICAgXG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmF2LmxhYmVsKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uYXBwZW5kQ2hpbGQobmV3TmF2SXRlbUxhYmVsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3TmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2Nyb2xsIGRvd24gYW5kIGFjY291bnQgZm9yIHRoZSBoZWlnaHQgb2YgdGhlIG5hdmJhclxuICAgICAgICAgICAgICAgIC8vICoqKiBKUVVFUlkgKioqKlxuXG4gICAgICAgICAgICAgICAgLy8gbGV0IGhlYWRlckhlaWdodCA9ICQoXCIubmF2XCIpLmhlaWdodCgpKzIwO1xuICAgICAgICAgICAgICAgIGdvVG9JZChuYXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIC8vICAgICBzY3JvbGxUb3A6ICQobmF2LnRhcmdldElkKS5vZmZzZXQoKS50b3AgLSBoZWFkZXJIZWlnaHRcbiAgICAgICAgICAgICAgICAvLyB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBuZXdMaXN0LmFwcGVuZENoaWxkKG5ld05hdkl0ZW0pO1xuICAgIFxuICAgICAgICB9XG4gICAgKTtcbiAgICBuYXZCYXIuYXBwZW5kQ2hpbGQobmV3TGlzdCk7XG4gICAgXG4gICAgLyoqXG4gICAgICAgICAqIEJ1aWxkaW5nIHRoZSBkcm9wZG93biBtZW51XG4gICAgICAgICAqL1xuICAgIGNvbnN0IGhhbWJ1cmdlck1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhhbWJ1cmdlck1lbnUuY2xhc3NOYW1lID0gXCJtZW51LWNvbFwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGxldCBuZXdNZW51QmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbmV3TWVudUJhci5jbGFzc05hbWUgPSBcIm1lbnUtY29sX19iYXJcIjtcbiAgICAgICAgaGFtYnVyZ2VyTWVudS5hcHBlbmRDaGlsZChuZXdNZW51QmFyKTtcbiAgICB9XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChoYW1idXJnZXJNZW51KTtcbiAgICBcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtZW51LmNsYXNzTmFtZSA9IFwibWVudS1saXN0XCI7XG4gICAgY29uc3QgbWVudUxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbWVudUxpc3QuY2xhc3NOYW1lID0gXCJtZW51LWxpc3RfX2xpc3RcIjtcbiAgICBtZW51LmFwcGVuZENoaWxkKG1lbnVMaXN0KTtcbiAgICBcbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICBsZXQgbWVudUl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBtZW51SXRlbS5pbm5lckhUTUwgPSBgJHtuYXYubGFiZWx9YDtcbiAgICAgICAgICAgIG1lbnVJdGVtLmNsYXNzTmFtZSA9IFwibWVudS1saXN0X19pdGVtXCI7XG4gICAgICAgICAgICBtZW51TGlzdC5hcHBlbmRDaGlsZChtZW51SXRlbSk7XG4gICAgICAgICAgICBtZW51SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IG5hdi5saW5rO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIG5hdkJhci5hcHBlbmRDaGlsZChtZW51KTtcbiAgICBcbn0pO1xuXG4vKipcbiAgICAqIEhhbWJ1cmdlciBNZW51XG4gICAgKiBUaGF0IHdpbGwgbG9vayBsaWtlIHNvbWV0aGluZyBpbnRlcmVzdGluZ1xuICAgICovXG5jb25zdCBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIik7IFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1jb2xcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXNwbGF5U3R5bGUgPSBtZW51LnN0eWxlLmRpc3BsYXk7XG4gICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT09IFwibm9uZVwiIHx8IGRpc3BsYXlTdHlsZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgICAgXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgICAgICBcbiAgICAgICAgY29uc3QgZGlzcGxheVN0eWxlID0gbWVudS5zdHlsZS5kaXNwbGF5O1xuICAgICAgICBpZiAoZGlzcGxheVN0eWxlID09PSBcIm5vbmVcIiB8fCBkaXNwbGF5U3R5bGUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgICAgIFxuICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgdXNlciByZXNpemVzIHRoZSB3aW5kb3cgdGhlIGRyb3AgZG93biBtZW51IHdpbGwgZGlzYXBwZWFyXG4gICAgICAgICAqL1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcbiAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBvcHVsYXRlTmF2Q29tcG9uZW50cyhicmFuZCkge1xuICAgIHBvcHVsYXRlTmF2QmFyKGJyYW5kKTtcbiAgICBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMoKTtcbn07XG5cbiIsIi8qXG4gICAgUkVRVUlSRU1FTlRTOiBcbiAgICAgICAgSFRNTDogYSA8c2VjdGlvbj4gd2l0aCB0aGUgY2xhc3Mgb2YgXCJwYWdpbmF0aW9uXCIuIFxuICAgICAgICBKUzogWW91J2xsIG5lZWQgdG8gc2VuZCBpbiB0aGUgbnVtYmVyIG9mIHBhZ2VzIHRvIGRpc3BsYXlcbiovXG5cblxuLy8gd2FudCB0byBtYWtlIHN1cmUgd2UncmUgY2xpY2tpbmcgb24gYSBwYXJ0IG9mIHRoZSBwYWdpbmF0aW9uIHdpdGggYSBidXR0b25cbmNvbnN0IGlzVmFsaWRQYWdpbmF0aW9uID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBjb25zdCB2YWxpZEVsZW1lbnRzID0gW1wicGFnaW5hdGlvbl9fcGFnZVwiLCBcInBhZ2luYXRpb25fX3BhZ2UtLXNlbGVjdGVkXCIsIFwicGFnaW5hdGlvbl9fcHJldmlvdXNcIiwgXCJwYWdpbmF0aW9uX19uZXh0XCJdO1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG5cbiAgICB2YWxpZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lID09PSBlbGVtZW50KSB7IGlzVmFsaWQgPSB0cnVlO31cbiAgICB9KTtcbiAgICAgICAgXG4gICAgcmV0dXJuIGlzVmFsaWQ7XG59O1xuXG4vKiBcbiAgICBUaGlzIGhhbmRsZXMgdGhlIHN0eWxpbmcgbW9kaWZpY2F0aW9ucyBmb3IgdGhlIHBhZ2luYXRpb25cbiAgICAxLiAgVGhlIGFjdGl2ZSBwYWdlIGlzIHNldCB3aXRoIHRoZSAtLXNlbGVjdGVkIG1vZGlmaWVyXG4gICAgMi4gIElmIHRoZSBhY3RpdmUgcGFnZSBpcyB0aGUgZmlyc3Qgb3IgbGFzdCBlbGVtZW50LCBoaWRlIG9yIHNob3cgdGhlXG4gICAgICAgIGFycm93IGtleXNcbiovXG5jb25zdCB1cGRhdGVQYWdpbmF0aW9uID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGlmICghaXNWYWxpZFBhZ2luYXRpb24oZXZlbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjYXB0dXJlIHRoZSBwYWdlTnVtIHZhbHVlIGZyb20gY2xpY2tlZCBlbGVtZW50LiBQYXJzZSBpdCBhcyBhbiBpbnRcbiAgICAvLyBiZWNhdXNlIHRoZSBwcm9ncmFtIHdpbGwgbmVlZCB0byBkbyBtYXRoIHdpdGggaXQgbGF0ZXJcbiAgICBjb25zdCBjbGlja2VkUGFnZU51bWJlciA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgIFxuICAgIC8qICBcbiAgICAgICAgT25seSBsb29wIHRocm91Z2ggdGhlIG51bWJlcmVkIGVsZW1lbnRzIGV4Y2x1ZGluZyB0aGUgYXJyb3dzXG4gICAgICAgIHJlc2V0IHRoZSBjbGFzcyBuYW1lIHRvIHJlbW92ZSB0aGUgbW9kaWZpZXIgY2xhc3NcbiAgICAgICAgQWxzbyBuZWVkIHRvIGNhcHR1cmUgdGhlIG51bWJlciBvZiBwYWdlc1xuICAgICovIFxuICAgIGNvbnN0IHBhZ2VOdW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltjbGFzc149J3BhZ2luYXRpb25fX3BhZ2UnXCIpO1xuICAgIEFycmF5LmZyb20ocGFnZU51bXMpLmZvckVhY2goZnVuY3Rpb24gKHBhZ2UpIHsgICAgIFxuICAgICAgICBwYWdlLmNsYXNzTmFtZSA9IFwicGFnaW5hdGlvbl9fcGFnZVwiO1xuICAgICAgICBpZiAoY2xpY2tlZFBhZ2VOdW1iZXIudG9TdHJpbmcoKSA9PT0gcGFnZS5kYXRhc2V0LnBhZ2VOdW0pIHtcbiAgICAgICAgICAgIHBhZ2UuY2xhc3NOYW1lID0gXCJwYWdpbmF0aW9uX19wYWdlLS1zZWxlY3RlZFwiO1xuICAgICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgXG4gICAgY29uc3QgbWF4UGFnZSA9IHBhcnNlSW50KHBhZ2VOdW1zW3BhZ2VOdW1zLmxlbmd0aC0xXS5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgIGNvbnN0IG1pblBhZ2UgPSBwYXJzZUludChwYWdlTnVtc1swXS5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgIFxuICAgIGNvbnN0IHByZXZpb3VzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX3ByZXZpb3VzXCIpO1xuICAgIGNvbnN0IG5leHRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvbl9fbmV4dFwiKTtcblxuICAgIC8vIEJlaGF2aW9yIGZvciB0aGUgYXJyb3cga2V5c1xuICAgIGlmIChjbGlja2VkUGFnZU51bWJlciA9PT0gbWluUGFnZSkge1xuICAgICAgICBwcmV2aW91c0VsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZpb3VzRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgIHByZXZpb3VzRWwuZGF0YXNldC5wYWdlTnVtID0gY2xpY2tlZFBhZ2VOdW1iZXItMTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGNsaWNrZWRQYWdlTnVtYmVyICsgMSA+IG1heFBhZ2UpIHsgIFxuICAgICAgICBuZXh0RWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dEVsLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICBuZXh0RWwuZGF0YXNldC5wYWdlTnVtID0gY2xpY2tlZFBhZ2VOdW1iZXIrMTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuO1xufTtcblxuY29uc3Qgc2V0UGFnaW5hdGlvbkJ5RWxzID0gZnVuY3Rpb24gKG51bWJlck9mUGFnZXMsIHN0YXJ0UGFnZSA9IDEpIHtcblxuICAgIGNvbnN0IHBhZ2luYXRpb25FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKTtcbiAgICAvLyByZXNldCB0aGUgcGFnaW5hdGlvbiBieSByZW1vdmluZyBhbGwgdGhlIGNoaWxkIG5vZGVzXG4gICAgd2hpbGUgKHBhZ2luYXRpb25FbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgcGFnaW5hdGlvbkVsLnJlbW92ZUNoaWxkKHBhZ2luYXRpb25FbC5sYXN0Q2hpbGQpO1xuICAgIH1cbiAgICAvKlxuICAgICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgICBDcmVhdGUgdGhlIHBhZ2luYXRpb24gZWxlbWVudHNcbiAgICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAqL1xuICAgIC8vIFN0YXJ0IHdpdGggdGhlIHByZXZpb3VzIGFycm93XG4gICAgY29uc3QgcHJldiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHByZXYuZGF0YXNldC5wYWdlTnVtPShzdGFydFBhZ2UtMSkudG9TdHJpbmcoKTtcbiAgICBwcmV2LmNsYXNzTmFtZT1cInBhZ2luYXRpb25fX3ByZXZpb3VzXCI7XG4gICAgY29uc3QgcHJldlRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIjxcIik7XG4gICAgcHJldi5hcHBlbmRDaGlsZChwcmV2VGV4dCk7XG5cbiAgICBwYWdpbmF0aW9uRWwuYXBwZW5kQ2hpbGQocHJldik7XG5cbiAgICAvLyBjcmVhdGUgYW4gZWxlbWVudCB0byByZXByZXNlbnQgZWFjaCBwYWdlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZlBhZ2VzOyBpKyspIHtcbiAgICAgICAgICAgIFxuICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBsaW5rLmRhdGFzZXQucGFnZU51bT1gJHtpK3N0YXJ0UGFnZX1gO1xuICAgICAgICBsaW5rLmNsYXNzTmFtZT1cInBhZ2luYXRpb25fX3BhZ2VcIjtcbiAgICAgICAgbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgJHtpK3N0YXJ0UGFnZX1gKSk7XG4gICAgICAgIHBhZ2luYXRpb25FbC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgIFxuICAgIH1cbiAgICAgICBcbiAgICAvLyBjcmVhdGUgdGhlIG5leHQgYXJyb3cgYnV0dG9uXG4gICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIG5leHQuZGF0YXNldC5wYWdlTnVtPShzdGFydFBhZ2UrMSkudG9TdHJpbmcoKTtcbiAgICBuZXh0LmNsYXNzTmFtZT1cInBhZ2luYXRpb25fX25leHRcIjtcbiAgICBjb25zdCBuZXh0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiPlwiKTtcbiAgICBuZXh0LmFwcGVuZENoaWxkKG5leHRUZXh0KTtcbiAgICBwYWdpbmF0aW9uRWwuYXBwZW5kQ2hpbGQobmV4dCk7XG4gICAgICAgIFxuICAgIC8vIHNldCB0aGUgcHJldmlvdXMgcGFnZSBzZWxlY3RvciB0byBpbnZpc2libGUgYW5kIHRoZSBmaXJzdCBlbGVtZW50IHRvIHNlbGVjdGVkXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19wcmV2aW91c1wiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX3BhZ2VcIikuY2xhc3NOYW1lID0gXCJwYWdpbmF0aW9uX19wYWdlLS1zZWxlY3RlZFwiO1xuICAgIFxufTtcblxuLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2luYXRpb24nKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdXBkYXRlUGFnaW5hdGlvbik7XG5zZXRQYWdpbmF0aW9uQnlFbHMoMTAsNSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge3NldFBhZ2luYXRpb25CeUVscywgaXNWYWxpZFBhZ2luYXRpb24sIHVwZGF0ZVBhZ2luYXRpb259O1xuLypcbmNvbnN0IFBhZ2luYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIGxldCBfdG90YWxQYWdlcyA9IDA7XG4gICAgbGV0IF9jdXJyZW50UmFuZ2UgPSBudWxsO1xuICAgIGxldCBfc3BhbiA9IDA7XG4gICAgbGV0IF9jdXJyZW50UGFnZTtcblxuICAgIGNvbnN0IHByaW50T3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJ0ZXN0XCIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh7fSx7XG4gICAgICAgICAgICBcbiAgICAgICAgXCJpbml0XCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihwYWdlcywgc3BhbikgeyBcbiAgICAgICAgICAgICAgICBfdG90YWxQYWdlcyA9IHBhZ2VzLFxuICAgICAgICAgICAgICAgIF9zcGFuID0gc3BhbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiY3VycmVudFBhZ2VcIjoge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIF9jdXJyZW50UGFnZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJzcGFuXCI6IHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gX3NwYW5cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlXCI6IHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gX2N1cnJlbnRQYWdlXG4gICAgICAgIH0sXG4gICAgICAgIFwicHJpbnRlclwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogKCkgPT4gcHJpbnRPdXQoKSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICAgIH1cblxuICAgIH0pO1xuICAgIFxufTtcblxuKi9cblxuLyogXG4gICAgRGVwcmVjYXRlZCBidXQga2VlcGluZyB0aGlzIGFzIGEgZmFsbC1iYWNrXG4qL1xuXG4vLyBjb25zdCBzZXRQYWdpbmF0aW9uID0gZnVuY3Rpb24gKG51bWJlck9mUGFnZXMsIHN0YXJ0UGFnZSA9IDEpIHtcbiAgICBcbi8vICAgICAgICAgY29uc3QgcGFnaW5hdGlvbkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpO1xuLy8gICAgICAgICAvKlxuLy8gICAgICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICBXcml0aW5nIHRoZSBIVE1MIGZvciB0aGUgcGFnaW5hdGlvbiBcblxuLy8gICAgICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICovXG4vLyAgICAgICAgIC8vIFN0YXJ0IHdpdGggdGhlIHByZXZpb3VzIGFycm93XG4vLyAgICAgICAgIGxldCBwYWdpbmF0aW9uID0gYDxzcGFuIGNsYXNzPVwicGFnaW5hdGlvbl9fcHJldmlvdXNcIiBkYXRhLXBhZ2UtbnVtPVwiMFwiPiZsdDwvc3Bhbj5gO1xuXG4vLyAgICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgbnVtYmVyIG9mIHBhZ2VzIGFuZCB3cml0ZSBhIHNwYW4gb3IgbGkgZm9yIGVhY2ggb25lIHdpdGggdGhlXG4vLyAgICAgICAgIC8vIGNsYXNzIG9mIFwiYmxvZy1wYWdlLWxpbmtcIlxuLy8gICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mUGFnZXM7IGkrKykge1xuLy8gICAgICAgICAgICAgcGFnaW5hdGlvbiArPSBgPHNwYW4gY2xhc3M9XCJwYWdpbmF0aW9uX19wYWdlXCIgZGF0YS1wYWdlLW51bT1cIiR7aSsxfVwiPiR7aSsxfTwvc3Bhbj5gO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIC8vIGNvZGUgZm9yIHRoZSBuZXh0IGFycm93XG4vLyAgICAgICAgIHBhZ2luYXRpb24gKz0gYDxzcGFuIGNsYXNzPVwicGFnaW5hdGlvbl9fbmV4dFwiIGRhdGEtcGFnZS1udW09XCIyXCI+Jmd0PC9zcGFuPmA7XG4vLyAgICAgICAgIC8vIC8vIDIuMi4zIFVwZGF0ZSB0aGUgaW5uZXJIVE1MXG4vLyAgICAgICAgIHBhZ2luYXRpb25FbC5pbm5lckhUTUwgPSBwYWdpbmF0aW9uO1xuXG4vLyAgICAgICAgIC8vIHNldCB0aGUgcHJldmlvdXMgcGFnZSBzZWxlY3RvciB0byBpbnZpc2libGVcbi8vICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19wcmV2aW91c1wiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbi8vICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19wYWdlXCIpLmNsYXNzTmFtZSA9IFwicGFnaW5hdGlvbl9fcGFnZS0tc2VsZWN0ZWRcIjtcbiAgICBcbi8vIH0iLCJjb25zdCBuYXZiYXIgPSByZXF1aXJlKFwiLi4vbmF2YmFyL3NjcmlwdHMvbmF2YmFyXCIpO1xuLy9jb25zdCBibG9ncyA9IHJlcXVpcmUoXCIuLi9ibG9nL3NjcmlwdHMvYmxvZy1jb250cm9sbGVyXCIpO1xuY29uc3QgQmxvZ2dlciA9IHJlcXVpcmUoXCIuLi9ibG9nL3NjcmlwdHMvYmxvZ2dlclwiKTtcblxubmF2YmFyKFwiS3J5cyBNYXRoaXNcIik7Il19
