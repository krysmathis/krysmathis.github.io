// TODO: verify the database exists
// 1. In HTML, create a section with an id=displayer and a section to hold the pagination id=paginator
// 2. In pagination.js:
// 2.0 Pull in the database and check how many articles are there
const blogDB = JSON.parse(localStorage.getItem("blog"));
const numberOfItems = blogDB.blogEntries.length;
// 2.1 Establish the constraints and calcs for the pagination
const itemsPerPage = 5; // constant value
const numberOfPages = Math.ceil(numberOfItems/itemsPerPage);

// 2.2 Programically generate the pagination section
const blogsEl= document.getElementById("blog-posts");
const blogPaginationEl = document.getElementById("blog-pagination");

// 2.2.1 Assign the < and > elements with unique classes, we'll store the current
//       page inside the class as 'page-#'
// for the previous arrow
let pagination = `<span class="" id="blog-previous">&lt</span>`;

// 2.2.2 Loop through the number of pages and write a span or li for each one with the
//       class of "blog-page-link"
for (let i = 0; i < numberOfPages; i++){
    pagination += `<span class="blog-paginate-link blogpage-${i+1}">${i+1}</span>`;
}
// code for the next arrow
pagination += `<span class="blogpage-2" id="blog-next">&gt</span>`;
// 2.2.3 Update the innerHTML
blogPaginationEl.innerHTML = pagination;

 // 2.2.4 Capture the new <  and > elements in a variable (we'll use it later)
const previousEl = document.getElementById("blog-previous");
const nextEl = document.getElementById("blog-next");


// 2.3  Function for update page that takes an event, the user will click on the span or li
//      to update the page
function updateBlogPage( event ) {
            // 2.3.1 Clear the innerHTML of the "displayer"
            blogsEl.innerHTML = "";
            // 2.3.2 which page are we on? get PAGENUMBER here we're going to loop through the classList 
            //          and find a class that starts with page-

            const pageNumber = parseInt(
                Array.from(event.target.classList)
                .find(cl => {
                    if (cl.startsWith("blogpage-")) return cl;
                }).split("-")[1]);

            console.log(pageNumber);
                
            // 2.3.3 update the arrows with the current page and control the formatting

            if (pageNumber === 1) {
                previousEl.style.display = "none";
            } else {
                previousEl.style.display = "";
                previousEl.className = `blog-paginate-link blogpage-${pageNumber-1}`;
            }

            if (pageNumber + 1 > numberOfPages) {
                nextEl.style.display = "none";
            } else {
                nextEl.style.display = "";
                nextEl.className = `blog-paginate-link blogpage-${pageNumber+1}`;
            }
            // 2.3.4 determine which items to display by slicing the array based on PAGENUMBER -1 * 2
            const itemsToDisplay = blogDB.blogEntries.slice(
                (pageNumber - 1) * itemsPerPage,
                pageNumber * itemsPerPage
            );

            // 2.3.5 Update the page html from the array
            //     for (let i = 0; i < currentKey.length; i++) {
        for (let i = 0; i < itemsToDisplay.length; i++){
            let entry = itemsToDisplay[i];

            let html =  `
                <article class="blog-post">
                    <div class="blog-header">
                        <div class="blog-headline">${entry.headline}</div>
                        <div class="blog-date">${(entry.dateAdded)}</div>
                    </div>
                    <div class="blog-img-header">
                        <img src="${entry.imgHeader}">
                    </div>
                    <div class="blog-content">
                        ${entry.content}
                    </div>
                
            `;
            
            html+=`<div class="blog-footer project-tag"><ul>`;
            
            let tags = entry.tags;
            for (let i = 0; i < tags.length; i++) {
                let currentTag = tags[i];
                html += `<li>${currentTag}</li>`
            }
            
            html += "</ul></div></article>";
            blogsEl.innerHTML += html;  
        }

}       
// 2.4  Programmically assign event listeners on the spans to check when they are clicked
//      and send that to the function is 2.3
    const pageNums = document.getElementsByClassName("blog-paginate-link")
    for (let i = 0; i < pageNums.length; i++) {
        let element = pageNums[i];
        element.addEventListener("click", updateBlogPage,false);
        
    }
    //      2.4.1 add event listeners to the <  and > buttons seperately
    previousEl.addEventListener("click", updateBlogPage, false);
    nextEl.addEventListener("click", updateBlogPage, false);

    // 2.5  Programically launch the first page using a fake event (variable that has the 
    //       necessary elements)
updateBlogPage({
    "target": {"classList": ["blogpage-1"]}
});



















