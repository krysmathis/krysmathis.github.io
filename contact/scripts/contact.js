const PersonalETL = require("../../scripts/personalETL");

const ContactManager = Object.create(PersonalETL, {
    
    "load": {
        value: function() {
            $.ajax({url: "https://personal-site-3111d.firebaseio.com/contact.json"})
                .then(result => {
                    this.data = result;
                    this.filteredData = result;
                    this.display();
                });
        }
    },

    "display": {
        value: function() {

            const socialLinks = document.getElementById("social-links");
            socialLinks.innerHTML = "";
            this.filteredData.forEach(contactType => {
                socialLinks.innerHTML += 
                    `<div><a href="${contactType.url}"><img src="${contactType.icon}" alt="${contactType.iconAlt}" class="social-img"></a></div>`;
            
            });
        },
        enumerable: true
    },
    
    "displayOptions": {
        value: {
            "itemsPerPage": 5
        },
        "writable": true
    },

    "search": {
        value: function(searchString) {
            if (searchString.length >=3) {
                this.filterBySearchCriteria(searchString);
            } else {
                this.filterBySearchCriteria("");
            }
        },
        writable: true,
        enumerable: true
    }
    
});

module.exports = ContactManager;
