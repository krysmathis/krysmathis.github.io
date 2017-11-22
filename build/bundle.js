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
    navs.set("Home", {"label": "Home", "container": "aboutContainer", "link": "../index.html", "buttonClass": "btn-nav__home","targetId": "about"}),
    navs.set("Projects", {"label": "Projects", "container": "projectsContainer", "link": "../projects", "buttonClass": "btn-nav__projects", "targetId": "projects"}),
    navs.set("Blog", {"label": "Blog", "container": "blogContainer", "link": "#blogs", "buttonClass": "btn-nav__blog", "targetId":"blogs"}),
    navs.set("Resume", {"label": "Resume", "container": "resumeContainer", "link": "../resume", "buttonClass": "btn-nav__resume", "targetId": "resume"}),
    navs.set("Contact", {"label": "Contact", "container": "contactContainer", "link": "../contact", "buttonClass": "btn-nav__contact", "targetId": "contact"});
    navs.set("Login", {"label": "Login", "container": "loginContainer", "link": "../login", "buttonClass": "btn-nav__login", "targetId": "login"});
    
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
        window.scrollBy(0,-(navBarHeight+60));
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

                
                
                navs.forEach(n =>{
                    if (n.label === nav.label) {
                        $(`.${n.container}`).show();
                    } else {
                        $(`.${n.container}`).hide();
                    }
                });

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

            const projectsHTML = document.getElementById("projectList");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZG1pbi9zY3JpcHRzL2FkbWluLWJsb2ctZm9ybS12YWxpZGF0aW9uLmpzIiwiYWRtaW4vc2NyaXB0cy9hZG1pbi1jb250cm9sbGVyLmpzIiwiYmxvZy9zY3JpcHRzL2Jsb2ctYWRtaW4tZXZlbnRzLmpzIiwiYmxvZy9zY3JpcHRzL2Jsb2ctY29udHJvbGxlci5qcyIsImJsb2cvc2NyaXB0cy9ibG9nLWZhY3RvcnkuanMiLCJibG9nL3NjcmlwdHMvYmxvZ01hbmFnZXIuanMiLCJjb250YWN0L3NjcmlwdHMvY29udGFjdC5qcyIsIm5hdmJhci9zY3JpcHRzL25hdmJhci5qcyIsInBhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uLmpzIiwicHJvamVjdHMvc2NyaXB0cy9wcm9qZWN0cy5qcyIsInJlc3VtZS9zY3JpcHRzL3Jlc3VtZS5qcyIsInNjcmlwdHMvbWFpbi5qcyIsInNjcmlwdHMvcGVyc29uYWxFVEwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgICBGb3JtIHZhbGlkYXRpb25cbiAgICAxLiBBbGwgdGV4dCBpbnB1dHMgc2hvdWxkIGhhdmUgYSB2YWx1ZVxuICAgIDIuIFRoZSB0ZXh0IGFyZWEgc2hvdWxkIGNvbnRhaW4gYXQgbGVhc3QgdGhyZWUgY2hhcmFjdGVyc1xuICAgICovXG5jb25zdCBnZXRNaXNzaW5nUGFydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgIC8vIGNoZWNrIGlucHV0c1xuICAgIGNvbnN0IGJsb2dQYXJ0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W2NsYXNzXj0nYmxvZ0Zvcm0nXVwiKSk7XG4gICAgY29uc3QgbWlzc2luZ1BhcnRzID0gW107XG4gICAgICAgIFxuICAgIGJsb2dQYXJ0cy5mb3JFYWNoKHBhcnQgPT4ge1xuICAgICAgICBpZiAocGFydC52YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIG1pc3NpbmdQYXJ0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IHBhcnQubmFtZSxcbiAgICAgICAgICAgICAgICBcImNsYXNzXCI6IHBhcnQuY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIm1pc3NpbmcgXCIgKyBwYXJ0Lm5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgICAgIFxuICAgIC8vIGNoZWNrIHRleHQgYXJlYVxuICAgIGNvbnN0IGJsb2dUZXh0QXJlYVZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRleHRhcmVhW25hbWU9J2Jsb2ctY29udGVudCddXCIpLnZhbHVlO1xuICAgIGlmIChibG9nVGV4dEFyZWFWYWx1ZS5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1pc3NpbmdQYXJ0cy5wdXNoKHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJibG9nLWNvbnRlbnRzXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IGJsb2dUZXh0QXJlYVZhbHVlLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcInNob3VsZCBjb250YWluIGF0IGxlYXN0IDMgY2hhcmFjdGVycyBvZiBjb250ZW50XCJcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBtaXNzaW5nUGFydHM7XG59O1xuICAgIFxuICAgIC8qXG4gICAgVGhlIG1pc3NpbmcgcGFydHMgYXJlIHN0b3JlZCBoZXJlLCBleHRyYWN0IGFuZCBkaXNwbGF5IHRoZW0gaGVyZVxuICAgICovXG5jb25zdCBzaG93RXJyb3JzID0gZnVuY3Rpb24gKG1pc3NpbmdQYXJ0cykge1xuICAgIGxldCBtZXNzYWdlID0gXCI8aDM+ISEhVW5hY2NlcHRhYmxlIFN1Ym1pc3Npb24hISE8L2gzPiA8dWw+XCI7XG4gICAgY29uc3QgbXNnQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2VCbG9ja1wiKTtcbiAgICAgICAgXG4gICAgbWlzc2luZ1BhcnRzLmZvckVhY2gocGFydCA9PiBtZXNzYWdlICs9IGA8bGkgY2xhc3M9XCJtZXNzYWdlQmxvY2tfX2RldGFpbFwiPllvdXIgJHtwYXJ0LmZpZWxkfSBpcyAke3BhcnQubWVzc2FnZX08L2xpPmApO1xuICAgIG1lc3NhZ2UgKz0gXCI8L3VsPlwiO1xuICAgIG1zZ0Jsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgbXNnQmxvY2suc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcbiAgICBtc2dCbG9jay5pbm5lckhUTUwgPSBtZXNzYWdlO1xufTtcbiAgICBcbmNvbnN0IHNob3dTdWNjZXNzID0gKCkgPT4ge1xuICAgIGNvbnN0IG1zZ0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZXNzYWdlQmxvY2tcIik7XG4gICAgbXNnQmxvY2suc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI1NSwyNTUsMCwuNzUpXCI7XG4gICAgbXNnQmxvY2suaW5uZXJIVE1MID0gXCJZb3UndmUgY3JlYXRlZCBhIG5ldyBibG9nIVwiO1xuICAgIG1zZ0Jsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7IC8vc2hvdyB0aGUgZWxlbWVudFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBtc2dCbG9jay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSwgMTAwMDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7c2hvd1N1Y2Nlc3MsIHNob3dFcnJvcnMsIGdldE1pc3NpbmdQYXJ0c307IiwiY29uc3QgYmxvZ09iamVjdEZhY3RvcnkgPSByZXF1aXJlKFwiLi4vLi4vYmxvZy9zY3JpcHRzL2Jsb2ctZmFjdG9yeVwiKTtcbmNvbnN0IEJsb2dNYW5hZ2VyID0gcmVxdWlyZShcIi4uLy4uL2Jsb2cvc2NyaXB0cy9ibG9nTWFuYWdlclwiKTtcblxuY29uc3QgUnVuQWRtaW4gPSBmdW5jdGlvbiAoYmxvZ0RhdGEpIHtcbiAgICBcbiAgICAvLyBnZXQgdGhlIGRhdGFiYXNlIGZyb20gbG9jYWwgc3RvcmFnZSwgb3IgZW1wdHkgb2JqZWN0IGlmIG51bGxcbiAgICAvLyBnZXQgdGhlIGJsb2cgZW50cmllcyBvciBlbXB0eSBvYmplY3QgaWYgbnVsbFxuICAgIGNvbnN0IGJsb2dzID0gYmxvZ0RhdGE7XG4gICAgLypcbiAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIEdlbmVyYXRlIGEgbGlzdCBvZiB0aGUgY3VycmVudCBibG9ncyBmb3IgZWRpdGluZ1xuICAgICAgICBUaGUgcmVjb3JkcyB3aWxsIGdvIGludG8gYSB0YWJsZVxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAqL1xuICAgIGNvbnN0IGxpc3RDdXJyZW50QmxvZ3MgPSAoKSA9PiB7XG4gICAgICAgIGxldCBodG1sID0gXCJcIjtcbiAgICAgICAgY29uc3QgYmxvZ3NBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYmxvZ3MpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50QmxvZyA9IGJsb2dzW2tleV07XG4gICAgICAgICAgICBibG9nc0FycmF5LnB1c2goe1wiaWRcIjoga2V5LCBcImRhdGVBZGRlZFwiOiBjdXJyZW50QmxvZy5kYXRlQWRkZWQsIFwiYmxvZ0RldGFpbFwiOiBjdXJyZW50QmxvZ30pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvcnRlZEJsb2dzID0gYmxvZ3NBcnJheS5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQWRkZWQpIC0gbW9tZW50KGEuZGF0ZUFkZGVkKSk7XG4gICAgICAgIHNvcnRlZEJsb2dzXG4gICAgICAgICAgICAuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgaHRtbCArPSBgXG5cdFx0XHRcdDxhcnRpY2xlIGNsYXNzPVwiYmxvZ0xpc3RfX2VudHJ5XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJsb2dMaXN0X19oZWFkbGluZVwiPiR7ZW50cnkuYmxvZ0RldGFpbC5oZWFkbGluZX08L3RoPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJibG9nTGlzdF9fcHJldmlld1wiPiR7ZW50cnkuYmxvZ0RldGFpbC5jb250ZW50LnN1YnN0cmluZygwLDMwKS5yZXBsYWNlKC88KD86LnxcXG4pKj8+L2dtLCBcIlwiKX08L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYmxvZ0xpc3RfX2RhdGVcIj4ke2VudHJ5LmJsb2dEZXRhaWwuZGF0ZUFkZGVkfTwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJibG9nTGlzdF9fYnV0dG9uLXJvd1wiPjxidXR0b24gY2xhc3M9XCJibG9nTGlzdF9fYnRuLWVkaXRcIiBkYXRhLWJsb2ctaWQ9XCIke2VudHJ5LmlkfVwiPkVkaXQ8L2J1dHRvbj48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYmxvZ0xpc3RfX2J1dHRvbi1yb3dcIj48YnV0dG9uIGNsYXNzPVwiYmxvZ0xpc3RfX2J0bi1kZWxldGVcIiBkYXRhLWJsb2ctaWQ9XCIke2VudHJ5LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPjwvdGQ+XG5cdFx0XHRcdDwvYXJ0aWNsZT5cblx0XHRcdFx0YDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0xpc3RcIikuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB9O1xuXG4gICAgLy8gSW5pdCBibG9nIGxpc3RcbiAgICBsaXN0Q3VycmVudEJsb2dzKCk7XG5cbn07XG4vLyBlbmQgb2YgY2FzdGxlIHdhbGxcbiAgICBcbm1vZHVsZS5leHBvcnRzID0gUnVuQWRtaW47IiwiY29uc3Qge3Nob3dTdWNjZXNzLCBzaG93RXJyb3JzLCBnZXRNaXNzaW5nUGFydHN9ID0gcmVxdWlyZShcIi4uLy4uL2FkbWluL3NjcmlwdHMvYWRtaW4tYmxvZy1mb3JtLXZhbGlkYXRpb25cIik7XG5jb25zdCBCbG9nTWFuYWdlciA9IHJlcXVpcmUoXCIuL2Jsb2dNYW5hZ2VyXCIpO1xuY29uc3QgYmxvZ09iamVjdEZhY3RvcnkgPSByZXF1aXJlKFwiLi9ibG9nLWZhY3RvcnlcIik7XG5cbmxldCBlZGl0TW9kZSA9IGZhbHNlO1xubGV0IGN1cnJlbnRCbG9nID0ge307XG5cbi8vLS0tLSBFVkVOVCBMSVNURU5FUlMgLS0tLS0gXG4vL1N0b3JlIHRoZSBlbGVtZW50cyBoZXJlXG5jb25zdCBoZWFkbGluZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9faGVhZGxpbmVcIik7XG5jb25zdCBhdXRob3JFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0Zvcm1fX2F1dGhvclwiKTtcbmNvbnN0IGRhdGVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0Zvcm1fX2RhdGVcIik7XG5jb25zdCBpbWFnZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9faW1hZ2VcIik7XG5jb25zdCBjb250ZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19jb250ZW50XCIpO1xuY29uc3QgdGFnc0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9fdGFnc1wiKTtcblxuY29uc3Qgc2V0RWRpdE1vZGUgPSAoYm9vbCkgPT4ge1xuICAgIGVkaXRNb2RlID0gYm9vbDtcblxuICAgIGNvbnN0IG1zZ0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZXNzYWdlQmxvY2tcIik7XG4gICAgaWYgKGJvb2wpIHtcbiAgICAgICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgbXNnQmxvY2suaW5uZXJIVE1MID0gXCJFZGl0IE1vZGUhXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn07XG5cbi8vIHNldHMgdGhlIGN1cnJlbnQgYmxvZ1xuY29uc3QgZ2V0Q3VycmVudEJsb2cgPSBibG9nSWQgPT4ge1xuICAgIGN1cnJlbnRCbG9nID0ge1wiaWRcIjogYmxvZ0lkLCBcImRldGFpbFwiOiBCbG9nTWFuYWdlci5kYXRhW2Jsb2dJZF19O1xuICAgIGNvbnNvbGUubG9nKFwiY3VycmVudCBibG9nXCIsIGN1cnJlbnRCbG9nKTtcbn07XG5cbmNvbnN0IGFkZFVwZGF0ZUJsb2dBcnRpY2xlVG9EYiA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBjb25zdCB0YWdzID0gdGFnc0VsLnZhbHVlLnNwbGl0KFwiLCBcIik7XG4gICAgXG4gICAgaWYgKGVkaXRNb2RlKSB7XG4gICAgICAgIC8vZ2V0IGluZGV4XG4gICAgICAgIC8vIEZpbmQgdGhlIGluZGV4IG9mIHRoZSBzZWxlY3RlZCBhcnRpY2xlXG4gICAgICAgIGNvbnN0IHBpZCA9IGN1cnJlbnRCbG9nLmlkO1xuICAgIFxuICAgICAgICBjb25zdCB1cGRhdGVCbG9nQXJ0aWNsZSA9IGJsb2dPYmplY3RGYWN0b3J5KFxuICAgICAgICAgICAgaGVhZGxpbmVFbC52YWx1ZSwgLy9oZWFkbGluZVxuICAgICAgICAgICAgZGF0ZUVsLnZhbHVlLFxuICAgICAgICAgICAgYXV0aG9yRWwudmFsdWUsIC8vYXV0aG9yXG4gICAgICAgICAgICBpbWFnZUVsLnZhbHVlLCAvLyBpbWdoZWFkZXJcbiAgICAgICAgICAgIGNvbnRlbnRFbC52YWx1ZSwgLy9jb250ZW50XG4gICAgICAgICAgICB0YWdzLFxuICAgICAgICAgICAgY3VycmVudEJsb2cuaWRcbiAgICAgICAgKTtcbiAgICAgICAgQmxvZ01hbmFnZXIudXBkYXRlKHBpZCx1cGRhdGVCbG9nQXJ0aWNsZSk7XG4gICAgICAgIHNldEVkaXRNb2RlKGZhbHNlKTtcbiAgICAgICAgLy9tb2RpZnkgZXhpc3RpbmcgYXJyYXlcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuZXdCbG9nQXJ0aWNsZSA9IGJsb2dPYmplY3RGYWN0b3J5KFxuICAgICAgICAgICAgaGVhZGxpbmVFbC52YWx1ZSwgLy9oZWFkbGluZVxuICAgICAgICAgICAgbmV3IG1vbWVudCgpLmZvcm1hdChcIllZWVktTU0tRERcIiksIC8vIGRhdGUgYWRkZWRcbiAgICAgICAgICAgIGF1dGhvckVsLnZhbHVlLCAvL2F1dGhvclxuICAgICAgICAgICAgaW1hZ2VFbC52YWx1ZSwgLy8gaW1naGVhZGVyXG4gICAgICAgICAgICBjb250ZW50RWwudmFsdWUsIC8vY29udGVudFxuICAgICAgICAgICAgdGFnc1xuICAgICAgICApO1xuICAgICAgICAvKiAgICAgICAgIFxuICAgICAgICBBZGQgdGhlIGFydGljbGUgdG8gdGhlIGJsb2cgYXJyYXksIHRoZW4gYWRkIGl0IHRvIHRoZSBkYiBpblxuICAgICAgICBBZGQgaXQgdG8gbG9jYWwgc3RvcmFnZSBcbiAgICAgICAgKi9cbiAgICAgICAgQmxvZ01hbmFnZXIuYWRkKG5ld0Jsb2dBcnRpY2xlKTtcbiAgICB9XG5cbiAgICBoZWFkbGluZUVsLnZhbHVlID0gXCJcIjsgLy9oZWFkbGluZVxuICAgIGRhdGVFbC52YWx1ZSA9IFwiXCI7XG4gICAgYXV0aG9yRWwudmFsdWUgPSBcIlwiOyAvL2F1dGhvclxuICAgIGltYWdlRWwudmFsdWUgPSBcIlwiOyAvLyBpbWdoZWFkZXJcbiAgICBjb250ZW50RWwudmFsdWUgPSBcIlwiOyAvL2NvbnRlbnRcbiAgICB0YWdzRWwudmFsdWUgPSBcIlwiO1xuXG5cbn07XG4gICAgXG4gICAgXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19idG5Hb1RvQmxvZ1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiLi4vYmxvZy9pbmRleC5odG1sXCI7XG59KTtcbiAgICBcbi8vIENsaWNrIG9uIHRoZSBlZGl0IGJ1dHRvblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nTGlzdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgIFxuICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUgPT09IFwiYmxvZ0xpc3RfX2J0bi1lZGl0XCIpIHtcbiAgICAgICAgY29uc3QgYmxvZ0lkID0gZS50YXJnZXQuZGF0YXNldC5ibG9nSWQ7XG4gICAgICAgIGdldEN1cnJlbnRCbG9nKGJsb2dJZCk7XG4gICAgICAgIC8vIHBvcHVsYXRlIHRoZSBibG9nIGZvcm1cbiAgICAgICAgdGFnc0VsLnZhbHVlID0gY3VycmVudEJsb2cuZGV0YWlsLnRhZ3Muam9pbihcIiwgXCIpO1xuICAgICAgICBoZWFkbGluZUVsLnZhbHVlID0gY3VycmVudEJsb2cuZGV0YWlsLmhlYWRsaW5lO1xuICAgICAgICBhdXRob3JFbC52YWx1ZSA9IGN1cnJlbnRCbG9nLmRldGFpbC5hdXRob3I7XG4gICAgICAgIGRhdGVFbC52YWx1ZSA9IGN1cnJlbnRCbG9nLmRldGFpbC5kYXRlQWRkZWQ7XG4gICAgICAgIGltYWdlRWwudmFsdWUgPSBjdXJyZW50QmxvZy5kZXRhaWwuaW1nSGVhZGVyO1xuICAgICAgICBjb250ZW50RWwudmFsdWUgPSBjdXJyZW50QmxvZy5kZXRhaWwuY29udGVudDtcbiAgICAgICAgc2V0RWRpdE1vZGUodHJ1ZSk7XG4gICAgfVxuICAgICAgICBcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lID09PSBcImJsb2dMaXN0X19idG4tZGVsZXRlXCIpIHtcbiAgICAgICAgY29uc3QgYmxvZ0lkID0gZS50YXJnZXQuZGF0YXNldC5ibG9nSWQ7XG4gICAgICAgIEJsb2dNYW5hZ2VyLmRlbGV0ZShibG9nSWQpO1xuICAgIH1cbn0pO1xuICAgIFxuLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBzdWJtaXQgYnV0dG9uXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19idG5TYXZlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgLypcbiAgICAgICAgQ29sbGVjdCB0aGUgaW5wdXQgZWxlbWVudHNcbiAgICAgICAgY29uc3QgYmxvZ09iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiAoaGVhZGxpbmUsIGRhdGVBZGRlZCwgYXV0aG9yLCBpbWdIZWFkZXIsIGNvbnRlbnQsIC4uLnRhZ3MpXG4gICAgICAgIFxuICAgICAgICBPYmplY3RpdmUgaXMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGFjY2VwdCBvciByZWplY3QgdGhpcyBzdWJtaXNzaW9uXG4gICAgICAgICovXG4gICAgY29uc3QgbWlzc2luZ1BhcnRzID0gZ2V0TWlzc2luZ1BhcnRzKCk7XG4gICAgICAgIFxuICAgIGlmIChtaXNzaW5nUGFydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIG5vIGVycm9ycyBwcm9jZWVkIHRvIGFkZCBibG9nXG4gICAgICAgIGFkZFVwZGF0ZUJsb2dBcnRpY2xlVG9EYigpO1xuICAgICAgICBzaG93U3VjY2VzcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGRpc3BsYXkgZXJyb3JzLCBkbyBub3QgYWRkIGJsb2dcbiAgICAgICAgc2hvd0Vycm9ycyhtaXNzaW5nUGFydHMpO1xuICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxufSk7IiwiY29uc3QgZGlzcGxheUJsb2dzID0gZnVuY3Rpb24gKHBhZ2VOdW1iZXIpIHtcblxuICAgIC8vIHNvcnQgdGhlIGRhdGFcbiAgICBjb25zdCB1bnNvcnRlZEJsb2dzID0gW107XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZmlsdGVyZWREYXRhKSB7XG4gICAgICAgIGxldCBjdXJyZW50QmxvZyA9IHRoaXMuZmlsdGVyZWREYXRhW2tleV07XG4gICAgICAgIHVuc29ydGVkQmxvZ3MucHVzaChjdXJyZW50QmxvZyk7XG4gICAgfVxuICAgIGNvbnN0IGJsb2dzID0gdW5zb3J0ZWRCbG9ncy5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQWRkZWQpIC0gbW9tZW50KGEuZGF0ZUFkZGVkKSk7XG5cbiAgICAvLyBDbGVhciBvdXQgYWxsIGV4aXN0aW5nIGJsb2cgZWxlbWVudHNcbiAgICBjb25zdCBibG9nc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJibG9nLXBvc3RzXCIpO1xuICAgIHdoaWxlIChibG9nc0VsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBibG9nc0VsLnJlbW92ZUNoaWxkKGJsb2dzRWwubGFzdENoaWxkKTtcbiAgICB9XG5cbiAgICAvLyBkb24ndCBkaXNwbGF5IHBhZ2luYXRlIGlmIHRoZXJlIGFyZSBubyBibG9nc1xuICAgIGlmIChibG9ncy5sZW5ndGggPCAxKSB7XG4gICAgICAgIGJsb2dzRWwuaW5uZXJIVE1MID0gXCJObyBibG9ncyBmb3VuZC4uLlwiO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT25seSBkaXNwbGF5IHRoZSBwYWdlcyBpbiB0aGUgY3VycmVudCBwYWdlIG51bWJlclxuICAgIGNvbnN0IGJsb2dzVG9EaXNwbGF5ID0gYmxvZ3Muc2xpY2UoXG4gICAgICAgIChwYWdlTnVtYmVyIC0gMSkgKiB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSxcbiAgICAgICAgcGFnZU51bWJlciAqIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlXG4gICAgKTtcblxuICAgIC8vIGdvIHRocm91Z2ggdGhlIGRhdGEgaGVyZVxuICAgIGJsb2dzVG9EaXNwbGF5LmZvckVhY2goZW50cnkgPT4ge1xuXG4gICAgICAgIGxldCBpbWFnZVNyYyA9IGVudHJ5LmltZ0hlYWRlci5zdGFydHNXaXRoKFwiaW1hZ2VzXCIpID8gXCIuLi9cIiArIGVudHJ5LmltZ0hlYWRlciA6IGVudHJ5LmltZ0hlYWRlcjtcblxuICAgICAgICAvLyBtYWluIGVsZW1lbnRcbiAgICAgICAgbGV0IGJsb2dQb3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFydGljbGVcIik7XG4gICAgICAgIGJsb2dQb3N0LmNsYXNzTmFtZSA9IFwiYmxvZ19fcG9zdFwiO1xuXG4gICAgICAgIGxldCBibG9nSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ0hlYWRlci5jbGFzc05hbWUgPSBcImJsb2dfX2hlYWRlclwiO1xuXG4gICAgICAgIGxldCBibG9nSGVhZGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibG9nSGVhZGxpbmUuY2xhc3NOYW1lID0gXCJibG9nX19oZWFkbGluZVwiO1xuICAgICAgICBsZXQgYmxvZ0hlYWRsaW5lVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGVudHJ5LmhlYWRsaW5lKTtcbiAgICAgICAgYmxvZ0hlYWRsaW5lLmFwcGVuZENoaWxkKGJsb2dIZWFkbGluZVRleHQpO1xuXG4gICAgICAgIGxldCBibG9nRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsb2dEYXRlLmNsYXNzTmFtZSA9IFwiYmxvZ19fZGF0ZVwiO1xuICAgICAgICBsZXQgYmxvZ0RhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobW9tZW50KGVudHJ5LmRhdGVBZGRlZCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGJsb2dEYXRlLmFwcGVuZENoaWxkKGJsb2dEYXRlVGV4dCk7XG5cbiAgICAgICAgLy8gYXBwZW5kIHRvIHRoZSBibG9nSGVhZGVyIGRpdlxuICAgICAgICBibG9nSGVhZGVyLmFwcGVuZENoaWxkKGJsb2dIZWFkbGluZSk7XG4gICAgICAgIGJsb2dIZWFkZXIuYXBwZW5kQ2hpbGQoYmxvZ0RhdGUpO1xuXG4gICAgICAgIC8vIGFwcGVuZCB0byBtYWluIGRpdlxuICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nSGVhZGVyKTtcblxuICAgICAgICAvLyBJbWcgZGl2XG4gICAgICAgIGxldCBibG9nSW1nQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ0ltZ0NvbnRhaW5lci5jbGFzc05hbWUgPSBcImJsb2dfX2ltZy1oZWFkZXJcIjtcbiAgICAgICAgLy8gSW1hZ2VcbiAgICAgICAgbGV0IGJsb2dJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBibG9nSW1nLnNyYyA9IGltYWdlU3JjO1xuICAgICAgICBibG9nSW1nQ29udGFpbmVyLmFwcGVuZENoaWxkKGJsb2dJbWcpO1xuICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nSW1nQ29udGFpbmVyKTtcblxuICAgICAgICAvLyBDb250ZW50XG4gICAgICAgIGxldCBibG9nQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsb2dDb250ZW50LmNsYXNzTmFtZSA9IFwiYmxvZ19fY29udGVudFwiO1xuICAgICAgICBibG9nQ29udGVudC5pbm5lckhUTUwgPSBlbnRyeS5jb250ZW50O1xuICAgICAgICBibG9nUG9zdC5hcHBlbmRDaGlsZChibG9nQ29udGVudCk7XG5cbiAgICAgICAgLy8gVGFncyBDb250YWluZXJcbiAgICAgICAgbGV0IGJsb2dUYWdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ1RhZ3MuY2xhc3NOYW1lID0gXCJibG9nX19mb290ZXIgcHJvamVjdC10YWdcIjtcbiAgICAgICAgbGV0IGJsb2dUYWdMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuXG4gICAgICAgIC8vIGRvIHRoZSB0YWdzXG4gICAgICAgIGVudHJ5LnRhZ3MuZm9yRWFjaChjdXJyZW50VGFnID0+IHtcbiAgICAgICAgICAgIGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICB0YWcuY2xhc3NOYW1lID0gXCJibG9nX190YWdcIjtcbiAgICAgICAgICAgIHRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjdXJyZW50VGFnKSk7XG4gICAgICAgICAgICBibG9nVGFnTGlzdC5hcHBlbmRDaGlsZCh0YWcpO1xuXG4gICAgICAgICAgICAvLyBhZGQgZXZlbnQgbGlzdGVuZXIgZm9yIG9uIGNsaWNrXG4gICAgICAgICAgICB0YWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFnVHh0ID0gZS50YXJnZXQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlUYWcodGFnVHh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBibG9nVGFncy5hcHBlbmRDaGlsZChibG9nVGFnTGlzdCk7XG4gICAgICAgIGJsb2dQb3N0LmFwcGVuZENoaWxkKGJsb2dUYWdzKTtcblxuXG4gICAgICAgIC8vIGZvciBsb29wIGZvciBhZGRpbmcgdGhlIHRhZ3NcbiAgICAgICAgYmxvZ3NFbC5hcHBlbmRDaGlsZChibG9nUG9zdCk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRpc3BsYXlCbG9nczsiLCJjb25zdCBCbG9nTWFuYWdlciA9IHJlcXVpcmUoXCIuL2Jsb2dNYW5hZ2VyXCIpO1xuXG4vKlxuQ3JlYXRlIGEgYmxvZy5qcyBmaWxlIGFuZCBpbmNsdWRlIGl0IGluIHlvdXIgYmxvZy5odG1sIGZpbGUuXG5CdWlsZCBhIGRhdGFiYXNlIG9iamVjdCB0byBzdG9yZSB0aGUgZWFjaCBvZiB5b3VyIGJsb2cgYXJ0aWNsZXMuXG5TdHJpbmdpZnkgdGhlIGRhdGFiYXNlIG9iamVjdCBhbmQgc3RvcmUgaXQgaW4gbG9jYWwgc3RvcmFnZS5cblRoZSBmaXJzdCBzdGVwIGlzIHRvIGRlc2lnbiB3aGF0IGVhY2ggb2JqZWN0J3MgcHJvcGVydGllcyBzaG91bGQgYmUgLSB0aXRsZSwgZGF0ZSBvZiBwdWJsaWNhdGlvbiwgdGFncywgYXV0aG9yLCBhbmQgY29udGVudC4gRWFjaCBhcnRpY2xlIG9iamVjdCBzaG91bGQgaGF2ZSB0aG9zZSBwcm9wZXJ0aWVzLlxuKi9cblxuLypcbmNvbnN0IGJsb2dFbnRyeSA9IHtcbiAgICBcImhlYWRsaW5lXCI6IFwiXCIsXG4gICAgXCJkYXRlQWRkZWRcIjogXCJcIixcbiAgICBcImF1dGhvclwiOiBcIlwiLFxuICAgIFwidGFnc1wiOiBbXSxcbiAgICBcImltZ0hlYWRlclwiOiBcIlwiLFxuICAgIFwiY29udGVudFwiOiBcIlwiLFxufVxuKi9cblxuY29uc3QgYmxvZ0VudHJpZXNUb0NoZWNrID0gQmxvZ01hbmFnZXIuZGF0YSB8fCBbXTtcblxuY29uc3QgZ2V0TWF4QmxvZ0lkID0gZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICAgICAgICAgIDEuICBDYXB0dXJlIHRoZSBjdXJyZW50IGJsb2cgZGF0YWJhc2VcbiAgICAgICAgICAgIDIuICBTb3J0IHRoZSBibG9nIGVudHJpZXMgaGVsZCBpbiB0aGUgZGF0YWJhc2UgZGVzY2VuZGluZ1xuICAgICAgICAgICAgMy4gIENhcHR1cmUgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBzb3J0ZWQgbGlzdCBhbmQgZXh0cmFjdFxuICAgICAgICAgICAgICAgIHRoZSBpZCBjb2x1bW4uIElmIGl0IGRvZXNuJ3QgZXhpc3QgcmV0dXJuIGEgbmV3IG9iamVjdFxuICAgICAgICAgICAgICAgIHdpdGggYW4gaWQgb2YgMFxuICAgICAgICAqL1xuICAgIGNvbnN0IHNvcnRlZERlc2NCbG9ncyA9IGJsb2dFbnRyaWVzVG9DaGVjay5zb3J0KChwcmV2aW91cyxuZXh0KT0+IG5leHQuaWQtcHJldmlvdXMuaWQpO1xuICAgIHJldHVybiBzb3J0ZWREZXNjQmxvZ3NbMF0gfHwge2lkOiAwfTtcbiAgICBcbn07XG5cbmNvbnN0IG1heEJsb2dJZCA9IGdldE1heEJsb2dJZCgpLmlkO1xuXG4vLyBnZW5lcmF0ZSBhbiB1bmlxdWUgaWQgZm9yIGVhY2ggYmxvZyBhcnRpY2xlXG5jb25zdCBibG9nSWRHZW5lcmF0b3IgPSBmdW5jdGlvbiogKHN0YXJ0KSB7XG4gICAgbGV0IGlkID0gMTtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHlpZWxkIGlkICsgc3RhcnQ7XG4gICAgICAgIGlkKys7XG4gICAgfVxufTtcblxuY29uc3QgYmxvZ0lkRmFjdG9yeSA9IGJsb2dJZEdlbmVyYXRvcihtYXhCbG9nSWQpO1xuXG5jb25zdCBibG9nT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIChoZWFkbGluZSwgZGF0ZUFkZGVkLCBhdXRob3IsIGltZ0hlYWRlciwgY29udGVudCwgdGFncywgaWQpIHtcbiAgICBcbiAgICBjb25zdCBjdXJyZW50SWQgPSBibG9nSWRGYWN0b3J5Lm5leHQoKS52YWx1ZTtcbiAgICBcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh7fSx7XG4gICAgICAgIC8vIFwiaWRcIjoge3ZhbHVlOiBpZCB8fCBjdXJyZW50SWQsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcImhlYWRsaW5lXCI6IHt2YWx1ZTogaGVhZGxpbmUsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcImRhdGVBZGRlZFwiOiB7dmFsdWU6IGRhdGVBZGRlZCwgZW51bWVyYWJsZTogdHJ1ZX0sXG4gICAgICAgIFwiYXV0aG9yXCI6IHt2YWx1ZTogYXV0aG9yLCBlbnVtZXJhYmxlOiB0cnVlfSxcbiAgICAgICAgXCJpbWdIZWFkZXJcIjoge3ZhbHVlOiBpbWdIZWFkZXIsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcImNvbnRlbnRcIjoge3ZhbHVlOiBjb250ZW50LCBlbnVtZXJhYmxlOiB0cnVlfSxcbiAgICAgICAgXCJ0YWdzXCI6IHt2YWx1ZTogdGFncywgZW51bWVyYWJsZTogdHJ1ZX0sXG4gICAgICAgIFwiZ2V0RGF0ZVwiOiB7dmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCh0aGlzLmRhdGVBZGRlZCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgfSwgZW51bWVyYWJsZTogZmFsc2V9XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJsb2dPYmplY3RGYWN0b3J5O1xuXG5cblxuXG4iLCIvLyBBbiBvYmplY3QgdGhhdCB3aWxsIGNvbnRyb2wgdGhlIGZldGNoaW5nIGFuZCBwb3N0aW5nIG9mIGJsb2dzXG4vLyBFVEwgb2JqZWN0IGZvciBibG9nc1xuXG4vLyBjYWxsYmFjayBmdW5jdGlvbiBmb3IgZ2VuZXJhdGluZyBwYWdpbmF0aW9uXG5jb25zdCBQYWdpbmF0b3IgPSByZXF1aXJlKFwiLi4vLi4vcGFnaW5hdGlvbi9zY3JpcHRzL3BhZ2luYXRpb25cIik7XG5jb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuY29uc3QgZGlzcGxheUJsb2dzID0gcmVxdWlyZShcIi4vYmxvZy1jb250cm9sbGVyXCIpO1xuY29uc3QgQWRtaW5NYW5hZ2VyID0gcmVxdWlyZShcIi4uLy4uL2FkbWluL3NjcmlwdHMvYWRtaW4tY29udHJvbGxlclwiKTtcbi8vY29uc3QgYWRkRXZlbnRzID0gcmVxdWlyZShcIi4vYmxvZy1hZG1pbi1ldmVudHNcIik7XG5cbmNvbnN0IEJsb2dNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlKFBlcnNvbmFsRVRMLCB7XG4gICAgXG4gICAgXCJsb2FkXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJC5hamF4KHt1cmw6IFwiaHR0cHM6Ly9wZXJzb25hbC1zaXRlLTMxMTFkLmZpcmViYXNlaW8uY29tL2Jsb2dzLmpzb25cIn0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBBZG1pbk1hbmFnZXIodGhpcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxvZ0FkbWluIHVwZGF0ZSBnb2VzIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgLy9ibG9nQWRtaW5pc3RyYXRvci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImFkZFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9ibG9ncy8uanNvblwiLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkob2JqKVxuICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihwaWQsIG9iaikge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vYmxvZ3MvJHtwaWR9Ly5qc29uYCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkob2JqKVxuICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihwaWQpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9wZXJzb25hbC1zaXRlLTMxMTFkLmZpcmViYXNlaW8uY29tL2Jsb2dzLyR7cGlkfS8uanNvbmAsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgICAgICB9KS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgdmFsdWU6IFBhZ2luYXRvcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikpLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlckJ5U2VhcmNoQ3JpdGVyaWFcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoQ3JpdGVyaWEpIHtcbiAgICAgICAgICAgIC8vIHNvcnQgaW4gZGVzY2VuZGluZyBvcmRlclxuICAgICAgICAgICAgLy9jb25zdCBzb3J0ZWRCbG9nRW50cmllcyA9IHRoaXMuZGF0YS5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQWRkZWQpIC0gbW9tZW50KGEuZGF0ZUFkZGVkKSk7XG4gICAgICAgICAgICBpZiAoc2VhcmNoQ3JpdGVyaWEgPT09IHVuZGVmaW5lZCB8fCBzZWFyY2hDcml0ZXJpYSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIC8vIGp1c3QgcmV0dXJuIHRoZSBzb3J0ZWQgYmxvZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBmaWx0ZXJlZCBibG9nc1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvZyA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9nLmhlYWRsaW5lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2cuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaENyaXRlcmlhKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgxKTtcblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIFwiZGlzcGxheVwiOiB7XG4gICAgICAgIHZhbHVlOiBkaXNwbGF5QmxvZ3MsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIFxuICAgIFwiZGlzcGxheU9wdGlvbnNcIjoge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgXCJpdGVtc1BlclBhZ2VcIjogNVxuICAgICAgICB9LFxuICAgICAgICBcIndyaXRhYmxlXCI6IHRydWVcbiAgICB9LFxuXG4gICAgXCJzZWFyY2hcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmxlbmd0aCA+PTMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgLy8gdGFrZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIHRoZSBwYWdpbmF0aW9uIG9iamVjdFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnN0IG51bWJlck9mSXRlbXMgPSBPYmplY3Qua2V5cyh0aGlzLmZpbHRlcmVkRGF0YSkubGVuZ3RoO1xuICAgICAgICAgICAgLy8gY29uc3QgbnVtYmVyT2ZQYWdlcyA9IE1hdGguY2VpbChudW1iZXJPZkl0ZW1zIC8gdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UpOyAgXG4gICAgICAgICAgICAvLyB0aGlzLnBhZ2luYXRpb25PYmouaW5pdChudW1iZXJPZlBhZ2VzLDEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyAvLyBkZXRlcm1pbmUgaG93IHRvIGhhbmRsZSB0aGUgcGFnaW5hdGlvbiBkaXNwbGF5XG4gICAgICAgICAgICAvLyBpZiAobnVtYmVyT2ZQYWdlcyA+IDEpIHtcbiAgICAgICAgICAgIC8vICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSxcblxufSk7XG5cbi8qKlxuICogSW5pdCBmb3IgdGhlIGJsb2cgcGFnZVxuICovXG4vL0Jsb2dNYW5hZ2VyLmxvYWQoKTtcblxuLy8gLS0tLSBFVkVOVCBMSVNURU5FUiBGT1IgUEFHSU5BVElPTiAtLS0tXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBcbiAgICBpZiAoIUJsb2dNYW5hZ2VyLnBhZ2luYXRpb25PYmouaGVscGVycy5pc1ZhbGlkKGUpKSB7cmV0dXJuO31cbiAgICAvLyBVcGRhdGUgdGhlIGJsb2cgcG9zdHNcbiAgICBjb25zdCBwYWdlTnVtYmVyID0gZS50YXJnZXQuZGF0YXNldC5wYWdlTnVtO1xuICAgIFxuICAgIEJsb2dNYW5hZ2VyLmRpc3BsYXkocGFnZU51bWJlcik7XG4gICAgLy8gVXBkYXRlIHRoZSBwYWdpbmF0aW9uIHRvIHN0b3JlIHRoZSBuZXcgcGFnZSAjJ3NcbiAgICBCbG9nTWFuYWdlci5wYWdpbmF0aW9uT2JqLnVwZGF0ZShlKTtcblxuXG59KTtcblxuLy8gLS0tLS0gRVZFTlQgTElTVEVORVJTIEZPUiBTRUFSQ0ggRk9STSAtLS0tLSAvL1xuY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dfX3NlYXJjaC1pbnB1dFwiKTtcblxuLy8gY2xlYXIgdGhlIGJveCB3aGVuIHRoZSBmb3JtIGhhcyB0aGUgZm9jdXNcbnNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB7XG4gICAgc2VhcmNoSW5wdXQudmFsdWUgPSBcIlwiO1xufSk7XG5cbnNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgIGxldCBzZWFyY2hTdHJpbmcgPSBldmVudC50YXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICBCbG9nTWFuYWdlci5zZWFyY2goc2VhcmNoU3RyaW5nKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dfX2JudC1jbGVhclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PiB7XG4gICAgc2VhcmNoSW5wdXQudmFsdWUgPSBcIlwiO1xuICAgIEJsb2dNYW5hZ2VyLnNlYXJjaChcIlwiKTtcbn0pO1xuXG4vLyAtLS0tLSBFVkVOVCBMSVNURU5FUlMgRk9SIEFETUlOIEZPUk0gLS0tLSAvL1xuXG5jb25zb2xlLmxvZyhcImJsb2cgbWFuYWdlciBmcm9tIGJsbVwiLCBCbG9nTWFuYWdlcik7XG4iLCJjb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuXG5jb25zdCBDb250YWN0TWFuYWdlciA9IE9iamVjdC5jcmVhdGUoUGVyc29uYWxFVEwsIHtcbiAgICBcbiAgICBcImxvYWRcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkLmFqYXgoe3VybDogXCJodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vY29udGFjdC5qc29uXCJ9KVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFwiZGlzcGxheVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3Qgc29jaWFsTGlua3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvY2lhbC1saW5rc1wiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEuZm9yRWFjaChjb250YWN0VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgc29jaWFsTGlua3MuaW5uZXJIVE1MICs9IFxuICAgICAgICAgICAgICAgICAgICBgPGRpdj48YSBocmVmPVwiJHtjb250YWN0VHlwZS51cmx9XCI+PGltZyBzcmM9XCIke2NvbnRhY3RUeXBlLmljb259XCIgYWx0PVwiJHtjb250YWN0VHlwZS5pY29uQWx0fVwiIGNsYXNzPVwic29jaWFsLWltZ1wiPjwvYT48L2Rpdj5gO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgXG4gICAgXCJkaXNwbGF5T3B0aW9uc1wiOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBcIml0ZW1zUGVyUGFnZVwiOiA1XG4gICAgICAgIH0sXG4gICAgICAgIFwid3JpdGFibGVcIjogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcubGVuZ3RoID49Mykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShzZWFyY2hTdHJpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfVxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGFjdE1hbmFnZXI7XG4iLCJjb25zdCBwb3B1bGF0ZU5hdkJhciA9IChmdW5jdGlvbihicmFuZCl7XG4gICAgXG4gICAgY29uc3QgbmF2cyA9IG5ldyBNYXAoKTtcbiAgICBcbiAgICAvKipcbiAgICAgICAgKiAgIFRoZSBtYXAgd2lsbCBob2xkIHRoZSBsYWJlbHMgYW5kIGxpbmtzIGZvciB0aGUgbmF2YmFyXG4gICAgICAgICoqL1xuICAgIC8vIEZvciB0ZXN0aW5nIHB1cnBvc2VzOlxuICAgIG5hdnMuc2V0KFwiSG9tZVwiLCB7XCJsYWJlbFwiOiBcIkhvbWVcIiwgXCJjb250YWluZXJcIjogXCJhYm91dENvbnRhaW5lclwiLCBcImxpbmtcIjogXCIuLi9pbmRleC5odG1sXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19ob21lXCIsXCJ0YXJnZXRJZFwiOiBcImFib3V0XCJ9KSxcbiAgICBuYXZzLnNldChcIlByb2plY3RzXCIsIHtcImxhYmVsXCI6IFwiUHJvamVjdHNcIiwgXCJjb250YWluZXJcIjogXCJwcm9qZWN0c0NvbnRhaW5lclwiLCBcImxpbmtcIjogXCIuLi9wcm9qZWN0c1wiLCBcImJ1dHRvbkNsYXNzXCI6IFwiYnRuLW5hdl9fcHJvamVjdHNcIiwgXCJ0YXJnZXRJZFwiOiBcInByb2plY3RzXCJ9KSxcbiAgICBuYXZzLnNldChcIkJsb2dcIiwge1wibGFiZWxcIjogXCJCbG9nXCIsIFwiY29udGFpbmVyXCI6IFwiYmxvZ0NvbnRhaW5lclwiLCBcImxpbmtcIjogXCIjYmxvZ3NcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX2Jsb2dcIiwgXCJ0YXJnZXRJZFwiOlwiYmxvZ3NcIn0pLFxuICAgIG5hdnMuc2V0KFwiUmVzdW1lXCIsIHtcImxhYmVsXCI6IFwiUmVzdW1lXCIsIFwiY29udGFpbmVyXCI6IFwicmVzdW1lQ29udGFpbmVyXCIsIFwibGlua1wiOiBcIi4uL3Jlc3VtZVwiLCBcImJ1dHRvbkNsYXNzXCI6IFwiYnRuLW5hdl9fcmVzdW1lXCIsIFwidGFyZ2V0SWRcIjogXCJyZXN1bWVcIn0pLFxuICAgIG5hdnMuc2V0KFwiQ29udGFjdFwiLCB7XCJsYWJlbFwiOiBcIkNvbnRhY3RcIiwgXCJjb250YWluZXJcIjogXCJjb250YWN0Q29udGFpbmVyXCIsIFwibGlua1wiOiBcIi4uL2NvbnRhY3RcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX2NvbnRhY3RcIiwgXCJ0YXJnZXRJZFwiOiBcImNvbnRhY3RcIn0pO1xuICAgIG5hdnMuc2V0KFwiTG9naW5cIiwge1wibGFiZWxcIjogXCJMb2dpblwiLCBcImNvbnRhaW5lclwiOiBcImxvZ2luQ29udGFpbmVyXCIsIFwibGlua1wiOiBcIi4uL2xvZ2luXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19sb2dpblwiLCBcInRhcmdldElkXCI6IFwibG9naW5cIn0pO1xuICAgIFxuICAgIGNvbnN0IG5hdkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2XCIpO1xuICAgIC8vIGNyZWF0ZSB0aGUgdWwgZWxlbWVudCB0byBzdGljayBpbnNpZGUgdGhlIG5hdlxuICAgIGNvbnN0IG5ld0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbmV3TGlzdC5jbGFzc05hbWUgPSBcIm5hdl9fbGlzdFwiO1xuICAgICAgICBcbiAgICBjb25zdCBuZXdCcmFuZExpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgIG5ld0JyYW5kTGkuY2xhc3NOYW1lID0gXCJuYXZfX2JyYW5kXCI7XG4gICAgICAgIFxuICAgIGNvbnN0IGJyYW5kVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGJyYW5kKTtcbiAgICBuZXdCcmFuZExpLmFwcGVuZENoaWxkKGJyYW5kVGV4dCk7XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChuZXdCcmFuZExpKTtcbiAgICAgICAgXG4gICAgbmV3QnJhbmRMaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gbmF2cy5nZXQoXCJIb21lXCIpLmxpbms7XG4gICAgfSk7XG5cbiAgICAvLyBzY3JvbGwgdG8gYSBwYXJ0IG9mIHRoZSBwYWdlIGFuZCBhY2NvdW50IGZvciB0aGUgbmF2YmFyIGhlaWdodFxuICAgIGNvbnN0IGdvVG9JZCA9IGZ1bmN0aW9uKG5hdikge1xuICAgICAgICBsZXQgbmF2QmFySGVpZ2h0ID0gbmF2QmFyLmNsaWVudEhlaWdodDtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmF2LnRhcmdldElkKS5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwtKG5hdkJhckhlaWdodCs2MCkpO1xuICAgIH07XG5cbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgbGlzdCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uY2xhc3NOYW1lID0gbmF2LmJ1dHRvbkNsYXNzICsgXCIgbmF2X19saW5rXCI7XG4gICAgXG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmF2LmxhYmVsKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uYXBwZW5kQ2hpbGQobmV3TmF2SXRlbUxhYmVsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3TmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2Nyb2xsIGRvd24gYW5kIGFjY291bnQgZm9yIHRoZSBoZWlnaHQgb2YgdGhlIG5hdmJhclxuICAgICAgICAgICAgICAgIC8vICoqKiBKUVVFUlkgKioqKlxuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbmF2cy5mb3JFYWNoKG4gPT57XG4gICAgICAgICAgICAgICAgICAgIGlmIChuLmxhYmVsID09PSBuYXYubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYC4ke24uY29udGFpbmVyfWApLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYC4ke24uY29udGFpbmVyfWApLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gbGV0IGhlYWRlckhlaWdodCA9ICQoXCIubmF2XCIpLmhlaWdodCgpKzIwO1xuICAgICAgICAgICAgICAgIGdvVG9JZChuYXYpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIC8vICAgICBzY3JvbGxUb3A6ICQobmF2LnRhcmdldElkKS5vZmZzZXQoKS50b3AgLSBoZWFkZXJIZWlnaHRcbiAgICAgICAgICAgICAgICAvLyB9LCAyMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICBuZXdMaXN0LmFwcGVuZENoaWxkKG5ld05hdkl0ZW0pO1xuICAgIFxuICAgICAgICB9XG4gICAgKTtcbiAgICBuYXZCYXIuYXBwZW5kQ2hpbGQobmV3TGlzdCk7XG4gICAgXG4gICAgLyoqXG4gICAgICAgICAqIEJ1aWxkaW5nIHRoZSBkcm9wZG93biBtZW51XG4gICAgICAgICAqL1xuICAgIGNvbnN0IGhhbWJ1cmdlck1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhhbWJ1cmdlck1lbnUuY2xhc3NOYW1lID0gXCJtZW51LWNvbFwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGxldCBuZXdNZW51QmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbmV3TWVudUJhci5jbGFzc05hbWUgPSBcIm1lbnUtY29sX19iYXJcIjtcbiAgICAgICAgaGFtYnVyZ2VyTWVudS5hcHBlbmRDaGlsZChuZXdNZW51QmFyKTtcbiAgICB9XG4gICAgbmV3TGlzdC5hcHBlbmRDaGlsZChoYW1idXJnZXJNZW51KTtcbiAgICBcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBtZW51LmNsYXNzTmFtZSA9IFwibWVudS1saXN0XCI7XG4gICAgY29uc3QgbWVudUxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgbWVudUxpc3QuY2xhc3NOYW1lID0gXCJtZW51LWxpc3RfX2xpc3RcIjtcbiAgICBtZW51LmFwcGVuZENoaWxkKG1lbnVMaXN0KTtcbiAgICBcbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICBsZXQgbWVudUl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBtZW51SXRlbS5pbm5lckhUTUwgPSBgJHtuYXYubGFiZWx9YDtcbiAgICAgICAgICAgIG1lbnVJdGVtLmNsYXNzTmFtZSA9IFwibWVudS1saXN0X19pdGVtXCI7XG4gICAgICAgICAgICBtZW51TGlzdC5hcHBlbmRDaGlsZChtZW51SXRlbSk7XG4gICAgICAgICAgICBtZW51SXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IG5hdi5saW5rO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIG5hdkJhci5hcHBlbmRDaGlsZChtZW51KTtcbiAgICBcbn0pO1xuXG4vKipcbiAgICAqIEhhbWJ1cmdlciBNZW51XG4gICAgKiBUaGF0IHdpbGwgbG9vayBsaWtlIHNvbWV0aGluZyBpbnRlcmVzdGluZ1xuICAgICovXG5jb25zdCBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIik7IFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1jb2xcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgIFxuICAgICAgICBjb25zdCBkaXNwbGF5U3R5bGUgPSBtZW51LnN0eWxlLmRpc3BsYXk7XG4gICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT09IFwibm9uZVwiIHx8IGRpc3BsYXlTdHlsZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgICAgXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWxpc3RcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT57XG4gICAgICAgICAgICBcbiAgICAgICAgY29uc3QgZGlzcGxheVN0eWxlID0gbWVudS5zdHlsZS5kaXNwbGF5O1xuICAgICAgICBpZiAoZGlzcGxheVN0eWxlID09PSBcIm5vbmVcIiB8fCBkaXNwbGF5U3R5bGUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgICAgIFxuICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgdXNlciByZXNpemVzIHRoZSB3aW5kb3cgdGhlIGRyb3AgZG93biBtZW51IHdpbGwgZGlzYXBwZWFyXG4gICAgICAgICAqL1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcbiAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBvcHVsYXRlTmF2Q29tcG9uZW50cyhicmFuZCkge1xuICAgIHBvcHVsYXRlTmF2QmFyKGJyYW5kKTtcbiAgICBhZGROYXZiYXJNZW51RXZlbnRMaXN0ZW5lcnMoKTtcblxufTtcblxuIiwiLypcbiAgICBSRVFVSVJFTUVOVFM6IFxuICAgICAgICBIVE1MOiBhIDxzZWN0aW9uPiB3aXRoIHRoZSBjbGFzcyBvZiBcInBhZ2luYXRpb25cIi4gXG4gICAgICAgIEpTOiBZb3UnbGwgbmVlZCB0byBzZW5kIGluIHRoZSBudW1iZXIgb2YgcGFnZXMgdG8gZGlzcGxheVxuKi9cblxuY29uc3QgUGFnaW5hdG9yID0gZnVuY3Rpb24ocGFnaW5hdGlvbkVsKSB7XG4gICAgXG4gICAgY29uc3QgX3BhZ2luYXRpb25FbCA9IHBhZ2luYXRpb25FbDtcblxuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgXG4gICAgICAgIFwiaW5pdFwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG51bWJlck9mUGFnZXMsIHN0YXJ0UGFnZSA9IDEpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnN0IHBhZ2luYXRpb25FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKTtcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgcGFnaW5hdGlvbiBieSByZW1vdmluZyBhbGwgdGhlIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICAgICAgd2hpbGUgKF9wYWdpbmF0aW9uRWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIF9wYWdpbmF0aW9uRWwucmVtb3ZlQ2hpbGQoX3BhZ2luYXRpb25FbC5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGUgdGhlIHBhZ2luYXRpb24gZWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IHdpdGggdGhlIHByZXZpb3VzIGFycm93XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIHByZXYuZGF0YXNldC5wYWdlTnVtPShzdGFydFBhZ2UtMSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBwcmV2LmNsYXNzTmFtZT1cInBhZ2luYXRpb25fX3ByZXZpb3VzXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldlRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIjxcIik7XG4gICAgICAgICAgICAgICAgcHJldi5hcHBlbmRDaGlsZChwcmV2VGV4dCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBfcGFnaW5hdGlvbkVsLmFwcGVuZENoaWxkKHByZXYpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGFuIGVsZW1lbnQgdG8gcmVwcmVzZW50IGVhY2ggcGFnZVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZQYWdlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGluay5kYXRhc2V0LnBhZ2VOdW09YCR7aStzdGFydFBhZ2V9YDtcbiAgICAgICAgICAgICAgICAgICAgbGluay5jbGFzc05hbWU9XCJwYWdpbmF0aW9uX19wYWdlXCI7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7aStzdGFydFBhZ2V9YCkpO1xuICAgICAgICAgICAgICAgICAgICBfcGFnaW5hdGlvbkVsLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgbmV4dCBhcnJvdyBidXR0b25cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgbmV4dC5kYXRhc2V0LnBhZ2VOdW09KHN0YXJ0UGFnZSsxKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIG5leHQuY2xhc3NOYW1lPVwicGFnaW5hdGlvbl9fbmV4dFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCI+XCIpO1xuICAgICAgICAgICAgICAgIG5leHQuYXBwZW5kQ2hpbGQobmV4dFRleHQpO1xuICAgICAgICAgICAgICAgIF9wYWdpbmF0aW9uRWwuYXBwZW5kQ2hpbGQobmV4dCk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgcHJldmlvdXMgcGFnZSBzZWxlY3RvciB0byBpbnZpc2libGUgYW5kIHRoZSBmaXJzdCBlbGVtZW50IHRvIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19wcmV2aW91c1wiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX3BhZ2VcIikuY2xhc3NOYW1lID0gXCJwYWdpbmF0aW9uX19wYWdlLS1zZWxlY3RlZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5oZWxwZXJzLmlzVmFsaWQoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjYXB0dXJlIHRoZSBwYWdlTnVtIHZhbHVlIGZyb20gY2xpY2tlZCBlbGVtZW50LiBQYXJzZSBpdCBhcyBhbiBpbnRcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBwcm9ncmFtIHdpbGwgbmVlZCB0byBkbyBtYXRoIHdpdGggaXQgbGF0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGlja2VkUGFnZU51bWJlciA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8qICBcbiAgICAgICAgICAgICAgICAgICAgT25seSBsb29wIHRocm91Z2ggdGhlIG51bWJlcmVkIGVsZW1lbnRzIGV4Y2x1ZGluZyB0aGUgYXJyb3dzXG4gICAgICAgICAgICAgICAgICAgIHJlc2V0IHRoZSBjbGFzcyBuYW1lIHRvIHJlbW92ZSB0aGUgbW9kaWZpZXIgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgQWxzbyBuZWVkIHRvIGNhcHR1cmUgdGhlIG51bWJlciBvZiBwYWdlc1xuICAgICAgICAgICAgICAgICovIFxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VOdW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltjbGFzc149J3BhZ2luYXRpb25fX3BhZ2UnXCIpO1xuICAgICAgICAgICAgICAgIEFycmF5LmZyb20ocGFnZU51bXMpLmZvckVhY2goZnVuY3Rpb24gKHBhZ2UpIHsgICAgIFxuICAgICAgICAgICAgICAgICAgICBwYWdlLmNsYXNzTmFtZSA9IFwicGFnaW5hdGlvbl9fcGFnZVwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xpY2tlZFBhZ2VOdW1iZXIudG9TdHJpbmcoKSA9PT0gcGFnZS5kYXRhc2V0LnBhZ2VOdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UuY2xhc3NOYW1lID0gXCJwYWdpbmF0aW9uX19wYWdlLS1zZWxlY3RlZFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4UGFnZSA9IHBhcnNlSW50KHBhZ2VOdW1zW3BhZ2VOdW1zLmxlbmd0aC0xXS5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1pblBhZ2UgPSBwYXJzZUludChwYWdlTnVtc1swXS5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX3ByZXZpb3VzXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvbl9fbmV4dFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEJlaGF2aW9yIGZvciB0aGUgYXJyb3cga2V5c1xuICAgICAgICAgICAgICAgIGlmIChjbGlja2VkUGFnZU51bWJlciA9PT0gbWluUGFnZSkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0VsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzRWwuZGF0YXNldC5wYWdlTnVtID0gY2xpY2tlZFBhZ2VOdW1iZXItMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGNsaWNrZWRQYWdlTnVtYmVyICsgMSA+IG1heFBhZ2UpIHsgIFxuICAgICAgICAgICAgICAgICAgICBuZXh0RWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEVsLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBuZXh0RWwuZGF0YXNldC5wYWdlTnVtID0gY2xpY2tlZFBhZ2VOdW1iZXIrMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGVscGVyc1wiOiB7XG4gICAgICAgICAgICB2YWx1ZToge1xuXG4gICAgICAgICAgICAgICAgXCJpc1ZhbGlkXCI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkRWxlbWVudHMgPSBbXCJwYWdpbmF0aW9uX19wYWdlXCIsIFwicGFnaW5hdGlvbl9fcGFnZS0tc2VsZWN0ZWRcIiwgXCJwYWdpbmF0aW9uX19wcmV2aW91c1wiLCBcInBhZ2luYXRpb25fX25leHRcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lID09PSBlbGVtZW50KSB7IGlzVmFsaWQgPSB0cnVlO31cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBcbiAgICAgICAgXCJwYWdpbmF0aW9uU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBtYXhQYWdlc1RvRGlzcGxheTogNVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2luYXRvcjsiLCJjb25zdCBQYWdpbmF0b3IgPSByZXF1aXJlKFwiLi4vLi4vcGFnaW5hdGlvbi9zY3JpcHRzL3BhZ2luYXRpb25cIik7XG5jb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuXG5jb25zdCBQcm9qZWN0TWFuYWdlciA9IE9iamVjdC5jcmVhdGUoUGVyc29uYWxFVEwsIHtcbiAgICBcbiAgICBcImxvYWRcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBnZXRQcm9qZWN0cyA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9wcm9qZWN0cy5qc29uXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZ2V0UHJvamVjdHNcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRpb25PYmpcIjoge1xuICAgICAgICB2YWx1ZTogT2JqZWN0LmNyZWF0ZShQYWdpbmF0b3Ise30pLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlckJ5U2VhcmNoQ3JpdGVyaWFcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKHNlYXJjaENyaXRlcmlhKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YS5maWx0ZXIoZnVuY3Rpb24ocHJvail7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hDcml0ZXJpYSkgfHwgcHJvai5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoMSk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRlKCk7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRpc3BsYXlcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKHBhZ2VOdW1iZXIpIHtcblxuICAgICAgICAgICAgLy8gT25seSBkaXNwbGF5IHRoZSBwYWdlcyBpbiB0aGUgY3VycmVudCBwYWdlIG51bWJlclxuICAgICAgICAgICAgY29uc3QgYmxvZ3NUb0Rpc3BsYXkgPSB0aGlzLmZpbHRlcmVkRGF0YS5zbGljZShcbiAgICAgICAgICAgICAgICAocGFnZU51bWJlciAtIDEpICogdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UsXG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciAqIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlKTtcbiAgICAgICAgICAgIC8vICk7ICBcblxuICAgICAgICAgICAgY29uc3QgcHJvamVjdHNIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9qZWN0TGlzdFwiKTtcbiAgICAgICAgICAgIHByb2plY3RzSFRNTC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgICAgICBsZXQgc29ydGVkUHJvamVjdHMgPSB0aGlzLmZpbHRlcmVkRGF0YS5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQ29tcGxldGVkKSAtIG1vbWVudChhLmRhdGVDb21wbGV0ZWQpKTtcblxuICAgICAgICAgICAgbGV0IHByb2plY3RzID0gc29ydGVkUHJvamVjdHMgfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdCA9IHByb2plY3RzW2ldO1xuXG4gICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgZmlyc3QgdGVjaG5vbG9neSBsaXN0ZWRcbiAgICAgICAgICAgICAgICBjb25zdCB0ZWNobm9sb2d5ID0gcHJvamVjdC50ZWNobm9sb2dpZXMubGVuZ3RoID4gMCA/IHByb2plY3QudGVjaG5vbG9naWVzWzBdIDogXCJcIjtcbiAgICAgICAgICAgICAgICBsZXQgdGFnSFRNTCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3QudGVjaG5vbG9naWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWcgPSBwcm9qZWN0LnRlY2hub2xvZ2llc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGFnSFRNTCArPSBgPGxpPiR7dGFnfTwvbGk+YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRlYW1tYXRlIHN0cmluZ1xuICAgICAgICAgICAgICAgIGxldCB0ZWFtbWF0ZXMgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0LnRlYW1tYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVhbW1hdGUgPSBwcm9qZWN0LnRlYW1tYXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGVhbW1hdGVzICs9IGA8YSBocmVmPVwiJHt0ZWFtbWF0ZS5wZXJzb25hbFNpdGV9XCI+JHt0ZWFtbWF0ZS5uYW1lfTwvYT5gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vbGV0IGh0bWwgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHByb2plY3RzSFRNTC5pbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgPGFydGljbGUgY2xhc3M9XCJwcm9qZWN0LWRldGFpbCAke3RlY2hub2xvZ3kudG9Mb3dlckNhc2UoKX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJwcm9qZWN0LXRpdGxlXCI+JHtwcm9qZWN0Lm5hbWV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInByb2plY3QtZGVzY3JpcHRpb25cIj4ke3Byb2plY3QuZGVzY3JpcHRpb259PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwicHJvamVjdC1jb21wbGV0ZWQtZGF0ZVwiPkRhdGUgY29tcGxldGVkOiAke21vbWVudChwcm9qZWN0LmRhdGVDb21wbGV0ZWQpLmZvcm1hdChcIllZWVktTU0tRERcIil9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiciBjbGFzcz1cInByb2plY3QtaHJlZlwiPjxhIGhyZWY9XCIke3Byb2plY3QuaHJlZn1cIj5saW5rPC9hPiB8IDxhIGhyZWY9XCIke3Byb2plY3QucmVwb3NpdG9yeX1cIj5yZXBvc2l0b3J5PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9qZWN0LXRhZ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGFnSFRNTH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICAgICAgYDtcblxuXG4gICAgICAgICAgICB9XG4gICAgICAgIFxuXG5cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImRpc3BsYXlPcHRpb25zXCI6IHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIFwiaXRlbXNQZXJQYWdlXCI6IDVcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3cml0YWJsZVwiOiB0cnVlXG4gICAgfSxcblxuICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAvLyB0YWtlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGZyb20gdGhlIHBhZ2luYXRpb24gb2JqZWN0XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IG51bWJlck9mSXRlbXMgPSB0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICAvLyBjb25zdCBudW1iZXJPZlBhZ2VzID0gTWF0aC5jZWlsKG51bWJlck9mSXRlbXMgLyB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMucGFnaW5hdGlvbk9iai5pbml0KG51bWJlck9mUGFnZXMsIDEpO1xuXG4gICAgICAgICAgICAvLyAvLyBkZXRlcm1pbmUgaG93IHRvIGhhbmRsZSB0aGUgcGFnaW5hdGlvbiBkaXNwbGF5XG4gICAgICAgICAgICAvLyBpZiAobnVtYmVyT2ZQYWdlcyA+IDEpIHtcbiAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgIH0sXG5cblxuXG59KTtcblxuLyoqXG4gKiBJbml0IGZvciB0aGUgYmxvZyBwYWdlXG4gKi9cblByb2plY3RNYW5hZ2VyLmxvYWQoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0TWFuYWdlcjsiLCIvL3VwZGF0ZU5hdkJhcihcInJlc3VtZVwiKTtcblxuLy8gY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGdlbmVyYXRpbmcgcGFnaW5hdGlvblxuLy9jb25zdCBQYWdpbmF0b3IgPSByZXF1aXJlKFwiLi4vLi4vcGFnaW5hdGlvbi9zY3JpcHRzL3BhZ2luYXRpb25cIik7XG5jb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuXG5jb25zdCBSZXN1bWVNYW5hZ2VyID0gT2JqZWN0LmNyZWF0ZShQZXJzb25hbEVUTCwge1xuICAgIFxuICAgIFwibG9hZFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQuYWpheCh7dXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9yZXN1bWUuanNvblwifSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRpc3BsYXlcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGpvYnNTZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bWUtam9ic1wiKTtcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYXJyYXkgb2Ygam9iIG9iamVjdHNcbiAgICAgICAgICAgIGxldCBqb2JzID0gdGhpcy5maWx0ZXJlZERhdGEuam9icztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgam9icy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFRPIERPIFRISVMgV0lMTCBOT1cgQ09OVEFJTiBPQkpFQ1RTXG4gICAgICAgICAgICAgICAgbGV0IGpvYiA9IGpvYnNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgcmVzdW1lQnVsbGV0cz1cIlwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYWNjb21wVHJhY2tlciA9IDA7IGFjY29tcFRyYWNrZXIgPCBqb2IuYWNjb21wbGlzaG1lbnRzLmxlbmd0aDsgYWNjb21wVHJhY2tlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VtZUJ1bGxldHMgKz0gXG4gICAgICAgICAgICAgICAgICAgIGA8bGkgY2xhc3M9XCJyZXN1bWVfX2FjY29tcGxpc2htZW50XCI+JHtqb2IuYWNjb21wbGlzaG1lbnRzW2FjY29tcFRyYWNrZXJdfTwvbGk+YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBqb2JzU2VjdGlvbi5pbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicHJvZmVzc2lvbmFsLWV4cGVyaWVuY2VcIj5cbiAgICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3M9XCJhcnRpY2xlLWhlYWRlciByZXN1bWVfX2hlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJlc3VtZV9faGVhZGxpbmVcIj4ke2pvYi5oZWFkbGluZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicmVzdW1lX19kYXRlXCI+JHttb21lbnQoam9iLnN0YXJ0RGF0ZSkuZm9ybWF0KFwiWVlZWVwiKX0tJHttb21lbnQoam9iLmVuZERhdGUpLmZvcm1hdChcIllZWVlcIil9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7am9iLmNvbXBhbnlMb2dvSW1nfVwiXG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJyZXN1bWVfX2pvYi10aXRsZVwiPiR7am9iLnRpdGxlfTxoMz5cbiAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInJlc3VtZV9fam9iLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgJHtyZXN1bWVCdWxsZXRzfVxuICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBcbiAgICBcImRpc3BsYXlPcHRpb25zXCI6IHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIFwiaXRlbXNQZXJQYWdlXCI6IDVcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3cml0YWJsZVwiOiB0cnVlXG4gICAgfSxcblxuICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5sZW5ndGggPj0zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9XG4gICAgXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bWVNYW5hZ2VyO1xuIiwiY29uc3QgbmF2YmFyID0gcmVxdWlyZShcIi4uL25hdmJhci9zY3JpcHRzL25hdmJhclwiKTtcbi8vY29uc3QgYmxvZ3MgPSByZXF1aXJlKFwiLi4vYmxvZy9zY3JpcHRzL2Jsb2ctY29udHJvbGxlclwiKTtcbmNvbnN0IEJsb2dNYW5hZ2VyPSByZXF1aXJlKFwiLi4vYmxvZy9zY3JpcHRzL2Jsb2dNYW5hZ2VyXCIpO1xuY29uc3QgUmVzdW1lTWFuYWdlcj0gcmVxdWlyZShcIi4uL3Jlc3VtZS9zY3JpcHRzL3Jlc3VtZVwiKTtcbmNvbnN0IFByb2plY3RNYW5hZ2VyID0gcmVxdWlyZShcIi4uL3Byb2plY3RzL3NjcmlwdHMvcHJvamVjdHNcIik7XG5jb25zdCBDb250YWN0TWFuYWdlciA9IHJlcXVpcmUoXCIuLi9jb250YWN0L3NjcmlwdHMvY29udGFjdFwiKTtcblxuLy8gYWRkIHRoZSBhZG1pbiBldmVudHNcbmNvbnN0IGFkbWluRXZlbnRzID0gcmVxdWlyZShcIi4uL2Jsb2cvc2NyaXB0cy9ibG9nLWFkbWluLWV2ZW50c1wiKTtcblxuY29uc29sZS5sb2coXCJibG9nZ2VyXCIsIEJsb2dNYW5hZ2VyKTtcblxubmF2YmFyKFwiS3J5cyBNYXRoaXNcIik7XG5jb25zb2xlLmxvZyhcIlByb2plY3QgTWFuYWdlclwiLCBQcm9qZWN0TWFuYWdlcik7XG5jb25zb2xlLmxvZyhcIkJsb2dNYW5hZ2VyXCIsIEJsb2dNYW5hZ2VyKTtcbmNvbnNvbGUubG9nKFwiUmVzdW1lTWFuYWdlclwiLCBSZXN1bWVNYW5hZ2VyKTtcbmNvbnNvbGUubG9nKFwiQ29udGFjdE1hbmFnZXJcIiwgQ29udGFjdE1hbmFnZXIpO1xuQmxvZ01hbmFnZXIubG9hZCgpO1xuUmVzdW1lTWFuYWdlci5sb2FkKCk7XG5Db250YWN0TWFuYWdlci5sb2FkKCk7XG5cbiIsImNvbnN0IFBlcnNvbmFsRVRMID0gXG4gICAgT2JqZWN0LmNyZWF0ZShudWxsLHtcbiAgICAgICAgXG4gICAgICAgIFwibG9hZFwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogW10sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIC8vIGluaXRpYWxseSBzZXQgdGhlIGZpbHRlcmQgZGF0YSA9IGRhdGFcbiAgICAgICAgXCJmaWx0ZXJlZERhdGFcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHRoaXMgaXMgYSBmdW5jdGlvbiBjcmVhdGVkIGJ5IHRoZSBjb25jcmV0ZSBpbXBsZW1lbnRhdGlvblxuICAgICAgICBcImZpbHRlckJ5U2VhcmNoQ3JpdGVyaWFcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdGhpcyBtYXkgY2hhbmdlIGFzIHRoZSBpbXBsZW1lbnRhdGlvbiBjaGFuZ2VzXG4gICAgICAgIFwiZmlsdGVyQnlUYWdcIjoge1xuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24odGFnKSB7XG4gICAgICAgICAgICAvLyBHZXQgcmVjb3JkcyB3aXRoIG1hdGNoaW5nIHRhZ3NcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaGVkUmVjb3JkcyA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC50YWdzLmZvckVhY2goY3VycmVudFRhZyA9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGFnID09PSB0YWcpIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRSZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSBtYXRjaGVkUmVjb3JkcztcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBwYWdpbmF0aW9uT2JqIGNvbnRhaW5zIHRoZSBvYmplY3QgdGhhdCBjb250cm9scyB0aGUgcGFnaW5hdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBkaXNwbGF5IHByb3BlcnR5IHdpbGwgY29udGFpbiBhIGZ1bmN0aW9uIHRoYXQgY29udHJvbHNcbiAgICAgICAgICogSG93IHRoZSBvYmplY3QgZGlzcGxheXMgaXQncyBkYXRhXG4gICAgICAgICAqIFRoaXMgaXMgc3BlY2lmaWMgdG8gaG93IHRoZSBvYmplY3QgaXMgYWN1dGFsbHkgaW1wbGVtZW50ZWRcbiAgICAgICAgICovXG4gICAgICAgIFwiZGlzcGxheVwiOiB7XG4gICAgICAgICAgICB2YWx1ZToge30sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICBcImRpc3BsYXlPcHRpb25zXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgXCJpdGVtc1BlclBhZ2VcIjogNSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5sZW5ndGggPj0zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShzZWFyY2hTdHJpbmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgXG4gICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgLy8gdGFrZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIHRoZSBwYWdpbmF0aW9uIG9iamVjdFxuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IG51bWJlck9mSXRlbXMgPSB0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgbnVtYmVyT2ZQYWdlcyA9IE1hdGguY2VpbChudW1iZXJPZkl0ZW1zIC8gdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuUGFnaW5hdG9yLmluaXQobnVtYmVyT2ZQYWdlcywxKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoISQuaXNFbXB0eU9iamVjdCh0aGlzLnBhZ2luYXRpb25PYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZGV0ZXJtaW5lIGhvdyB0byBoYW5kbGUgdGhlIHBhZ2luYXRpb24gZGlzcGxheVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAobnVtYmVyT2ZQYWdlcyA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcbiAgICBcblxuXG5cblxuICAgIH0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uYWxFVEw7Il19
