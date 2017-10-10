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

const blogEntry20171006 = {
    "headline": "First Week at NSS",
    "dateAdded": new Date("2017-10-06"),
    "author": "Krys Mathis",
    "tags": ["footer","html"],
    "imgHeader": "http://media2.giphy.com/media/jrC5zowLdpw5y/giphy.gif",
    "content": "Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same goal.  Seems to be a lot of memes and animated GIFs going on around. Must mean we'll need a sense of humor to",
};

let blogEntries = [];
blogEntries.push(blogEntry20171006);

let Blog = {
    "blogEntries": blogEntries
}

localStorage.setItem("blog", JSON.stringify(Blog));

const blogDB = localStorage.getItem("blog");

for (let key in blogDB) {
    const currentKey = blogDB[key];
}
