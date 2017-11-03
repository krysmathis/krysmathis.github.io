const tags = ["html", "javascript"]

let tagsHTML = "";
for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    tagsHTML += `<li>${tag}</li>`
    
}

let html = tags.reduce(function(l, c) {
    l += `<li>${c}</li>`;
    return l;
});

console.log(html);
let j = 1;
