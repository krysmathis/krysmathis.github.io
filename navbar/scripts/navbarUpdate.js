// this is the external function
const updateNavBar = function(pageName) {
    document.querySelectorAll(".nav__link").forEach(
        nav=> {
            nav.textContent.toLowerCase() == pageName.toLowerCase() ? nav.className = "nav__link--selected" : nav.className = "nav__link";
        }
    );
};

module.exports = updateNavBar;