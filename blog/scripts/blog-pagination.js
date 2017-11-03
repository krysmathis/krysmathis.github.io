// 1. In HTML, create a section with an id=displayer and a section to hold the pagination id=paginator
// 2. In pagination.js:
// 2.0 Pull in the database and check how many articles are there
// 2.1 Establish the constraints and calcs for the pagination
// 2.2 Programically generate the pagination section
// 2.2.1 Assign the < and > elements with unique classes, we'll store the current
//       page inside the class as 'page-#'
// 2.2.2 Loop through the number of pages and write a span or li for each one with the
//       class of "blog-page-link"
// 2.2.3 Update the innerHTML
// 2.2.4 Capture the new <  and > elements in a variable (we'll use it later)
// 2.3  Function for update page that takes an event, the user will click on the span or li
//      to update the page
// 2.3.1 Clear the innerHTML of the "displayer"
// 2.3.2 which page are we on? get PAGENUMBER here we're going to loop through the classList 
//          and find a class that starts with page-
// 2.3.3 update the arrows with the current page and control the formatting
// 2.3.4 determine which items to display by slicing the array based on PAGENUMBER -1 * 2
// 2.3.5 Update the page html from the array
// 2.4  Programmically assign event listeners on the spans to check when they are clicked
//      and send that to the function is 2.3
//      2.4.1 add event listeners to the <  and > buttons seperately
// 2.5  Programically launch the first page using a fake event (variable that has the 
//       necessary elements)


