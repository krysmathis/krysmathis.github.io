const {showSuccess, showErrors, getMissingParts} = require("../../admin/scripts/admin-blog-form-validation");
const blogObjectFactory = require("./blog-factory");
const updateAdmin = require("../../admin/scripts/admin-controller");

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
const getCurrentBlog = (blogId,blogManager) => {
    currentBlog = {"id": blogId, "detail": blogManager.data[blogId]};
    console.log("current blog", currentBlog);
};

const addUpdateBlogArticleToDb = function (blogManager) {
    
    const tags = tagsEl.value.split(", ");
    
    if (editMode) {
        //get index
        // Find the index of the selected article
        const pid = currentBlog.detail.id;
    
        const updateBlogArticle = blogObjectFactory(
            headlineEl.value, //headline
            dateEl.value,
            authorEl.value, //author
            imageEl.value, // imgheader
            contentEl.value, //content
            tags,
            currentBlog.id
        );
        blogManager.update(pid,updateBlogArticle).then(() =>{
            blogManager.load().then(() => {
                updateAdmin(blogManager.data);
            });
        });
        
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
        blogManager.add(newBlogArticle).then(() =>{
            blogManager.load().then(() => {
                updateAdmin(blogManager.data);
            });
        });
    }

    

    headlineEl.value = ""; //headline
    dateEl.value = "";
    authorEl.value = ""; //author
    imageEl.value = ""; // imgheader
    contentEl.value = ""; //content
    tagsEl.value = "";


};

const adminEventListeners = (blogManager) => {

    document.querySelector(".blogForm__btnGoToBlog").addEventListener("click",  () => {
        window.location.href = "../blog/index.html";
    });
        
    // Click on the edit button
    document.querySelector(".blogList").addEventListener("click", e => {
            
        if (e.target.classList.contains("blogList__btn-edit")) {
            const blogId = e.target.dataset.blogId;
            getCurrentBlog(blogId,blogManager);
            // populate the blog form
            tagsEl.value = currentBlog.detail.tags.join(", ");
            headlineEl.value = currentBlog.detail.headline;
            authorEl.value = currentBlog.detail.author;
            dateEl.value = currentBlog.detail.dateAdded;
            imageEl.value = currentBlog.detail.imgHeader;
            contentEl.value = currentBlog.detail.content;
            setEditMode(true);
        }
            
        if (e.target.classList  .contains("blogList__btn-delete")) {
            const blogId = e.target.dataset.blogId;
            blogManager.delete(blogId).then(() => {
                blogManager.load().then(() => {
                    updateAdmin(blogManager.data);
                });
            });
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
            addUpdateBlogArticleToDb(blogManager);
            showSuccess();
        } else {
            // display errors, do not add blog
            showErrors(missingParts);
        }
            
            
    });
};

module.exports = adminEventListeners;
    

