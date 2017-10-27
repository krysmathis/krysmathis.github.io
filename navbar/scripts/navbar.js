console.log('connected...')

// get the nav item as the parent add a ul
// then create li's for each link and adding child text fields for each one

// add eventlistener to toggle the selected class

const pageName = document.querySelector("[class^='page__']").className.split("__")[1]


const populateNavBar = (function(){

    const navs = new Map();

    navs.set("Home", {"label": "Home", "link": "../index.html"}),
    navs.set("Projects", {"label": "Projects", "link": "../projects"}),
    navs.set("Blog", {"label": "Blog", "link": "../blog"}),
    navs.set("Contact", {"label": "Contact", "link": "../contact"}),
    navs.set("Resume", {"label": "Resume", "link": "../resume"})

    // navs.set("Home", {"label": "Home", "link": "#"}),
    // navs.set("Projects", {"label": "Projects", "link": "#"}),
    // navs.set("Blog", {"label": "Blog", "link": "#"}),
    // navs.set("Contact", {"label": "Contacts", "link": "#"}),
    // navs.set("Resume", {"label": "Resume", "link": "#"})
    
    
    const navBar = document.querySelector(".nav");
    // create the ul element to stick inside the nav
    const newList = document.createElement("ul");
    newList.className = "nav__list"
    
    const newBrandLi = document.createElement("li");
    newBrandLi.className = "nav__brand";
    
    const brandText = document.createTextNode("Krys Mathis");
    newBrandLi.appendChild(brandText)
    newList.appendChild(newBrandLi);

    navs.forEach(
        nav => {
            // create a new list element
            let newNavItem = document.createElement("li")
            let classAssignment = window.location.pathname.includes(nav.link.split("/")[1].toLowerCase()) ? "nav__link--selected" : "nav__link";
            newNavItem.className = classAssignment;

            let newNavItemLabel = document.createTextNode(nav.label);
            newNavItem.appendChild(newNavItemLabel);
        
            newNavItem.addEventListener("click",function(e) {
                document.location.href = nav.link;
            })

            newList.appendChild(newNavItem);

            
        }
    )
    navBar.appendChild(newList);
    
})()

