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
                        dest: 'lib/'
                    }
                ]
            }
        }
    });

    grunt.registerTask('build', ['clean:dist', 'webpack', 'babel']);
};
