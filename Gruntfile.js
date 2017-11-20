module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        eslint: {
            src: [
                "*/scripts*.js",
                "**/scripts/*.js",
                "**/scripts/**/*.js",
                "!node_modules/**/*.js",
            ],
        },
        browserify: {
            dist: {
                files: {
                    "build/bundle.js": ["scripts/main.js"]
                }
            },
            options: {
                browserifyOptions: {
                    debug: true,
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            styles: {
                files: ["styles/**/*.css","**/styles/*.css","**/**/styles/*.css"]
            },
            html: {
                files: ["index.html"]
            },
            scripts: {
                files: ["**/scripts/*.js", "**/scripts/**/*.js", "!node_modules/**/*.js" ],
                tasks: ["eslint","browserify","uglify"],
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
                    cwd: "./build",
                    src: "bundle.js",
                    dest: "./build",
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