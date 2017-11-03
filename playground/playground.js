
console.log("connected...");
// event listener for the body
document.querySelector("body").addEventListener("click", function(event){
    const targetId = event.target.id;
    
    if (targetId === "popup-area"){
        positionPopupOnPage(event);
        document.getElementById("popup-range").value = 50;
        document.getElementById("popup-value").textContent = 5;
    } else if (targetId === "popup") {
        // reset the range of the values to 5
        // do something within the popup
    } else if (!targetId.startsWith("popup")) {
        // if it's not in that area make sure the modal is hidden
        document.getElementById("popup").style.display = "none";
    }

    // if (targetId === "popup-range") {
    //     const rangeEl = document.getElementById("popup-range");
    //     const valueEl = document.getElementById("popup-value");
    //     const oneToTen = Math.ceil(rangeEl.value/10,0);
    //     valueEl.textContent = oneToTen;
    // }
});

document.querySelector("#popup").addEventListener("mouseup", function(event){
    const targetId = event.target.id;

    if (targetId === "popup-range") {
        const rangeEl = document.getElementById("popup-range");
        const valueEl = document.getElementById("popup-value");
        const oneToTen = Math.ceil(rangeEl.value/10,0);
        valueEl.textContent = oneToTen;
    }
})

let popup = document.getElementById("popup");
// positon popup on page relative to cursor
// position at time of click event  
// https://www.sitepoint.com/community/t/how-to-position-modal-dialog-at-x-y-coordinates-of-click-event/224882/2
function positionPopupOnPage( evt ) {
    
    var VPWH = [];                  // view port width / height
    var intVPW, intVPH;             // view port width / height
    var intCoordX = evt.clientX;    
    var intCoordY = evt.clientY;    // distance from click point to view port top
    var intDistanceScrolledUp = document.body.scrollTop;
          // distance the page has been scrolled up from view port top
    var intPopupOffsetTop = intDistanceScrolledUp + intCoordY;
        // add the two for total distance from click point y to top of page
    
    var intDistanceScrolledLeft = document.body.scrollLeft;
    var intPopupOffsetLeft = intDistanceScrolledLeft + intCoordX;
    
    //VPWH = getViewPortWidthHeight();    // view port Width/Height
    //intVPW = VPWH[0];
    //intVPH = VPWH[1];
    intVPH = document.documentElement.clientHeight;
    intVPW = document.documentElement.clientWidth;

    popup.style.position = 'absolute';
            // if not display: block, .offsetWidth & .offsetHeight === 0
    popup.style.display = 'flex';
    popup.style.zIndex = '10100';
    
    if ( intCoordX > intVPW/2 ) { intPopupOffsetLeft -= popup.offsetWidth; }
          // if x is in the right half of the viewport, pull popup left by its width
    if ( intCoordY > intVPH/2 ) { intPopupOffsetTop -= popup.offsetHeight; }
        // if y is in the bottom half of view port, pull popup up by its height
    
    popup.style.top = intPopupOffsetTop + 'px';
    popup.style.left = intPopupOffsetLeft + 'px';
    }   // end fn positionPopupOnPage

    console.log(moment()); 



