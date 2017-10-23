/* template
const social-media-type = {
    "service-name": ,
    "handle": ,
    "url": ,
    "icon": ,
    "icon-alt"
}
*/

const contactIdGenerator = function* () {
    let i = 0;
    while(true) {
        yield i;
        i++;
    }
}

let contactIdFactory = contactIdGenerator();

const contact = function(serviceName, handle, url, icon, iconAlt) {
    return Object.create({},{
        "contactId": {value: contactIdFactory.next().value, enumerable: true},
        "service": {value: serviceName, enumerable: true},
        "handle": {value: handle, enumerable: true},
        "url": {value: url, enumerable: true},
        "icon": {value: icon, enumerable: true},
        "iconAlt": {value: iconAlt, enumerable: true},
        getService: {value: function(){
            return this.contactId;
        }, enumerable: true}
    });
};

const email = contact("Email", "krysmathis", "mailto:krysmathis@test.com","./images/email.png", "email icon" );

console.log("email service: ", email.getService());

const github = {
    "service": "GitHub",
    "handle": "krysmathis",
    "url": "https://www.github.com/krysmathis",
    "icon": "./images/github.png",
    "iconAlt": "email icon"
};

const linkedIn = {
    "service": "LinkedIn" ,
    "handle": "krysmathis",
    "url": "https://www.linkedin.com/in/krysmathis/",
    "icon": "./images/linkedin.png", 
    "iconAlt": "linkedin"
};

const twitter = {
    "service": "Twitter" ,
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

