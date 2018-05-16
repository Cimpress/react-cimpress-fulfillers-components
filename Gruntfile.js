module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({

        verbose: true,

        clean: {
            dist: ['dist/']
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

    grunt.registerTask('build', ['clean:dist', 'babel']);
};
