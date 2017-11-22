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
				<tr class="blogList__entry">
					<th class="blogList__headline">${entry.blogDetail.headline}</th>
					<td class="blogList__preview">${entry.blogDetail.content.substring(0,30).replace(/<(?:.|\n)*?>/gm, "")}</td>
					<td class="blogList__date">${entry.blogDetail.dateAdded}</td>
					<td class="blogList__button-row"><button class="blogList__btn-edit" data-blog-id="${entry.id}">Edit</button></td>
					<td class="blogList__button-row"><button class="blogList__btn-delete" data-blog-id="${entry.id}">Delete</button></td>
				</tr>
				`;
            });

        document.querySelector(".blogList__body").innerHTML = html;
    };

    // Init blog list
    listCurrentBlogs();

};
// end of castle wall
    
module.exports = RunAdmin;
},{"../../blog/scripts/blog-factory":5,"../../blog/scripts/blogManager":6}],3:[function(require,module,exports){
const {showSuccess, showErrors, getMissingParts} = require("../../admin/scripts/admin-blog-form-validation");
const BlogManager = require("./blogManager");

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
};
    
    
document.querySelector(".blogForm__btnGoToBlog").addEventListener("click",  () => {
    window.location.href = "../blog/index.html";
});
    
// Click on the edit button
document.querySelector(".blogList__body").addEventListener("click", e => {
        
    if (e.target.className === "blogList__btn-edit") {
        const blogId = e.target.dataset.blogId;
        console.log("state of blog manager", BlogManager);
        // getCurrentBlog(blogId);
        // // populate the blog form
        // tagsEl.value = currentBlog.detail.tags.join(", ");
        // headlineEl.value = currentBlog.detail.headline;
        // authorEl.value = currentBlog.detail.author;
        // dateEl.value = currentBlog.detail.dateAdded;
        // imageEl.value = currentBlog.detail.imgHeader;
        // contentEl.value = currentBlog.detail.content;
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
},{"../../admin/scripts/admin-blog-form-validation":1,"./blogManager":6}],4:[function(require,module,exports){
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
const eventListeners = require("./blog-admin-events");

const BlogManager = Object.create(PersonalETL, {
    
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

module.exports = BlogManager;
},{"../../admin/scripts/admin-controller":2,"../../pagination/scripts/pagination":9,"../../scripts/personalETL":13,"./blog-admin-events":3,"./blog-controller":4}],7:[function(require,module,exports){
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


navbar("Krys Mathis");
console.log("Project Manager", ProjectManager);
console.log("BlogManager", BlogManager);
console.log("ResumeManager", ResumeManager);
console.log("ContactManager", ContactManager);
BlogManager.load();
ResumeManager.load();
ContactManager.load();


},{"../blog/scripts/blogManager":6,"../contact/scripts/contact":7,"../navbar/scripts/navbar":8,"../projects/scripts/projects":10,"../resume/scripts/resume":11}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZG1pbi9zY3JpcHRzL2FkbWluLWJsb2ctZm9ybS12YWxpZGF0aW9uLmpzIiwiYWRtaW4vc2NyaXB0cy9hZG1pbi1jb250cm9sbGVyLmpzIiwiYmxvZy9zY3JpcHRzL2Jsb2ctYWRtaW4tZXZlbnRzLmpzIiwiYmxvZy9zY3JpcHRzL2Jsb2ctY29udHJvbGxlci5qcyIsImJsb2cvc2NyaXB0cy9ibG9nLWZhY3RvcnkuanMiLCJibG9nL3NjcmlwdHMvYmxvZ01hbmFnZXIuanMiLCJjb250YWN0L3NjcmlwdHMvY29udGFjdC5qcyIsIm5hdmJhci9zY3JpcHRzL25hdmJhci5qcyIsInBhZ2luYXRpb24vc2NyaXB0cy9wYWdpbmF0aW9uLmpzIiwicHJvamVjdHMvc2NyaXB0cy9wcm9qZWN0cy5qcyIsInJlc3VtZS9zY3JpcHRzL3Jlc3VtZS5qcyIsInNjcmlwdHMvbWFpbi5qcyIsInNjcmlwdHMvcGVyc29uYWxFVEwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuICAgIEZvcm0gdmFsaWRhdGlvblxuICAgIDEuIEFsbCB0ZXh0IGlucHV0cyBzaG91bGQgaGF2ZSBhIHZhbHVlXG4gICAgMi4gVGhlIHRleHQgYXJlYSBzaG91bGQgY29udGFpbiBhdCBsZWFzdCB0aHJlZSBjaGFyYWN0ZXJzXG4gICAgKi9cbmNvbnN0IGdldE1pc3NpbmdQYXJ0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgLy8gY2hlY2sgaW5wdXRzXG4gICAgY29uc3QgYmxvZ1BhcnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbY2xhc3NePSdibG9nRm9ybSddXCIpKTtcbiAgICBjb25zdCBtaXNzaW5nUGFydHMgPSBbXTtcbiAgICAgICAgXG4gICAgYmxvZ1BhcnRzLmZvckVhY2gocGFydCA9PiB7XG4gICAgICAgIGlmIChwYXJ0LnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbWlzc2luZ1BhcnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogcGFydC5uYW1lLFxuICAgICAgICAgICAgICAgIFwiY2xhc3NcIjogcGFydC5jbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwibWlzc2luZyBcIiArIHBhcnQubmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgICAgXG4gICAgLy8gY2hlY2sgdGV4dCBhcmVhXG4gICAgY29uc3QgYmxvZ1RleHRBcmVhVmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGV4dGFyZWFbbmFtZT0nYmxvZy1jb250ZW50J11cIikudmFsdWU7XG4gICAgaWYgKGJsb2dUZXh0QXJlYVZhbHVlLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgbWlzc2luZ1BhcnRzLnB1c2goe1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImJsb2ctY29udGVudHNcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogYmxvZ1RleHRBcmVhVmFsdWUuY2xhc3NOYW1lLFxuICAgICAgICAgICAgXCJtZXNzYWdlXCI6IFwic2hvdWxkIGNvbnRhaW4gYXQgbGVhc3QgMyBjaGFyYWN0ZXJzIG9mIGNvbnRlbnRcIlxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG1pc3NpbmdQYXJ0cztcbn07XG4gICAgXG4gICAgLypcbiAgICBUaGUgbWlzc2luZyBwYXJ0cyBhcmUgc3RvcmVkIGhlcmUsIGV4dHJhY3QgYW5kIGRpc3BsYXkgdGhlbSBoZXJlXG4gICAgKi9cbmNvbnN0IHNob3dFcnJvcnMgPSBmdW5jdGlvbiAobWlzc2luZ1BhcnRzKSB7XG4gICAgbGV0IG1lc3NhZ2UgPSBcIjxoMz4hISFVbmFjY2VwdGFibGUgU3VibWlzc2lvbiEhITwvaDM+IDx1bD5cIjtcbiAgICBjb25zdCBtc2dCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVzc2FnZUJsb2NrXCIpO1xuICAgICAgICBcbiAgICBtaXNzaW5nUGFydHMuZm9yRWFjaChwYXJ0ID0+IG1lc3NhZ2UgKz0gYDxsaSBjbGFzcz1cIm1lc3NhZ2VCbG9ja19fZGV0YWlsXCI+WW91ciAke3BhcnQuZmllbGR9IGlzICR7cGFydC5tZXNzYWdlfTwvbGk+YCk7XG4gICAgbWVzc2FnZSArPSBcIjwvdWw+XCI7XG4gICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBtc2dCbG9jay5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJlZFwiO1xuICAgIG1zZ0Jsb2NrLmlubmVySFRNTCA9IG1lc3NhZ2U7XG59O1xuICAgIFxuY29uc3Qgc2hvd1N1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgY29uc3QgbXNnQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2VCbG9ja1wiKTtcbiAgICBtc2dCbG9jay5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMjU1LDI1NSwwLC43NSlcIjtcbiAgICBtc2dCbG9jay5pbm5lckhUTUwgPSBcIllvdSd2ZSBjcmVhdGVkIGEgbmV3IGJsb2chXCI7XG4gICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjsgLy9zaG93IHRoZSBlbGVtZW50XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1zZ0Jsb2NrLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9LCAxMDAwMCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtzaG93U3VjY2Vzcywgc2hvd0Vycm9ycywgZ2V0TWlzc2luZ1BhcnRzfTsiLCJjb25zdCBibG9nT2JqZWN0RmFjdG9yeSA9IHJlcXVpcmUoXCIuLi8uLi9ibG9nL3NjcmlwdHMvYmxvZy1mYWN0b3J5XCIpO1xuY29uc3QgQmxvZ01hbmFnZXIgPSByZXF1aXJlKFwiLi4vLi4vYmxvZy9zY3JpcHRzL2Jsb2dNYW5hZ2VyXCIpO1xuXG5jb25zdCBSdW5BZG1pbiA9IGZ1bmN0aW9uIChibG9nRGF0YSkge1xuICAgIFxuICAgIC8vIGdldCB0aGUgZGF0YWJhc2UgZnJvbSBsb2NhbCBzdG9yYWdlLCBvciBlbXB0eSBvYmplY3QgaWYgbnVsbFxuICAgIC8vIGdldCB0aGUgYmxvZyBlbnRyaWVzIG9yIGVtcHR5IG9iamVjdCBpZiBudWxsXG4gICAgY29uc3QgYmxvZ3MgPSBibG9nRGF0YTtcbiAgICAvKlxuICAgICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgR2VuZXJhdGUgYSBsaXN0IG9mIHRoZSBjdXJyZW50IGJsb2dzIGZvciBlZGl0aW5nXG4gICAgICAgIFRoZSByZWNvcmRzIHdpbGwgZ28gaW50byBhIHRhYmxlXG4gICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICovXG4gICAgY29uc3QgbGlzdEN1cnJlbnRCbG9ncyA9ICgpID0+IHtcbiAgICAgICAgbGV0IGh0bWwgPSBcIlwiO1xuICAgICAgICBjb25zdCBibG9nc0FycmF5ID0gW107XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBibG9ncykge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRCbG9nID0gYmxvZ3Nba2V5XTtcbiAgICAgICAgICAgIGJsb2dzQXJyYXkucHVzaCh7XCJpZFwiOiBrZXksIFwiZGF0ZUFkZGVkXCI6IGN1cnJlbnRCbG9nLmRhdGVBZGRlZCwgXCJibG9nRGV0YWlsXCI6IGN1cnJlbnRCbG9nfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc29ydGVkQmxvZ3MgPSBibG9nc0FycmF5LnNvcnQoKGEsIGIpID0+IG1vbWVudChiLmRhdGVBZGRlZCkgLSBtb21lbnQoYS5kYXRlQWRkZWQpKTtcbiAgICAgICAgc29ydGVkQmxvZ3NcbiAgICAgICAgICAgIC5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICBodG1sICs9IGBcblx0XHRcdFx0PHRyIGNsYXNzPVwiYmxvZ0xpc3RfX2VudHJ5XCI+XG5cdFx0XHRcdFx0PHRoIGNsYXNzPVwiYmxvZ0xpc3RfX2hlYWRsaW5lXCI+JHtlbnRyeS5ibG9nRGV0YWlsLmhlYWRsaW5lfTwvdGg+XG5cdFx0XHRcdFx0PHRkIGNsYXNzPVwiYmxvZ0xpc3RfX3ByZXZpZXdcIj4ke2VudHJ5LmJsb2dEZXRhaWwuY29udGVudC5zdWJzdHJpbmcoMCwzMCkucmVwbGFjZSgvPCg/Oi58XFxuKSo/Pi9nbSwgXCJcIil9PC90ZD5cblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJibG9nTGlzdF9fZGF0ZVwiPiR7ZW50cnkuYmxvZ0RldGFpbC5kYXRlQWRkZWR9PC90ZD5cblx0XHRcdFx0XHQ8dGQgY2xhc3M9XCJibG9nTGlzdF9fYnV0dG9uLXJvd1wiPjxidXR0b24gY2xhc3M9XCJibG9nTGlzdF9fYnRuLWVkaXRcIiBkYXRhLWJsb2ctaWQ9XCIke2VudHJ5LmlkfVwiPkVkaXQ8L2J1dHRvbj48L3RkPlxuXHRcdFx0XHRcdDx0ZCBjbGFzcz1cImJsb2dMaXN0X19idXR0b24tcm93XCI+PGJ1dHRvbiBjbGFzcz1cImJsb2dMaXN0X19idG4tZGVsZXRlXCIgZGF0YS1ibG9nLWlkPVwiJHtlbnRyeS5pZH1cIj5EZWxldGU8L2J1dHRvbj48L3RkPlxuXHRcdFx0XHQ8L3RyPlxuXHRcdFx0XHRgO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nTGlzdF9fYm9keVwiKS5pbm5lckhUTUwgPSBodG1sO1xuICAgIH07XG5cbiAgICAvLyBJbml0IGJsb2cgbGlzdFxuICAgIGxpc3RDdXJyZW50QmxvZ3MoKTtcblxufTtcbi8vIGVuZCBvZiBjYXN0bGUgd2FsbFxuICAgIFxubW9kdWxlLmV4cG9ydHMgPSBSdW5BZG1pbjsiLCJjb25zdCB7c2hvd1N1Y2Nlc3MsIHNob3dFcnJvcnMsIGdldE1pc3NpbmdQYXJ0c30gPSByZXF1aXJlKFwiLi4vLi4vYWRtaW4vc2NyaXB0cy9hZG1pbi1ibG9nLWZvcm0tdmFsaWRhdGlvblwiKTtcbmNvbnN0IEJsb2dNYW5hZ2VyID0gcmVxdWlyZShcIi4vYmxvZ01hbmFnZXJcIik7XG5cbmxldCBlZGl0TW9kZSA9IGZhbHNlO1xubGV0IGN1cnJlbnRCbG9nID0ge307XG5cbi8vLS0tLSBFVkVOVCBMSVNURU5FUlMgLS0tLS0gXG4vL1N0b3JlIHRoZSBlbGVtZW50cyBoZXJlXG5jb25zdCBoZWFkbGluZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9faGVhZGxpbmVcIik7XG5jb25zdCBhdXRob3JFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0Zvcm1fX2F1dGhvclwiKTtcbmNvbnN0IGRhdGVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0Zvcm1fX2RhdGVcIik7XG5jb25zdCBpbWFnZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9faW1hZ2VcIik7XG5jb25zdCBjb250ZW50RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19jb250ZW50XCIpO1xuY29uc3QgdGFnc0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nRm9ybV9fdGFnc1wiKTtcblxuY29uc3Qgc2V0RWRpdE1vZGUgPSAoYm9vbCkgPT4ge1xuICAgIGVkaXRNb2RlID0gYm9vbDtcblxuICAgIGNvbnN0IG1zZ0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZXNzYWdlQmxvY2tcIik7XG4gICAgaWYgKGJvb2wpIHtcbiAgICAgICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgbXNnQmxvY2suaW5uZXJIVE1MID0gXCJFZGl0IE1vZGUhXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbXNnQmxvY2suc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn07XG5cblxuY29uc3QgYWRkVXBkYXRlQmxvZ0FydGljbGVUb0RiID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIGNvbnN0IHRhZ3MgPSB0YWdzRWwudmFsdWUuc3BsaXQoXCIsIFwiKTtcbiAgICBcbiAgICBpZiAoZWRpdE1vZGUpIHtcbiAgICAgICAgLy9nZXQgaW5kZXhcbiAgICAgICAgLy8gRmluZCB0aGUgaW5kZXggb2YgdGhlIHNlbGVjdGVkIGFydGljbGVcbiAgICAgICAgY29uc3QgcGlkID0gY3VycmVudEJsb2cuaWQ7XG4gICAgXG4gICAgICAgIGNvbnN0IHVwZGF0ZUJsb2dBcnRpY2xlID0gYmxvZ09iamVjdEZhY3RvcnkoXG4gICAgICAgICAgICBoZWFkbGluZUVsLnZhbHVlLCAvL2hlYWRsaW5lXG4gICAgICAgICAgICBkYXRlRWwudmFsdWUsXG4gICAgICAgICAgICBhdXRob3JFbC52YWx1ZSwgLy9hdXRob3JcbiAgICAgICAgICAgIGltYWdlRWwudmFsdWUsIC8vIGltZ2hlYWRlclxuICAgICAgICAgICAgY29udGVudEVsLnZhbHVlLCAvL2NvbnRlbnRcbiAgICAgICAgICAgIHRhZ3MsXG4gICAgICAgICAgICBjdXJyZW50QmxvZy5pZFxuICAgICAgICApO1xuICAgICAgICBCbG9nTWFuYWdlci51cGRhdGUocGlkLHVwZGF0ZUJsb2dBcnRpY2xlKTtcbiAgICAgICAgc2V0RWRpdE1vZGUoZmFsc2UpO1xuICAgICAgICAvL21vZGlmeSBleGlzdGluZyBhcnJheVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG5ld0Jsb2dBcnRpY2xlID0gYmxvZ09iamVjdEZhY3RvcnkoXG4gICAgICAgICAgICBoZWFkbGluZUVsLnZhbHVlLCAvL2hlYWRsaW5lXG4gICAgICAgICAgICBuZXcgbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSwgLy8gZGF0ZSBhZGRlZFxuICAgICAgICAgICAgYXV0aG9yRWwudmFsdWUsIC8vYXV0aG9yXG4gICAgICAgICAgICBpbWFnZUVsLnZhbHVlLCAvLyBpbWdoZWFkZXJcbiAgICAgICAgICAgIGNvbnRlbnRFbC52YWx1ZSwgLy9jb250ZW50XG4gICAgICAgICAgICB0YWdzXG4gICAgICAgICk7XG4gICAgICAgIC8qICAgICAgICAgXG4gICAgICAgICAgICAgICAgQWRkIHRoZSBhcnRpY2xlIHRvIHRoZSBibG9nIGFycmF5LCB0aGVuIGFkZCBpdCB0byB0aGUgZGIgaW5cbiAgICAgICAgICAgICAgICBBZGQgaXQgdG8gbG9jYWwgc3RvcmFnZSBcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICBCbG9nTWFuYWdlci5hZGQobmV3QmxvZ0FydGljbGUpO1xuICAgIH1cbn07XG4gICAgXG4gICAgXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2dGb3JtX19idG5Hb1RvQmxvZ1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiLi4vYmxvZy9pbmRleC5odG1sXCI7XG59KTtcbiAgICBcbi8vIENsaWNrIG9uIHRoZSBlZGl0IGJ1dHRvblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nTGlzdF9fYm9keVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgIFxuICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUgPT09IFwiYmxvZ0xpc3RfX2J0bi1lZGl0XCIpIHtcbiAgICAgICAgY29uc3QgYmxvZ0lkID0gZS50YXJnZXQuZGF0YXNldC5ibG9nSWQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhdGUgb2YgYmxvZyBtYW5hZ2VyXCIsIEJsb2dNYW5hZ2VyKTtcbiAgICAgICAgLy8gZ2V0Q3VycmVudEJsb2coYmxvZ0lkKTtcbiAgICAgICAgLy8gLy8gcG9wdWxhdGUgdGhlIGJsb2cgZm9ybVxuICAgICAgICAvLyB0YWdzRWwudmFsdWUgPSBjdXJyZW50QmxvZy5kZXRhaWwudGFncy5qb2luKFwiLCBcIik7XG4gICAgICAgIC8vIGhlYWRsaW5lRWwudmFsdWUgPSBjdXJyZW50QmxvZy5kZXRhaWwuaGVhZGxpbmU7XG4gICAgICAgIC8vIGF1dGhvckVsLnZhbHVlID0gY3VycmVudEJsb2cuZGV0YWlsLmF1dGhvcjtcbiAgICAgICAgLy8gZGF0ZUVsLnZhbHVlID0gY3VycmVudEJsb2cuZGV0YWlsLmRhdGVBZGRlZDtcbiAgICAgICAgLy8gaW1hZ2VFbC52YWx1ZSA9IGN1cnJlbnRCbG9nLmRldGFpbC5pbWdIZWFkZXI7XG4gICAgICAgIC8vIGNvbnRlbnRFbC52YWx1ZSA9IGN1cnJlbnRCbG9nLmRldGFpbC5jb250ZW50O1xuICAgICAgICBzZXRFZGl0TW9kZSh0cnVlKTtcbiAgICB9XG4gICAgICAgIFxuICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUgPT09IFwiYmxvZ0xpc3RfX2J0bi1kZWxldGVcIikge1xuICAgICAgICBjb25zdCBibG9nSWQgPSBlLnRhcmdldC5kYXRhc2V0LmJsb2dJZDtcbiAgICAgICAgQmxvZ01hbmFnZXIuZGVsZXRlKGJsb2dJZCk7XG4gICAgfVxufSk7XG4gICAgXG4vLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHN1Ym1pdCBidXR0b25cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvZ0Zvcm1fX2J0blNhdmVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAvKlxuICAgICAgICBDb2xsZWN0IHRoZSBpbnB1dCBlbGVtZW50c1xuICAgICAgICBjb25zdCBibG9nT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIChoZWFkbGluZSwgZGF0ZUFkZGVkLCBhdXRob3IsIGltZ0hlYWRlciwgY29udGVudCwgLi4udGFncylcbiAgICAgICAgXG4gICAgICAgIE9iamVjdGl2ZSBpcyB0byBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdG8gYWNjZXB0IG9yIHJlamVjdCB0aGlzIHN1Ym1pc3Npb25cbiAgICAgICAgKi9cbiAgICBjb25zdCBtaXNzaW5nUGFydHMgPSBnZXRNaXNzaW5nUGFydHMoKTtcbiAgICAgICAgXG4gICAgaWYgKG1pc3NpbmdQYXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gbm8gZXJyb3JzIHByb2NlZWQgdG8gYWRkIGJsb2dcbiAgICAgICAgYWRkVXBkYXRlQmxvZ0FydGljbGVUb0RiKCk7XG4gICAgICAgIHNob3dTdWNjZXNzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZGlzcGxheSBlcnJvcnMsIGRvIG5vdCBhZGQgYmxvZ1xuICAgICAgICBzaG93RXJyb3JzKG1pc3NpbmdQYXJ0cyk7XG4gICAgfVxuICAgICAgICBcbiAgICAgICAgXG59KTsiLCJjb25zdCBkaXNwbGF5QmxvZ3MgPSBmdW5jdGlvbiAocGFnZU51bWJlcikge1xuXG4gICAgLy8gc29ydCB0aGUgZGF0YVxuICAgIGNvbnN0IHVuc29ydGVkQmxvZ3MgPSBbXTtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5maWx0ZXJlZERhdGEpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRCbG9nID0gdGhpcy5maWx0ZXJlZERhdGFba2V5XTtcbiAgICAgICAgdW5zb3J0ZWRCbG9ncy5wdXNoKGN1cnJlbnRCbG9nKTtcbiAgICB9XG4gICAgY29uc3QgYmxvZ3MgPSB1bnNvcnRlZEJsb2dzLnNvcnQoKGEsIGIpID0+IG1vbWVudChiLmRhdGVBZGRlZCkgLSBtb21lbnQoYS5kYXRlQWRkZWQpKTtcblxuICAgIC8vIENsZWFyIG91dCBhbGwgZXhpc3RpbmcgYmxvZyBlbGVtZW50c1xuICAgIGNvbnN0IGJsb2dzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJsb2ctcG9zdHNcIik7XG4gICAgd2hpbGUgKGJsb2dzRWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIGJsb2dzRWwucmVtb3ZlQ2hpbGQoYmxvZ3NFbC5sYXN0Q2hpbGQpO1xuICAgIH1cblxuICAgIC8vIGRvbid0IGRpc3BsYXkgcGFnaW5hdGUgaWYgdGhlcmUgYXJlIG5vIGJsb2dzXG4gICAgaWYgKGJsb2dzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgYmxvZ3NFbC5pbm5lckhUTUwgPSBcIk5vIGJsb2dzIGZvdW5kLi4uXCI7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGRpc3BsYXkgdGhlIHBhZ2VzIGluIHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyXG4gICAgY29uc3QgYmxvZ3NUb0Rpc3BsYXkgPSBibG9ncy5zbGljZShcbiAgICAgICAgKHBhZ2VOdW1iZXIgLSAxKSAqIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlLFxuICAgICAgICBwYWdlTnVtYmVyICogdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2VcbiAgICApO1xuXG4gICAgLy8gZ28gdGhyb3VnaCB0aGUgZGF0YSBoZXJlXG4gICAgYmxvZ3NUb0Rpc3BsYXkuZm9yRWFjaChlbnRyeSA9PiB7XG5cbiAgICAgICAgbGV0IGltYWdlU3JjID0gZW50cnkuaW1nSGVhZGVyLnN0YXJ0c1dpdGgoXCJpbWFnZXNcIikgPyBcIi4uL1wiICsgZW50cnkuaW1nSGVhZGVyIDogZW50cnkuaW1nSGVhZGVyO1xuXG4gICAgICAgIC8vIG1haW4gZWxlbWVudFxuICAgICAgICBsZXQgYmxvZ1Bvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXJ0aWNsZVwiKTtcbiAgICAgICAgYmxvZ1Bvc3QuY2xhc3NOYW1lID0gXCJibG9nX19wb3N0XCI7XG5cbiAgICAgICAgbGV0IGJsb2dIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibG9nSGVhZGVyLmNsYXNzTmFtZSA9IFwiYmxvZ19faGVhZGVyXCI7XG5cbiAgICAgICAgbGV0IGJsb2dIZWFkbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsb2dIZWFkbGluZS5jbGFzc05hbWUgPSBcImJsb2dfX2hlYWRsaW5lXCI7XG4gICAgICAgIGxldCBibG9nSGVhZGxpbmVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZW50cnkuaGVhZGxpbmUpO1xuICAgICAgICBibG9nSGVhZGxpbmUuYXBwZW5kQ2hpbGQoYmxvZ0hlYWRsaW5lVGV4dCk7XG5cbiAgICAgICAgbGV0IGJsb2dEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ0RhdGUuY2xhc3NOYW1lID0gXCJibG9nX19kYXRlXCI7XG4gICAgICAgIGxldCBibG9nRGF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtb21lbnQoZW50cnkuZGF0ZUFkZGVkKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgYmxvZ0RhdGUuYXBwZW5kQ2hpbGQoYmxvZ0RhdGVUZXh0KTtcblxuICAgICAgICAvLyBhcHBlbmQgdG8gdGhlIGJsb2dIZWFkZXIgZGl2XG4gICAgICAgIGJsb2dIZWFkZXIuYXBwZW5kQ2hpbGQoYmxvZ0hlYWRsaW5lKTtcbiAgICAgICAgYmxvZ0hlYWRlci5hcHBlbmRDaGlsZChibG9nRGF0ZSk7XG5cbiAgICAgICAgLy8gYXBwZW5kIHRvIG1haW4gZGl2XG4gICAgICAgIGJsb2dQb3N0LmFwcGVuZENoaWxkKGJsb2dIZWFkZXIpO1xuXG4gICAgICAgIC8vIEltZyBkaXZcbiAgICAgICAgbGV0IGJsb2dJbWdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibG9nSW1nQ29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYmxvZ19faW1nLWhlYWRlclwiO1xuICAgICAgICAvLyBJbWFnZVxuICAgICAgICBsZXQgYmxvZ0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIGJsb2dJbWcuc3JjID0gaW1hZ2VTcmM7XG4gICAgICAgIGJsb2dJbWdDb250YWluZXIuYXBwZW5kQ2hpbGQoYmxvZ0ltZyk7XG4gICAgICAgIGJsb2dQb3N0LmFwcGVuZENoaWxkKGJsb2dJbWdDb250YWluZXIpO1xuXG4gICAgICAgIC8vIENvbnRlbnRcbiAgICAgICAgbGV0IGJsb2dDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxvZ0NvbnRlbnQuY2xhc3NOYW1lID0gXCJibG9nX19jb250ZW50XCI7XG4gICAgICAgIGJsb2dDb250ZW50LmlubmVySFRNTCA9IGVudHJ5LmNvbnRlbnQ7XG4gICAgICAgIGJsb2dQb3N0LmFwcGVuZENoaWxkKGJsb2dDb250ZW50KTtcblxuICAgICAgICAvLyBUYWdzIENvbnRhaW5lclxuICAgICAgICBsZXQgYmxvZ1RhZ3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibG9nVGFncy5jbGFzc05hbWUgPSBcImJsb2dfX2Zvb3RlciBwcm9qZWN0LXRhZ1wiO1xuICAgICAgICBsZXQgYmxvZ1RhZ0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG5cbiAgICAgICAgLy8gZG8gdGhlIHRhZ3NcbiAgICAgICAgZW50cnkudGFncy5mb3JFYWNoKGN1cnJlbnRUYWcgPT4ge1xuICAgICAgICAgICAgbGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIHRhZy5jbGFzc05hbWUgPSBcImJsb2dfX3RhZ1wiO1xuICAgICAgICAgICAgdGFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGN1cnJlbnRUYWcpKTtcbiAgICAgICAgICAgIGJsb2dUYWdMaXN0LmFwcGVuZENoaWxkKHRhZyk7XG5cbiAgICAgICAgICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lciBmb3Igb24gY2xpY2tcbiAgICAgICAgICAgIHRhZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWdUeHQgPSBlLnRhcmdldC5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVRhZyh0YWdUeHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJsb2dUYWdzLmFwcGVuZENoaWxkKGJsb2dUYWdMaXN0KTtcbiAgICAgICAgYmxvZ1Bvc3QuYXBwZW5kQ2hpbGQoYmxvZ1RhZ3MpO1xuXG5cbiAgICAgICAgLy8gZm9yIGxvb3AgZm9yIGFkZGluZyB0aGUgdGFnc1xuICAgICAgICBibG9nc0VsLmFwcGVuZENoaWxkKGJsb2dQb3N0KTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZGlzcGxheUJsb2dzOyIsImNvbnN0IEJsb2dNYW5hZ2VyID0gcmVxdWlyZShcIi4vYmxvZ01hbmFnZXJcIik7XG5cbi8qXG5DcmVhdGUgYSBibG9nLmpzIGZpbGUgYW5kIGluY2x1ZGUgaXQgaW4geW91ciBibG9nLmh0bWwgZmlsZS5cbkJ1aWxkIGEgZGF0YWJhc2Ugb2JqZWN0IHRvIHN0b3JlIHRoZSBlYWNoIG9mIHlvdXIgYmxvZyBhcnRpY2xlcy5cblN0cmluZ2lmeSB0aGUgZGF0YWJhc2Ugb2JqZWN0IGFuZCBzdG9yZSBpdCBpbiBsb2NhbCBzdG9yYWdlLlxuVGhlIGZpcnN0IHN0ZXAgaXMgdG8gZGVzaWduIHdoYXQgZWFjaCBvYmplY3QncyBwcm9wZXJ0aWVzIHNob3VsZCBiZSAtIHRpdGxlLCBkYXRlIG9mIHB1YmxpY2F0aW9uLCB0YWdzLCBhdXRob3IsIGFuZCBjb250ZW50LiBFYWNoIGFydGljbGUgb2JqZWN0IHNob3VsZCBoYXZlIHRob3NlIHByb3BlcnRpZXMuXG4qL1xuXG4vKlxuY29uc3QgYmxvZ0VudHJ5ID0ge1xuICAgIFwiaGVhZGxpbmVcIjogXCJcIixcbiAgICBcImRhdGVBZGRlZFwiOiBcIlwiLFxuICAgIFwiYXV0aG9yXCI6IFwiXCIsXG4gICAgXCJ0YWdzXCI6IFtdLFxuICAgIFwiaW1nSGVhZGVyXCI6IFwiXCIsXG4gICAgXCJjb250ZW50XCI6IFwiXCIsXG59XG4qL1xuXG5jb25zdCBibG9nRW50cmllc1RvQ2hlY2sgPSBCbG9nTWFuYWdlci5kYXRhIHx8IFtdO1xuXG5jb25zdCBnZXRNYXhCbG9nSWQgPSBmdW5jdGlvbigpIHtcbiAgICAvKlxuICAgICAgICAgICAgMS4gIENhcHR1cmUgdGhlIGN1cnJlbnQgYmxvZyBkYXRhYmFzZVxuICAgICAgICAgICAgMi4gIFNvcnQgdGhlIGJsb2cgZW50cmllcyBoZWxkIGluIHRoZSBkYXRhYmFzZSBkZXNjZW5kaW5nXG4gICAgICAgICAgICAzLiAgQ2FwdHVyZSB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIHNvcnRlZCBsaXN0IGFuZCBleHRyYWN0XG4gICAgICAgICAgICAgICAgdGhlIGlkIGNvbHVtbi4gSWYgaXQgZG9lc24ndCBleGlzdCByZXR1cm4gYSBuZXcgb2JqZWN0XG4gICAgICAgICAgICAgICAgd2l0aCBhbiBpZCBvZiAwXG4gICAgICAgICovXG4gICAgY29uc3Qgc29ydGVkRGVzY0Jsb2dzID0gYmxvZ0VudHJpZXNUb0NoZWNrLnNvcnQoKHByZXZpb3VzLG5leHQpPT4gbmV4dC5pZC1wcmV2aW91cy5pZCk7XG4gICAgcmV0dXJuIHNvcnRlZERlc2NCbG9nc1swXSB8fCB7aWQ6IDB9O1xuICAgIFxufTtcblxuY29uc3QgbWF4QmxvZ0lkID0gZ2V0TWF4QmxvZ0lkKCkuaWQ7XG5cbi8vIGdlbmVyYXRlIGFuIHVuaXF1ZSBpZCBmb3IgZWFjaCBibG9nIGFydGljbGVcbmNvbnN0IGJsb2dJZEdlbmVyYXRvciA9IGZ1bmN0aW9uKiAoc3RhcnQpIHtcbiAgICBsZXQgaWQgPSAxO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeWllbGQgaWQgKyBzdGFydDtcbiAgICAgICAgaWQrKztcbiAgICB9XG59O1xuXG5jb25zdCBibG9nSWRGYWN0b3J5ID0gYmxvZ0lkR2VuZXJhdG9yKG1heEJsb2dJZCk7XG5cbmNvbnN0IGJsb2dPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gKGhlYWRsaW5lLCBkYXRlQWRkZWQsIGF1dGhvciwgaW1nSGVhZGVyLCBjb250ZW50LCB0YWdzLCBpZCkge1xuICAgIFxuICAgIGNvbnN0IGN1cnJlbnRJZCA9IGJsb2dJZEZhY3RvcnkubmV4dCgpLnZhbHVlO1xuICAgIFxuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKHt9LHtcbiAgICAgICAgLy8gXCJpZFwiOiB7dmFsdWU6IGlkIHx8IGN1cnJlbnRJZCwgZW51bWVyYWJsZTogdHJ1ZX0sXG4gICAgICAgIFwiaGVhZGxpbmVcIjoge3ZhbHVlOiBoZWFkbGluZSwgZW51bWVyYWJsZTogdHJ1ZX0sXG4gICAgICAgIFwiZGF0ZUFkZGVkXCI6IHt2YWx1ZTogZGF0ZUFkZGVkLCBlbnVtZXJhYmxlOiB0cnVlfSxcbiAgICAgICAgXCJhdXRob3JcIjoge3ZhbHVlOiBhdXRob3IsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcImltZ0hlYWRlclwiOiB7dmFsdWU6IGltZ0hlYWRlciwgZW51bWVyYWJsZTogdHJ1ZX0sXG4gICAgICAgIFwiY29udGVudFwiOiB7dmFsdWU6IGNvbnRlbnQsIGVudW1lcmFibGU6IHRydWV9LFxuICAgICAgICBcInRhZ3NcIjoge3ZhbHVlOiB0YWdzLCBlbnVtZXJhYmxlOiB0cnVlfSxcbiAgICAgICAgXCJnZXREYXRlXCI6IHt2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KHRoaXMuZGF0ZUFkZGVkKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICB9LCBlbnVtZXJhYmxlOiBmYWxzZX1cbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmxvZ09iamVjdEZhY3Rvcnk7XG5cblxuXG5cbiIsIi8vIEFuIG9iamVjdCB0aGF0IHdpbGwgY29udHJvbCB0aGUgZmV0Y2hpbmcgYW5kIHBvc3Rpbmcgb2YgYmxvZ3Ncbi8vIEVUTCBvYmplY3QgZm9yIGJsb2dzXG5cbi8vIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBnZW5lcmF0aW5nIHBhZ2luYXRpb25cbmNvbnN0IFBhZ2luYXRvciA9IHJlcXVpcmUoXCIuLi8uLi9wYWdpbmF0aW9uL3NjcmlwdHMvcGFnaW5hdGlvblwiKTtcbmNvbnN0IFBlcnNvbmFsRVRMID0gcmVxdWlyZShcIi4uLy4uL3NjcmlwdHMvcGVyc29uYWxFVExcIik7XG5jb25zdCBkaXNwbGF5QmxvZ3MgPSByZXF1aXJlKFwiLi9ibG9nLWNvbnRyb2xsZXJcIik7XG5jb25zdCBBZG1pbk1hbmFnZXIgPSByZXF1aXJlKFwiLi4vLi4vYWRtaW4vc2NyaXB0cy9hZG1pbi1jb250cm9sbGVyXCIpO1xuY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSByZXF1aXJlKFwiLi9ibG9nLWFkbWluLWV2ZW50c1wiKTtcblxuY29uc3QgQmxvZ01hbmFnZXIgPSBPYmplY3QuY3JlYXRlKFBlcnNvbmFsRVRMLCB7XG4gICAgXG4gICAgXCJsb2FkXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJC5hamF4KHt1cmw6IFwiaHR0cHM6Ly9wZXJzb25hbC1zaXRlLTMxMTFkLmZpcmViYXNlaW8uY29tL2Jsb2dzLmpzb25cIn0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBBZG1pbk1hbmFnZXIodGhpcy5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxvZ0FkbWluIHVwZGF0ZSBnb2VzIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgLy9ibG9nQWRtaW5pc3RyYXRvci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImFkZFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9ibG9ncy8uanNvblwiLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkob2JqKVxuICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihwaWQsIG9iaikge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IGBodHRwczovL3BlcnNvbmFsLXNpdGUtMzExMWQuZmlyZWJhc2Vpby5jb20vYmxvZ3MvJHtwaWR9Ly5qc29uYCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkob2JqKVxuICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRlbGV0ZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihwaWQpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBgaHR0cHM6Ly9wZXJzb25hbC1zaXRlLTMxMTFkLmZpcmViYXNlaW8uY29tL2Jsb2dzLyR7cGlkfS8uanNvbmAsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgICAgICB9KS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJwYWdpbmF0aW9uT2JqXCI6IHtcbiAgICAgICAgdmFsdWU6IFBhZ2luYXRvcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikpLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlckJ5U2VhcmNoQ3JpdGVyaWFcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoQ3JpdGVyaWEpIHtcbiAgICAgICAgICAgIC8vIHNvcnQgaW4gZGVzY2VuZGluZyBvcmRlclxuICAgICAgICAgICAgLy9jb25zdCBzb3J0ZWRCbG9nRW50cmllcyA9IHRoaXMuZGF0YS5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQWRkZWQpIC0gbW9tZW50KGEuZGF0ZUFkZGVkKSk7XG4gICAgICAgICAgICBpZiAoc2VhcmNoQ3JpdGVyaWEgPT09IHVuZGVmaW5lZCB8fCBzZWFyY2hDcml0ZXJpYSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIC8vIGp1c3QgcmV0dXJuIHRoZSBzb3J0ZWQgYmxvZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBmaWx0ZXJlZCBibG9nc1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvZyA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9nLmhlYWRsaW5lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2cuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaENyaXRlcmlhKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGUoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgxKTtcblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIFwiZGlzcGxheVwiOiB7XG4gICAgICAgIHZhbHVlOiBkaXNwbGF5QmxvZ3MsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LFxuICAgIFxuICAgIFwiZGlzcGxheU9wdGlvbnNcIjoge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgXCJpdGVtc1BlclBhZ2VcIjogNVxuICAgICAgICB9LFxuICAgICAgICBcIndyaXRhYmxlXCI6IHRydWVcbiAgICB9LFxuXG4gICAgXCJzZWFyY2hcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmxlbmd0aCA+PTMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgLy8gdGFrZXMgYSBjYWxsYmFjayBmdW5jdGlvbiBmcm9tIHRoZSBwYWdpbmF0aW9uIG9iamVjdFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnN0IG51bWJlck9mSXRlbXMgPSBPYmplY3Qua2V5cyh0aGlzLmZpbHRlcmVkRGF0YSkubGVuZ3RoO1xuICAgICAgICAgICAgLy8gY29uc3QgbnVtYmVyT2ZQYWdlcyA9IE1hdGguY2VpbChudW1iZXJPZkl0ZW1zIC8gdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UpOyAgXG4gICAgICAgICAgICAvLyB0aGlzLnBhZ2luYXRpb25PYmouaW5pdChudW1iZXJPZlBhZ2VzLDEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyAvLyBkZXRlcm1pbmUgaG93IHRvIGhhbmRsZSB0aGUgcGFnaW5hdGlvbiBkaXNwbGF5XG4gICAgICAgICAgICAvLyBpZiAobnVtYmVyT2ZQYWdlcyA+IDEpIHtcbiAgICAgICAgICAgIC8vICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcbn0pO1xuXG4vKipcbiAqIEluaXQgZm9yIHRoZSBibG9nIHBhZ2VcbiAqL1xuLy9CbG9nTWFuYWdlci5sb2FkKCk7XG5cbi8vIC0tLS0gRVZFTlQgTElTVEVORVIgRk9SIFBBR0lOQVRJT04gLS0tLVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgXG4gICAgaWYgKCFCbG9nTWFuYWdlci5wYWdpbmF0aW9uT2JqLmhlbHBlcnMuaXNWYWxpZChlKSkge3JldHVybjt9XG4gICAgLy8gVXBkYXRlIHRoZSBibG9nIHBvc3RzXG4gICAgY29uc3QgcGFnZU51bWJlciA9IGUudGFyZ2V0LmRhdGFzZXQucGFnZU51bTtcbiAgICBcbiAgICBCbG9nTWFuYWdlci5kaXNwbGF5KHBhZ2VOdW1iZXIpO1xuICAgIC8vIFVwZGF0ZSB0aGUgcGFnaW5hdGlvbiB0byBzdG9yZSB0aGUgbmV3IHBhZ2UgIydzXG4gICAgQmxvZ01hbmFnZXIucGFnaW5hdGlvbk9iai51cGRhdGUoZSk7XG5cblxufSk7XG5cbi8vIC0tLS0tIEVWRU5UIExJU1RFTkVSUyBGT1IgU0VBUkNIIEZPUk0gLS0tLS0gLy9cbmNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nX19zZWFyY2gtaW5wdXRcIik7XG5cbi8vIGNsZWFyIHRoZSBib3ggd2hlbiB0aGUgZm9ybSBoYXMgdGhlIGZvY3VzXG5zZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4ge1xuICAgIHNlYXJjaElucHV0LnZhbHVlID0gXCJcIjtcbn0pO1xuXG5zZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBsZXQgc2VhcmNoU3RyaW5nID0gZXZlbnQudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgQmxvZ01hbmFnZXIuc2VhcmNoKHNlYXJjaFN0cmluZyk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9nX19ibnQtY2xlYXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT4ge1xuICAgIHNlYXJjaElucHV0LnZhbHVlID0gXCJcIjtcbiAgICBCbG9nTWFuYWdlci5zZWFyY2goXCJcIik7XG59KTtcblxuLy8gLS0tLS0gRVZFTlQgTElTVEVORVJTIEZPUiBBRE1JTiBGT1JNIC0tLS0gLy9cblxuY29uc29sZS5sb2coXCJibG9nIG1hbmFnZXIgZnJvbSBibG1cIiwgQmxvZ01hbmFnZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2dNYW5hZ2VyOyIsImNvbnN0IFBlcnNvbmFsRVRMID0gcmVxdWlyZShcIi4uLy4uL3NjcmlwdHMvcGVyc29uYWxFVExcIik7XG5cbmNvbnN0IENvbnRhY3RNYW5hZ2VyID0gT2JqZWN0LmNyZWF0ZShQZXJzb25hbEVUTCwge1xuICAgIFxuICAgIFwibG9hZFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQuYWpheCh7dXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9jb250YWN0Lmpzb25cIn0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJkaXNwbGF5XCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBzb2NpYWxMaW5rcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29jaWFsLWxpbmtzXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YS5mb3JFYWNoKGNvbnRhY3RUeXBlID0+IHtcbiAgICAgICAgICAgICAgICBzb2NpYWxMaW5rcy5pbm5lckhUTUwgKz0gXG4gICAgICAgICAgICAgICAgICAgIGA8ZGl2PjxhIGhyZWY9XCIke2NvbnRhY3RUeXBlLnVybH1cIj48aW1nIHNyYz1cIiR7Y29udGFjdFR5cGUuaWNvbn1cIiBhbHQ9XCIke2NvbnRhY3RUeXBlLmljb25BbHR9XCIgY2xhc3M9XCJzb2NpYWwtaW1nXCI+PC9hPjwvZGl2PmA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBcbiAgICBcImRpc3BsYXlPcHRpb25zXCI6IHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIFwiaXRlbXNQZXJQYWdlXCI6IDVcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3cml0YWJsZVwiOiB0cnVlXG4gICAgfSxcblxuICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5sZW5ndGggPj0zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9XG4gICAgXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0TWFuYWdlcjtcbiIsImNvbnN0IHBvcHVsYXRlTmF2QmFyID0gKGZ1bmN0aW9uKGJyYW5kKXtcbiAgICBcbiAgICBjb25zdCBuYXZzID0gbmV3IE1hcCgpO1xuICAgIFxuICAgIC8qKlxuICAgICAgICAqICAgVGhlIG1hcCB3aWxsIGhvbGQgdGhlIGxhYmVscyBhbmQgbGlua3MgZm9yIHRoZSBuYXZiYXJcbiAgICAgICAgKiovXG4gICAgLy8gRm9yIHRlc3RpbmcgcHVycG9zZXM6XG4gICAgbmF2cy5zZXQoXCJIb21lXCIsIHtcImxhYmVsXCI6IFwiSG9tZVwiLCBcImxpbmtcIjogXCIuLi9pbmRleC5odG1sXCIsIFwiYnV0dG9uQ2xhc3NcIjogXCJidG4tbmF2X19ob21lXCIsXCJ0YXJnZXRJZFwiOiBcImFib3V0XCJ9KSxcbiAgICBuYXZzLnNldChcIlByb2plY3RzXCIsIHtcImxhYmVsXCI6IFwiUHJvamVjdHNcIiwgXCJsaW5rXCI6IFwiLi4vcHJvamVjdHNcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX3Byb2plY3RzXCIsIFwidGFyZ2V0SWRcIjogXCJwcm9qZWN0c1wifSksXG4gICAgbmF2cy5zZXQoXCJCbG9nXCIsIHtcImxhYmVsXCI6IFwiQmxvZ1wiLCBcImxpbmtcIjogXCIjYmxvZ3NcIiwgXCJidXR0b25DbGFzc1wiOiBcImJ0bi1uYXZfX2Jsb2dcIiwgXCJ0YXJnZXRJZFwiOlwiYmxvZ3NcIn0pLFxuICAgIG5hdnMuc2V0KFwiUmVzdW1lXCIsIHtcImxhYmVsXCI6IFwiUmVzdW1lXCIsIFwibGlua1wiOiBcIi4uL3Jlc3VtZVwiLCBcImJ1dHRvbkNsYXNzXCI6IFwiYnRuLW5hdl9fcmVzdW1lXCIsIFwidGFyZ2V0SWRcIjogXCJyZXN1bWVcIn0pLFxuICAgIG5hdnMuc2V0KFwiQ29udGFjdFwiLCB7XCJsYWJlbFwiOiBcIkNvbnRhY3RcIiwgXCJsaW5rXCI6IFwiLi4vY29udGFjdFwiLCBcImJ1dHRvbkNsYXNzXCI6IFwiYnRuLW5hdl9fY29udGFjdFwiLCBcInRhcmdldElkXCI6IFwiY29udGFjdFwifSk7XG4gICAgXG4gICAgY29uc3QgbmF2QmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uYXZcIik7XG4gICAgLy8gY3JlYXRlIHRoZSB1bCBlbGVtZW50IHRvIHN0aWNrIGluc2lkZSB0aGUgbmF2XG4gICAgY29uc3QgbmV3TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICBuZXdMaXN0LmNsYXNzTmFtZSA9IFwibmF2X19saXN0XCI7XG4gICAgICAgIFxuICAgIGNvbnN0IG5ld0JyYW5kTGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgbmV3QnJhbmRMaS5jbGFzc05hbWUgPSBcIm5hdl9fYnJhbmRcIjtcbiAgICAgICAgXG4gICAgY29uc3QgYnJhbmRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYnJhbmQpO1xuICAgIG5ld0JyYW5kTGkuYXBwZW5kQ2hpbGQoYnJhbmRUZXh0KTtcbiAgICBuZXdMaXN0LmFwcGVuZENoaWxkKG5ld0JyYW5kTGkpO1xuICAgICAgICBcbiAgICBuZXdCcmFuZExpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBuYXZzLmdldChcIkhvbWVcIikubGluaztcbiAgICB9KTtcblxuICAgIC8vIHNjcm9sbCB0byBhIHBhcnQgb2YgdGhlIHBhZ2UgYW5kIGFjY291bnQgZm9yIHRoZSBuYXZiYXIgaGVpZ2h0XG4gICAgY29uc3QgZ29Ub0lkID0gZnVuY3Rpb24obmF2KSB7XG4gICAgICAgIGxldCBuYXZCYXJIZWlnaHQgPSBuYXZCYXIuY2xpZW50SGVpZ2h0O1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYXYudGFyZ2V0SWQpLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLC0obmF2QmFySGVpZ2h0KzEwKSk7XG4gICAgfTtcblxuICAgIG5hdnMuZm9yRWFjaChcbiAgICAgICAgbmF2ID0+IHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBsaXN0IGVsZW1lbnRcbiAgICAgICAgICAgIGxldCBuZXdOYXZJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICAgICAgbmV3TmF2SXRlbS5jbGFzc05hbWUgPSBuYXYuYnV0dG9uQ2xhc3MgKyBcIiBuYXZfX2xpbmtcIjtcbiAgICBcbiAgICAgICAgICAgIGxldCBuZXdOYXZJdGVtTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYXYubGFiZWwpO1xuICAgICAgICAgICAgbmV3TmF2SXRlbS5hcHBlbmRDaGlsZChuZXdOYXZJdGVtTGFiZWwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBuZXdOYXZJdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBTY3JvbGwgZG93biBhbmQgYWNjb3VudCBmb3IgdGhlIGhlaWdodCBvZiB0aGUgbmF2YmFyXG4gICAgICAgICAgICAgICAgLy8gKioqIEpRVUVSWSAqKioqXG5cbiAgICAgICAgICAgICAgICAvLyBsZXQgaGVhZGVySGVpZ2h0ID0gJChcIi5uYXZcIikuaGVpZ2h0KCkrMjA7XG4gICAgICAgICAgICAgICAgZ29Ub0lkKG5hdik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgLy8gICAgIHNjcm9sbFRvcDogJChuYXYudGFyZ2V0SWQpLm9mZnNldCgpLnRvcCAtIGhlYWRlckhlaWdodFxuICAgICAgICAgICAgICAgIC8vIH0sIDIwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIG5ld0xpc3QuYXBwZW5kQ2hpbGQobmV3TmF2SXRlbSk7XG4gICAgXG4gICAgICAgIH1cbiAgICApO1xuICAgIG5hdkJhci5hcHBlbmRDaGlsZChuZXdMaXN0KTtcbiAgICBcbiAgICAvKipcbiAgICAgICAgICogQnVpbGRpbmcgdGhlIGRyb3Bkb3duIG1lbnVcbiAgICAgICAgICovXG4gICAgY29uc3QgaGFtYnVyZ2VyTWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgaGFtYnVyZ2VyTWVudS5jbGFzc05hbWUgPSBcIm1lbnUtY29sXCI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgbGV0IG5ld01lbnVCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBuZXdNZW51QmFyLmNsYXNzTmFtZSA9IFwibWVudS1jb2xfX2JhclwiO1xuICAgICAgICBoYW1idXJnZXJNZW51LmFwcGVuZENoaWxkKG5ld01lbnVCYXIpO1xuICAgIH1cbiAgICBuZXdMaXN0LmFwcGVuZENoaWxkKGhhbWJ1cmdlck1lbnUpO1xuICAgIFxuICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG1lbnUuY2xhc3NOYW1lID0gXCJtZW51LWxpc3RcIjtcbiAgICBjb25zdCBtZW51TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICBtZW51TGlzdC5jbGFzc05hbWUgPSBcIm1lbnUtbGlzdF9fbGlzdFwiO1xuICAgIG1lbnUuYXBwZW5kQ2hpbGQobWVudUxpc3QpO1xuICAgIFxuICAgIG5hdnMuZm9yRWFjaChcbiAgICAgICAgbmF2ID0+IHtcbiAgICAgICAgICAgIGxldCBtZW51SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIG1lbnVJdGVtLmlubmVySFRNTCA9IGAke25hdi5sYWJlbH1gO1xuICAgICAgICAgICAgbWVudUl0ZW0uY2xhc3NOYW1lID0gXCJtZW51LWxpc3RfX2l0ZW1cIjtcbiAgICAgICAgICAgIG1lbnVMaXN0LmFwcGVuZENoaWxkKG1lbnVJdGVtKTtcbiAgICAgICAgICAgIG1lbnVJdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gbmF2Lmxpbms7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgXG4gICAgbmF2QmFyLmFwcGVuZENoaWxkKG1lbnUpO1xuICAgIFxufSk7XG5cbi8qKlxuICAgICogSGFtYnVyZ2VyIE1lbnVcbiAgICAqIFRoYXQgd2lsbCBsb29rIGxpa2Ugc29tZXRoaW5nIGludGVyZXN0aW5nXG4gICAgKi9cbmNvbnN0IGFkZE5hdmJhck1lbnVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtbGlzdFwiKTsgXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWNvbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpc3BsYXlTdHlsZSA9IG1lbnUuc3R5bGUuZGlzcGxheTtcbiAgICAgICAgaWYgKGRpc3BsYXlTdHlsZSA9PT0gXCJub25lXCIgfHwgZGlzcGxheVN0eWxlID09PSBcIlwiKSB7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICAgICBcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtbGlzdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcbiAgICAgICAgICAgIFxuICAgICAgICBjb25zdCBkaXNwbGF5U3R5bGUgPSBtZW51LnN0eWxlLmRpc3BsYXk7XG4gICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT09IFwibm9uZVwiIHx8IGRpc3BsYXlTdHlsZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgICAgXG4gICAgLyoqXG4gICAgICAgICAqIElmIHRoZSB1c2VyIHJlc2l6ZXMgdGhlIHdpbmRvdyB0aGUgZHJvcCBkb3duIG1lbnUgd2lsbCBkaXNhcHBlYXJcbiAgICAgICAgICovXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcG9wdWxhdGVOYXZDb21wb25lbnRzKGJyYW5kKSB7XG4gICAgcG9wdWxhdGVOYXZCYXIoYnJhbmQpO1xuICAgIGFkZE5hdmJhck1lbnVFdmVudExpc3RlbmVycygpO1xufTtcblxuIiwiLypcbiAgICBSRVFVSVJFTUVOVFM6IFxuICAgICAgICBIVE1MOiBhIDxzZWN0aW9uPiB3aXRoIHRoZSBjbGFzcyBvZiBcInBhZ2luYXRpb25cIi4gXG4gICAgICAgIEpTOiBZb3UnbGwgbmVlZCB0byBzZW5kIGluIHRoZSBudW1iZXIgb2YgcGFnZXMgdG8gZGlzcGxheVxuKi9cblxuY29uc3QgUGFnaW5hdG9yID0gZnVuY3Rpb24ocGFnaW5hdGlvbkVsKSB7XG4gICAgXG4gICAgY29uc3QgX3BhZ2luYXRpb25FbCA9IHBhZ2luYXRpb25FbDtcblxuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgXG4gICAgICAgIFwiaW5pdFwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKG51bWJlck9mUGFnZXMsIHN0YXJ0UGFnZSA9IDEpIHtcbiAgICAgICAgICAgICAgICAvL2NvbnN0IHBhZ2luYXRpb25FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKTtcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgcGFnaW5hdGlvbiBieSByZW1vdmluZyBhbGwgdGhlIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICAgICAgd2hpbGUgKF9wYWdpbmF0aW9uRWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIF9wYWdpbmF0aW9uRWwucmVtb3ZlQ2hpbGQoX3BhZ2luYXRpb25FbC5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgICAgICAgICAgICAgICBDcmVhdGUgdGhlIHBhZ2luYXRpb24gZWxlbWVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IHdpdGggdGhlIHByZXZpb3VzIGFycm93XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgIHByZXYuZGF0YXNldC5wYWdlTnVtPShzdGFydFBhZ2UtMSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBwcmV2LmNsYXNzTmFtZT1cInBhZ2luYXRpb25fX3ByZXZpb3VzXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldlRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIjxcIik7XG4gICAgICAgICAgICAgICAgcHJldi5hcHBlbmRDaGlsZChwcmV2VGV4dCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBfcGFnaW5hdGlvbkVsLmFwcGVuZENoaWxkKHByZXYpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGFuIGVsZW1lbnQgdG8gcmVwcmVzZW50IGVhY2ggcGFnZVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZQYWdlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGluay5kYXRhc2V0LnBhZ2VOdW09YCR7aStzdGFydFBhZ2V9YDtcbiAgICAgICAgICAgICAgICAgICAgbGluay5jbGFzc05hbWU9XCJwYWdpbmF0aW9uX19wYWdlXCI7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7aStzdGFydFBhZ2V9YCkpO1xuICAgICAgICAgICAgICAgICAgICBfcGFnaW5hdGlvbkVsLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgbmV4dCBhcnJvdyBidXR0b25cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICAgICAgbmV4dC5kYXRhc2V0LnBhZ2VOdW09KHN0YXJ0UGFnZSsxKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIG5leHQuY2xhc3NOYW1lPVwicGFnaW5hdGlvbl9fbmV4dFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCI+XCIpO1xuICAgICAgICAgICAgICAgIG5leHQuYXBwZW5kQ2hpbGQobmV4dFRleHQpO1xuICAgICAgICAgICAgICAgIF9wYWdpbmF0aW9uRWwuYXBwZW5kQ2hpbGQobmV4dCk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgcHJldmlvdXMgcGFnZSBzZWxlY3RvciB0byBpbnZpc2libGUgYW5kIHRoZSBmaXJzdCBlbGVtZW50IHRvIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uX19wcmV2aW91c1wiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX3BhZ2VcIikuY2xhc3NOYW1lID0gXCJwYWdpbmF0aW9uX19wYWdlLS1zZWxlY3RlZFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5oZWxwZXJzLmlzVmFsaWQoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjYXB0dXJlIHRoZSBwYWdlTnVtIHZhbHVlIGZyb20gY2xpY2tlZCBlbGVtZW50LiBQYXJzZSBpdCBhcyBhbiBpbnRcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHRoZSBwcm9ncmFtIHdpbGwgbmVlZCB0byBkbyBtYXRoIHdpdGggaXQgbGF0ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGlja2VkUGFnZU51bWJlciA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8qICBcbiAgICAgICAgICAgICAgICAgICAgT25seSBsb29wIHRocm91Z2ggdGhlIG51bWJlcmVkIGVsZW1lbnRzIGV4Y2x1ZGluZyB0aGUgYXJyb3dzXG4gICAgICAgICAgICAgICAgICAgIHJlc2V0IHRoZSBjbGFzcyBuYW1lIHRvIHJlbW92ZSB0aGUgbW9kaWZpZXIgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgQWxzbyBuZWVkIHRvIGNhcHR1cmUgdGhlIG51bWJlciBvZiBwYWdlc1xuICAgICAgICAgICAgICAgICovIFxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VOdW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltjbGFzc149J3BhZ2luYXRpb25fX3BhZ2UnXCIpO1xuICAgICAgICAgICAgICAgIEFycmF5LmZyb20ocGFnZU51bXMpLmZvckVhY2goZnVuY3Rpb24gKHBhZ2UpIHsgICAgIFxuICAgICAgICAgICAgICAgICAgICBwYWdlLmNsYXNzTmFtZSA9IFwicGFnaW5hdGlvbl9fcGFnZVwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xpY2tlZFBhZ2VOdW1iZXIudG9TdHJpbmcoKSA9PT0gcGFnZS5kYXRhc2V0LnBhZ2VOdW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2UuY2xhc3NOYW1lID0gXCJwYWdpbmF0aW9uX19wYWdlLS1zZWxlY3RlZFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4UGFnZSA9IHBhcnNlSW50KHBhZ2VOdW1zW3BhZ2VOdW1zLmxlbmd0aC0xXS5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1pblBhZ2UgPSBwYXJzZUludChwYWdlTnVtc1swXS5kYXRhc2V0LnBhZ2VOdW0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25fX3ByZXZpb3VzXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvbl9fbmV4dFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEJlaGF2aW9yIGZvciB0aGUgYXJyb3cga2V5c1xuICAgICAgICAgICAgICAgIGlmIChjbGlja2VkUGFnZU51bWJlciA9PT0gbWluUGFnZSkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0VsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzRWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzRWwuZGF0YXNldC5wYWdlTnVtID0gY2xpY2tlZFBhZ2VOdW1iZXItMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGNsaWNrZWRQYWdlTnVtYmVyICsgMSA+IG1heFBhZ2UpIHsgIFxuICAgICAgICAgICAgICAgICAgICBuZXh0RWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEVsLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBuZXh0RWwuZGF0YXNldC5wYWdlTnVtID0gY2xpY2tlZFBhZ2VOdW1iZXIrMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGVscGVyc1wiOiB7XG4gICAgICAgICAgICB2YWx1ZToge1xuXG4gICAgICAgICAgICAgICAgXCJpc1ZhbGlkXCI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkRWxlbWVudHMgPSBbXCJwYWdpbmF0aW9uX19wYWdlXCIsIFwicGFnaW5hdGlvbl9fcGFnZS0tc2VsZWN0ZWRcIiwgXCJwYWdpbmF0aW9uX19wcmV2aW91c1wiLCBcInBhZ2luYXRpb25fX25leHRcIl07XG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lID09PSBlbGVtZW50KSB7IGlzVmFsaWQgPSB0cnVlO31cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBcbiAgICAgICAgXCJwYWdpbmF0aW9uU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBtYXhQYWdlc1RvRGlzcGxheTogNVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2luYXRvcjsiLCJjb25zdCBQYWdpbmF0b3IgPSByZXF1aXJlKFwiLi4vLi4vcGFnaW5hdGlvbi9zY3JpcHRzL3BhZ2luYXRpb25cIik7XG5jb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuXG5jb25zdCBQcm9qZWN0TWFuYWdlciA9IE9iamVjdC5jcmVhdGUoUGVyc29uYWxFVEwsIHtcbiAgICBcbiAgICBcImxvYWRcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBnZXRQcm9qZWN0cyA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9wcm9qZWN0cy5qc29uXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZ2V0UHJvamVjdHNcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRpb25PYmpcIjoge1xuICAgICAgICB2YWx1ZTogT2JqZWN0LmNyZWF0ZShQYWdpbmF0b3Ise30pLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImZpbHRlckJ5U2VhcmNoQ3JpdGVyaWFcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKHNlYXJjaENyaXRlcmlhKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YS5maWx0ZXIoZnVuY3Rpb24ocHJvail7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2ouZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hDcml0ZXJpYSkgfHwgcHJvai5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoQ3JpdGVyaWEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoMSk7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRlKCk7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRpc3BsYXlcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKHBhZ2VOdW1iZXIpIHtcblxuICAgICAgICAgICAgLy8gT25seSBkaXNwbGF5IHRoZSBwYWdlcyBpbiB0aGUgY3VycmVudCBwYWdlIG51bWJlclxuICAgICAgICAgICAgY29uc3QgYmxvZ3NUb0Rpc3BsYXkgPSB0aGlzLmZpbHRlcmVkRGF0YS5zbGljZShcbiAgICAgICAgICAgICAgICAocGFnZU51bWJlciAtIDEpICogdGhpcy5kaXNwbGF5T3B0aW9ucy5pdGVtc1BlclBhZ2UsXG4gICAgICAgICAgICAgICAgcGFnZU51bWJlciAqIHRoaXMuZGlzcGxheU9wdGlvbnMuaXRlbXNQZXJQYWdlKTtcbiAgICAgICAgICAgIC8vICk7ICBcblxuICAgICAgICAgICAgY29uc3QgcHJvamVjdHNIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9qZWN0c1wiKTtcbiAgICAgICAgICAgIHByb2plY3RzSFRNTC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgICAgICBsZXQgc29ydGVkUHJvamVjdHMgPSB0aGlzLmZpbHRlcmVkRGF0YS5zb3J0KChhLCBiKSA9PiBtb21lbnQoYi5kYXRlQ29tcGxldGVkKSAtIG1vbWVudChhLmRhdGVDb21wbGV0ZWQpKTtcblxuICAgICAgICAgICAgbGV0IHByb2plY3RzID0gc29ydGVkUHJvamVjdHMgfHwgW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdCA9IHByb2plY3RzW2ldO1xuXG4gICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgZmlyc3QgdGVjaG5vbG9neSBsaXN0ZWRcbiAgICAgICAgICAgICAgICBjb25zdCB0ZWNobm9sb2d5ID0gcHJvamVjdC50ZWNobm9sb2dpZXMubGVuZ3RoID4gMCA/IHByb2plY3QudGVjaG5vbG9naWVzWzBdIDogXCJcIjtcbiAgICAgICAgICAgICAgICBsZXQgdGFnSFRNTCA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3QudGVjaG5vbG9naWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWcgPSBwcm9qZWN0LnRlY2hub2xvZ2llc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGFnSFRNTCArPSBgPGxpPiR7dGFnfTwvbGk+YDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdGhlIHRlYW1tYXRlIHN0cmluZ1xuICAgICAgICAgICAgICAgIGxldCB0ZWFtbWF0ZXMgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0LnRlYW1tYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVhbW1hdGUgPSBwcm9qZWN0LnRlYW1tYXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGVhbW1hdGVzICs9IGA8YSBocmVmPVwiJHt0ZWFtbWF0ZS5wZXJzb25hbFNpdGV9XCI+JHt0ZWFtbWF0ZS5uYW1lfTwvYT5gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vbGV0IGh0bWwgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHByb2plY3RzSFRNTC5pbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgPGFydGljbGUgY2xhc3M9XCJwcm9qZWN0LWRldGFpbCAke3RlY2hub2xvZ3kudG9Mb3dlckNhc2UoKX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJwcm9qZWN0LXRpdGxlXCI+JHtwcm9qZWN0Lm5hbWV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInByb2plY3QtZGVzY3JpcHRpb25cIj4ke3Byb2plY3QuZGVzY3JpcHRpb259PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwicHJvamVjdC1jb21wbGV0ZWQtZGF0ZVwiPkRhdGUgY29tcGxldGVkOiAke21vbWVudChwcm9qZWN0LmRhdGVDb21wbGV0ZWQpLmZvcm1hdChcIllZWVktTU0tRERcIil9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiciBjbGFzcz1cInByb2plY3QtaHJlZlwiPjxhIGhyZWY9XCIke3Byb2plY3QuaHJlZn1cIj5saW5rPC9hPiB8IDxhIGhyZWY9XCIke3Byb2plY3QucmVwb3NpdG9yeX1cIj5yZXBvc2l0b3J5PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9qZWN0LXRhZ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGFnSFRNTH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICAgICAgYDtcblxuXG4gICAgICAgICAgICB9XG4gICAgICAgIFxuXG5cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcImRpc3BsYXlPcHRpb25zXCI6IHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIFwiaXRlbXNQZXJQYWdlXCI6IDVcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3cml0YWJsZVwiOiB0cnVlXG4gICAgfSxcblxuICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckJ5U2VhcmNoQ3JpdGVyaWEoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAvLyB0YWtlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGZyb20gdGhlIHBhZ2luYXRpb24gb2JqZWN0XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IG51bWJlck9mSXRlbXMgPSB0aGlzLmZpbHRlcmVkRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICAvLyBjb25zdCBudW1iZXJPZlBhZ2VzID0gTWF0aC5jZWlsKG51bWJlck9mSXRlbXMgLyB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMucGFnaW5hdGlvbk9iai5pbml0KG51bWJlck9mUGFnZXMsIDEpO1xuXG4gICAgICAgICAgICAvLyAvLyBkZXRlcm1pbmUgaG93IHRvIGhhbmRsZSB0aGUgcGFnaW5hdGlvbiBkaXNwbGF5XG4gICAgICAgICAgICAvLyBpZiAobnVtYmVyT2ZQYWdlcyA+IDEpIHtcbiAgICAgICAgICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb25cIikuc3R5bGUudmlzaWJpbGl0eSA9IFwiXCI7XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnaW5hdGlvblwiKS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgIH0sXG5cblxuXG59KTtcblxuLyoqXG4gKiBJbml0IGZvciB0aGUgYmxvZyBwYWdlXG4gKi9cblByb2plY3RNYW5hZ2VyLmxvYWQoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0TWFuYWdlcjsiLCIvL3VwZGF0ZU5hdkJhcihcInJlc3VtZVwiKTtcblxuLy8gY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGdlbmVyYXRpbmcgcGFnaW5hdGlvblxuLy9jb25zdCBQYWdpbmF0b3IgPSByZXF1aXJlKFwiLi4vLi4vcGFnaW5hdGlvbi9zY3JpcHRzL3BhZ2luYXRpb25cIik7XG5jb25zdCBQZXJzb25hbEVUTCA9IHJlcXVpcmUoXCIuLi8uLi9zY3JpcHRzL3BlcnNvbmFsRVRMXCIpO1xuXG5jb25zdCBSZXN1bWVNYW5hZ2VyID0gT2JqZWN0LmNyZWF0ZShQZXJzb25hbEVUTCwge1xuICAgIFxuICAgIFwibG9hZFwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQuYWpheCh7dXJsOiBcImh0dHBzOi8vcGVyc29uYWwtc2l0ZS0zMTExZC5maXJlYmFzZWlvLmNvbS9yZXN1bWUuanNvblwifSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBcImRpc3BsYXlcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGpvYnNTZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bWUtam9ic1wiKTtcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYXJyYXkgb2Ygam9iIG9iamVjdHNcbiAgICAgICAgICAgIGxldCBqb2JzID0gdGhpcy5maWx0ZXJlZERhdGEuam9icztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgam9icy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFRPIERPIFRISVMgV0lMTCBOT1cgQ09OVEFJTiBPQkpFQ1RTXG4gICAgICAgICAgICAgICAgbGV0IGpvYiA9IGpvYnNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgcmVzdW1lQnVsbGV0cz1cIlwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYWNjb21wVHJhY2tlciA9IDA7IGFjY29tcFRyYWNrZXIgPCBqb2IuYWNjb21wbGlzaG1lbnRzLmxlbmd0aDsgYWNjb21wVHJhY2tlcisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VtZUJ1bGxldHMgKz0gXG4gICAgICAgICAgICAgICAgICAgIGA8bGkgY2xhc3M9XCJyZXN1bWVfX2FjY29tcGxpc2htZW50XCI+JHtqb2IuYWNjb21wbGlzaG1lbnRzW2FjY29tcFRyYWNrZXJdfTwvbGk+YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBqb2JzU2VjdGlvbi5pbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicHJvZmVzc2lvbmFsLWV4cGVyaWVuY2VcIj5cbiAgICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3M9XCJhcnRpY2xlLWhlYWRlciByZXN1bWVfX2hlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInJlc3VtZV9faGVhZGxpbmVcIj4ke2pvYi5oZWFkbGluZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicmVzdW1lX19kYXRlXCI+JHttb21lbnQoam9iLnN0YXJ0RGF0ZSkuZm9ybWF0KFwiWVlZWVwiKX0tJHttb21lbnQoam9iLmVuZERhdGUpLmZvcm1hdChcIllZWVlcIil9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7am9iLmNvbXBhbnlMb2dvSW1nfVwiXG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJyZXN1bWVfX2pvYi10aXRsZVwiPiR7am9iLnRpdGxlfTxoMz5cbiAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInJlc3VtZV9fam9iLWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgJHtyZXN1bWVCdWxsZXRzfVxuICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBcbiAgICBcImRpc3BsYXlPcHRpb25zXCI6IHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIFwiaXRlbXNQZXJQYWdlXCI6IDVcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3cml0YWJsZVwiOiB0cnVlXG4gICAgfSxcblxuICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5sZW5ndGggPj0zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQnlTZWFyY2hDcml0ZXJpYShcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9XG4gICAgXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bWVNYW5hZ2VyO1xuIiwiY29uc3QgbmF2YmFyID0gcmVxdWlyZShcIi4uL25hdmJhci9zY3JpcHRzL25hdmJhclwiKTtcbi8vY29uc3QgYmxvZ3MgPSByZXF1aXJlKFwiLi4vYmxvZy9zY3JpcHRzL2Jsb2ctY29udHJvbGxlclwiKTtcbmNvbnN0IEJsb2dNYW5hZ2VyPSByZXF1aXJlKFwiLi4vYmxvZy9zY3JpcHRzL2Jsb2dNYW5hZ2VyXCIpO1xuY29uc3QgUmVzdW1lTWFuYWdlcj0gcmVxdWlyZShcIi4uL3Jlc3VtZS9zY3JpcHRzL3Jlc3VtZVwiKTtcbmNvbnN0IFByb2plY3RNYW5hZ2VyID0gcmVxdWlyZShcIi4uL3Byb2plY3RzL3NjcmlwdHMvcHJvamVjdHNcIik7XG5jb25zdCBDb250YWN0TWFuYWdlciA9IHJlcXVpcmUoXCIuLi9jb250YWN0L3NjcmlwdHMvY29udGFjdFwiKTtcblxuXG5uYXZiYXIoXCJLcnlzIE1hdGhpc1wiKTtcbmNvbnNvbGUubG9nKFwiUHJvamVjdCBNYW5hZ2VyXCIsIFByb2plY3RNYW5hZ2VyKTtcbmNvbnNvbGUubG9nKFwiQmxvZ01hbmFnZXJcIiwgQmxvZ01hbmFnZXIpO1xuY29uc29sZS5sb2coXCJSZXN1bWVNYW5hZ2VyXCIsIFJlc3VtZU1hbmFnZXIpO1xuY29uc29sZS5sb2coXCJDb250YWN0TWFuYWdlclwiLCBDb250YWN0TWFuYWdlcik7XG5CbG9nTWFuYWdlci5sb2FkKCk7XG5SZXN1bWVNYW5hZ2VyLmxvYWQoKTtcbkNvbnRhY3RNYW5hZ2VyLmxvYWQoKTtcblxuIiwiY29uc3QgUGVyc29uYWxFVEwgPSBcbiAgICBPYmplY3QuY3JlYXRlKG51bGwse1xuICAgICAgICBcbiAgICAgICAgXCJsb2FkXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiBbXSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLy8gaW5pdGlhbGx5IHNldCB0aGUgZmlsdGVyZCBkYXRhID0gZGF0YVxuICAgICAgICBcImZpbHRlcmVkRGF0YVwiOiB7XG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdGhpcyBpcyBhIGZ1bmN0aW9uIGNyZWF0ZWQgYnkgdGhlIGNvbmNyZXRlIGltcGxlbWVudGF0aW9uXG4gICAgICAgIFwiZmlsdGVyQnlTZWFyY2hDcml0ZXJpYVwiOiB7XG4gICAgICAgICAgICB2YWx1ZToge30sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB0aGlzIG1heSBjaGFuZ2UgYXMgdGhlIGltcGxlbWVudGF0aW9uIGNoYW5nZXNcbiAgICAgICAgXCJmaWx0ZXJCeVRhZ1wiOiB7XG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbih0YWcpIHtcbiAgICAgICAgICAgIC8vIEdldCByZWNvcmRzIHdpdGggbWF0Y2hpbmcgdGFnc1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRSZWNvcmRzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnRhZ3MuZm9yRWFjaChjdXJyZW50VGFnID0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUYWcgPT09IHRhZykgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZFJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkRGF0YSA9IG1hdGNoZWRSZWNvcmRzO1xuICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHBhZ2luYXRpb25PYmogY29udGFpbnMgdGhlIG9iamVjdCB0aGF0IGNvbnRyb2xzIHRoZSBwYWdpbmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBcInBhZ2luYXRpb25PYmpcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRpc3BsYXkgcHJvcGVydHkgd2lsbCBjb250YWluIGEgZnVuY3Rpb24gdGhhdCBjb250cm9sc1xuICAgICAgICAgKiBIb3cgdGhlIG9iamVjdCBkaXNwbGF5cyBpdCdzIGRhdGFcbiAgICAgICAgICogVGhpcyBpcyBzcGVjaWZpYyB0byBob3cgdGhlIG9iamVjdCBpcyBhY3V0YWxseSBpbXBsZW1lbnRlZFxuICAgICAgICAgKi9cbiAgICAgICAgXCJkaXNwbGF5XCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIFwiZGlzcGxheU9wdGlvbnNcIjoge1xuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICBcIml0ZW1zUGVyUGFnZVwiOiA1LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbihzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmxlbmd0aCA+PTMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJCeVNlYXJjaENyaXRlcmlhKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcbiAgICBcbiAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XG4gICAgICAgICAgICAvLyB0YWtlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGZyb20gdGhlIHBhZ2luYXRpb24gb2JqZWN0XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgbnVtYmVyT2ZJdGVtcyA9IHRoaXMuZmlsdGVyZWREYXRhLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBudW1iZXJPZlBhZ2VzID0gTWF0aC5jZWlsKG51bWJlck9mSXRlbXMgLyB0aGlzLmRpc3BsYXlPcHRpb25zLml0ZW1zUGVyUGFnZSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5QYWdpbmF0b3IuaW5pdChudW1iZXJPZlBhZ2VzLDEpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KHRoaXMucGFnaW5hdGlvbk9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9kZXRlcm1pbmUgaG93IHRvIGhhbmRsZSB0aGUgcGFnaW5hdGlvbiBkaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChudW1iZXJPZlBhZ2VzID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdpbmF0aW9uXCIpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuICAgIFxuXG5cblxuXG4gICAgfSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQZXJzb25hbEVUTDsiXX0=
