const loadingActions = () => {

    // add to session storage
    const admin = storageObj();

    // if it exists replace it
    if (localStorage.getItem("admin")) {
        localStorage.removeItem("admin");
    }
    localStorage.setItem("admin", JSON.stringify(admin));

    window.location.href = "/";
    // have navbar check for session storage to unlock admin and login logout
};

const storageObj = () => {
    return Object.create(null,{
        "loginRequestDate": {
            value: Date.now(),
            enumerable: true,
            writable: true
        },
        "numberOfRequests": {
            value: 0,
            enumerable: true,
            writable: true
        }
    });
};