// event listener for the search bar
const createSearchBarListeners = (function(projects) {

    const searchInput = document.querySelector(".searchBar__input");

    // remove any existing event listeners
    const clearSearchInput = () => searchInput.value = "";
    
    const executeSearch = () => {
        let searchString = event.target.value.toLowerCase();
        
        // three of more characters to account for words like CSS
        if (searchString.length >=3) {
            // function on project controller to update projects
            projects.filterBySearchCriteria(searchString);
        } else {
            // same function but with no value entered
            // test this with no input
            projects.filterBySearchCriteria("");
        }
    };

    try {
        searchInput.removeEventListener("keyup", executeSearch);
        searchInput.removeEventListener("focus", clearSearchInput);
    } catch (err) {
        console.warn("event listeners removal ERR = ",err);
    }

    searchInput.addEventListener("focus", clearSearchInput);
    searchInput.addEventListener("keyup", executeSearch);

});

module.exports = createSearchBarListeners;