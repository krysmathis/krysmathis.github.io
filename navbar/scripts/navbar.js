// get the nav item as the parent add a ul
// then create li's for each link and adding child text fields for each one

// add eventlistener to toggle the selected class

const populateNavBar = (function(brand){

    const navs = new Map();

    /**
    *   The map will hold the labels and links for the navbar
    **/
    navs.set("Home", {"label": "Home", "link": "../index.html"}),
    navs.set("Projects", {"label": "Projects", "link": "../projects"}),
    navs.set("Blog", {"label": "Blog", "link": "../blog"}),
    navs.set("Resume", {"label": "Resume", "link": "../resume"}),
    navs.set("Contact", {"label": "Contact", "link": "../contact"})

    // For testing purposes:
    // navs.set("Home", {"label": "Home", "link": "#"}),
    // navs.set("Projects", {"label": "Projects", "link": "#"}),
    // navs.set("Blog", {"label": "Blog", "link": "#"}),
    // navs.set("Contact", {"label": "Contacts", "link": "#"}),
    // navs.set("Resume", {"label": "Resume", "link": "#"})
    
    
    const navBar = document.querySelector(".nav");
    // create the ul element to stick inside the nav
    const newList = document.createElement("ul");
    newList.className = "nav__list";
    
    const newBrandLi = document.createElement("li");
    newBrandLi.className = "nav__brand";
    
    const brandText = document.createTextNode(brand);
    newBrandLi.appendChild(brandText);
    newList.appendChild(newBrandLi);
    newBrandLi.addEventListener("click", () => {
        document.location.href = navs.get("Home").link;
    });

    navs.forEach(
        nav => {
            // create a new list element
            let newNavItem = document.createElement("li");
            newNavItem.className = "nav__link";

            let newNavItemLabel = document.createTextNode(nav.label);
            newNavItem.appendChild(newNavItemLabel);
        
            newNavItem.addEventListener("click",() => {
                document.location.href = nav.link;
            });

            newList.appendChild(newNavItem);

        }
    );
    navBar.appendChild(newList);
    
})("Krys Mathis");

// this is the external function
const updateNavBar = function(pageName) {
    document.querySelectorAll(".nav__link").forEach(
        nav=> {
            nav.textContent.toLowerCase() == pageName.toLowerCase() ? nav.className = "nav__link--selected" : nav.className = "nav__link";
        }
    );
};