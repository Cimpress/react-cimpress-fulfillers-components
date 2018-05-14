const webpackConfig = require('./webpack.config.js');
const log = console;

const npm = /^win/.test(process.platform)
    ? 'npm.cmd'
    : 'npm';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.initConfig({

        verbose: true,

        clean: {
            dist: ['dist/']
        },

        webpack: {
            build: webpackConfig
        },

        copy: {
            main: {
                files: [

                    // copy all files from src/ except of .js files
                    {
                        expand: true,
                        src: [
                            'package.json',
                            '*.md'
                        ],
                        dest: 'dist/'
                    }
                ]
            }
        },
        babel: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [

                    // transpile .js files
                    {
                        expand: true,
                        cwd: 'src',
                        src: [
                            'index.js',
                            '*.jsx',
                        ],
                        dest: 'dist/lib/'
                    }
                ]
            }
        }
    });

    grunt.registerTask('build', ['clean:dist', 'copy', 'webpack', 'babel']);
};
