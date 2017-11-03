module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        eslint: {
            src: ["admin/scripts/*.js","blog/scripts/*.js","contact/scripts/*.js","toaster/scripts/*.js","projects/scripts/*.js","pagination/scripts/*.js", "resume/scripts/*.js"]
        },
        browserify: {
            dist: {
                files: {
                    "build/module.js": ["admin/scripts/*.js","blog/scripts/*.js"]
                }
            }
        },
        watch: {
            scripts: {
                files: ["admin/scripts/*.js","blog/scripts/*.js","contact/scripts/*.js","toaster/scripts/*.js","projects/*.js","pagination/scripts/*.js", "resume/scripts/*.js"],
                tasks: ["eslint","uglify"],
                options: {
                    spawn: false,
                },
            }
        },
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            build: {
                files: [{
                    expand: true,
                    cwd: "admin/scripts",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                }
                    ,{
                    expand: true,
                    cwd: "blog/scripts",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                }
                    ,{
                    expand: true,
                    cwd: "contact/scripts",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                }
                    ,{
                    expand: true,
                    cwd: "pagination/scripts",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                }
                    ,{
                    expand: true,
                    cwd: "projects/scripts",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                },
                {
                    expand: true,
                    cwd: "navbar/scripts",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                },{
                    expand: true,
                    cwd: "toaster/scripts",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                }
                    ,{
                    expand: true,
                    cwd: "./*",
                    src: "*.js",
                    dest: "build",
                    ext: ".min.js"
                }
                ]
            }
        }
    });
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks("grunt-browserify");
        
    
    // Default task(s).
    grunt.registerTask("default", ["uglify", "watch","eslint","browserify"]);
    
};