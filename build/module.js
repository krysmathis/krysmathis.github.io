(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f;}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e);},l,l.exports,e,t,n,r);}return n[o].exports;}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s;})({1:[function(require,module,exports){
    {

    // get the database from local storage, or empty object if null
        const blog = JSON.parse(localStorage.getItem("blog")) || {};

        // get the blog entries or empty object if null
        blog.blogEntries = blog.blogEntries || [];

        let editMode = false;
        let currentBlog = null;

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

        /*
        ===================================================
        Generate a list of the current blogs for editing
        The records will go into a table
        ===================================================
    */
        const listCurrentBlogs = () => {
            let html = "";
            blog.blogEntries
                .sort((a, b) => b.dateAdded - a.dateAdded)
                .forEach(entry => {
                    html += `
				<tr class="blogList__entry">
					<th class="blogList__headline">${entry.headline}</th>
					<td class="blogList__preview">${entry.content.substring(0,30).replace(/<(?:.|\n)*?>/gm, "")}</td>
					<td class="blogList__date">${entry.dateAdded}</td>
					<td class="blogList__button-row"><button class="blogList__btn-edit" data-blog-id="${entry.id}">Edit</button></td>
				</tr>
				`;
                });

            document.querySelector(".blogList__body").innerHTML = html;
        };

        // Init blog list
        listCurrentBlogs();

        const addUpdateBlogArticleToDb = function () {

            const tags = tagsEl.value.split(", ");

            if (editMode) {
            //get index
            // Find the index of the selected article
                const blogIndex = blog.blogEntries.findIndex(
                    a => a.id === currentBlog.id
                );

                blog.blogEntries[blogIndex] = blogObjectFactory(
                    headlineEl.value, //headline
                    dateEl.value,
                    authorEl.value, //author
                    imageEl.value, // imgheader
                    contentEl.value, //content
                    tags,
                    currentBlog.id
                );
                listCurrentBlogs();
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
                blog.blogEntries.unshift(newBlogArticle);
            }

            // regardless of edit mode push the changes to the database
            localStorage.setItem("blog", JSON.stringify(blog));


        };

        // store the current blog as the number
        const getCurrentBlog = (blogId) => {
            currentBlog = blog.blogEntries.find(function (_blog) {
                return _blog.id === parseInt(blogId);
            });
        };

        const populateBlogForm = () => {
            tagsEl.value = currentBlog.tags.join(", ");
            headlineEl.value = currentBlog.headline;
            authorEl.value = currentBlog.author;
            dateEl.value = currentBlog.dateAdded;
            imageEl.value = currentBlog.imgHeader;
            contentEl.value = currentBlog.content;
            setEditMode(true);
        };

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

        //---- EVENT LISTENERS ----- 

        document.querySelector(".blogForm__btnGoToBlog").addEventListener("click",  () => {
            window.location.href = "../blog/index.html";
        });

        // Click on the edit button
        document.querySelector(".blogList__body").addEventListener("click", e => {

            if (e.target.className === "blogList__btn-edit") {
                const blogId = e.target.dataset.blogId;
                getCurrentBlog(blogId);
                populateBlogForm();
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
                listCurrentBlogs();
            } else {
            // display errors, do not add blog
                showErrors(missingParts);
            }


        });

    } // end of castle wall
},{}],2:[function(require,module,exports){
// TODO: verify the database exists

    let currentBlogs = [];
    let itemsPerPage = 5;


    // function to return the blogs to show
    const getBlogs = function (searchCriteria) {

        const blogDB = JSON.parse(localStorage.getItem("blog")) || {};
        const blogEntries = blogDB.blogEntries || [];

        // sort in descending order
        const sortedBlogEntries = blogEntries.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
    
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
        
    };

    // Get blogs with matching tags
    const getBlogsMatchedTags = function(tag) {
        const allBlogs = getBlogs("");
        const matchedBlogPosts = [];
        allBlogs.forEach(blog => {
            blog.tags.forEach(currentTag =>{
                if (currentTag === tag) 
                    matchedBlogPosts.push(blog);
                return;
            });
        });
        return matchedBlogPosts;
    };

    // Update the current blogs based on the selected tag
    const filterByTag = e => {
        currentBlogs = getBlogsMatchedTags(e.target.innerHTML);
        writeBlogsEl(1);
        setInitialPagination();
    };

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
    
    };




    const writeBlogsEl = function (pageNumber) {
    
        const blogs = currentBlogs;

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
            (pageNumber - 1) * itemsPerPage,
            pageNumber * itemsPerPage
        );  
            
        blogsToDisplay.forEach(function (entry) {
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
                tag.addEventListener("click", filterByTag);
            });

            blogTags.appendChild(blogTagList);
            blogPost.appendChild(blogTags);


            // for loop for adding the tags
            blogsEl.appendChild(blogPost);
        });
    
    };



    // ---- EVENT LISTENER FOR PAGINATION ----
    document.querySelector(".pagination").addEventListener("click", function(e) {
    
        if (!isValidPagination(e)) {return;}
    
        // Update the blog posts
        const pageNumber = e.target.dataset.pageNum;
        writeBlogsEl(pageNumber);
        // Update the pagination to store the new page #'s
        updatePagination(e);

    });

    getBlogs(""); // returns all blogs
    writeBlogsEl(1); // writes the first page of blogs
    setInitialPagination(); // initiates the pagination div


