var argv = require('yargs').argv;
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var merge = require('merge-stream');
var connect = require('gulp-connect');
var config = require('./config');

gulp.task('clean', function() {
  return del(config.dest + '**/*');
});

gulp.task('copy', ['clean'], function() {
  var lib = gulp.src(config.libs[config.target], {cwd: './node_modules/'})
    .pipe(gulp.dest(config.dest + 'lib/'));

  var assets = gulp.src(config.globs.assets, {cwd: config.src})
    .pipe(gulp.dest(config.dest));

  return merge(lib, assets);
});

gulp.task('build-sass', ['clean'], function() {
  var scssVars = fs.readFileSync(config.src + config.paths.scssVars, 'utf8').toString();
  return gulp.src(config.globs.sass, {cwd: config.src})
    .pipe(concat('styles.scss'))
    .pipe(insert.prepend(scssVars))
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer())
    .pipe(gulpif(!argv.dev, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(gulpif(!argv.dev, rename({ extname: '.min.css' })))
    .pipe(gulp.dest(config.dest + 'css/'));
});

gulp.task('build-js', ['clean'], function() {
  return gulp.src(config.globs.scripts, {cwd: config.src})
    .pipe(concat('app.js'))
    .pipe(gulpif(!argv.dev, uglify()))
    .pipe(gulpif(!argv.dev, rename({ extname: '.min.js' })))
    .pipe(gulp.dest(config.dest + 'js/'));
});

gulp.task('build-html', ['clean'], function() {
  return gulp.src(config.globs.templates, {cwd: config.src})
    .pipe(templateCache({
      module: 'onog.templates',
      standalone: true
    }))
    .pipe(gulp.dest(config.dest + 'js/'));
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: config.dest
  });
  return gulp.watch([config.src + '**/*'], ['watch']);
});

gulp.task('build', ['build-sass', 'build-js', 'build-html', 'copy']);
gulp.task('watch', ['build'], connect.reload);
gulp.task('default', ['connect', 'watch']);