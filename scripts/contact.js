/* template
const social-media-type = {
    "service-name": ,
    "handle": ,
    "url": ,
    "icon": ,
    "icon-alt"
}
*/

const email = {
    "service-name": "Email",
    "handle": "krysmathis",
    "url": "mailto:krysmathis@test.com",
    "icon": "./images/email.png",
    "iconAlt": "email icon"
};

const github = {
    "service-name": "GitHub",
    "handle": "krysmathis",
    "url": "https://github.com/krysmathis",
    "icon": "./images/github.png",
    "iconAlt": "github icon"
};

const linkedIn = {
    "service-name": "LinkedIn" ,
    "handle": "krysmathis",
    "url": "https://www.linkedin.com/in/krysmathis/",
    "icon": "./images/linkedin.png", 
    "iconAlt": "linkedin"
};

const twitter = {
    "service-name": "Twitter" ,
    "handle": "coldbuckets",
    "url": "https://twitter.com/coldbuckets",
    "icon": "./images/twitter.png",
    "iconAlt": "twitter bird"
};


let contactMethods = [];
contactMethods.push(github,twitter,linkedIn, email);

let Contact = {
    "method": contactMethods
}


localStorage.setItem("contact", JSON.stringify(Contact));

// --- get items from local storage and adjust page
const contactsDB = JSON.parse(localStorage.getItem("contact"));

const socialLinks = document.getElementById("social-links");

for(let key in contactsDB){
    let currentKey = contactsDB[key];

    for (var i = 0; i < currentKey.length; i++) {
        var contactType = currentKey[i];
        
        socialLinks.innerHTML += 
        `
            <div><a href="${contactType.url}"><img src="${contactType.icon}" alt="${contactType.iconAlt}" class="social-img"></a></div>
        `

    }

}

