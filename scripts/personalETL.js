const personalETL = 
    Object.create(null,{
            
        "data": {
            value: [],
            writable: true,
            enumerable: true
        },
            
        "filteredData": {
            value: [],
            writable: true,
            enumerable: true
        },

        "filterBySearchCriteria": {
            value: {},
            writable: true,
            enumerable: true
        },

        "filterByTag": {
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
                this.paginate();
                this.display(1);
            }
        },
            
        "paginationObj": {
            value: {},
            writable: true,
            enumerable: true
        },
        
        "display": {
            value: {},
            writable: true,
            enumerable: true
        },

        "displayOptions": {
            value: {
                "itemsPerPage": 5 
            },
            writable: true
        },
    
        "paginate": {
            // takes a callback function from the pagination object
            value: function() {
                
                const numberOfItems = this.filteredData.length;
                const numberOfPages = Math.ceil(numberOfItems / this.displayOptions.itemsPerPage);
                
                this.Paginator.init(numberOfPages,1);
                
                // determine how to handle the pagination display
                if (numberOfPages > 1) {
                    document.querySelector(".pagination").style.visibility = "";
                } else {
                    document.querySelector(".pagination").style.visibility = "hidden";
                }
            },
            writable: true
        },
    
        "search": {
            value: function(searchString) {
                if (searchString.length >=3) {
                    this.filterBySearchCriteria(searchString);
                } else {
                    this.filterBySearchCriteria("");
                }
            },
            writable: true
        }



    });