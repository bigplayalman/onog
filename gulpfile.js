var gulp = require('gulp'),
  build = require('gulp-build'),
  connect = require('gulp-connect'),
  include = require('gulp-include');

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});
gulp.task('copy', function() {
  return gulp.src(['app/**/*','!app/*.scss'])
    .pipe(gulp.dest('dist'));
});
gulp.task('parse', function() {
  return gulp.src([
    './node_modules/angular-parse/angular-parse.js',
    './node_modules/angular/angular.js',
    './node_modules/angular-route/angular-route.js',
    './node_modules/angular-bootstrap-npm/dist/angular-bootstrap.min.js',
  ])
    .pipe(gulp.dest('app/libs'));
});
gulp.task('html', function () {
  gulp.src('app/**/*')
    .pipe(connect.reload());
});
gulp.task('cordova', function() {
  return gulp.src(['app/**/*','!app/*.scss'])
    .pipe(gulp.dest('synergyApp/www'));
});
gulp.task('watch', function () {
  gulp.watch(['app/**/*'], ['html']);
});

gulp.task('default', ['parse', 'copy', 'connect', 'watch']);