var argv = require('yargs').argv;
var VERSION = argv.version || require('./package.json').version;
var TARGET = argv.dev ? 'dev' : 'prod';

module.exports = {
  version: VERSION,
  target: TARGET,
  src: './src/',
  dest: './dist/',
  paths: {
    scssVars: 'sass/styles.scss'
  },
  globs: {
    sass: ['+(app|sass)/**/*.scss'],
    templates: ['app/**/*.html'],
    scripts: ['app/**/*.js'],
    assets: ['**', '!{app,app/**,sass,sass/**}'],
  },
  fonts: {
    awesome: 'font-awesome/'
  },
  libs: {
    dev: [
      'angular/angular.js',
      'angular-animate/angular-animate.js',
      'angular-ui-router/build/angular-ui-router.js',
      'parse/dist/parse-latest.min.js',
      'angular-parse/angular-parse.js',
      'bootswatch/superhero/bootstrap.css',
      'font-awesome/css/font-awesome.min.css',
      'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
    ],
    prod: [
      'angular/angular.min.js',
      'angular-animate/angular-animate.min.js',
      'angular-ui-router/build/angular-ui-router.min.js',
      'parse/dist/parse-latest.min.js',
      'angular-parse/angular-parse.js',
      'bootswatch/superhero/bootstrap.min.css',
      'font-awesome/css/font-awesome.min.css',
      'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
    ]
  }
};