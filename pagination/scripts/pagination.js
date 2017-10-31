console.log('connected...')

/*
    REQUIREMENTS: 
        HTML: a <section> with the class of "pagination". 
        JS: You'll need to send in the number of pages to display
*/
const setPagination = function (numberOfPages, startPage = 1) {
    
        const paginationEl = document.querySelector(".pagination");
        /*
            ============================================================
            Writing the HTML for the pagination 

            ============================================================
        */
        // Start with the previous arrow
        let pagination = `<span class="pagination__previous" data-page-num="0">&lt</span>`;

        // Loop through the number of pages and write a span or li for each one with the
        // class of "blog-page-link"
        for (let i = 0; i < numberOfPages; i++) {
            pagination += `<span class="pagination__page" data-page-num="${i+1}">${i+1}</span>`;
        }
        // code for the next arrow
        pagination += `<span class="pagination__next" data-page-num="2">&gt</span>`;
        // // 2.2.3 Update the innerHTML
        paginationEl.innerHTML = pagination;

        // set the previous page selector to invisible
        document.querySelector(".pagination__previous").style.visibility = "hidden";
        document.querySelector(".pagination__page").className = "pagination__page--selected";
    
}

// want to make sure we're clicking on a part of the pagination with a button
const isValidPagination = function(event) {
    const validElements = ["pagination__page", "pagination__page--selected", "pagination__previous", "pagination__next"]
    let isValid = false;

    validElements.forEach(function(element){
        if (event.target.className === element) { isValid = true}
    })
        
    return isValid;
}

/* 
    This handles the styling modifications for the pagination
    1.  The active page is set with the --selected modifier
    2.  If the active page is the first or last element, hide or show the
        arrow keys
*/
const updatePagination = function(event) {

    if (!isValidPagination(event)) {
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
    let numberOfPages = 0;
    Array.from(pageNums).forEach(function (page) {     
        page.className = "pagination__page";
        if (clickedPageNumber.toString() === page.dataset.pageNum) {
            page.className = "pagination__page--selected";
        }
        numberOfPages++;
    }, this);

    const previousEl = document.querySelector(".pagination__previous");
    const nextEl = document.querySelector(".pagination__next");

    // Behavior for the arrow keys
    if (clickedPageNumber === 1) {
        previousEl.style.visibility = "hidden";
    } else {
        previousEl.style.visibility = "";
        previousEl.dataset.pageNum = clickedPageNumber-1;
    }
    
    if (clickedPageNumber + 1 > numberOfPages) {  
        nextEl.style.visibility = "hidden";
    } else {
        nextEl.style.visibility = "";
        nextEl.dataset.pageNum = clickedPageNumber+1;
    }
    
    // scroll to the top of the window
    window.scrollTo(0,0);
    return;
}


setPagination(4);  //need this to set the styling

// set the initial page as --selected
document.querySelector(".pagination__page").className = "pagination__page--selected";

// add event listener for pagination
document.querySelector('.pagination').addEventListener("click", updatePagination);




// const setPaginationEls = function (numberOfPages, startPage = 1) {
//     /*
//     -------------------------------------------------
//     This code does not currently work - do not use.
//     Further research is required - use setPagination
//     -------------------------------------------------
//     */
//         const paginationEl = document.querySelector(".pagination");
//         // will need to remove all child nodes from here

//         /*
//             ============================================================
//             Write the HTML for the pagination

//             ============================================================
//         */
//         // Start with the previous arrow
//         const prev = document.createElement("span")
//         prev.dataset.pageNum="0"
//         prev.className="pagination_previous"
//         const prevText = document.createTextNode("<")
//         prev.appendChild(prevText);

//         paginationEl.appendChild(prev);
  
//         for (let i = 0; i < numberOfPages; i++) {
            
//             let link = document.createElement("span")
//             link.dataset.pageNum=`${i+1}`
//             link.className="pagination__page";
//             link.appendChild(document.createTextNode(`${i+1}`));
//             paginationEl.appendChild(link);
   
//         }
       
//         const next = document.createElement("span")
//         next.dataset.pageNum="2"
//         next.className="pagination_previous"
//         const nextText = document.createTextNode(">")
//         next.appendChild(nextText);
        
//         // set the previous page selector to invisible
//         document.querySelector(".pagination__previous").style.visibility = "hidden";
//         document.querySelector(".pagination__page").className = "pagination__page--selected";
    
// }
