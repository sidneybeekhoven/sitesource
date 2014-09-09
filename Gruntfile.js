/*
 * sidney.beekhoven.nl
 * 
 * Sidney Beekhoven
 * https://github.com/sidney/sidney.beekhoven.nl
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
'use strict';

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),
    bootstrap: '<%= vendor %>/bootstrap',


    // Before generating any new files, remove files from previous build.
    clean: {
      example: ['<%= site.dest %>']
    },


    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'source/js/freelancer.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        production: false,
        assets: '<%= site.assets %>',
        postprocess: require('pretty'),

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],

        // Templates
        partials: '<%= site.includes %>',
        layoutdir: '<%= site.layouts %>',
        layout: '<%= site.layout %>',

        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>'
      },
      example: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs']}
      }
    },


    // Compile LESS to CSS
    less: {
      options: {
        vendor: 'vendor',
        paths: [
          '<%= site.theme %>',
          '<%= site.theme %>/bootstrap',
          '<%= site.theme %>/components',
          '<%= site.theme %>/utils'
        ]
      },
      site: {
        src: ['<%= site.theme %>/freelancer.less', '<%= site.theme %>/mixins.less', '<%= site.theme %>/variables.less'],
        dest: '<%= site.assets %>/css/freelancer.css'
      }
    },


    // Copy Bootstrap's assets to site assets
    copy: {
      // Keep this target as a getting started point
      assets: {
        files: [
          {expand: true, cwd: 'source/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},
          {expand: true, cwd: 'source/js',    src: ['*.*'], dest: '<%= site.assets %>/js/'},
          {expand: true, cwd: 'source/img',    src: ['**/*'], dest: '<%= site.assets %>/img/'},
          {expand: true, cwd: 'source/css',    src: ['bootstrap.min.css'], dest: '<%= site.assets %>/css/'}
        ]
      },
      divers: {
        files: [
          {expand: true, cwd: 'source', src: ['CNAME'], dest: '<%= site %>/'}
        ]
      }
    },

    watch: {
      all: {
        files: ['<%= jshint.all %>'],
        tasks: ['jshint', 'nodeunit']
      },
      site: {
        files: ['Gruntfile.js', '<%= less.options.paths %>/*.less', 'templates/**/*.hbs'],
        tasks: ['design']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-sync-pkg');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('assemble');

  // Run this task once, then delete it as well as all of the "once" targets.
  grunt.registerTask('setup', ['copy:once', 'clean:once']);

  // Build HTML, compile LESS and watch for changes. You must first run "bower install"
  // or install Bootstrap to the "vendor" directory before running this command.
  grunt.registerTask('design', ['clean', 'assemble', 'less:site', 'watch:site']);

  grunt.registerTask('docs', ['readme', 'sync']);

  grunt.registerTask('default', ['clean', 'jshint', 'copy:assets', 'assemble', 'less', 'docs']);
};