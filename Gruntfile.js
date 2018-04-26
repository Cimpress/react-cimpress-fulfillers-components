const AWS = require('aws-sdk');
const s3 = new AWS.S3({signatureVersion: 'v2'}); //MAGIC ALERT: without {signatureVersion: 'v2'} S3 will time out -.-
const fs = require('fs');
const path = require('path');
const webpackConfig = require('./webpack.config.js');
const log = console;

const npm = /^win/.test(process.platform)
    ? 'npm.cmd'
    : 'npm';

module.exports = function (grunt) {

    const version = "0.2." + process.env.CI_PIPELINE_ID;
    const serviceName = `react-fl-fi-components`;
    const serviceZip = `${serviceName}-${version}.tgz`;

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
        },
        exec: {
            setVersion: {
                cwd: 'dist',
                command: `${npm} version ${version} --no-git-tag-version --allow-same-version`
            },
            createTar: {
                cwd: 'dist',
                command: `${npm} pack`
            }
        }
    });

    grunt.registerTask('awsCopyToS3', function () {
        let done = this.async();
        let params = {
            ACL: "public-read",
            Bucket: 'msw-lqp-deploy',
            Key: `${serviceName}/${serviceZip}`,
            ContentType: 'multipart/form-data',
            Body: fs.createReadStream(path.join('dist', serviceZip))
        };
        s3.putObject(params, done);
    });

    grunt.registerTask('awsCopyDemoToS3', function () {
        let done = this.async();
        let params = {
            ACL: "public-read",
            Bucket: 'qp-demo',
            Key: `react-fl-fi-components/bundle.js`,
            ContentType: 'multipart/form-data',
            Body: fs.createReadStream(path.join('dist-dev', 'bundle.js'))
        };
        s3.putObject(params, function (err, data) {
            params.ContentType = 'text/html';
            params.Key = `react-fl-fi-components/index.html`;
            params.Body = fs.createReadStream(path.join('dist-dev', 'index.html'));
            s3.putObject(params, done);
        });
    });

    grunt.registerTask('build', ['clean:dist', 'copy', 'webpack', 'babel', 'exec:setVersion', 'exec:createTar']);
    grunt.registerTask('publish', ['awsCopyToS3', 'awsCopyDemoToS3']);
};
