// navbar update
updateNavBar("contact");

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

