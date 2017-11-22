/*
    REQUIREMENTS: 
        HTML: a <section> with the class of "pagination". 
        JS: You'll need to send in the number of pages to display
*/

const Paginator = function(paginationEl) {
    
    const _paginationEl = paginationEl;

    return Object.create(null, {
        
        "init": {
            value: function (numberOfPages, startPage = 1) {
                //const paginationEl = document.querySelector(".pagination");
                // reset the pagination by removing all the child nodes
                while (_paginationEl.hasChildNodes()) {
                    _paginationEl.removeChild(_paginationEl.lastChild);
                }
                /*
                        ============================================================
                        Create the pagination elements
                        ============================================================
                    */
                // Start with the previous arrow
                const prev = document.createElement("span");
                prev.dataset.pageNum=(startPage-1).toString();
                prev.className="pagination__previous";
                const prevText = document.createTextNode("<");
                prev.appendChild(prevText);
            
                _paginationEl.appendChild(prev);
            
                // create an element to represent each page
                for (let i = 0; i < numberOfPages; i++) {
                        
                    let link = document.createElement("span");
                    link.dataset.pageNum=`${i+startPage}`;
                    link.className="pagination__page";
                    link.appendChild(document.createTextNode(`${i+startPage}`));
                    _paginationEl.appendChild(link);
               
                }
                   
                // create the next arrow button
                const next = document.createElement("span");
                next.dataset.pageNum=(startPage+1).toString();
                next.className="pagination__next";
                const nextText = document.createTextNode(">");
                next.appendChild(nextText);
                _paginationEl.appendChild(next);
                    
                // set the previous page selector to invisible and the first element to selected
                document.querySelector(".pagination__previous").style.visibility = "hidden";
                document.querySelector(".pagination__page").className = "pagination__page--selected";
            }

        },
        "update": {
            value: function(event) {
                if (!this.helpers.isValid(event)) {
                    return;
                }
            
                // capture the pageNum value from clicked element. Parse it as an int
                // because the program will need to do math with it later
                const clickedPageNumber = parseInt(event.target.dataset.pageNum);
                
                /*  
                    Only loop through the numbered elements excluding the arrows
                    reset the class name to remove the modifier class
                    Also need to capture the number of pages
                */ 
                const pageNums = document.querySelectorAll("[class^='pagination__page'");
                Array.from(pageNums).forEach(function (page) {     
                    page.className = "pagination__page";
                    if (clickedPageNumber.toString() === page.dataset.pageNum) {
                        page.className = "pagination__page--selected";
                    }
                }, this);
                
                const maxPage = parseInt(pageNums[pageNums.length-1].dataset.pageNum);
                const minPage = parseInt(pageNums[0].dataset.pageNum);
                
                const previousEl = document.querySelector(".pagination__previous");
                const nextEl = document.querySelector(".pagination__next");
            
                // Behavior for the arrow keys
                if (clickedPageNumber === minPage) {
                    previousEl.style.visibility = "hidden";
                } else {
                    previousEl.style.visibility = "";
                    previousEl.dataset.pageNum = clickedPageNumber-1;
                }
                
                if (clickedPageNumber + 1 > maxPage) {  
                    nextEl.style.visibility = "hidden";
                } else {
                    nextEl.style.visibility = "";
                    nextEl.dataset.pageNum = clickedPageNumber+1;
                }
            }
        },
        "helpers": {
            value: {

                "isValid": function(event) {
                    const validElements = ["pagination__page", "pagination__page--selected", "pagination__previous", "pagination__next"];
                    let isValid = false;
                
                    validElements.forEach(function(element){
                        if (event.target.className === element) { isValid = true;}
                    });
                        
                    return isValid;
                }
            }
        }, 
        "paginationSettings": {
            value: {
                maxPagesToDisplay: 5
            },
            writable: true
        }
    });
};



module.exports = Paginator;