"use strict";

const projectAdmin = require("./projectsAdminController");

let editMode = false;
let currentId = null; // holds the editable record

const state = {
    completeDate: null,
    description: null,
    href: null,
    modalId: null,
    name: null,
    repo: null,
    teammates: null,
    technologies: null,
    screenshot: ""
};
// the edit button send a database record and have the state set
function setState(obj) {
    document.querySelector(".projectInput__date").value = obj.completeDate || moment(Date.now()).format("YYYY-MM-DD");
    document.querySelector(".projectInput__description").value = obj.description || "";
    document.querySelector(".projectInput__href").value = obj.href  || "";
    document.querySelector(".projectInput__modalId").value = obj.modalId  || "";
    document.querySelector(".projectInput__name").value = obj.name || "";
    document.querySelector(".projectInput__repo").value = obj.repo || "";
    document.querySelector(".projectInput__teammates").value = obj.teammates || "";
    // * TODO: convert array to string here
    document.querySelector(".projectInput__technologies").value = obj.technologies.join(" ") || "";
    document.querySelector(".projectInput__sceenshot").value = obj.screenshot || "";
}

function getState() {
    state.completeDate = document.querySelector(".projectInput__date").value;
    state.description = document.querySelector(".projectInput__description").value;
    state.href = document.querySelector(".projectInput__href").value;
    state.modalId = document.querySelector(".projectInput__modalId").value;
    state.name = document.querySelector(".projectInput__name").value;
    state.repo = document.querySelector(".projectInput__repo").value;
    state.teammates = document.querySelector(".projectInput__teammates").value;
    const technologyBase = document.querySelector(".projectInput__technologies");
    state.technologies = technologyBase.value.split(" ");
    state.screenshot = document.querySelector(".projectInput__sceenshot").value;
}

function clearState() {

    state.completeDate = null;
    state.description = "";
    state.href = "";
    state.modalId = "";
    state.name = "";
    state.repo = "";
    state.teammates = "";
    state.technologies = [];
    state.screenshot = "";

}

function addButtonEventListeners(e) {
    if (e.target.className.includes("projectEntry__update")) {
        editMode = true;
        try {
            const recordNum = parseInt(e.target.dataset.seq);
            const record = projectAdmin.retrieveById(recordNum);
            console.log(record);
            setState(record);
            currentId = e.target.dataset.id;
            $("#projectEntry__record-update").show();
        } catch (err) {
            console.log("Project update error: ", err);
        }
    }

    

    if (e.target.className.includes("projectEntry__delete") ) {
        projectAdmin.delete(e.target.dataset.id).then(()=> {
            projectAdmin.generateList();
        });
    }

}

function addRecord() {
    // gather the current state of the form
    // send to the update function
    getState();
    
    // call the add method of the projects admin object
    projectAdmin.add(state).then(() => projectAdmin.generateList());

}

function updateRecord() {
    
    getState();
    projectAdmin.update(currentId, state).then(()=> {
        editMode = false;
        $("#projectEntry__record-update").hide();
        clearState();
        setState(state);
        projectAdmin.generateList();
    });

}

const projectsAdminEventListenerAdd = module.exports =
    function() {
        // remove the event listener if it exists - try to remove it
        const addBtn = $("#projectEntry__add");

        // remove the event listener first if it exists
        try {
            addBtn.off("click");
        } catch (err) {
            console.warn("no active events");
        }

        addBtn.click(addRecord);

        // the edit and delete buttons
        try {
            document.querySelector(".projectsEntryList").removeEventListener("click", addButtonEventListeners);
        } catch (err) {
            console.warn("no event listener to remove ", err);
        }


        document.querySelector(".projectsEntryList").addEventListener("click", addButtonEventListeners);
    

        try {
            $("#projectEntry__record-update").off("click");
        } catch (err){
            console.warn("no update event listener ", err);
        }

        $("#projectEntry__record-update").click(updateRecord);
    };