// --- DEPRECATED BUT KEEPING AS A FALLBACK ---

// const writeBlogs = function (pageNumber) {
    
//         const blogs = currentBlogs;
    
//         const blogsEl = document.getElementById("blog-posts");
//         blogsEl.innerHTML = "";
    
//         // don't display pagination if there are no blogs
//         if (blogs.length < 1) {
//             blogsEl.innerHTML = "No blogs found...";
//             return;
//         }
    
//         // Only display the pages in the current page number
//         const blogsToDisplay = blogs.slice(
//             (pageNumber - 1) * itemsPerPage,
//             pageNumber * itemsPerPage
//         );  
            
//         blogsToDisplay.forEach(function (entry) {
//             let imageSrc = entry.imgHeader.startsWith("images") ? "../" + entry.imgHeader : entry.imgHeader;
//             let html = `
//                 <article class="blog__post">
//                     <div class="blog__header">
//                         <div class="blog__headline">${entry.headline}</div>
//                         <div class="blog__date">${moment(entry.dateAdded).format("YYYY-MM-DD")}</div>
//                     </div>
//                     <div class="blog__img-header">
//                         <img src="${imageSrc}">
//                     </div>
//                     <div class="blog__content">
//                         ${entry.content}
//                     </div>
                
//             `;
    
//             html += `<div class="blog__footer project-tag"><ul>`;
    
//             entry.tags.forEach((currentTag) => html += `<li>${currentTag}</li>`)
    
    
//             html += "</ul></div></article>";
//             blogsEl.innerHTML += html;
    
//         });
    
//     }
    
},{}],3:[function(require,module,exports){
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

    const blog = JSON.parse(localStorage.getItem("blog")) || {};
    const blogEntriesToCheck = blog.blogEntries || [];

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


    /* 
Check if the database exists already and that it has the same id #'s as
the ones here
*/
    let generateDatabase = false;
    if (blogEntriesToCheck.length === 0 || maxBlogId < blogEntriesToCheck.length) {
        generateDatabase = true;
    }

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
            "id": {value: id || currentId, enumerable: true},
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

    /*
        Only populate or re-populate local storage if the database does not exist
        the check is set higher up in the code
    */

    function populateBlogDB() {

        const blogEntry20171006 = blogObjectFactory(
            "First Week at NSS",
            moment("2017-10-16").format("YYYY-MM-DD"),
            "Krys Mathis",
            "images/journeybegins.jpg",
            "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
            ["footer", "html", "css"]
        );

        const blogEntry2 = blogObjectFactory(
            "Inside the Grid",
            moment("2017-10-27").format("YYYY-MM-DD"),
            "Krys Mathis",
            "images/grid.png",
            "<p>Spent some time experimenting with the css grid over the weekend. My hope is that it will make laying out webpages simpler. So far it's been a big time sink with rather frustrating results.</p><p>You can see the results here: <a href='https://github.com/krysmathis/experiments/tree/master/grid-transforms'>link</a>",
            ["css"]
        );

        const blogEntry3 = blogObjectFactory(
            "3",
            moment("2017-10-08").format("YYYY-MM-DD"),
            "Krys Mathis",
            "images/journeybegins.jpg",
            "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
            ["footer", "html", "css"]
        );

        const blogEntry4 = blogObjectFactory(
            "4",
            moment("2017-10-09").format("YYYY-MM-DD"),
            "Krys Mathis",
            "images/journeybegins.jpg",
            "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
            ["footer", "html", "css"]
        );

        const blogEntry5 = blogObjectFactory(
            "5",
            moment("2017-10-10").format("YYYY-MM-DD"),
            "Krys Mathis",
            "images/journeybegins.jpg",
            "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
            ["footer", "html", "css"]
        );

        const blogEntry6 = blogObjectFactory(
            "6",
            moment("2017-10-11").format("YYYY-MM-DD"),
            "Krys Mathis",
            "images/journeybegins.jpg",
            "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
            ["footer", "html", "css"]
        ); 

        // add the blog articles to the blog entry array (for sorting)

        let blogEntries = [];
        blogEntries.unshift(blogEntry20171006);
        blogEntries.unshift(blogEntry2);
        blogEntries.unshift(blogEntry3);
        blogEntries.unshift(blogEntry4);
        blogEntries.unshift(blogEntry5);
        blogEntries.unshift(blogEntry6);

        // The blog object
        let Blog = {
        // add the blog as a sorted object
            "blogEntries": blogEntries
        };

        localStorage.setItem("blog", JSON.stringify(Blog));
    }
    
    
    if (generateDatabase) {
        populateBlogDB();
    }




},{}],4:[function(require,module,exports){
// 1. In HTML, create a section with an id=displayer and a section to hold the pagination id=paginator
// 2. In pagination.js:
// 2.0 Pull in the database and check how many articles are there
// 2.1 Establish the constraints and calcs for the pagination
// 2.2 Programically generate the pagination section
// 2.2.1 Assign the < and > elements with unique classes, we'll store the current
//       page inside the class as 'page-#'
// 2.2.2 Loop through the number of pages and write a span or li for each one with the
//       class of "blog-page-link"
// 2.2.3 Update the innerHTML
// 2.2.4 Capture the new <  and > elements in a variable (we'll use it later)
// 2.3  Function for update page that takes an event, the user will click on the span or li
//      to update the page
// 2.3.1 Clear the innerHTML of the "displayer"
// 2.3.2 which page are we on? get PAGENUMBER here we're going to loop through the classList 
//          and find a class that starts with page-
// 2.3.3 update the arrows with the current page and control the formatting
// 2.3.4 determine which items to display by slicing the array based on PAGENUMBER -1 * 2
// 2.3.5 Update the page html from the array
// 2.4  Programmically assign event listeners on the spans to check when they are clicked
//      and send that to the function is 2.3
//      2.4.1 add event listeners to the <  and > buttons seperately
// 2.5  Programically launch the first page using a fake event (variable that has the 
//       necessary elements)



},{}],5:[function(require,module,exports){
// event listener for the search bar
    const initiateSearch = function(searchString) {
        if (searchString.length >=3) {
            getBlogs(searchString);
            writeBlogsEl(1);
            setInitialPagination();
        } else {
            getBlogs(searchString);
            writeBlogsEl(1);
            setInitialPagination();
        }
    };

    const searchInput = document.querySelector(".blog__search-input");

    // clear the box when the form has the focus
    searchInput.addEventListener("focus", () => {
        searchInput.value = "";
    });

    searchInput.addEventListener("keyup", function(event) {
        let searchString = event.target.value.toLowerCase();
        initiateSearch(searchString);
    });

    document.querySelector(".blog__bnt-clear").addEventListener("click", ()=> {
        searchInput.value = "";
        initiateSearch("");
    });
},{}],6:[function(require,module,exports){
// update navbar
    updateNavBar("blog");

},{}]},{},[1,2,3,4,5,6]);
