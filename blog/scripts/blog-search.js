// event listener for the search bar
const initiateSearch = function(searchString) {
    if (searchString.length >=3) {
        getBlogs(searchString);
        writeBlogsEl(1);
        setInitialPagination()
    } else {
        getBlogs(searchString)
        writeBlogsEl(1);
        setInitialPagination()
    }
}

const searchInput = document.querySelector(".blog__search-input");

// clear the box when the form has the focus
searchInput.addEventListener("focus", function(event) {
    searchInput.value = "";
});

searchInput.addEventListener("keyup", function(event) {
    let searchString = event.target.value.toLowerCase();
    initiateSearch(searchString);
})

document.querySelector(".blog__bnt-clear").addEventListener("click", e => {
    searchInput.value = "";
    initiateSearch("");
})