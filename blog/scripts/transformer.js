const Transformer = function(config) {

    return Object.create (null, {
        
        "filteredData": {
            value: {},
            enumerable: true,
            writable: true
        },

        "searchableProperties": {
            value: config.searchableProperties,
            enumerable: true
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
        },

        "checkSearchableProperties": {
            value: function(record, searchCriteria) {
                let isMatch = false;
                this.searchableProperties.forEach(prop=> {
                    if (record[prop].toLowerCase().includes(searchCriteria)) {
                        isMatch = true;
                    }
                });
                return isMatch;
            },
            enumerable: true
        },

        "filterBySearchCriteria": {
            value: function(searchCriteria) {
                // sort in descending order
                //const sortedBlogEntries = this.data.sort((a, b) => moment(b.dateAdded) - moment(a.dateAdded));
                if (searchCriteria === undefined || searchCriteria === "") {
                    // just return the sorted blogs
                    this.filteredData = this.data;
                } else {
                    // return the filtered blogs
                    this.filteredData =
                            this.data.filter(
                                record => this.checkSearchableProperties(record, searchCriteria)
                            );
                }

            },
            enumerable: true
        },
        // this may change as the implementation changes
        "filterByTag": {
            writable: true,
            value: function(tag) {
            // Get records with matching tags
                const matchedRecords = [];
                this.data.forEach(record => {
                    record.tags.forEach(currentTag =>{
                        if (currentTag === tag) 
                            matchedRecords.push(record);
                        return;
                    });
                });
                this.filteredData = matchedRecords;
            }
        }, 
    });
};

module.exports = Transformer;