module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
            "warn"
        ],
        "no-console": [
            "warn"
        ],
        "no-debugger": [
            "warn"
        ]

        
    },
    "globals": {
        "moment": true,
        "setPaginationByEls": true,
        "getBlogs": true,
        "writeBlogsEl": true,
        "setInitialPagination": true,
        "isValidPagination": true,
        "blogObjectFactory": true,
        "updatePagination": true,
        "updateNavBar":true,
        "$": true
    }
    
    
};