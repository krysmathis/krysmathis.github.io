(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
    Form validation
    1. All text inputs should have a value
    2. The text area should contain at least three characters
    */
const getMissingParts = function () {
        
    // check inputs
    const blogParts = Array.from(document.querySelectorAll("input[class^='blogForm']"));
    const missingParts = [];
        
    blogParts.forEach(part => {
        if (part.value.length === 0) {
            missingParts.push({
                "field": part.name,
                "class": part.className,
                "message": "missing " + part.name
            });
        }
    });
        
    // check text area
    const blogTextAreaValue = document.querySelector("textarea[name='blog-content']").value;
    if (blogTextAreaValue.length < 3) {
        missingParts.push({
            "field": "blog-contents",
            "class": blogTextAreaValue.className,
            "message": "should contain at least 3 characters of content"
        });
    }
    return missingParts;
};
    
    /*
    The missing parts are stored here, extract and display them here
    */
const showErrors = function (missingParts) {
    let message = "<h3>!!!Unacceptable Submission!!!</h3> <ul>";
    const msgBlock = document.querySelector(".messageBlock");
        
    missingParts.forEach(part => message += `<li class="messageBlock__detail">Your ${part.field} is ${part.message}</li>`);
    message += "</ul>";
    msgBlock.style.display = "block";
    msgBlock.style.backgroundColor = "red";
    msgBlock.innerHTML = message;
};
    
const showSuccess = () => {
    const msgBlock = document.querySelector(".messageBlock");
    msgBlock.style.backgroundColor = "rgba(255,255,0,.75)";
    msgBlock.innerHTML = "You've created a new blog!";
    msgBlock.style.display = "block"; //show the element
    setTimeout(function () {
        msgBlock.style.display = "none";
    }, 10000);
};

module.exports = {showSuccess, showErrors, getMissingParts};
},{}],2:[function(require,module,exports){
const blogObjectFactory = require("../../blog/scripts/blog-factory");
const BlogManager = require("../../blog/scripts/blogManager");

const RunAdmin = function (blogData) {
    
    // get the database from local storage, or empty object if null
    // get the blog entries or empty object if null
    const blogs = blogData;
    /*
        ===================================================
        Generate a list of the current blogs for editing
        The records will go into a table
        ===================================================
    */
    const listCurrentBlogs = () => {
        let html = "";
        const blogsArray = [];
        for (let key in blogs) {
            let currentBlog = blogs[key];
            blogsArray.push({"id": key, "dateAdded": currentBlog.dateAdded, "blogDetail": currentBlog});
        }
        const sortedBlogs = blogsArray.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
        sortedBlogs
            .forEach(entry => {
                html += `
				<article class="blogList__entry">
					<div class="blogList__headline">${entry.blogDetail.headline}</th>
					<div class="blogList__preview">${entry.blogDetail.content.substring(0,30).replace(/<(?:.|\n)*?>/gm, "")}</div>
					<div class="blogList__date">${entry.blogDetail.dateAdded}</div>
					<div class="blogList__button-row"><button class="blogList__btn-edit" data-blog-id="${entry.id}">Edit</button></div>
					<div class="blogList__button-row"><button class="blogList__btn-delete" data-blog-id="${entry.id}">Delete</button></td>
				</article>
				`;
            });

        document.querySelector(".blogList").innerHTML = html;
    };

    // Init blog list
    listCurrentBlogs();

};
// end of castle wall
    
module.exports = RunAdmin;
},{"../../blog/scripts/blog-factory":5,"../../blog/scripts/blogManager":6}],3:[function(require,module,exports){
const {showSuccess, showErrors, getMissingParts} = require("../../admin/scripts/admin-blog-form-validation");
const BlogManager = require("./blogManager");
const blogObjectFactory = require("./blog-factory");

let editMode = false;
let currentBlog = {};

//---- EVENT LISTENERS ----- 
//Store the elements here
const headlineEl = document.querySelector(".blogForm__headline");
const authorEl = document.querySelector(".blogForm__author");
const dateEl = document.querySelector(".blogForm__date");
const imageEl = document.querySelector(".blogForm__image");
const contentEl = document.querySelector(".blogForm__content");
const tagsEl = document.querySelector(".blogForm__tags");

const setEditMode = (bool) => {
    editMode = bool;

    const msgBlock = document.querySelector(".messageBlock");
    if (bool) {
        msgBlock.style.display = "block";
        msgBlock.innerHTML = "Edit Mode!";
    } else {
        msgBlock.style.display = "none";
    }
};

// sets the current blog
const getCurrentBlog = blogId => {
    currentBlog = {"id": blogId, "detail": BlogManager.data[blogId]};
    console.log("current blog", currentBlog);
};

const addUpdateBlogArticleToDb = function () {
    
    const tags = tagsEl.value.split(", ");
    
    if (editMode) {
        //get index
        // Find the index of the selected article
        const pid = currentBlog.id;
    
        const updateBlogArticle = blogObjectFactory(
            headlineEl.value, //headline
            dateEl.value,
            authorEl.value, //author
            imageEl.value, // imgheader
            contentEl.value, //content
            tags,
            currentBlog.id
        );
        BlogManager.update(pid,updateBlogArticle);
        setEditMode(false);
        //modify existing array
    } else {
        const newBlogArticle = blogObjectFactory(
            headlineEl.value, //headline
            new moment().format("YYYY-MM-DD"), // date added
            authorEl.value, //author
            imageEl.value, // imgheader
            contentEl.value, //content
            tags
        );
        /*         
        Add the article to the blog array, then add it to the db in
        Add it to local storage 
        */
        BlogManager.add(newBlogArticle);
    }

    headlineEl.value = ""; //headline
    dateEl.value = "";
    authorEl.value = ""; //author
    imageEl.value = ""; // imgheader
    contentEl.value = ""; //content
    tagsEl.value = "";


};
    
    
document.querySelector(".blogForm__btnGoToBlog").addEventListener("click",  () => {
    window.location.href = "../blog/index.html";
});
    
// Click on the edit button
document.querySelector(".blogList").addEventListener("click", e => {
        
    if (e.target.className === "blogList__btn-edit") {
        const blogId = e.target.dataset.blogId;
        getCurrentBlog(blogId);
        // populate the blog form
        tagsEl.value = currentBlog.detail.tags.join(", ");
        headlineEl.value = currentBlog.detail.headline;
        authorEl.value = currentBlog.detail.author;
        dateEl.value = currentBlog.detail.dateAdded;
        imageEl.value = currentBlog.detail.imgHeader;
        contentEl.value = currentBlog.detail.content;
        setEditMode(true);
    }
        
    if (e.target.className === "blogList__btn-delete") {
        const blogId = e.target.dataset.blogId;
        BlogManager.delete(blogId);
    }
});
    
// Add event listener to the submit button
document.querySelector(".blogForm__btnSave").addEventListener("click", () => {
    /*
        Collect the input elements
        const blogObjectFactory = function (headline, dateAdded, author, imgHeader, content, ...tags)
        
        Objective is to determine whether or not to accept or reject this submission
        */
    const missingParts = getMissingParts();
        
    if (missingParts.length === 0) {
        // no errors proceed to add blog
        addUpdateBlogArticleToDb();
        showSuccess();
    } else {
        // display errors, do not add blog
        showErrors(missingParts);
    }
        
        
});
},{"../../admin/scripts/admin-blog-form-validation":1,"./blog-factory":5,"./blogManager":6}],4:[function(require,module,exports){
const displayBlogs = function (pageNumber) {

    // sort the data
    const unsortedBlogs = [];
    for (let key in this.filteredData) {
        let currentBlog = this.filteredData[key];
        unsortedBlogs.push(currentBlog);
    }
    const blogs = unsortedBlogs.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));

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

    // go through the data here
    blogsToDisplay.forEach(entry => {

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
        entry.tags.forEach(currentTag => {
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
};

module.exports = displayBlogs;
},{}],5:[function(require,module,exports){
const BlogManager = require("./blogManager");

/*
Create a blog.js file and include it in your blog.html file.
Build a database object to store the each of your blog articles.
Stringify the database object and store it in local storage.
The first step is to design what each object's properties should be - title, date of publication, tags, author, and content. Each article object should have those properties.
*/

/*
const blogEntry = {
    "headline": "",
    "dateAdded": "",
    "author": "",
    "tags": [],
    "imgHeader": "",
    "content": "",
}
*/

const blogEntriesToCheck = BlogManager.data || [];

const getMaxBlogId = function() {
    /*
            1.  Capture the current blog database
            2.  Sort the blog entries held in the database descending
            3.  Capture the first entry of the sorted list and extract
                the id column. If it doesn't exist return a new object
                with an id of 0
        */
    const sortedDescBlogs = blogEntriesToCheck.sort((previous,next)=> next.id-previous.id);
    return sortedDescBlogs[0] || {id: 0};
    
};

const maxBlogId = getMaxBlogId().id;

// generate an unique id for each blog article
const blogIdGenerator = function* (start) {
    let id = 1;

    while (true) {
        yield id + start;
        id++;
    }
};

const blogIdFactory = blogIdGenerator(maxBlogId);

const blogObjectFactory = function (headline, dateAdded, author, imgHeader, content, tags, id) {
    
    const currentId = blogIdFactory.next().value;
    
    return Object.create({},{
        // "id": {value: id || currentId, enumerable: true},
        "headline": {value: headline, enumerable: true},
        "dateAdded": {value: dateAdded, enumerable: true},
        "author": {value: author, enumerable: true},
        "imgHeader": {value: imgHeader, enumerable: true},
        "content": {value: content, enumerable: true},
        "tags": {value: tags, enumerable: true},
        "getDate": {value: function() {
            return moment(this.dateAdded).format("YYYY-MM-DD");
        }, enumerable: false}
    });
};

module.exports = blogObjectFactory;





},{"./blogManager":6}],6:[function(require,module,exports){
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
            
            // const numberOfItems = Object.keys(this.filteredData).length;
            // const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);  
            // this.paginationObj.init(numberOfPages,1);
            
            // // determine how to handle the pagination display
            // if (numberOfPages > 1) {
            //     //document.querySelector(".pagination").style.visibility = "visible";
            // } else {
            //     //document.querySelector(".pagination").style.visibility = "hidden";
            // }
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

},{"../../admin/scripts/admin-controller":2,"../../pagination/scripts/pagination":9,"../../scripts/personalETL":13,"./blog-controller":4}],7:[function(require,module,exports){
const PersonalETL = require("../../scripts/personalETL");

const ContactManager = Object.create(PersonalETL, {
    
    "load": {
        value: function() {
            $.ajax({url: "https://personal-site-3111d.firebaseio.com/contact.json"})
                .then(result => {
                    this.data = result;
                    this.filteredData = result;
                    this.display();
                });
        }
    },

    "display": {
        value: function() {

            const socialLinks = document.getElementById("social-links");
            
            this.filteredData.forEach(contactType => {
                socialLinks.innerHTML += 
                    `<div><a href="${contactType.url}"><img src="${contactType.icon}" alt="${contactType.iconAlt}" class="social-img"></a></div>`;
            
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
    }
    
});

module.exports = ContactManager;

},{"../../scripts/personalETL":13}],8:[function(require,module,exports){
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


},{}],9:[function(require,module,exports){
/*
    REQUIREMENTS: 
        HTML: a <section> with the class of "pagination". 
        JS: You'll need to send in the number of pages to display
*/

const Paginator = function(paginationEl) {
    
    const _paginationEl = paginationEl;

    return Object.create(null, {
        
        "init": {
            value: function (numberOfPages, startPage = 1) {
                //const paginationEl = document.querySelector(".pagination");
                // reset the pagination by removing all the child nodes
                while (_paginationEl.hasChildNodes()) {
                    _paginationEl.removeChild(_paginationEl.lastChild);
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
            
                _paginationEl.appendChild(prev);
            
                // create an element to represent each page
                for (let i = 0; i < numberOfPages; i++) {
                        
                    let link = document.createElement("span");
                    link.dataset.pageNum=`${i+startPage}`;
                    link.className="pagination__page";
                    link.appendChild(document.createTextNode(`${i+startPage}`));
                    _paginationEl.appendChild(link);
               
                }
                   
                // create the next arrow button
                const next = document.createElement("span");
                next.dataset.pageNum=(startPage+1).toString();
                next.className="pagination__next";
                const nextText = document.createTextNode(">");
                next.appendChild(nextText);
                _paginationEl.appendChild(next);
                    
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
        }, 
        "paginationSettings": {
            value: {
                maxPagesToDisplay: 5
            },
            writable: true
        }
    });
};



module.exports = Paginator;
},{}],10:[function(require,module,exports){
const Paginator = require("../../pagination/scripts/pagination");
const PersonalETL = require("../../scripts/personalETL");

const ProjectManager = Object.create(PersonalETL, {
    
    "load": {
        value: function() {
            const getProjects = $.ajax({
                url: "https://personal-site-3111d.firebaseio.com/projects.json"
            });
            getProjects
                .then(result => {
                    this.data = result;
                    this.filterBySearchCriteria("");
                });
        }
    },

    "paginationObj": {
        value: Object.create(Paginator,{}),
        writable: true,
        enumerable: true
    },

    "filterBySearchCriteria": {
        value: function (searchCriteria) {
            this.filteredData = this.data.filter(function(proj){
                return proj.description.toLowerCase().includes(searchCriteria) || proj.name.toLowerCase().includes(searchCriteria);
            });
            this.display(1);
            this.paginate();

        }
    },

    "display": {
        value: function (pageNumber) {

            // Only display the pages in the current page number
            const blogsToDisplay = this.filteredData.slice(
                (pageNumber - 1) * this.displayOptions.itemsPerPage,
                pageNumber * this.displayOptions.itemsPerPage);
            // );  

            const projectsHTML = document.getElementById("projects");
            projectsHTML.innerHTML = "";

            let sortedProjects = this.filteredData.sort((a, b) => moment(b.dateCompleted) - moment(a.dateCompleted));

            let projects = sortedProjects || [];

            for (let i = 0; i < projects.length; i++) {
                let project = projects[i];

                // grab the first technology listed
                const technology = project.technologies.length > 0 ? project.technologies[0] : "";
                let tagHTML = "";

                for (let i = 0; i < project.technologies.length; i++) {
                    let tag = project.technologies[i];
                    tagHTML += `<li>${tag}</li>`;
                }

                // create the teammate string
                let teammates = "";

                for (let i = 0; i < project.teammates.length; i++) {
                    let teammate = project.teammates[i];
                    teammates += `<a href="${teammate.personalSite}">${teammate.name}</a>`;
                }

                //let html = "";
                projectsHTML.innerHTML += `
                        <article class="project-detail ${technology.toLowerCase()}">
                            <h3 class="project-title">${project.name}</h3>
                            <p class="project-description">${project.description}</p>
                            <p class="project-completed-date">Date completed: ${moment(project.dateCompleted).format("YYYY-MM-DD")}</p>
                            <br class="project-href"><a href="${project.href}">link</a> | <a href="${project.repository}">repository</a>
                            <div class="project-tag">
                                <p></p>
                                <ul>
                                    ${tagHTML}
                                </ul>
                            </div>
                        </article>
                    `;


            }
        


        },
        enumerable: true
    },

    "displayOptions": {
        value: {
            "itemsPerPage": 5
        },
        "writable": true
    },

    "search": {
        value: function (searchString) {
            if (searchString.length >= 3) {
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
        value: function () {

            // const numberOfItems = this.filteredData.length;
            // const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);

            // this.paginationObj.init(numberOfPages, 1);

            // // determine how to handle the pagination display
            // if (numberOfPages > 1) {
            //     document.querySelector(".pagination").style.visibility = "";
            // } else {
            //     document.querySelector(".pagination").style.visibility = "hidden";
            // }
        }
    },



});

/**
 * Init for the blog page
 */
ProjectManager.load();

module.exports = ProjectManager;
},{"../../pagination/scripts/pagination":9,"../../scripts/personalETL":13}],11:[function(require,module,exports){
//updateNavBar("resume");

// callback function for generating pagination
//const Paginator = require("../../pagination/scripts/pagination");
const PersonalETL = require("../../scripts/personalETL");

const ResumeManager = Object.create(PersonalETL, {
    
    "load": {
        value: function() {
            $.ajax({url: "https://personal-site-3111d.firebaseio.com/resume.json"})
                .then(result => {
                    this.data = result;
                    this.filteredData = result;
                    this.display();
                });
        }
    },

    "display": {
        value: function() {
            
            const jobsSection = document.getElementById("resume-jobs");
            // loop through the array of job objects
            let jobs = this.filteredData.jobs;
            for (let i = 0; i < jobs.length; i++) {
                
                // TO DO THIS WILL NOW CONTAIN OBJECTS
                let job = jobs[i];
            
                let resumeBullets="";
            
                for (let accompTracker = 0; accompTracker < job.accomplishments.length; accompTracker++) {
                    resumeBullets += 
                    `<li class="resume__accomplishment">${job.accomplishments[accompTracker]}</li>`;
                }
            
                jobsSection.innerHTML += `
                <article class="professional-experience">
                  <header class="article-header resume__header">
                    <span class="resume__headline">${job.headline}</span>
                    <span class="resume__date">${moment(job.startDate).format("YYYY")}-${moment(job.endDate).format("YYYY")}</span>
                  </header>
                  <img src="${job.companyLogoImg}"
                  <h3 class="resume__job-title">${job.title}<h3>
                  <ul class="resume__job-list">
                    ${resumeBullets}
                  </ul>
                  </article>
                `;
                
            }
        },
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
    }
    
});

module.exports = ResumeManager;

},{"../../scripts/personalETL":13}],12:[function(require,module,exports){
const navbar = require("../navbar/scripts/navbar");
//const blogs = require("../blog/scripts/blog-controller");
const BlogManager= require("../blog/scripts/blogManager");
const ResumeManager= require("../resume/scripts/resume");
const ProjectManager = require("../projects/scripts/projects");
const ContactManager = require("../contact/scripts/contact");

// add the admin events
const adminEvents = require("../blog/scripts/blog-admin-events");

console.log("blogger", BlogManager);

navbar("Krys Mathis");
console.log("Project Manager", ProjectManager);
console.log("BlogManager", BlogManager);
console.log("ResumeManager", ResumeManager);
console.log("ContactManager", ContactManager);
BlogManager.load();
ResumeManager.load();
ContactManager.load();


},{"../blog/scripts/blog-admin-events":3,"../blog/scripts/blogManager":6,"../contact/scripts/contact":7,"../navbar/scripts/navbar":8,"../projects/scripts/projects":10,"../resume/scripts/resume":11}],13:[function(require,module,exports){
const PersonalETL = 
    Object.create(null,{
        
        "load": {
            value: function() {},
            writable: true,
            enumerable: true
        },

        "data": {
            value: [],
            writable: true,
            enumerable: true
        },
        
        // initially set the filterd data = data
        "filteredData": {
            value: this.data,
            writable: true,
            enumerable: true
        },

        // this is a function created by the concrete implementation
        "filterBySearchCriteria": {
            value: {},
            writable: true,
            enumerable: true
        },

        // this may change as the implementation changes
        "filterByTag": {
            writable: true,
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

            
        /**
         * The paginationObj contains the object that controls the pagination
         */
        "paginationObj": {
            value: {},
            writable: true,
            enumerable: true
        },
        
        /**
         * The display property will contain a function that controls
         * How the object displays it's data
         * This is specific to how the object is acutally implemented
         */
        "display": {
            value: {},
            writable: true,
            enumerable: true
        },

        "displayOptions": {
            value: {
                "itemsPerPage": 5,
            },
            writable: true,
            enumerable: true
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
                
                const numberOfItems = this.filteredData.length;
                const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);
                
                this.Paginator.init(numberOfPages,1);
                
                if (!$.isEmptyObject(this.paginationObj)) {
                    //determine how to handle the pagination display
                    // if (numberOfPages > 1) {
                    //     document.querySelector(".pagination").style.visibility = "";
                    // } else {
                    //     document.querySelector(".pagination").style.visibility = "hidden";
                    // }
                }
            },
            writable: true,
            enumerable: true
        },
    




    });


module.exports = PersonalETL;
},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZG1pbi9zY3JpcHRzL2FkbWluLWJsb2ctZm9ybS12YWxpZGF0aW9uLmpzIiwiYWRtaW4vc2NyaXB0cy9hZG1pbi1jb250cm9sbGVyLmpzIiwiYmxvZy9zY3JpcHRzL2Jsb2ctYWRtaW4tZXZlbnRzLmpzIiwiYmxvZy9zY3JpcHRzL2Jsb2ctY29udHJvbGxlci5qcyIsImJsb2cvc2NyaXB0cy9ibG9nLWZhY3RvcnkuanMiLCJibG9nL3NjcmlwdHMvYmxvZ01hbmFnZXIuanMiLCJjb250YWN0L3NjcmlwdHMvY29udGFjdC5qcyIsIm5hdmJhci9zY3JpcHRzL25hdmJhci5qcyIsInBhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uLmpzIiwicHJvamVjdHMvc2NyaXB0cy9wcm9qZWN0cy5qcyIsInJlc3VtZS9zY3JpcHRzL3Jlc3VtZS5qcyIsInNjcmlwdHMvbWFpbi5qcyIsInNjcmlwdHMvcGVyc29uYWxFVEwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBGb3JtIHZhbGlkYXRpb25cbiAgICAxLiBBbGwgdGV4dCBpbnB1dHMgc2hvdWxkIGhhdmUgYSB2YWx1ZVxuICAgIDIuIFRoZSB0ZXh0IGFyZWEgc2hvdWxkIGNvbnRhaW4gYXQgbGVhc3QgdGhyZWUgY2hhcmFjdGVyc1xuICAgICovXG5jb25zdCBnZXRNaXNzaW5nUGFydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgIC8vIGNoZWNrIGlucHV0c1xuICAgIGNvbnN0IGJsb2dQYXJ0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W2NsYXNzXj0nYmxvZ0Zvcm0nXVwiKSk7XG4gICAgY29uc3QgbWlzc2luZ1BhcnRzID0gW107XG4gICAgICAgIFxuICAgIGJsb2dQYXJ0cy5mb3JFYWNoKHBhcnQgPT4ge1xuICAgICAgICBpZiAocGFydC52YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIG1pc3NpbmdQYXJ0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IHBhcnQubmFtZSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IHBhcnQuY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIm1pc3NpbmcgXCIgKyBwYXJ0Lm5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgICAgIFxuICAgIC8vIGNoZWNrIHRleHQgYXJlYVxuICAgIGNvbnN0IGJsb2dUZXh0QXJlYVZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRleHRhcmVhW25hbWU9J2Jsb2ctY29udGVudCddXCIpLnZhbHVlO1xuICAgIGlmIChibG9nVGV4dEFyZWFWYWx1ZS5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1pc3NpbmdQYXJ0cy5wdXNoKHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJibG9nLWNvbnRlbnRzXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IGJsb2dUZXh0QXJlYVZhbHVlLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcInNob3VsZCBjb250YWluIGF0IGxlYXN0IDMgY2hhcmFjdGVycyBvZiBjb250ZW50XCJcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBtaXNzaW5nUGFydHM7XG59O1xuICAgIFxuICAgIC8qXG4gICAgVGhlIG1pc3NpbmcgcGFydHMgYXJlIHN0b3JlZCBoZXJlLCBleHRyYWN0IGFuZCBkaXNwbGF5IHRoZW0gaGVyZVxuICAgICovXG5jb25zdCBzaG93RXJyb3JzID0gZnVuY3Rpb24gKG1pc3NpbmdQYXJ0cykge1xuICAgIGxldCBtZXNzYWdlID0gXCI8aDM+ISEhVW5hY2NlcHRhYmxlIFN1Ym1pc3Npb24hISE8L2gzPiA8dWw+XCI7XG4gICAgY29uc3QgbXNnQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2VCbG9ja1wiKTtcbiAgICAgICAgXG4gICAgbWlzc2luZ1BhcnRzLmZvckVhY2gocGFydCA9PiBtZXNzYWdlICs9IGA8bGkgY2xhc3M9XCJtZXNzYWdlQmxvY2tfX2RldGFpbFwiPllvdXIgJHtwYXJ0LmZpZWxkfSBpcyAke3BhcnQubWVzc2FnZX08L2xpPmApO1xuICAgIG1lc3NhZ2UgKz0gXCI8L3VsPlwiO1xuICAgIG1zZ0Jsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgbXNnQmxvY2suc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcbiAgICBtc2dCbG9jay5pbm5lckhUTUwgPSBtZXNzYWdlO1xufTtcbiAgICBcbmNvbnN0IHNob3dTdWNjZXNzID0gKCkgPT4ge1xuICAgIGNvbnN0IG1zZ0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZXNzYWdlQmxvY2tcIik7XG4gICAgbXNnQmxvY2suc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI1NSwyNTUsMCwuNzUpXCI7XG4gICAgbXNnQmxvY2suaW5uZXJIVE1MID0gXCJZb3UndmUgY3JlYXRlZCBhIG5ldyBibG9nIVwiO1xuICAgIG1zZ0Jsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7IC8vc2hvdyB0aGUgZWxlbWVudFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBtc2dCbG9jay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSwgMTAwMDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7c2hvd1N1Y2Nlc3MsIHNob3dFcnJvcnMsIGdldE1pc3NpbmdQYXJ0c307IiwiY29uc3QgYmxvZ09iamVjdEZhY3RvcnkgPSByZXF1aXJlKFwiLi4vLi4vYmxvZy9zY3JpcHRzL2Jsb2ctZmFjdG9yeVwiKTtcbmNvbnN0IEJsb2dNYW5hZ2VyID0gcmVxdWlyZShcIi4uLy4uL2Jsb2cvc2NyaXB0cy9ibG9nTWFuYWdlclwiKTtcblxuY29uc3QgUnVuQWRtaW4gPSBmdW5jdGlvbiAoYmxvZ0RhdGEpIHtcbiAgICBcbiAgICAvLyBnZXQgdGhlIGRhdGFiYXNlIGZyb20gbG9jYWwgc3RvcmFnZSwgb3IgZW1wdHkgb2JqZWN0IGlmIG51bGxcbiAgICAvLyBnZXQgdGhlIGJsb2cgZW50cmllcyBvciBlbXB0eSBvYmplY3QgaWYgbnVsbFxuICAgIGNvbnN0IGJsb2dzID0gYmxvZ0RhdGE7XG4gICAgLypcbiAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIEdlbmVyYXRlIGEgbGlzdCBvZiB0aGUgY3VycmVudCBibG9ncyBmb3IgZWRpdGluZ1xuICAgICAgICBUaGUgcmVjb3JkcyB3aWxsIGdvIGludG8gYSB0YWJsZVxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAqL1xuICAgIGNvbnN0IGxpc3RDdXJyZW50QmxvZ3MgPSAoKSA9PiB7XG4gICAgICAgIGxldCBodG1sID0gXCJcIjtcbiAgICAgICAgY29uc3QgYmxvZ3NBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmxvZ3MpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50QmxvZyA9IGJsb2dzW2tleV07XG4gICAgICAgICAgICBibG9nc0FycmF5LnB1c2goe1wiaWRcIjoga2V5LCBcImRhdGVBZGRlZFwiOiBjdXJyZW50QmxvZy5kYXRlQWRkZWQsIFwiYmxvZ0RldGFpbFwiOiBjdXJyZW50QmxvZ30pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvcnRlZEJsb2dzID0gYmxvZ3NBcnJheS5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQWRkZWQpIC0gbW9tZW50KGEuZGF0ZUFkZGVkKSk7XG4gICAgICAgIHNvcnRlZEJsb2dzXG4gICAgICAgICAgICAuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBgXG5cdFx0XHRcdDxhcnRpY2xlIGNsYXNzPVwiYmxvZ0xpc3RfX2VudHJ5XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJsb2dMaXN0X19oZWFkbGluZVwiPiR7ZW50cnkuYmxvZ0RldGFpbC5oZWFkbGluZX08L3RoPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJibG9nTGlzdF9fcHJldmlld1wiPiR7ZW50cnkuYmxvZ0RldGFpbC5jb250ZW50LnN1YnN0cmluZygwLDMwKS5yZXBsYWNlKC88KD86LnxcXG4pKj8+L2dtLCBcIlwiKX08L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYmxvZ0xpc3RfX2RhdGVcIj4ke2VudHJ5LmJsb2dEZXRhaWwuZGF0ZUFkZGVkfTwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJibG9nTGlzdF9fYnV0dG9uLXJvd1wiPjxidXR0b24gY2xhc3M9XCJibG9nTGlzdF9fYnRuLWVkaXRcIiBkYXRhLWJsb2ctaWQ9XCIke2VudHJ5LmlkfVwiPkVkaXQ8L2J1dHRvbj48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYmxvZ0xpc3RfX2J1dHRvbi1yb3dcIj48YnV0dG9uIGNsYXNzPVwiYmxvZ0xpc3RfX2J0bi1kZWxldGVcIiBkYXRhLWJsb2ctaWQ9XCIke2VudHJ5LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPjwvdGQ+XG5cdFx0XHRcdDwvYXJ0aWNsZT5cblx0XHRcdFx0YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0xpc3RcIikuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB9O1xuXG4gICAgLy8gSW5pdCBibG9nIGxpc3RcbiAgICBsaXN0Q3VycmVudEJsb2dzKCk7XG5cbn07XG4vLyBlbmQgb2YgY2FzdGxlIHdhbGxcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gUnVuQWRtaW47IiwiY29uc3Qge3Nob3dTdWNjZXNzLCBzaG93RXJyb3JzLCBnZXRNaXNzaW5nUGFydHN9ID0gcmVxdWlyZShcIi4uLy4uL2FkbWluL3NjcmlwdHMvYWRtaW4tYmxvZy1mb3JtLXZhbGlkYXRpb25cIik7XG5jb25zdCBCbG9nTWFuYWdlciA9IHJlcXVpcmUoXCIuL2Jsb2dNYW5hZ2VyXCIpO1xuY29uc3QgYmxvZ09iamVjdEZhY3RvcnkgPSByZXF1aXJlKFwiLi9ibG9nLWZhY3RvcnlcIik7XG5cbmxldCBlZGl0TW9kZSA9IGZhbHNlO1xubGV0IGN1cnJlbnRCbG9nID0ge307XG5cbi8vLS0tLSBFVkVOVCBMSVNURU5FUlMgLS0tLS0gXG4vL1N0b3JlIHRoZSBlbGVtZW50cyBoZXJlXG5jb25zdCBoZWFkbGluZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9faGVhZGxpbmVcIik7XG5jb25zdCBhdXRob3JFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0Zvcm1fX2F1dGhvclwiKTtcbmNvbnN0IGRhdGVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0Zvcm1fX2RhdGVcIik7XG5jb25zdCBpbWFnZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9faW1hZ2VcIik7XG5jb25zdCBjb250ZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19jb250ZW50XCIpO1xuY29uc3QgdGFnc0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9fdGFnc1wiKTtcblxuY29uc3Qgc2V0RWRpdE1vZGUgPSAoYm9vbCkgPT4ge1xuICAgIGVkaXRNb2RlID0gYm9vbDtcblxuICAgIGNvbnN0IG1zZ0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZXNzYWdlQmxvY2tcIik7XG4gICAgaWYgKGJvb2wpIHtcbiAgICAgICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgbXNnQmxvY2suaW5uZXJIVE1MID0gXCJFZGl0IE1vZGUhXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn07XG5cbi8vIHNldHMgdGhlIGN1cnJlbnQgYmxvZ1xuY29uc3QgZ2V0Q3VycmVudEJsb2cgPSBibG9nSWQgPT4ge1xuICAgIGN1cnJlbnRCbG9nID0ge1wiaWRcIjogYmxvZ0lkLCBcImRldGFpbFwiOiBCbG9nTWFuYWdlci5kYXRhW2Jsb2dJZF19O1xuICAgIGNvbnNvbGUubG9nKFwiY3VycmVudCBibG9nXCIsIGN1cnJlbnRCbG9nKTtcbn07XG5cbmNvbnN0IGFkZFVwZGF0ZUJsb2dBcnRpY2xlVG9EYiA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBjb25zdCB0YWdzID0gdGFnc0VsLnZhbHVlLnNwbGl0KFwiLCBcIik7XG4gICAgXG4gICAgaWYgKGVkaXRNb2RlKSB7XG4gICAgICAgIC8vZ2V0IGluZGV4XG4gICAgICAgIC8vIEZpbmQgdGhlIGluZGV4IG9mIHRoZSBzZWxlY3RlZCBhcnRpY2xlXG4gICAgICAgIGNvbnN0IHBpZCA9IGN1cnJlbnRCbG9nLmlkO1xuICAgIFxuICAgICAgICBjb25zdCB1cGRhdGVCbG9nQXJ0aWNsZSA9IGJsb2dPYmplY3RGYWN0b3J5KFxuICAgICAgICAgICAgaGVhZGxpbmVFbC52YWx1ZSwgLy9oZWFkbGluZVxuICAgICAgICAgICAgZGF0ZUVsLnZhbHVlLFxuICAgICAgICAgICAgYXV0aG9yRWwudmFsdWUsIC8vYXV0aG9yXG4gICAgICAgICAgICBpbWFnZUVsLnZhbHVlLCAvLyBpbWdoZWFkZXJcbiAgICAgICAgICAgIGNvbnRlbnRFbC52YWx1ZSwgLy9jb250ZW50XG4gICAgICAgICAgICB0YWdzLFxuICAgICAgICAgICAgY3VycmVudEJsb2cuaWRcbiAgICAgICAgKTtcbiAgICAgICAgQmxvZ01hbmFnZXIudXBkYXRlKHBpZCx1cGRhdGVCbG9nQXJ0aWNsZSk7XG4gICAgICAgIHNldEVkaXRNb2RlKGZhbHNlKTtcbiAgICAgICAgLy9tb2RpZnkgZXhpc3RpbmcgYXJyYXlcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuZXdCbG9nQXJ0aWNsZSA9IGJsb2dPYmplY3RGYWN0b3J5KFxuICAgICAgICAgICAgaGVhZGxpbmVFbC52YWx1ZSwgLy9oZWFkbGluZVxuICAgICAgICAgICAgbmV3IG1vbWVudCgpLmZvcm1hdChcIllZWVktTU0tRERcIiksIC8vIGRhdGUgYWRkZWRcbiAgICAgICAgICAgIGF1dGhvckVsLnZhbHVlLCAvL2F1dGhvclxuICAgICAgICAgICAgaW1hZ2VFbC52YWx1ZSwgLy8gaW1naGVhZGVyXG4gICAgICAgICAgICBjb250ZW50RWwudmFsdWUsIC8vY29udGVudFxuICAgICAgICAgICAgdGFnc1xuICAgICAgICApO1xuICAgICAgICAvKiAgICAgICAgIFxuICAgICAgICBBZGQgdGhlIGFydGljbGUgdG8gdGhlIGJsb2cgYXJyYXksIHRoZW4gYWRkIGl0IHRvIHRoZSBkYiBpblxuICAgICAgICBBZGQgaXQgdG8gbG9jYWwgc3RvcmFnZSBcbiAgICAgICAgKi9cbiAgICAgICAgQmxvZ01hbmFnZXIuYWRkKG5ld0Jsb2dBcnRpY2xlKTtcbiAgICB9XG5cbiAgICBoZWFkbGluZUVsLnZhbHVlID0gXCJcIjsgLy9oZWFkbGluZVxuICAgIGRhdGVFbC52YWx1ZSA9IFwiXCI7XG4gICAgYXV0aG9yRWwudmFsdWUgPSBcIlwiOyAvL2F1dGhvclxuICAgIGltYWdlRWwudmFsdWUgPSBcIlwiOyAvLyBpbWdoZWFkZXJcbiAgICBjb250ZW50RWwudmFsdWUgPSBcIlwiOyAvL2NvbnRlbnRcbiAgICB0YWdzRWwudmFsdWUgPSBcIlwiO1xuXG5cbn07XG4gICAgXG4gICAgXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19idG5Hb1RvQmxvZ1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiLi4vYmxvZy9pbmRleC5odG1sXCI7XG59KTtcbiAgICBcbi8vIENsaWNrIG9uIHRoZSBlZGl0IGJ1dHRvblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nTGlzdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgIFxuICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUgPT09IFwiYmxvZ0xpc3RfX2J0bi1lZGl0XCIpIHtcbiAgICAgICAgY29uc3QgYmxvZ0lkID0gZS50YXJnZXQuZGF0YXNldC5ibG9nSWQ7XG4gICAgICAgIGdldEN1cnJlbnRCbG9nKGJsb2dJZCk7XG4gICAgICAgIC8vIHBvcHVsYXRlIHRoZSBibG9nIGZvcm1cbiAgICAgICAgdGFnc0VsLnZhbHVlID0gY3VycmVudEJsb2cuZGV0YWlsLnRhZ3Muam9pbihcIiwgXCIpO1xuICAgICAgICBoZWFkbGluZUVsLnZhbHVlID0gY3VycmVudEJsb2cuZGV0YWlsLmhlYWRsaW5lO1xuICAgICAgICBhdXRob3JFbC52YWx1ZSA9IGN1cnJlbnRCbG9nLmRldGFpbC5hdXRob3I7XG4gICAgICAgIGRhdGVFbC52YWx1ZSA9IGN1cnJlbnRCbG9nLmRldGFpbC5kYXRlQWRkZWQ7XG4gICAgICAgIGltYWdlRWwudmFsdWUgPSBjdXJyZW50QmxvZy5kZXRhaWwuaW1nSGVhZGVyO1xuICAgICAgICBjb250ZW50RWwudmFsdWUgPSBjdXJyZW50QmxvZy5kZXRhaWwuY29udGVudDtcbiAgICAgICAgc2V0RWRpdE1vZGUodHJ1ZSk7XG4gICAgfVxuICAgICAgICBcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lID09PSBcImJsb2dMaXN0X19idG4tZGVsZXRlXCIpIHtcbiAgICAgICAgY29uc3QgYmxvZ0lkID0gZS50YXJnZXQuZGF0YXNldC5ibG9nSWQ7XG4gICAgICAgIEJsb2dNYW5hZ2VyLmRlbGV0ZShibG9nSWQpO1xuICAgIH1cbn0pO1xuICAgIFxuLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBzdWJtaXQgYnV0dG9uXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19idG5TYXZlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgLypcbiAgICAgICAgQ29sbGVjdCB0aGUgaW5wdXQgZWxlbWVudHNcbiAgICAgICAgY29uc3QgYmxvZ09iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiAoaGVhZGxpbmUsIGRhdGVBZGRlZCwgYXV0aG9yLCBpbWdIZWFkZXIsIGNvbnRlbnQsIC4uLnRhZ3MpXG4gICAgICAgIFxuICAgICAgICBPYmplY3RpdmUgaXMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGFjY2VwdCBvciByZWplY3QgdGhpcyBzdWJtaXNzaW9uXG4gICAgICAgICovXG4gICAgY29uc3QgbWlzc2luZ1BhcnRzID0gZ2V0TWlzc2luZ1BhcnRzKCk7XG4gICAgICAgIFxuICAgIGlmIChtaXNzaW5nUGFydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIG5vIGVycm9ycyBwcm9jZWVkIHRvIGFkZCBibG9nXG4gICAgICAgIGFkZFVwZGF0ZUJsb2dBcnRpY2xlVG9EYigpO1xuICAgICAgICBzaG93U3VjY2VzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRpc3BsYXkgZXJyb3JzLCBkbyBub3QgYWRkIGJsb2dcbiAgICAgICAgc2hvd0Vycm9ycyhtaXNzaW5nUGFydHMpO1xuICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxufSk7IiwiY29uc3QgZGlzcGxheUJsb2dzID0gZnVuY3Rpb24gKHBhZ2VOdW1iZXIpIHtcblxuICAgIC8vIHNvcnQgdGhlIGRhdGFcbiAgICBjb25zdCB1bnNvcnRlZEJsb2dzID0gW107XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmlsdGVyZWREYXRhKSB7XG4gICAgICAgIGxldCBjdXJyZW50QmxvZyA9IHRoaXMuZmlsdGVyZWREYXRhW2tleV07XG4gICAgICAgIHVuc29ydGVkQmxvZ3MucHVzaChjdXJyZW50QmxvZyk7XG4gICAgfVxuICAgIGNvbnN0IGJsb2dzID0gdW5zb3J0ZWRCbG9ncy5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQWRkZWQpIC0gbW9tZW50KGEuZGF0ZUFkZGVkKSk7XG5cbiAgICAvLyBDbGVhciBvdXQgYWxsIGV4aXN0aW5nIGJsb2cgZWxlbWVudHNcbiAgICBjb25zdCBibG9nc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJibG9nLXBvc3RzXCIpO1xuICAgIHdoaWxlIChibG9nc0VsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBibG9nc0VsLnJlbW92ZUNoaWxkKGJsb2dzRWwubGFzdENoaWxkKTtcbiAgICB9XG5cbiAgICAvLyBkb24ndCBkaXNwbGF5IHBhZ2luYXRlIGlmIHRoZXJlIGFyZSBubyBibG9nc1xuICAgIGlmIChibG9ncy5sZW5ndGggPCAxKSB7XG4gICAgICAgIGJsb2dzRWwuaW5uZXJIVE1MID0gXCJObyBibG9ncyBmb3VuZC4uLlwiO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT25seSBkaXNwbGF5IHRoZSBwYWdlcyBpbiB0aGUgY3VycmVudCBwYWdlIG51bWJlclxuICAgIGNvbnN0IGJsb2dzVG9EaXNwbGF5ID0gYmxvZ3Muc2xpY2UoXG4gICAgICAgIChwYWdlTnVtYmVyIC0gMSkgKiB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgcGFnZU51bWJlciAqIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlXG4gICAgKTtcblxuICAgIC8vIGdvIHRocm91Z2ggdGhlIGRhdGEgaGVyZVxuICAgIGJsb2dzVG9EaXNwbGF5LmZvckVhY2goZW50cnkgPT4ge1xuXG4gICAgICAgIGxldCBpbWFnZVNyYyA9IGVudHJ5LmltZ0hlYWRlci5zdGFydHNXaXRoKFwiaW1hZ2VzXCIpID8gXCIuLi9cIiArIGVudHJ5LmltZ0hlYWRlciA6IGVudHJ5LmltZ0hlYWRlcjtcblxuICAgICAgICAvLyBtYWluIGVsZW1lbnRcbiAgICAgICAgbGV0IGJsb2dQb3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFydGljbGVcIik7XG4gICAgICAgIGJsb2dQb3N0LmNsYXNzTmFtZSA9IFwiYmxvZ19fcG9zdFwiO1xuXG4gICAgICAgIGxldCBibG9nSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ0hlYWRlci5jbGFzc05hbWUgPSBcImJsb2dfX2hlYWRlclwiO1xuXG4gICAgICAgIGxldCBibG9nSGVhZGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibG9nSGVhZGxpbmUuY2xhc3NOYW1lID0gXCJibG9nX19oZWFkbGluZVwiO1xuICAgICAgICBsZXQgYmxvZ0hlYWRsaW5lVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVudHJ5LmhlYWRsaW5lKTtcbiAgICAgICAgYmxvZ0hlYWRsaW5lLmFwcGVuZENoaWxkKGJsb2dIZWFkbGluZVRleHQpO1xuXG4gICAgICAgIGxldCBibG9nRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsb2dEYXRlLmNsYXNzTmFtZSA9IFwiYmxvZ19fZGF0ZVwiO1xuICAgICAgICBsZXQgYmxvZ0RhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobW9tZW50KGVudHJ5LmRhdGVBZGRlZCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGJsb2dEYXRlLmFwcGVuZENoaWxkKGJsb2dEYXRlVGV4dCk7XG5cbiAgICAgICAgLy8gYXBwZW5kIHRvIHRoZSBibG9nSGVhZGVyIGRpdlxuICAgICAgICBibG9nSGVhZGVyLmFwcGVuZENoaWxkKGJsb2dIZWFkbGluZSk7XG4gICAgICAgIGJsb2dIZWFkZXIuYXBwZW5kQ2hpbGQoYmxvZ0RhdGUpO1xuXG4gICAgICAgIC8vIGFwcGVuZCB0byBtYWluIGRpdlxuICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nSGVhZGVyKTtcblxuICAgICAgICAvLyBJbWcgZGl2XG4gICAgICAgIGxldCBibG9nSW1nQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ0ltZ0NvbnRhaW5lci5jbGFzc05hbWUgPSBcImJsb2dfX2ltZy1oZWFkZXJcIjtcbiAgICAgICAgLy8gSW1hZ2VcbiAgICAgICAgbGV0IGJsb2dJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBibG9nSW1nLnNyYyA9IGltYWdlU3JjO1xuICAgICAgICBibG9nSW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2dJbWcpO1xuICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nSW1nQ29udGFpbmVyKTtcblxuICAgICAgICAvLyBDb250ZW50XG4gICAgICAgIGxldCBibG9nQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsb2dDb250ZW50LmNsYXNzTmFtZSA9IFwiYmxvZ19fY29udGVudFwiO1xuICAgICAgICBibG9nQ29udGVudC5pbm5lckhUTUwgPSBlbnRyeS5jb250ZW50O1xuICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nQ29udGVudCk7XG5cbiAgICAgICAgLy8gVGFncyBDb250YWluZXJcbiAgICAgICAgbGV0IGJsb2dUYWdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ1RhZ3MuY2xhc3NOYW1lID0gXCJibG9nX19mb290ZXIgcHJvamVjdC10YWdcIjtcbiAgICAgICAgbGV0IGJsb2dUYWdMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuXG4gICAgICAgIC8vIGRvIHRoZSB0YWdzXG4gICAgICAgIGVudHJ5LnRhZ3MuZm9yRWFjaChjdXJyZW50VGFnID0+IHtcbiAgICAgICAgICAgIGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICB0YWcuY2xhc3NOYW1lID0gXCJibG9nX190YWdcIjtcbiAgICAgICAgICAgIHRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjdXJyZW50VGFnKSk7XG4gICAgICAgICAgICBibG9nVGFnTGlzdC5hcHBlbmRDaGlsZCh0YWcpO1xuXG4gICAgICAgICAgICAvLyBhZGQgZXZlbnQgbGlzdGVuZXIgZm9yIG9uIGNsaWNrXG4gICAgICAgICAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFnVHh0ID0gZS50YXJnZXQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlUYWcodGFnVHh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBibG9nVGFncy5hcHBlbmRDaGlsZChibG9nVGFnTGlzdCk7XG4gICAgICAgIGJsb2dQb3N0LmFwcGVuZENoaWxkKGJsb2dUYWdzKTtcblxuXG4gICAgICAgIC8vIGZvciBsb29wIGZvciBhZGRpbmcgdGhlIHRhZ3NcbiAgICAgICAgYmxvZ3NFbC5hcHBlbmRDaGlsZChibG9nUG9zdCk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRpc3BsYXlCbG9nczsiLCJjb25zdCBCbG9nTWFuYWdlciA9IHJlcXVpcmUoXCIuL2Jsb2dNYW5hZ2VyXCIpO1xuXG4vKlxuQ3JlYXRlIGEgYmxvZy5qcyBmaWxlIGFuZCBpbmNsdWRlIGl0IGluIHlvdXIgYmxvZy5odG1sIGZpbGUuXG5CdWlsZCBhIGRhdGFiYXNlIG9iamVjdCB0byBzdG9yZSB0aGUgZWFjaCBvZiB5b3VyIGJsb2cgYXJ0aWNsZXMuXG5TdHJpbmdpZnkgdGhlIGRhdGFiYXNlIG9iamVjdCBhbmQgc3RvcmUgaXQgaW4gbG9jYWwgc3RvcmFnZS5cblRoZSBmaXJzdCBzdGVwIGlzIHRvIGRlc2lnbiB3aGF0IGVhY2ggb2JqZWN0J3MgcHJvcGVydGllcyBzaG91bGQgYmUgLSB0aXRsZSwgZGF0ZSBvZiBwdWJsaWNhdGlvbiwgdGFncywgYXV0aG9yLCBhbmQgY29udGVudC4gRWFjaCBhcnRpY2xlIG9iamVjdCBzaG91bGQgaGF2ZSB0aG9zZSBwcm9wZXJ0aWVzLlxuKi9cblxuLypcbmNvbnN0IGJsb2dFbnRyeSA9IHtcbiAgICBcImhlYWRsaW5lXCI6IFwiXCIsXG4gICAgXCJkYXRlQWRkZWRcIjogXCJcIixcbiAgICBcImF1dGhvclwiOiBcIlwiLFxuICAgIFwidGFnc1wiOiBbXSxcbiAgICBcImltZ0hlYWRlclwiOiBcIlwiLFxuICAgIFwiY29udGVudFwiOiBcIlwiLFxufVxuKi9cblxuY29uc3QgYmxvZ0VudHJpZXNUb0NoZWNrID0gQmxvZ01hbmFnZXIuZGF0YSB8fCBbXTtcblxuY29uc3QgZ2V0TWF4QmxvZ0lkID0gZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICAgICAgICAgIDEuICBDYXB0dXJlIHRoZSBjdXJyZW50IGJsb2cgZGF0YWJhc2VcbiAgICAgICAgICAgIDIuICBTb3J0IHRoZSBibG9nIGVudHJpZXMgaGVsZCBpbiB0aGUgZGF0YWJhc2UgZGVzY2VuZGluZ1xuICAgICAgICAgICAgMy4gIENhcHR1cmUgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBzb3J0ZWQgbGlzdCBhbmQgZXh0cmFjdFxuICAgICAgICAgICAgICAgIHRoZSBpZCBjb2x1bW4uIElmIGl0IGRvZXNuJ3QgZXhpc3QgcmV0dXJuIGEgbmV3IG9iamVjdFxuICAgICAgICAgICAgICAgIHdpdGggYW4gaWQgb2YgMFxuICAgICAgICAqL1xuICAgIGNvbnN0IHNvcnRlZERlc2NCbG9ncyA9IGJsb2dFbnRyaWVzVG9DaGVjay5zb3J0KChwcmV2aW91cyxuZXh0KT0+IG5leHQuaWQtcHJldmlvdXMuaWQpO1xuICAgIHJldHVybiBzb3J0ZWREZXNjQmxvZ3NbMF0gfHwge2lkOiAwfTtcbiAgICBcbn07XG5cbmNvbnN0IG1heEJsb2dJZCA9IGdldE1heEJsb2dJZCgpLmlkO1xuXG4vLyBnZW5lcmF0ZSBhbiB1bmlxdWUgaWQgZm9yIGVhY2ggYmxvZyBhcnRpY2xlXG5jb25zdCBibG9nSWRHZW5lcmF0b3IgPSBmdW5jdGlvbiogKHN0YXJ0KSB7XG4gICAgbGV0IGlkID0gMTtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHlpZWxkIGlkICsgc3RhcnQ7XG4gICAgICAgIGlkKys7XG4gICAgfVxufTtcblxuY29uc3QgYmxvZ0lkRmFjdG9yeSA9IGJsb2dJZEdlbmVyYXRvcihtYXhCbG9nSWQpO1xuXG5jb25zdCBibG9nT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIChoZWFkbGluZSwgZGF0ZUFkZGVkLCBhdXRob3IsIGltZ0hlYWRlciwgY29udGVudCwgdGFncywgaWQpIHtcbiAgICBcbiAgICBjb25zdCBjdXJyZW50SWQgPSBibG9nSWRGYWN0b3J5Lm5leHQoKS52YWx1ZTtcbiAgICBcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh7fSx7XG4gICAgICAgIC8vIFwiaWRcIjoge3ZhbHVlOiBpZCB8fCBjdXJyZW50SWQsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcImhlYWRsaW5lXCI6IHt2YWx1ZTogaGVhZGxpbmUsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcImRhdGVBZGRlZFwiOiB7dmFsdWU6IGRhdGVBZGRlZCwgZW51bWVyYWJsZTogdHJ1ZX0sXG4gICAgICAgIFwiYXV0aG9yXCI6IHt2YWx1ZTogYXV0aG9yLCBlbnVtZXJhYmxlOiB0cnVlfSxcbiAgICAgICAgXCJpbWdIZWFkZXJcIjoge3ZhbHVlOiBpbWdIZWFkZXIsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcImNvbnRlbnRcIjoge3ZhbHVlOiBjb250ZW50LCBlbnVtZXJhYmxlOiB0cnVlfSxcbiAgICAgICAgXCJ0YWdzXCI6IHt2YWx1ZTogdGFncywgZW51bWVyYWJsZTogdHJ1ZX0sXG4gICAgICAgIFwiZ2V0RGF0ZVwiOiB7dmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCh0aGlzLmRhdGVBZGRlZCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgfSwgZW51bWVyYWJsZTogZmFsc2V9XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJsb2dPYmplY3RGYWN0b3J5O1xuXG5cblxuXG4iLCIvLyBBbiBvYmplY3QgdGhhdCB3aWxsIGNvbnRyb2wgdGhlIGZldGNoaW5nIGFuZCBwb3N0aW5nIG9mIGJsb2dzXG4vLyBFVEwgb2JqZWN0IGZvciBibG9nc1xuXG4vLyBjYWxsYmFjayBmdW5jdGlvbiBmb3IgZ2VuZXJhdGluZyBwYWdpbmF0aW9uXG5jb25zdCBQYWdpbmF0b3IgPSByZXF1aXJlKFwiLi4vLi4vcGFnaW5hdGlvbi9zY3JpcHRzL3BhZ2luYXRpb25cIik7XG5jb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuY29uc3QgZGlzcGxheUJsb2dzID0gcmVxdWlyZShcIi4vYmxvZy1jb250cm9sbGVyXCIpO1xuY29uc3QgQWRtaW5NYW5hZ2VyID0gcmVxdWlyZShcIi4uLy4uL2FkbWluL3NjcmlwdHMvYWRtaW4tY29udHJvbGxlclwiKTtcbi8vY29uc3QgYWRkRXZlbnRzID0gcmVxdWlyZShcIi4vYmxvZy1hZG1pbi1ldmVudHNcIik7XG5cbmNvbnN0IEJsb2dNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKFBlcnNvbmFsRVRMLCB7XG4gICAgXG4gICAgXCJsb2FkXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJC5hamF4KHt1cmw6IFwiaHR0cHM6Ly9wZXJzb25hbC1zaXRlLTMxMTFkLmZpcmViYXNlaW8uY29tL2Jsb2dzLmpzb25cIn0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBBZG1pbk1hbmFnZXIodGhpcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxvZ0FkbWluIHVwZGF0ZSBnb2VzIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgLy9ibG9nQWRtaW5pc3RyYXRvci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImFkZFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9ibG9ncy8uanNvblwiLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkob2JqKVxuICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihwaWQsIG9iaikge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vYmxvZ3MvJHtwaWR9Ly5qc29uYCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkob2JqKVxuICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihwaWQpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9wZXJzb25hbC1zaXRlLTMxMTFkLmZpcmViYXNlaW8uY29tL2Jsb2dzLyR7cGlkfS8uanNvbmAsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgICAgICB9KS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgdmFsdWU6IFBhZ2luYXRvcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikpLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlckJ5U2VhcmNoQ3JpdGVyaWFcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoQ3JpdGVyaWEpIHtcbiAgICAgICAgICAgIC8vIHNvcnQgaW4gZGVzY2VuZGluZyBvcmRlclxuICAgICAgICAgICAgLy9jb25zdCBzb3J0ZWRCbG9nRW50cmllcyA9IHRoaXMuZGF0YS5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQWRkZWQpIC0gbW9tZW50KGEuZGF0ZUFkZGVkKSk7XG4gICAgICAgICAgICBpZiAoc2VhcmNoQ3JpdGVyaWEgPT09IHVuZGVmaW5lZCB8fCBzZWFyY2hDcml0ZXJpYSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIC8vIGp1c3QgcmV0dXJuIHRoZSBzb3J0ZWQgYmxvZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBmaWx0ZXJlZCBibG9nc1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvZyA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9nLmhlYWRsaW5lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2cuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaENyaXRlcmlhKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgxKTtcblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIFwiZGlzcGxheVwiOiB7XG4gICAgICAgIHZhbHVlOiBkaXNwbGF5QmxvZ3MsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIFxuICAgIFwiZGlzcGxheU9wdGlvbnNcIjoge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgXCJpdGVtc1BlclBhZ2VcIjogNVxuICAgICAgICB9LFxuICAgICAgICBcIndyaXRhYmxlXCI6IHRydWVcbiAgICB9LFxuXG4gICAgXCJzZWFyY2hcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmxlbmd0aCA+PTMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgLy8gdGFrZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIHRoZSBwYWdpbmF0aW9uIG9iamVjdFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnN0IG51bWJlck9mSXRlbXMgPSBPYmplY3Qua2V5cyh0aGlzLmZpbHRlcmVkRGF0YSkubGVuZ3RoO1xuICAgICAgICAgICAgLy8gY29uc3QgbnVtYmVyT2ZQYWdlcyA9IE1hdGguY2VpbChudW1iZXJPZkl0ZW1zIC8gdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UpOyAgXG4gICAgICAgICAgICAvLyB0aGlzLnBhZ2luYXRpb25PYmouaW5pdChudW1iZXJPZlBhZ2VzLDEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyAvLyBkZXRlcm1pbmUgaG93IHRvIGhhbmRsZSB0aGUgcGFnaW5hdGlvbiBkaXNwbGF5XG4gICAgICAgICAgICAvLyBpZiAobnVtYmVyT2ZQYWdlcyA+IDEpIHtcbiAgICAgICAgICAgIC8vICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSxcblxufSk7XG5cbi8qKlxuICogSW5pdCBmb3IgdGhlIGJsb2cgcGFnZVxuICovXG4vL0Jsb2dNYW5hZ2VyLmxvYWQoKTtcblxuLy8gLS0tLSBFVkVOVCBMSVNURU5FUiBGT1IgUEFHSU5BVElPTiAtLS0tXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBcbiAgICBpZiAoIUJsb2dNYW5hZ2VyLnBhZ2luYXRpb25PYmouaGVscGVycy5pc1ZhbGlkKGUpKSB7cmV0dXJuO31cbiAgICAvLyBVcGRhdGUgdGhlIGJsb2cgcG9zdHNcbiAgICBjb25zdCBwYWdlTnVtYmVyID0gZS50YXJnZXQuZGF0YXNldC5wYWdlTnVtO1xuICAgIFxuICAgIEJsb2dNYW5hZ2VyLmRpc3BsYXkocGFnZU51bWJlcik7XG4gICAgLy8gVXBkYXRlIHRoZSBwYWdpbmF0aW9uIHRvIHN0b3JlIHRoZSBuZXcgcGFnZSAjJ3NcbiAgICBCbG9nTWFuYWdlci5wYWdpbmF0aW9uT2JqLnVwZGF0ZShlKTtcblxuXG59KTtcblxuLy8gLS0tLS0gRVZFTlQgTElTVEVORVJTIEZPUiBTRUFSQ0ggRk9STSAtLS0tLSAvL1xuY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dfX3NlYXJjaC1pbnB1dFwiKTtcblxuLy8gY2xlYXIgdGhlIGJveCB3aGVuIHRoZSBmb3JtIGhhcyB0aGUgZm9jdXNcbnNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB7XG4gICAgc2VhcmNoSW5wdXQudmFsdWUgPSBcIlwiO1xufSk7XG5cbnNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgIGxldCBzZWFyY2hTdHJpbmcgPSBldmVudC50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICBCbG9nTWFuYWdlci5zZWFyY2goc2VhcmNoU3RyaW5nKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dfX2JudC1jbGVhclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PiB7XG4gICAgc2VhcmNoSW5wdXQudmFsdWUgPSBcIlwiO1xuICAgIEJsb2dNYW5hZ2VyLnNlYXJjaChcIlwiKTtcbn0pO1xuXG4vLyAtLS0tLSBFVkVOVCBMSVNURU5FUlMgRk9SIEFETUlOIEZPUk0gLS0tLSAvL1xuXG5jb25zb2xlLmxvZyhcImJsb2cgbWFuYWdlciBmcm9tIGJsbVwiLCBCbG9nTWFuYWdlcik7XG4iLCJjb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuXG5jb25zdCBDb250YWN0TWFuYWdlciA9IE9iamVjdC5jcmVhdGUoUGVyc29uYWxFVEwsIHtcbiAgICBcbiAgICBcImxvYWRcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkLmFqYXgoe3VybDogXCJodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vY29udGFjdC5qc29uXCJ9KVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFwiZGlzcGxheVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3Qgc29jaWFsTGlua3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvY2lhbC1saW5rc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEuZm9yRWFjaChjb250YWN0VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgc29jaWFsTGlua3MuaW5uZXJIVE1MICs9IFxuICAgICAgICAgICAgICAgICAgICBgPGRpdj48YSBocmVmPVwiJHtjb250YWN0VHlwZS51cmx9XCI+PGltZyBzcmM9XCIke2NvbnRhY3RUeXBlLmljb259XCIgYWx0PVwiJHtjb250YWN0VHlwZS5pY29uQWx0fVwiIGNsYXNzPVwic29jaWFsLWltZ1wiPjwvYT48L2Rpdj5gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgXG4gICAgXCJkaXNwbGF5T3B0aW9uc1wiOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBcIml0ZW1zUGVyUGFnZVwiOiA1XG4gICAgICAgIH0sXG4gICAgICAgIFwid3JpdGFibGVcIjogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcubGVuZ3RoID49Mykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShzZWFyY2hTdHJpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfVxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGFjdE1hbmFnZXI7XG4iLCJjb25zdCBwb3B1bGF0ZU5hdkJhciA9IChmdW5jdGlvbihicmFuZCl7XG4gICAgXG4gICAgY29uc3QgbmF2cyA9IG5ldyBNYXAoKTtcbiAgICBcbiAgICAvKipcbiAgICAgICAgKiAgIFRoZSBtYXAgd2lsbCBob2xkIHRoZSBsYWJlbHMgYW5kIGxpbmtzIGZvciB0aGUgbmF2YmFyXG4gICAgICAgICoqL1xuICAgIC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzOlxuICAgIG5hdnMuc2V0KFwiSG9tZVwiLCB7XCJsYWJlbFwiOiBcIkhvbWVcIiwgXCJsaW5rXCI6IFwiLi4vaW5kZXguaHRtbFwiLCBcImJ1dHRvbkNsYXNzXCI6IFwiYnRuLW5hdl9faG9tZVwiLFwidGFyZ2V0SWRcIjogXCJhYm91dFwifSksXG4gICAgbmF2cy5zZXQoXCJQcm9qZWN0c1wiLCB7XCJsYWJlbFwiOiBcIlByb2plY3RzXCIsIFwibGlua1wiOiBcIi4uL3Byb2plY3RzXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19wcm9qZWN0c1wiLCBcInRhcmdldElkXCI6IFwicHJvamVjdHNcIn0pLFxuICAgIG5hdnMuc2V0KFwiQmxvZ1wiLCB7XCJsYWJlbFwiOiBcIkJsb2dcIiwgXCJsaW5rXCI6IFwiI2Jsb2dzXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19ibG9nXCIsIFwidGFyZ2V0SWRcIjpcImJsb2dzXCJ9KSxcbiAgICBuYXZzLnNldChcIlJlc3VtZVwiLCB7XCJsYWJlbFwiOiBcIlJlc3VtZVwiLCBcImxpbmtcIjogXCIuLi9yZXN1bWVcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX3Jlc3VtZVwiLCBcInRhcmdldElkXCI6IFwicmVzdW1lXCJ9KSxcbiAgICBuYXZzLnNldChcIkNvbnRhY3RcIiwge1wibGFiZWxcIjogXCJDb250YWN0XCIsIFwibGlua1wiOiBcIi4uL2NvbnRhY3RcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX2NvbnRhY3RcIiwgXCJ0YXJnZXRJZFwiOiBcImNvbnRhY3RcIn0pO1xuICAgIFxuICAgIGNvbnN0IG5hdkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2XCIpO1xuICAgIC8vIGNyZWF0ZSB0aGUgdWwgZWxlbWVudCB0byBzdGljayBpbnNpZGUgdGhlIG5hdlxuICAgIGNvbnN0IG5ld0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbmV3TGlzdC5jbGFzc05hbWUgPSBcIm5hdl9fbGlzdFwiO1xuICAgICAgICBcbiAgICBjb25zdCBuZXdCcmFuZExpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgIG5ld0JyYW5kTGkuY2xhc3NOYW1lID0gXCJuYXZfX2JyYW5kXCI7XG4gICAgICAgIFxuICAgIGNvbnN0IGJyYW5kVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJyYW5kKTtcbiAgICBuZXdCcmFuZExpLmFwcGVuZENoaWxkKGJyYW5kVGV4dCk7XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChuZXdCcmFuZExpKTtcbiAgICAgICAgXG4gICAgbmV3QnJhbmRMaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gbmF2cy5nZXQoXCJIb21lXCIpLmxpbms7XG4gICAgfSk7XG5cbiAgICAvLyBzY3JvbGwgdG8gYSBwYXJ0IG9mIHRoZSBwYWdlIGFuZCBhY2NvdW50IGZvciB0aGUgbmF2YmFyIGhlaWdodFxuICAgIGNvbnN0IGdvVG9JZCA9IGZ1bmN0aW9uKG5hdikge1xuICAgICAgICBsZXQgbmF2QmFySGVpZ2h0ID0gbmF2QmFyLmNsaWVudEhlaWdodDtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmF2LnRhcmdldElkKS5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwtKG5hdkJhckhlaWdodCsxMCkpO1xuICAgIH07XG5cbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgbGlzdCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uY2xhc3NOYW1lID0gbmF2LmJ1dHRvbkNsYXNzICsgXCIgbmF2X19saW5rXCI7XG4gICAgXG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmF2LmxhYmVsKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uYXBwZW5kQ2hpbGQobmV3TmF2SXRlbUxhYmVsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3TmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2Nyb2xsIGRvd24gYW5kIGFjY291bnQgZm9yIHRoZSBoZWlnaHQgb2YgdGhlIG5hdmJhclxuICAgICAgICAgICAgICAgIC8vICoqKiBKUVVFUlkgKioqKlxuXG4gICAgICAgICAgICAgICAgLy8gbGV0IGhlYWRlckhlaWdodCA9ICQoXCIubmF2XCIpLmhlaWdodCgpKzIwO1xuICAgICAgICAgICAgICAgIGdvVG9JZChuYXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIC8vICAgICBzY3JvbGxUb3A6ICQobmF2LnRhcmdldElkKS5vZmZzZXQoKS50b3AgLSBoZWFkZXJIZWlnaHRcbiAgICAgICAgICAgICAgICAvLyB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBuZXdMaXN0LmFwcGVuZENoaWxkKG5ld05hdkl0ZW0pO1xuICAgIFxuICAgICAgICB9XG4gICAgKTtcbiAgICBuYXZCYXIuYXBwZW5kQ2hpbGQobmV3TGlzdCk7XG4gICAgXG4gICAgLyoqXG4gICAgICAgICAqIEJ1aWxkaW5nIHRoZSBkcm9wZG93biBtZW51XG4gICAgICAgICAqL1xuICAgIGNvbnN0IGhhbWJ1cmdlck1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhhbWJ1cmdlck1lbnUuY2xhc3NOYW1lID0gXCJtZW51LWNvbFwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGxldCBuZXdNZW51QmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbmV3TWVudUJhci5jbGFzc05hbWUgPSBcIm1lbnUtY29sX19iYXJcIjtcbiAgICAgICAgaGFtYnVyZ2VyTWVudS5hcHBlbmRDaGlsZChuZXdNZW51QmFyKTtcbiAgICB9XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChoYW1idXJnZXJNZW51KTtcbiAgICBcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtZW51LmNsYXNzTmFtZSA9IFwibWVudS1saXN0XCI7XG4gICAgY29uc3QgbWVudUxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbWVudUxpc3QuY2xhc3NOYW1lID0gXCJtZW51LWxpc3RfX2xpc3RcIjtcbiAgICBtZW51LmFwcGVuZENoaWxkKG1lbnVMaXN0KTtcbiAgICBcbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICBsZXQgbWVudUl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBtZW51SXRlbS5pbm5lckhUTUwgPSBgJHtuYXYubGFiZWx9YDtcbiAgICAgICAgICAgIG1lbnVJdGVtLmNsYXNzTmFtZSA9IFwibWVudS1saXN0X19pdGVtXCI7XG4gICAgICAgICAgICBtZW51TGlzdC5hcHBlbmRDaGlsZChtZW51SXRlbSk7XG4gICAgICAgICAgICBtZW51SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IG5hdi5saW5rO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIG5hdkJhci5hcHBlbmRDaGlsZChtZW51KTtcbiAgICBcbn0pO1xuXG4vKipcbiAgICAqIEhhbWJ1cmdlciBNZW51XG4gICAgKiBUaGF0IHdpbGwgbG9vayBsaWtlIHNvbWV0aGluZyBpbnRlcmVzdGluZ1xuICAgICovXG5jb25zdCBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIik7IFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1jb2xcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXNwbGF5U3R5bGUgPSBtZW51LnN0eWxlLmRpc3BsYXk7XG4gICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT09IFwibm9uZVwiIHx8IGRpc3BsYXlTdHlsZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgICAgXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgICAgICBcbiAgICAgICAgY29uc3QgZGlzcGxheVN0eWxlID0gbWVudS5zdHlsZS5kaXNwbGF5O1xuICAgICAgICBpZiAoZGlzcGxheVN0eWxlID09PSBcIm5vbmVcIiB8fCBkaXNwbGF5U3R5bGUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgICAgIFxuICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgdXNlciByZXNpemVzIHRoZSB3aW5kb3cgdGhlIGRyb3AgZG93biBtZW51IHdpbGwgZGlzYXBwZWFyXG4gICAgICAgICAqL1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcbiAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBvcHVsYXRlTmF2Q29tcG9uZW50cyhicmFuZCkge1xuICAgIHBvcHVsYXRlTmF2QmFyKGJyYW5kKTtcbiAgICBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMoKTtcbn07XG5cbiIsIi8qXG4gICAgUkVRVUlSRU1FTlRTOiBcbiAgICAgICAgSFRNTDogYSA8c2VjdGlvbj4gd2l0aCB0aGUgY2xhc3Mgb2YgXCJwYWdpbmF0aW9uXCIuIFxuICAgICAgICBKUzogWW91J2xsIG5lZWQgdG8gc2VuZCBpbiB0aGUgbnVtYmVyIG9mIHBhZ2VzIHRvIGRpc3BsYXlcbiovXG5cbmNvbnN0IFBhZ2luYXRvciA9IGZ1bmN0aW9uKHBhZ2luYXRpb25FbCkge1xuICAgIFxuICAgIGNvbnN0IF9wYWdpbmF0aW9uRWwgPSBwYWdpbmF0aW9uRWw7XG5cbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG4gICAgICAgIFxuICAgICAgICBcImluaXRcIjoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChudW1iZXJPZlBhZ2VzLCBzdGFydFBhZ2UgPSAxKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zdCBwYWdpbmF0aW9uRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIik7XG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhlIHBhZ2luYXRpb24gYnkgcmVtb3ZpbmcgYWxsIHRoZSBjaGlsZCBub2Rlc1xuICAgICAgICAgICAgICAgIHdoaWxlIChfcGFnaW5hdGlvbkVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICBfcGFnaW5hdGlvbkVsLnJlbW92ZUNoaWxkKF9wYWdpbmF0aW9uRWwubGFzdENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXRlIHRoZSBwYWdpbmF0aW9uIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAvLyBTdGFydCB3aXRoIHRoZSBwcmV2aW91cyBhcnJvd1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICBwcmV2LmRhdGFzZXQucGFnZU51bT0oc3RhcnRQYWdlLTEpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgcHJldi5jbGFzc05hbWU9XCJwYWdpbmF0aW9uX19wcmV2aW91c1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCI8XCIpO1xuICAgICAgICAgICAgICAgIHByZXYuYXBwZW5kQ2hpbGQocHJldlRleHQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgX3BhZ2luYXRpb25FbC5hcHBlbmRDaGlsZChwcmV2KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhbiBlbGVtZW50IHRvIHJlcHJlc2VudCBlYWNoIHBhZ2VcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mUGFnZXM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuZGF0YXNldC5wYWdlTnVtPWAke2krc3RhcnRQYWdlfWA7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuY2xhc3NOYW1lPVwicGFnaW5hdGlvbl9fcGFnZVwiO1xuICAgICAgICAgICAgICAgICAgICBsaW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGAke2krc3RhcnRQYWdlfWApKTtcbiAgICAgICAgICAgICAgICAgICAgX3BhZ2luYXRpb25FbC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdGhlIG5leHQgYXJyb3cgYnV0dG9uXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIG5leHQuZGF0YXNldC5wYWdlTnVtPShzdGFydFBhZ2UrMSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBuZXh0LmNsYXNzTmFtZT1cInBhZ2luYXRpb25fX25leHRcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiPlwiKTtcbiAgICAgICAgICAgICAgICBuZXh0LmFwcGVuZENoaWxkKG5leHRUZXh0KTtcbiAgICAgICAgICAgICAgICBfcGFnaW5hdGlvbkVsLmFwcGVuZENoaWxkKG5leHQpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIHByZXZpb3VzIHBhZ2Ugc2VsZWN0b3IgdG8gaW52aXNpYmxlIGFuZCB0aGUgZmlyc3QgZWxlbWVudCB0byBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvbl9fcHJldmlvdXNcIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19wYWdlXCIpLmNsYXNzTmFtZSA9IFwicGFnaW5hdGlvbl9fcGFnZS0tc2VsZWN0ZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGVscGVycy5pc1ZhbGlkKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY2FwdHVyZSB0aGUgcGFnZU51bSB2YWx1ZSBmcm9tIGNsaWNrZWQgZWxlbWVudC4gUGFyc2UgaXQgYXMgYW4gaW50XG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSB0aGUgcHJvZ3JhbSB3aWxsIG5lZWQgdG8gZG8gbWF0aCB3aXRoIGl0IGxhdGVyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xpY2tlZFBhZ2VOdW1iZXIgPSBwYXJzZUludChldmVudC50YXJnZXQuZGF0YXNldC5wYWdlTnVtKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvKiAgXG4gICAgICAgICAgICAgICAgICAgIE9ubHkgbG9vcCB0aHJvdWdoIHRoZSBudW1iZXJlZCBlbGVtZW50cyBleGNsdWRpbmcgdGhlIGFycm93c1xuICAgICAgICAgICAgICAgICAgICByZXNldCB0aGUgY2xhc3MgbmFtZSB0byByZW1vdmUgdGhlIG1vZGlmaWVyIGNsYXNzXG4gICAgICAgICAgICAgICAgICAgIEFsc28gbmVlZCB0byBjYXB0dXJlIHRoZSBudW1iZXIgb2YgcGFnZXNcbiAgICAgICAgICAgICAgICAqLyBcbiAgICAgICAgICAgICAgICBjb25zdCBwYWdlTnVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbY2xhc3NePSdwYWdpbmF0aW9uX19wYWdlJ1wiKTtcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKHBhZ2VOdW1zKS5mb3JFYWNoKGZ1bmN0aW9uIChwYWdlKSB7ICAgICBcbiAgICAgICAgICAgICAgICAgICAgcGFnZS5jbGFzc05hbWUgPSBcInBhZ2luYXRpb25fX3BhZ2VcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsaWNrZWRQYWdlTnVtYmVyLnRvU3RyaW5nKCkgPT09IHBhZ2UuZGF0YXNldC5wYWdlTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlLmNsYXNzTmFtZSA9IFwicGFnaW5hdGlvbl9fcGFnZS0tc2VsZWN0ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG1heFBhZ2UgPSBwYXJzZUludChwYWdlTnVtc1twYWdlTnVtcy5sZW5ndGgtMV0uZGF0YXNldC5wYWdlTnVtKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtaW5QYWdlID0gcGFyc2VJbnQocGFnZU51bXNbMF0uZGF0YXNldC5wYWdlTnVtKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19wcmV2aW91c1wiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX25leHRcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBCZWhhdmlvciBmb3IgdGhlIGFycm93IGtleXNcbiAgICAgICAgICAgICAgICBpZiAoY2xpY2tlZFBhZ2VOdW1iZXIgPT09IG1pblBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0VsLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0VsLmRhdGFzZXQucGFnZU51bSA9IGNsaWNrZWRQYWdlTnVtYmVyLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChjbGlja2VkUGFnZU51bWJlciArIDEgPiBtYXhQYWdlKSB7ICBcbiAgICAgICAgICAgICAgICAgICAgbmV4dEVsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRFbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEVsLmRhdGFzZXQucGFnZU51bSA9IGNsaWNrZWRQYWdlTnVtYmVyKzE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhlbHBlcnNcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHtcblxuICAgICAgICAgICAgICAgIFwiaXNWYWxpZFwiOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWxpZEVsZW1lbnRzID0gW1wicGFnaW5hdGlvbl9fcGFnZVwiLCBcInBhZ2luYXRpb25fX3BhZ2UtLXNlbGVjdGVkXCIsIFwicGFnaW5hdGlvbl9fcHJldmlvdXNcIiwgXCJwYWdpbmF0aW9uX19uZXh0XCJdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YWxpZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gZWxlbWVudCkgeyBpc1ZhbGlkID0gdHJ1ZTt9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgXG4gICAgICAgIFwicGFnaW5hdGlvblNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgbWF4UGFnZXNUb0Rpc3BsYXk6IDVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBQYWdpbmF0b3I7IiwiY29uc3QgUGFnaW5hdG9yID0gcmVxdWlyZShcIi4uLy4uL3BhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uXCIpO1xuY29uc3QgUGVyc29uYWxFVEwgPSByZXF1aXJlKFwiLi4vLi4vc2NyaXB0cy9wZXJzb25hbEVUTFwiKTtcblxuY29uc3QgUHJvamVjdE1hbmFnZXIgPSBPYmplY3QuY3JlYXRlKFBlcnNvbmFsRVRMLCB7XG4gICAgXG4gICAgXCJsb2FkXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgZ2V0UHJvamVjdHMgPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCJodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vcHJvamVjdHMuanNvblwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGdldFByb2plY3RzXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoXCJcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgdmFsdWU6IE9iamVjdC5jcmVhdGUoUGFnaW5hdG9yLHt9KSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgXCJmaWx0ZXJCeVNlYXJjaENyaXRlcmlhXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChzZWFyY2hDcml0ZXJpYSkge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSB0aGlzLmRhdGEuZmlsdGVyKGZ1bmN0aW9uKHByb2ope1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9qLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpIHx8IHByb2oubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaENyaXRlcmlhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KDEpO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0ZSgpO1xuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJkaXNwbGF5XCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChwYWdlTnVtYmVyKSB7XG5cbiAgICAgICAgICAgIC8vIE9ubHkgZGlzcGxheSB0aGUgcGFnZXMgaW4gdGhlIGN1cnJlbnQgcGFnZSBudW1iZXJcbiAgICAgICAgICAgIGNvbnN0IGJsb2dzVG9EaXNwbGF5ID0gdGhpcy5maWx0ZXJlZERhdGEuc2xpY2UoXG4gICAgICAgICAgICAgICAgKHBhZ2VOdW1iZXIgLSAxKSAqIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlLFxuICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXIgKiB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSk7XG4gICAgICAgICAgICAvLyApOyAgXG5cbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RzSFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvamVjdHNcIik7XG4gICAgICAgICAgICBwcm9qZWN0c0hUTUwuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICAgICAgbGV0IHNvcnRlZFByb2plY3RzID0gdGhpcy5maWx0ZXJlZERhdGEuc29ydCgoYSwgYikgPT4gbW9tZW50KGIuZGF0ZUNvbXBsZXRlZCkgLSBtb21lbnQoYS5kYXRlQ29tcGxldGVkKSk7XG5cbiAgICAgICAgICAgIGxldCBwcm9qZWN0cyA9IHNvcnRlZFByb2plY3RzIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3QgPSBwcm9qZWN0c1tpXTtcblxuICAgICAgICAgICAgICAgIC8vIGdyYWIgdGhlIGZpcnN0IHRlY2hub2xvZ3kgbGlzdGVkXG4gICAgICAgICAgICAgICAgY29uc3QgdGVjaG5vbG9neSA9IHByb2plY3QudGVjaG5vbG9naWVzLmxlbmd0aCA+IDAgPyBwcm9qZWN0LnRlY2hub2xvZ2llc1swXSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgbGV0IHRhZ0hUTUwgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0LnRlY2hub2xvZ2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGFnID0gcHJvamVjdC50ZWNobm9sb2dpZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRhZ0hUTUwgKz0gYDxsaT4ke3RhZ308L2xpPmA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSB0ZWFtbWF0ZSBzdHJpbmdcbiAgICAgICAgICAgICAgICBsZXQgdGVhbW1hdGVzID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdC50ZWFtbWF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlYW1tYXRlID0gcHJvamVjdC50ZWFtbWF0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRlYW1tYXRlcyArPSBgPGEgaHJlZj1cIiR7dGVhbW1hdGUucGVyc29uYWxTaXRlfVwiPiR7dGVhbW1hdGUubmFtZX08L2E+YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL2xldCBodG1sID0gXCJcIjtcbiAgICAgICAgICAgICAgICBwcm9qZWN0c0hUTUwuaW5uZXJIVE1MICs9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicHJvamVjdC1kZXRhaWwgJHt0ZWNobm9sb2d5LnRvTG93ZXJDYXNlKCl9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwicHJvamVjdC10aXRsZVwiPiR7cHJvamVjdC5uYW1lfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJwcm9qZWN0LWRlc2NyaXB0aW9uXCI+JHtwcm9qZWN0LmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInByb2plY3QtY29tcGxldGVkLWRhdGVcIj5EYXRlIGNvbXBsZXRlZDogJHttb21lbnQocHJvamVjdC5kYXRlQ29tcGxldGVkKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIgY2xhc3M9XCJwcm9qZWN0LWhyZWZcIj48YSBocmVmPVwiJHtwcm9qZWN0LmhyZWZ9XCI+bGluazwvYT4gfCA8YSBocmVmPVwiJHtwcm9qZWN0LnJlcG9zaXRvcnl9XCI+cmVwb3NpdG9yeTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvamVjdC10YWdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3RhZ0hUTUx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICAgICAgIGA7XG5cblxuICAgICAgICAgICAgfVxuICAgICAgICBcblxuXG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgXCJkaXNwbGF5T3B0aW9uc1wiOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBcIml0ZW1zUGVyUGFnZVwiOiA1XG4gICAgICAgIH0sXG4gICAgICAgIFwid3JpdGFibGVcIjogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgXCJwYWdpbmF0ZVwiOiB7XG4gICAgLy8gdGFrZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIHRoZSBwYWdpbmF0aW9uIG9iamVjdFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAvLyBjb25zdCBudW1iZXJPZkl0ZW1zID0gdGhpcy5maWx0ZXJlZERhdGEubGVuZ3RoO1xuICAgICAgICAgICAgLy8gY29uc3QgbnVtYmVyT2ZQYWdlcyA9IE1hdGguY2VpbChudW1iZXJPZkl0ZW1zIC8gdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UpO1xuXG4gICAgICAgICAgICAvLyB0aGlzLnBhZ2luYXRpb25PYmouaW5pdChudW1iZXJPZlBhZ2VzLCAxKTtcblxuICAgICAgICAgICAgLy8gLy8gZGV0ZXJtaW5lIGhvdyB0byBoYW5kbGUgdGhlIHBhZ2luYXRpb24gZGlzcGxheVxuICAgICAgICAgICAgLy8gaWYgKG51bWJlck9mUGFnZXMgPiAxKSB7XG4gICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICB9LFxuXG5cblxufSk7XG5cbi8qKlxuICogSW5pdCBmb3IgdGhlIGJsb2cgcGFnZVxuICovXG5Qcm9qZWN0TWFuYWdlci5sb2FkKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdE1hbmFnZXI7IiwiLy91cGRhdGVOYXZCYXIoXCJyZXN1bWVcIik7XG5cbi8vIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBnZW5lcmF0aW5nIHBhZ2luYXRpb25cbi8vY29uc3QgUGFnaW5hdG9yID0gcmVxdWlyZShcIi4uLy4uL3BhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uXCIpO1xuY29uc3QgUGVyc29uYWxFVEwgPSByZXF1aXJlKFwiLi4vLi4vc2NyaXB0cy9wZXJzb25hbEVUTFwiKTtcblxuY29uc3QgUmVzdW1lTWFuYWdlciA9IE9iamVjdC5jcmVhdGUoUGVyc29uYWxFVEwsIHtcbiAgICBcbiAgICBcImxvYWRcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkLmFqYXgoe3VybDogXCJodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vcmVzdW1lLmpzb25cIn0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJkaXNwbGF5XCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBqb2JzU2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdW1lLWpvYnNcIik7XG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGFycmF5IG9mIGpvYiBvYmplY3RzXG4gICAgICAgICAgICBsZXQgam9icyA9IHRoaXMuZmlsdGVyZWREYXRhLmpvYnM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpvYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBUTyBETyBUSElTIFdJTEwgTk9XIENPTlRBSU4gT0JKRUNUU1xuICAgICAgICAgICAgICAgIGxldCBqb2IgPSBqb2JzW2ldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VtZUJ1bGxldHM9XCJcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGFjY29tcFRyYWNrZXIgPSAwOyBhY2NvbXBUcmFja2VyIDwgam9iLmFjY29tcGxpc2htZW50cy5sZW5ndGg7IGFjY29tcFRyYWNrZXIrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bWVCdWxsZXRzICs9IFxuICAgICAgICAgICAgICAgICAgICBgPGxpIGNsYXNzPVwicmVzdW1lX19hY2NvbXBsaXNobWVudFwiPiR7am9iLmFjY29tcGxpc2htZW50c1thY2NvbXBUcmFja2VyXX08L2xpPmA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgam9ic1NlY3Rpb24uaW5uZXJIVE1MICs9IGBcbiAgICAgICAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cInByb2Zlc3Npb25hbC1leHBlcmllbmNlXCI+XG4gICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwiYXJ0aWNsZS1oZWFkZXIgcmVzdW1lX19oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJyZXN1bWVfX2hlYWRsaW5lXCI+JHtqb2IuaGVhZGxpbmV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJlc3VtZV9fZGF0ZVwiPiR7bW9tZW50KGpvYi5zdGFydERhdGUpLmZvcm1hdChcIllZWVlcIil9LSR7bW9tZW50KGpvYi5lbmREYXRlKS5mb3JtYXQoXCJZWVlZXCIpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2pvYi5jb21wYW55TG9nb0ltZ31cIlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwicmVzdW1lX19qb2ItdGl0bGVcIj4ke2pvYi50aXRsZX08aDM+XG4gICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJyZXN1bWVfX2pvYi1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICR7cmVzdW1lQnVsbGV0c31cbiAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgXG4gICAgXCJkaXNwbGF5T3B0aW9uc1wiOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBcIml0ZW1zUGVyUGFnZVwiOiA1XG4gICAgICAgIH0sXG4gICAgICAgIFwid3JpdGFibGVcIjogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcubGVuZ3RoID49Mykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShzZWFyY2hTdHJpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfVxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdW1lTWFuYWdlcjtcbiIsImNvbnN0IG5hdmJhciA9IHJlcXVpcmUoXCIuLi9uYXZiYXIvc2NyaXB0cy9uYXZiYXJcIik7XG4vL2NvbnN0IGJsb2dzID0gcmVxdWlyZShcIi4uL2Jsb2cvc2NyaXB0cy9ibG9nLWNvbnRyb2xsZXJcIik7XG5jb25zdCBCbG9nTWFuYWdlcj0gcmVxdWlyZShcIi4uL2Jsb2cvc2NyaXB0cy9ibG9nTWFuYWdlclwiKTtcbmNvbnN0IFJlc3VtZU1hbmFnZXI9IHJlcXVpcmUoXCIuLi9yZXN1bWUvc2NyaXB0cy9yZXN1bWVcIik7XG5jb25zdCBQcm9qZWN0TWFuYWdlciA9IHJlcXVpcmUoXCIuLi9wcm9qZWN0cy9zY3JpcHRzL3Byb2plY3RzXCIpO1xuY29uc3QgQ29udGFjdE1hbmFnZXIgPSByZXF1aXJlKFwiLi4vY29udGFjdC9zY3JpcHRzL2NvbnRhY3RcIik7XG5cbi8vIGFkZCB0aGUgYWRtaW4gZXZlbnRzXG5jb25zdCBhZG1pbkV2ZW50cyA9IHJlcXVpcmUoXCIuLi9ibG9nL3NjcmlwdHMvYmxvZy1hZG1pbi1ldmVudHNcIik7XG5cbmNvbnNvbGUubG9nKFwiYmxvZ2dlclwiLCBCbG9nTWFuYWdlcik7XG5cbm5hdmJhcihcIktyeXMgTWF0aGlzXCIpO1xuY29uc29sZS5sb2coXCJQcm9qZWN0IE1hbmFnZXJcIiwgUHJvamVjdE1hbmFnZXIpO1xuY29uc29sZS5sb2coXCJCbG9nTWFuYWdlclwiLCBCbG9nTWFuYWdlcik7XG5jb25zb2xlLmxvZyhcIlJlc3VtZU1hbmFnZXJcIiwgUmVzdW1lTWFuYWdlcik7XG5jb25zb2xlLmxvZyhcIkNvbnRhY3RNYW5hZ2VyXCIsIENvbnRhY3RNYW5hZ2VyKTtcbkJsb2dNYW5hZ2VyLmxvYWQoKTtcblJlc3VtZU1hbmFnZXIubG9hZCgpO1xuQ29udGFjdE1hbmFnZXIubG9hZCgpO1xuXG4iLCJjb25zdCBQZXJzb25hbEVUTCA9IFxuICAgIE9iamVjdC5jcmVhdGUobnVsbCx7XG4gICAgICAgIFxuICAgICAgICBcImxvYWRcIjoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgdmFsdWU6IFtdLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvLyBpbml0aWFsbHkgc2V0IHRoZSBmaWx0ZXJkIGRhdGEgPSBkYXRhXG4gICAgICAgIFwiZmlsdGVyZWREYXRhXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLmRhdGEsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB0aGlzIGlzIGEgZnVuY3Rpb24gY3JlYXRlZCBieSB0aGUgY29uY3JldGUgaW1wbGVtZW50YXRpb25cbiAgICAgICAgXCJmaWx0ZXJCeVNlYXJjaENyaXRlcmlhXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHRoaXMgbWF5IGNoYW5nZSBhcyB0aGUgaW1wbGVtZW50YXRpb24gY2hhbmdlc1xuICAgICAgICBcImZpbHRlckJ5VGFnXCI6IHtcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHRhZykge1xuICAgICAgICAgICAgLy8gR2V0IHJlY29yZHMgd2l0aCBtYXRjaGluZyB0YWdzXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlZFJlY29yZHMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmQudGFncy5mb3JFYWNoKGN1cnJlbnRUYWcgPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRhZyA9PT0gdGFnKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gbWF0Y2hlZFJlY29yZHM7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcGFnaW5hdGlvbk9iaiBjb250YWlucyB0aGUgb2JqZWN0IHRoYXQgY29udHJvbHMgdGhlIHBhZ2luYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIFwicGFnaW5hdGlvbk9ialwiOiB7XG4gICAgICAgICAgICB2YWx1ZToge30sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZGlzcGxheSBwcm9wZXJ0eSB3aWxsIGNvbnRhaW4gYSBmdW5jdGlvbiB0aGF0IGNvbnRyb2xzXG4gICAgICAgICAqIEhvdyB0aGUgb2JqZWN0IGRpc3BsYXlzIGl0J3MgZGF0YVxuICAgICAgICAgKiBUaGlzIGlzIHNwZWNpZmljIHRvIGhvdyB0aGUgb2JqZWN0IGlzIGFjdXRhbGx5IGltcGxlbWVudGVkXG4gICAgICAgICAqL1xuICAgICAgICBcImRpc3BsYXlcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgXCJkaXNwbGF5T3B0aW9uc1wiOiB7XG4gICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIFwiaXRlbXNQZXJQYWdlXCI6IDUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcubGVuZ3RoID49Mykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuICAgIFxuICAgICAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgICAgIC8vIHRha2VzIGEgY2FsbGJhY2sgZnVuY3Rpb24gZnJvbSB0aGUgcGFnaW5hdGlvbiBvYmplY3RcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBudW1iZXJPZkl0ZW1zID0gdGhpcy5maWx0ZXJlZERhdGEubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bWJlck9mUGFnZXMgPSBNYXRoLmNlaWwobnVtYmVyT2ZJdGVtcyAvIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLlBhZ2luYXRvci5pbml0KG51bWJlck9mUGFnZXMsMSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCEkLmlzRW1wdHlPYmplY3QodGhpcy5wYWdpbmF0aW9uT2JqKSkge1xuICAgICAgICAgICAgICAgICAgICAvL2RldGVybWluZSBob3cgdG8gaGFuZGxlIHRoZSBwYWdpbmF0aW9uIGRpc3BsYXlcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKG51bWJlck9mUGFnZXMgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgXG5cblxuXG5cbiAgICB9KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcnNvbmFsRVRMOyJdfQ==
