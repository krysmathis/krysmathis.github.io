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
        
}

// Get blogs with matching tags
const getBlogsMatchedTags = function(tag) {
    const allBlogs = getBlogs("");
    const matchedBlogPosts = [];
    allBlogs.forEach(blog => {
        blog.tags.forEach(currentTag =>{
            if (currentTag === tag) 
                matchedBlogPosts.push(blog);
                return;
        })
    })
    return matchedBlogPosts;
}

// Update the current blogs based on the selected tag
const filterByTag = e => {
    currentBlogs = getBlogsMatchedTags(e.target.innerHTML)
    console.log("currentBlgos", currentBlogs);
    writeBlogsEl(1);
    setInitialPagination();
}

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
    
}




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
            let blogPost = document.createElement('article');
            blogPost.className = "blog__post"

            let blogHeader = document.createElement('div');
            blogHeader.className = "blog__header"

                let blogHeadline = document.createElement('div');
                blogHeadline.className = "blog__headline"
                let blogHeadlineText = document.createTextNode(entry.headline);
                blogHeadline.appendChild(blogHeadlineText);

                let blogDate = document.createElement('div');
                blogDate.className = "blog__date";
                let blogDateText = document.createTextNode(moment(entry.dateAdded).format("YYYY-MM-DD"));
                blogDate.appendChild(blogDateText);

                // append to the blogHeader div
                blogHeader.appendChild(blogHeadline);
                blogHeader.appendChild(blogDate);
                
                // append to main div
                blogPost.appendChild(blogHeader);
            
            // Img div
            let blogImgContainer = document.createElement('div');
            blogImgContainer.className = "blog__img-header";
            // Image
            let blogImg = document.createElement('img');
            blogImg.src = imageSrc;
            blogImgContainer.appendChild(blogImg);
            blogPost.appendChild(blogImgContainer);

            // Content
            let blogContent = document.createElement('div');
            blogContent.className = "blog__content";
            blogContent.innerHTML = entry.content;
            blogPost.appendChild(blogContent);

            // Tags Container
            let blogTags = document.createElement('div');
            blogTags.className = "blog__footer project-tag"
            let blogTagList = document.createElement('ul');
            
            // do the tags
            entry.tags.forEach(currentTag => 
            {
                let tag = document.createElement('li');
                tag.className = "blog__tag";
                tag.appendChild(document.createTextNode(currentTag))
                blogTagList.appendChild(tag);
                
                // add event listener for on click
                tag.addEventListener("click", filterByTag)
            })

            blogTags.appendChild(blogTagList);
            blogPost.appendChild(blogTags);


            // for loop for adding the tags
            blogsEl.appendChild(blogPost);
        });
    
    }



// ---- EVENT LISTENER FOR PAGINATION ----
document.querySelector('.pagination').addEventListener("click", function(e) {
    
    if (!isValidPagination(e)) {return}
    
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
    