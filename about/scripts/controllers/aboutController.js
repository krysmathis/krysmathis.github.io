const aboutController = Object.create({},{

    "init": {
        "value": function() {
            $.ajax({
                url: "../../about/partials/about.html", dataType: "html"
            }).then(responseHTML => {
                $("#about").html(responseHTML);
            });
        },
        enumerable: true
    }
   
});

module.exports = aboutController;