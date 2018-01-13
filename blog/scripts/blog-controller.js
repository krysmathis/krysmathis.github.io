const blogDisplayer = function(config) {
    
    return Object.create(null, {

        "displayBlogs": {

            value: function (pageNumber) {

            // sort the data
                // const unsortedBlogs = [];
                // for (let key in this.filteredData) {
                //     let currentBlog = this.filteredData[key];
                //     unsortedBlogs.push(currentBlog);
                // }
                const blogs = this.filteredData.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));

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
                    (pageNumber - 1) * config.displayOptions.itemsPerPage,
                    pageNumber * config.displayOptions.itemsPerPage
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

            },
            enumerable: true
        }
    });
};

module.exports = blogDisplayer;