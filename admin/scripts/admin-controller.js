console.log('connected...')

const getMaxBlogId = function() {

    /*
        1.  Capture the current blog database
        2.  Sort the blog entries held in the database descending
        3.  Capture the first entry of the sorted list and extract
            the id column. If it doesn't exist return a new object
            with an id of 0
    */
    const blog = JSON.parse(localStorage.getItem("blog")) || {};
    const sortedDescBlogs = blog.blogEntries.sort((previous,next)=> next.id-previous.id);
    return sortedDescBlogs[0].id || {id: 0}

}

const blogUIDGenerator = function* (start) {
    let i = 1;
    while(true){
        yield start + i;
        i++
    }
}

const blogUIDFactory = blogUIDGenerator(getMaxBlogId());

const blogObjectFactory = function (headline, dateAdded, author, imgHeader, content, ...tags) {
    return Object.create({},{
        "id": {value: blogUID.next().value, enumerable: true},
        "headline": {value: headline, enumerable: true},
        "dateAdded": {value: dateAdded, enumerable: true},
        "author": {value: dateAdded, enumerable: true},
        "imgHeader": {value: imgHeader, enumerable: true},
        "content": {value: content, enumerable: true},
        "tags": {value: tags, enumerable: true},
        "getDate": {value: function() {
            return moment(dateAdded).format("YYYY-MM-DD");
        }, enumerable: false}
    });
}