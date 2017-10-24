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

// generate an unique id for each blog article
const blogIdGenerator = function* () {
    let id = 1;

    while (true) {
        yield id;
        id++;
    }
}

const blogIdFactory = blogIdGenerator();

const blogObjectFactory = function (headline, dateAdded, author, imgHeader, content, ...tags) {
    return Object.create({},{
        "id": {value: blogIdFactory.next().value, enumerable: true},
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


    const blogEntry20171006 = blogObjectFactory(
        "First Week at NSS",
        moment("2017-10-16").format("YYYY-MM-DD"),
        "Krys Mathis",
        "images/journeybegins.jpg",
        "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
        "footer", "html", "css"
    );

    const blogEntry2 = blogObjectFactory(
        "Second Blog Entry",
        moment("2017-10-07").format("YYYY-MM-DD"),
        "Krys Mathis",
        "images/journeybegins.jpg",
        "<p>Brocolli! Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
        "footer", "html", "css"
    );

    const blogEntry3 = blogObjectFactory(
        "3",
        moment("2017-10-08").format("YYYY-MM-DD"),
        "Krys Mathis",
        "images/journeybegins.jpg",
        "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
        "footer", "html", "css"
    );

    const blogEntry4 = blogObjectFactory(
        "4",
        moment("2017-10-09").format("YYYY-MM-DD"),
        "Krys Mathis",
        "images/journeybegins.jpg",
        "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
        "footer", "html", "css"
    );

    const blogEntry5 = blogObjectFactory(
        "5",
        moment("2017-10-10").format("YYYY-MM-DD"),
        "Krys Mathis",
        "images/journeybegins.jpg",
        "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
        "footer", "html", "css"
    );

    const blogEntry6 = blogObjectFactory(
        "6",
        moment("2017-10-11").format("YYYY-MM-DD"),
        "Krys Mathis",
        "images/journeybegins.jpg",
        "<p>Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same place, same skills. One more observation, seems to be a lot of memes and animated GIFs going on around here. Must mean we'll need a sense of humor to make it where we want to go.</p>",
        "footer", "html", "css"
    ); 


blogEntries = [];
blogEntries.push(blogEntry20171006);
blogEntries.push(blogEntry2);
blogEntries.push(blogEntry3);
blogEntries.push(blogEntry4);
blogEntries.push(blogEntry5);
blogEntries.push(blogEntry6);

// The blog object
let Blog = {
    // add the blog as a sorted object
    "blogEntries": blogEntries
}

// store the blog database in local storage
localStorage.setItem("blog", JSON.stringify(Blog));