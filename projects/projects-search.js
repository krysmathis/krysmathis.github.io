// event listener for the search bar


const createSearchBarListeners = (function() {

    const searchInput = document.querySelector(".searchBar__input");

    searchInput.addEventListener("focus", function(event) {
        searchInput.value = "";
    });

    searchInput.addEventListener("keyup", function(event) {
        
        let searchString = event.target.value.toLowerCase();
        
        if (searchString.length >=3) {
            // function on project controller to update projects
            updateProjectsInDOM(searchString);
        } else {
            // same function but with no value entered
            // test this with no input
            updateProjectsInDOM("");
        }

    })  

})();