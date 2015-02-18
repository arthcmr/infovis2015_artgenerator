// Generated on 2014-11-15 using generator-chrome-extension 0.2.6
'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        src: 'src',
        dist: 'dist'
    };

    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= config.src %>/scripts/{,*/}*.js'],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            page: {
                files: ['<%= config.src %>/{,*/}*.html'],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= config.src %>/styles/{,*/}*.css'],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.src %>/**/*.js',
                    '<%= config.src %>/*.html',
                    '<%= config.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Grunt server and debug server setting
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            chrome: {
                options: {
                    open: 'http://127.0.0.1:9000/',
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            chrome: {
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            }
        },

        // The following *-min tasks produce minifies files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.src %>',
                    src: '*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.{png,gif,jpg}',
                        '{,*/}*.html',
                        'styles/{,*/}*.css',
                        'styles/fonts/{,*/}*.*',
                        '_locales/{,*/}*.json',
                        'scripts/{,*/}*.js'
                    ]
                }]
            },
            dependencies: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'bower_components',
                    dest: '<%= config.dist %>/vendor',
                    src: [
                        '**/*'
                    ]
                }]
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            chrome: [
            ],
            dist: [
                'imagemin',
                'svgmin'
            ],
            test: [
            ]
        }

    });

    grunt.registerTask('dev', function () {
        grunt.task.run([
            'build',
            'concurrent:chrome',
            'connect:chrome',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'copy',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
