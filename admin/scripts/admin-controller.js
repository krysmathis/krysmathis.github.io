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