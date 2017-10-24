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
        "id": {value: contactIdFactory.next().value, enumerable: true},
        "service": {value: serviceName, enumerable: true},
        "handle": {value: handle, enumerable: true},
        "url": {value: url, enumerable: true},
        "icon": {value: icon, enumerable: true},
        "iconAlt": {value: iconAlt, enumerable: true},
        getService: {value: function(){
            return this.contactId;
        }, enumerable: false}
    });
};

// --- Generate the contact objects
const email = contact("Email", "krysmathis", "mailto:krysmathis@test.com","./images/email.png", "email icon" );
const github = contact("GitHub", "krysmathis", "https://www.github.com/krysmathis", "./images/github.png","email icon");
const linkedIn = contact("LinkedIn","krysmathis","https://www.linkedin.com/in/krysmathis/","./images/linkedin.png", "linkedin");
const twitter = contact("Twitter" ,"coldbuckets","https://twitter.com/coldbuckets","./images/twitter.png","twitter bird");

// --- hold the contact objects in an array
let contactMethods = [];
contactMethods.push(github,twitter,linkedIn, email);

// --- Create a database object to hold
let Contact = {
    "method": contactMethods
}

localStorage.setItem("contact", JSON.stringify(Contact));