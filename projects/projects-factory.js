/*
Create a projects.js file and include it in your projects.html file.
Build a database object to store the pertinent information about your software projects. At this point, you only have one of note - your personal site.
Stringify the database object and store it in local storage.
The first step is to design what each object's properties should be - name, date completed, technologies used, teammates (if applicable). Each object should have those properties.
*/

/* 
const project = {
    "name": "",
    "dateCompleted": "",
    "technologies": [],
    "teammates": [],
    "repository": ""
}
*/
{
    const uniqueProjectIdGenerator = function*() {
        let i = 0;
        while (true) {
            yield i;
            i++;
        }
    };

    const uniqueProjectIdFactory = uniqueProjectIdGenerator();

    const projectFactory = function(name, description, dateCompleted, technologies, teammates, href, repository){
        return Object.create({},{
            "id": {value: uniqueProjectIdFactory.next().value, enumerable: true},
            "name": {value: name, enumerable: true},
            "description": {value: description, enumerable: true},
            "dateCompleted": {value: dateCompleted, enumerable: true},
            "technologies": {value: technologies, enumerable: true},
            "teammates": {value: teammates, enumerable: true},
            "href": {value: href, enumerable: true},
            "repository": {value: repository, enumerable: true}
        });
    };

    module.exports = projectFactory;
}