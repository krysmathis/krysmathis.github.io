const Blogger = require("./blogger");

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

const blogEntriesToCheck = Blogger.data || [];

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

module.exports = blogObjectFactory;




