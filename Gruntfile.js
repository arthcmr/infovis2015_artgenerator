// Generated on 2014-11-15 using generator-chrome-extension 0.2.6
'use strict';

module.exports = function(grunt) {

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
            dev: {
                files: ['<%= config.src %>/**/*.js', '<%= config.src %>/**/*.html', '<%= config.src %>/assets/**/*.css'],
                tasks: ['build-dev'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
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
            chrome: {},
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

        concat: {
            prod: {
                src: ['<%= config.src %>/artgen/_head.js',
                    '<%= config.src %>/artgen/base/**/*.js',
                    '<%= config.src %>/artgen/artgen.js',
                    '<%= config.src %>/artgen/brushes/**/*.js',
                    '<%= config.src %>/artgen/painters/**/*.js',
                    '<%= config.src %>/artgen/_foot.js'
                ],
                dest: '<%= config.dist %>/artgen/artgen.js',
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
                        '{,*/}*.html',
                        'assets/**/*',
						'ncsound/**/*'
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
            chrome: [],
            dist: [
                'imagemin',
                'svgmin'
            ],
            test: []
        }

    });

    grunt.registerTask('dev', function() {
        grunt.task.run([
            'build-dev',
            'concurrent:chrome',
            'connect:chrome',
            'watch:dev'
        ]);
    });

    grunt.registerTask('build-dev', [
        'clean:dist',
        'concurrent:dist',
        'concat:prod',
        'copy',
    ]);

    grunt.registerTask('build', [
        'build-dev',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};