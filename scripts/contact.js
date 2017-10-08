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
    "service-name": "email",
    "handle": "krysmathis",
    "url": "mailto:krysmathis@gmail.com",
    "icon": "images/email.png",
    "icon-alt": "email icon"
};

const linkedIn = {
    "service-name": "LinkedIn" ,
    "handle": "krysmathis",
    "url": "https://www.linkedin.com/in/krysmathis/",
    "icon": "images/linkedin.png", 
    "icon-alt": "linkedin"
};

const twitter = {
    "service-name": "Twitter" ,
    "handle": "coldbuckets",
    "url": "https://twitter.com/coldbuckets",
    "icon": "images/twitter.png",
    "icon-alt": "twitter bird"
};


let contactMethods = [];
contactMethods.push(email,twitter,linkedIn);

let Contact = {
    "method": contactMethods
}


localStorage.setItem("contact", JSON.stringify(Contact));

