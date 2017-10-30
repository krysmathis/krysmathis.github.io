console.log('connected...')

/*
    REQUIREMENTS: 
        HTML: a <section> with the class of "pagination". 
        JS: You'll need to send in the number of pages to display
*/


const setPagination = function (numberOfPages) {
    
        const paginationEl = document.querySelector(".pagination");
        /*
            ============================================================
            Writing all of the HTML for the blog page. 
            TODO: turn this into a create and add element style 
            ============================================================
        */
        // Start with the previous arrow
        let pagination = `<span class="pagination__previous" data-page-num="0">&lt</span>`;

        // 2.2.2 Loop through the number of pages and write a span or li for each one with the
        //       class of "blog-page-link"
        for (let i = 0; i < numberOfPages; i++) {
            pagination += `<span class="pagination__page" data-page-num="${i+1}">${i+1}</span>`;
        }
        // code for the next arrow
        pagination += `<span class="pagination__next" data-page-num="2">&gt</span>`;
        // 2.2.3 Update the innerHTML
        paginationEl.innerHTML = pagination;
       
        // set the previous page selector to invisible
        document.querySelector(".pagination__previous").style.visibility = "hidden";
        
        // if (numberOfPages < 2) {
        //     paginationEl.style.visibility = "hidden"
            
        // } else {
        //     paginationEl.style.visibility = "visible"
        // }
    
}
    



// this updates which element gets the --selected modifier
// and update the previous and next data values for pageNum
const updatePagination = function(event) {
    
    const validElements = ["pagination__page", "pagination__page--selected", "pagination__previous", "pagination__next"]
    let isValid = false;

    validElements.forEach(function(element){
       if (event.target.className === element) { isValid = true}
    })
    
    console.log("isValid",isValid)
    if (!isValid) {
        // Do nothing!
        return;
    }

    // capture the pageNum value from clicked element
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

    console.log("Clicked Page", clickedPageNumber)
    console.log("Number Of Pages", numberOfPages);
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
        console.log("true!",clickedPageNumber + 1);   
        nextEl.style.visibility = "hidden";
    } else {
        nextEl.style.visibility = "";
        nextEl.dataset.pageNum = clickedPageNumber+1;
    }
    
    return;
}

setPagination(4);
document.querySelector(".pagination__page").className = "pagination__page--selected";

document.querySelector('.pagination').addEventListener("click",updatePagination);