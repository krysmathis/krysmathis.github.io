const firebase = require("firebase");

const DataFactory = function(config) {
    
    return Object.create(null, {
        
        "connection": {
            value: config.dbConnection,
            writable: true,
            enumerable: true
        },
    
        "data": {
            value: null,
            writable: true,
            enumerable: true
        },  

        "load": {
            value: function() {
                return $.ajax({
                    url: `${this.connection}/.json`,
                    method: "GET"
                }).then(results => {
                    // this should return an array of ojects
                    this.data = Object.keys(results)
                        .map(key => {
                            // adding an id field here
                            results[key].id = key;
                            return results[key];
                        });
                        
                    this.filteredData = this.data;
                });
            },
            enumerable: true
        },
    
        "add": {
            value: function(obj) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $.ajax({
                            url: `${this.connection}/.json?auth=${idToken}`,
                            method: "POST",
                            data: JSON.stringify(obj)
                        }).then(() => {
                            console.log("record added successfully");
                            this.load();
                        });
                    });
            },
            enumerable: true
        },
        

        "update": {
            value: function(pid, obj) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $.ajax({
                            url: `${this.connection}/${pid}/.json?auth=${idToken}`,
                            method: "PUT",
                            data: JSON.stringify(obj)
                        }).then(() => {
                            this.load();
                        });
                    }
                    );
            },
            enumerable: true
        },
        "retrieveById": {
            value: function(id) {
                return this.data[id];
            },
            enumerable: true
        },
        "delete": {
            value: function(pid) {
                return firebase.auth().currentUser.getIdToken(true)
                    .then(idToken => {
                        return $.ajax({
                            url: `${this.connection}/${pid}/.json?auth=${idToken}`,
                            method: "DELETE"
                        }).then(r => {
                            this.load();
                        });

                    });
            },
            enumerable: true
        },
    });
};

module.exports = DataFactory;