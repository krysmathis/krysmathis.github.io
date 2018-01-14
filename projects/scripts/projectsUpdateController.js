const projectsUpdateController = (config) => {

    return Object.create({}, {

        "formState": {
            value: {},
            enumerable: true,
            writable: true
        },
        "generateForm": {
            value: function() {
            // Imitating Angular - though a user could get to this if they wanted
                return $.ajax({
                    url: "../projects/partials/project-form.html", dataType: "html"
                }).then(responseHTML => {
                    $("#projectsEntry__container").html(responseHTML);
                });
            },
            enumerable: true,
        },
        "generateList": {
            value: function() {

                let data = null;
                this.load().then(() => {
                    // load the data asynchronously
                    data = this.data;
                    console.log("data", data);
                    
                    const projectList = $(".projectEntry__list--container");
                    // initialize the project list with a blank set of data
                    projectList[0].innerHTML = "";
                    const ul = $("<ul class='list-group'>");

                    let c = 0;
                    data.forEach(d=> {
                        ul.append(`<li class="projectEntry__li list-group-item">
                        ${ d.name } ${ d.description }
                        <div>
                            <button class="projectEntry__update btn btn-primary" data-id="${d.id}" data-seq="${c}">Edit</button>
                            <button class="projectEntry__delete btn btn-danger" data-id="${d.id}">Delete</button>
                        </div>
                        </li>`);
                        c++;
                    });

                    projectList.append(ul);

                    // add event listeners for the buttons
                
                });
            },
            enumerable: true
        },
        
    



    });
};

module.exports = projectsUpdateController;