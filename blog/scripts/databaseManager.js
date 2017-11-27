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
                return $.ajax({
                    url: `${this.dbConnection}/.json`,
                    method: "POST",
                    data: JSON.stringify(obj)
                }).then(() => {
                    this.load();
                });
            },
            enumerable: true
        },
    
        "update": {
            value: function(pid, obj) {
                return $.ajax({
                    url: `${this.dbConnection}/${pid}/.json`,
                    method: "PUT",
                    data: JSON.stringify(obj)
                }).then(() => {
                    this.load();
                });
            },
            enumerable: true
        },
    
        "delete": {
            value: function(pid) {
                return $.ajax({
                    url: `${this.dbConnection}/${pid}/.json`,
                    method: "DELETE"
                }).then(r => {
                    this.load();
                });
            },
            enumerable: true
        },
    });
};

module.exports = DataFactory;