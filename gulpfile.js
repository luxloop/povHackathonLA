var gulp = require('gulp'),
  sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
  rename = require("gulp-rename"),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');

// gulp.task('compileCustom', function() {
//   return gulp.src(['./_js/custom/nodeField.js','./_js/custom/main.js'])
//     .pipe(concat('ivaylogetov.min.js'))
//     .pipe(uglify({mangle: true}))
//     .pipe(gulp.dest('./assets/js/'))
// });

// gulp.task('compileTools', function() {
//   return gulp.src(['./_js/tools/*.js'])
//     .pipe(concat('tools.min.js'))
//     .pipe(uglify({mangle: true}))
//     .pipe(gulp.dest('./assets/js/'))
// });

// gulp.task('minifyCube', function() {
//   return gulp.src(['./_js/cube.js'])
//     .pipe(uglify({mangle: true}))
//     .pipe(rename(function (path) {path.extname = ".min.js"}))
//     .pipe(gulp.dest('./assets/js/'))
// });

gulp.task('sass', function() {
  return gulp.src('./sass/*.scss')
    .pipe(sass({
        'outputStyle' : 'expanded'
    }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(cleanCSS({
      compatibility: 'ie8',
      aggressiveMerging: false,
      mediaMerging: false,
      rebase: false,
      roundingPrecision: -1
    }))
    .pipe(rename(function (path) {
      path.extname = ".min.css"
    }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('compressjs', function() {
  // return gulp.src(['./public/js/*.js', '!./public/js/*.min.js'])
  //   .pipe(uglify({
  //     mangle: true,
  //     preserveComments: 'license'
  //   }))
  //   .pipe(rename(function (path) {
  //     path.extname = ".min.js"
  //   }))
  //   .pipe(gulp.dest('./public/js/'))
});

// gulp.task('concatjs', function() {
//   return gulp.src(['./public/js/util.min.js','./public/js/vendor/stats.min.js','./public/js/vendor/detectmobile.min.js','./public/js/vendor/shuffle.min.js'])
//     .pipe(concat('support.js'))
//     .pipe(gulp.dest('./public/js/'))
// });

gulp.task('js', ['compileCustom','compileTools','minifyCube']);
