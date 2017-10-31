// event listener for the search bar

const searchInput = document.querySelector("#blog-search-container input");

// clear the box when the form has the focus
searchInput.addEventListener("focus", function(event) {
    searchInput.value = "";
});

searchInput.addEventListener("keyup", function(event) {
    let searchString = event.target.value.toLowerCase();
    if (searchString.length >=3) {
        getBlogs(searchString);
        writeBlogs(1);
        setInitialPagination()
    } else {
        getBlogs(searchString)
        writeBlogs(1);
        setInitialPagination()
    }
})