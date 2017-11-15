(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const populateNavBar = (function(brand){
    
    const navs = new Map();
    
    /**
        *   The map will hold the labels and links for the navbar
        **/
    // For testing purposes:
    navs.set("Home", {"label": "Home", "link": "../index.html"}),
    navs.set("Projects", {"label": "Projects", "link": "../projects"}),
    navs.set("Blog", {"label": "Blog", "link": "../blog"}),
    navs.set("Resume", {"label": "Resume", "link": "../resume"}),
    navs.set("Contact", {"label": "Contact", "link": "../contact"});
    
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
    
    /**
         * Building the dropdown menu
         */
    const hamburgerMenu = document.createElement("div");
    hamburgerMenu.className = "menu-col";
    for (let i = 0; i < 3; i++) {
        let newMenuBar = document.createElement("div");
        newMenuBar.className = "menu-col__bar";
        hamburgerMenu.appendChild(newMenuBar);
    }
    newList.appendChild(hamburgerMenu);
    
    const menu = document.createElement("div");
    menu.className = "menu-list";
    const menuList = document.createElement("ul");
    menuList.className = "menu-list__list";
    menu.appendChild(menuList);
    
    navs.forEach(
        nav => {
            let menuItem = document.createElement("li");
            menuItem.innerHTML = `${nav.label}`;
            menuItem.className = "menu-list__item";
            menuList.appendChild(menuItem);
            menuItem.addEventListener("click",() => {
                document.location.href = nav.link;
            });
        }
    );
    
    navBar.appendChild(menu);
    
});

/**
    * Hamburger Menu
    * That will look like something interesting
    */
const addNavbarMenuEventListeners = function() {
    const menu = document.querySelector(".menu-list"); 
    document.querySelector(".menu-col").addEventListener("click", ()=>{
        
        const displayStyle = menu.style.display;
        if (displayStyle === "none" || displayStyle === "") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });
        
    document.querySelector(".menu-list").addEventListener("click", ()=>{
            
        const displayStyle = menu.style.display;
        if (displayStyle === "none" || displayStyle === "") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });
        
    /**
         * If the user resizes the window the drop down menu will disappear
         */
    window.addEventListener("resize", () => {
        menu.style.display = "none";
    });
};

module.exports = function populateNavComponents(brand) {
    populateNavBar(brand);
    addNavbarMenuEventListeners();
};


},{}],2:[function(require,module,exports){
const navbar = require("../navbar/scripts/navbar");
navbar("Krys Mathis");
},{"../navbar/scripts/navbar":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJuYXZiYXIvc2NyaXB0cy9uYXZiYXIuanMiLCJzY3JpcHRzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgcG9wdWxhdGVOYXZCYXIgPSAoZnVuY3Rpb24oYnJhbmQpe1xuICAgIFxuICAgIGNvbnN0IG5hdnMgPSBuZXcgTWFwKCk7XG4gICAgXG4gICAgLyoqXG4gICAgICAgICogICBUaGUgbWFwIHdpbGwgaG9sZCB0aGUgbGFiZWxzIGFuZCBsaW5rcyBmb3IgdGhlIG5hdmJhclxuICAgICAgICAqKi9cbiAgICAvLyBGb3IgdGVzdGluZyBwdXJwb3NlczpcbiAgICBuYXZzLnNldChcIkhvbWVcIiwge1wibGFiZWxcIjogXCJIb21lXCIsIFwibGlua1wiOiBcIi4uL2luZGV4Lmh0bWxcIn0pLFxuICAgIG5hdnMuc2V0KFwiUHJvamVjdHNcIiwge1wibGFiZWxcIjogXCJQcm9qZWN0c1wiLCBcImxpbmtcIjogXCIuLi9wcm9qZWN0c1wifSksXG4gICAgbmF2cy5zZXQoXCJCbG9nXCIsIHtcImxhYmVsXCI6IFwiQmxvZ1wiLCBcImxpbmtcIjogXCIuLi9ibG9nXCJ9KSxcbiAgICBuYXZzLnNldChcIlJlc3VtZVwiLCB7XCJsYWJlbFwiOiBcIlJlc3VtZVwiLCBcImxpbmtcIjogXCIuLi9yZXN1bWVcIn0pLFxuICAgIG5hdnMuc2V0KFwiQ29udGFjdFwiLCB7XCJsYWJlbFwiOiBcIkNvbnRhY3RcIiwgXCJsaW5rXCI6IFwiLi4vY29udGFjdFwifSk7XG4gICAgXG4gICAgY29uc3QgbmF2QmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5uYXZcIik7XG4gICAgLy8gY3JlYXRlIHRoZSB1bCBlbGVtZW50IHRvIHN0aWNrIGluc2lkZSB0aGUgbmF2XG4gICAgY29uc3QgbmV3TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICBuZXdMaXN0LmNsYXNzTmFtZSA9IFwibmF2X19saXN0XCI7XG4gICAgICAgIFxuICAgIGNvbnN0IG5ld0JyYW5kTGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgbmV3QnJhbmRMaS5jbGFzc05hbWUgPSBcIm5hdl9fYnJhbmRcIjtcbiAgICAgICAgXG4gICAgY29uc3QgYnJhbmRUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYnJhbmQpO1xuICAgIG5ld0JyYW5kTGkuYXBwZW5kQ2hpbGQoYnJhbmRUZXh0KTtcbiAgICBuZXdMaXN0LmFwcGVuZENoaWxkKG5ld0JyYW5kTGkpO1xuICAgICAgICBcbiAgICBuZXdCcmFuZExpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBuYXZzLmdldChcIkhvbWVcIikubGluaztcbiAgICB9KTtcbiAgICBcbiAgICBuYXZzLmZvckVhY2goXG4gICAgICAgIG5hdiA9PiB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgbGlzdCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgbmV3TmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIG5ld05hdkl0ZW0uY2xhc3NOYW1lID0gXCJuYXZfX2xpbmtcIjtcbiAgICBcbiAgICAgICAgICAgIGxldCBuZXdOYXZJdGVtTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShuYXYubGFiZWwpO1xuICAgICAgICAgICAgbmV3TmF2SXRlbS5hcHBlbmRDaGlsZChuZXdOYXZJdGVtTGFiZWwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBuZXdOYXZJdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gbmF2Lmxpbms7XG4gICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgIG5ld0xpc3QuYXBwZW5kQ2hpbGQobmV3TmF2SXRlbSk7XG4gICAgXG4gICAgICAgIH1cbiAgICApO1xuICAgIG5hdkJhci5hcHBlbmRDaGlsZChuZXdMaXN0KTtcbiAgICBcbiAgICAvKipcbiAgICAgICAgICogQnVpbGRpbmcgdGhlIGRyb3Bkb3duIG1lbnVcbiAgICAgICAgICovXG4gICAgY29uc3QgaGFtYnVyZ2VyTWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgaGFtYnVyZ2VyTWVudS5jbGFzc05hbWUgPSBcIm1lbnUtY29sXCI7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgbGV0IG5ld01lbnVCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBuZXdNZW51QmFyLmNsYXNzTmFtZSA9IFwibWVudS1jb2xfX2JhclwiO1xuICAgICAgICBoYW1idXJnZXJNZW51LmFwcGVuZENoaWxkKG5ld01lbnVCYXIpO1xuICAgIH1cbiAgICBuZXdMaXN0LmFwcGVuZENoaWxkKGhhbWJ1cmdlck1lbnUpO1xuICAgIFxuICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG1lbnUuY2xhc3NOYW1lID0gXCJtZW51LWxpc3RcIjtcbiAgICBjb25zdCBtZW51TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICBtZW51TGlzdC5jbGFzc05hbWUgPSBcIm1lbnUtbGlzdF9fbGlzdFwiO1xuICAgIG1lbnUuYXBwZW5kQ2hpbGQobWVudUxpc3QpO1xuICAgIFxuICAgIG5hdnMuZm9yRWFjaChcbiAgICAgICAgbmF2ID0+IHtcbiAgICAgICAgICAgIGxldCBtZW51SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIG1lbnVJdGVtLmlubmVySFRNTCA9IGAke25hdi5sYWJlbH1gO1xuICAgICAgICAgICAgbWVudUl0ZW0uY2xhc3NOYW1lID0gXCJtZW51LWxpc3RfX2l0ZW1cIjtcbiAgICAgICAgICAgIG1lbnVMaXN0LmFwcGVuZENoaWxkKG1lbnVJdGVtKTtcbiAgICAgICAgICAgIG1lbnVJdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gbmF2Lmxpbms7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgXG4gICAgbmF2QmFyLmFwcGVuZENoaWxkKG1lbnUpO1xuICAgIFxufSk7XG5cbi8qKlxuICAgICogSGFtYnVyZ2VyIE1lbnVcbiAgICAqIFRoYXQgd2lsbCBsb29rIGxpa2Ugc29tZXRoaW5nIGludGVyZXN0aW5nXG4gICAgKi9cbmNvbnN0IGFkZE5hdmJhck1lbnVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtbGlzdFwiKTsgXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWNvbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRpc3BsYXlTdHlsZSA9IG1lbnUuc3R5bGUuZGlzcGxheTtcbiAgICAgICAgaWYgKGRpc3BsYXlTdHlsZSA9PT0gXCJub25lXCIgfHwgZGlzcGxheVN0eWxlID09PSBcIlwiKSB7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICAgICBcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtbGlzdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PntcbiAgICAgICAgICAgIFxuICAgICAgICBjb25zdCBkaXNwbGF5U3R5bGUgPSBtZW51LnN0eWxlLmRpc3BsYXk7XG4gICAgICAgIGlmIChkaXNwbGF5U3R5bGUgPT09IFwibm9uZVwiIHx8IGRpc3BsYXlTdHlsZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAgICAgXG4gICAgLyoqXG4gICAgICAgICAqIElmIHRoZSB1c2VyIHJlc2l6ZXMgdGhlIHdpbmRvdyB0aGUgZHJvcCBkb3duIG1lbnUgd2lsbCBkaXNhcHBlYXJcbiAgICAgICAgICovXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuICAgICAgICBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcG9wdWxhdGVOYXZDb21wb25lbnRzKGJyYW5kKSB7XG4gICAgcG9wdWxhdGVOYXZCYXIoYnJhbmQpO1xuICAgIGFkZE5hdmJhck1lbnVFdmVudExpc3RlbmVycygpO1xufTtcblxuIiwiY29uc3QgbmF2YmFyID0gcmVxdWlyZShcIi4uL25hdmJhci9zY3JpcHRzL25hdmJhclwiKTtcbm5hdmJhcihcIktyeXMgTWF0aGlzXCIpOyJdfQ==
