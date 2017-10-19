

const blogDB = JSON.parse(localStorage.getItem("blog"));

const blogs = document.getElementById("blog-posts");

for (let key in blogDB) {
    const currentKey = blogDB[key];

    for (var i = 0; i < currentKey.length; i++) {
        var entry = currentKey[i];

        let html +=  `
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
        for (var i = 0; i < tags.length; i++) {
            var currentTag = tags[i];
            html += `<li>${currentTag}</li>`
        }
        
       html += "</ul></div></article>";
        blogs.innerHTML += html;  
  
    }
}

/*
// <article class="blog-post">
//             <div class="blog-header">
//                 <div class="blog-title">First Day at NSS</div>
//                 <div class="blog-date">10/2/2017</div>
//             </div>
//             <div class="blog-content">
//                 Started my journey to becoming a software developer. Is it just me or are they stressing that we won't understand anything they say for weeks? It's nice to be around people with the same goal. We're starting at different points, but we're going to end up at the same goal.
//                 <img src="http://media2.giphy.com/media/jrC5zowLdpw5y/giphy.gif" class="blog-img float-left">
//                 Seems to be a lot of memes and animated GIFs going on around. Must mean we'll need a sense of humor to hang with the program. WHAT DOES IT ALL MEAN?
//             </div>
//             <div class="blog-footer project-tag">
//                 <ul><li>footer</li><li>html</li></ul>
//             </div>
//         </article>
// */ 