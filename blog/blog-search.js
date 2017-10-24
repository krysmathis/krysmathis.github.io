// event listener for the search bar

const searchInput = document.querySelector("#blog-search-container input");

searchInput.addEventListener("focus", function() {
    searchInput.value = "";
});