/*
 *
 * TaskList =>  [watch]       >> Watch for changes on all dirs and files
 *              [init]        >> Initial command to generate everything
 *              [build-css]   >> Generate your CSS
 *              [minify-css]  >> Minify your generated css
 *              [build-js]    >> Bundle all custom .js files
 *              [jshint]      >> Check js for error
 *              [image-opt]   >> Optimize image size
 *              [copy-html]   >> Copy the HTML source
 *              [w3cjs]       >> Validate your HTML
 *              [copy-fonts]  >> copy fonts to public dir
 *              [serve]       >> start a development server
 */

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    image = require('gulp-image'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace');
    sourcemaps = require('gulp-sourcemaps'),
    fs = require('fs-extra'),
    rename = require("gulp-rename"),
    w3cjs = require('gulp-w3cjs'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,

    input = {
        'html': 'source/*.html',
        'images': 'source/assets/images/**/*.*',
        'sass': 'source/assets/scss/**/*.scss',
        'javascript': 'source/assets/javascript/**/*.js',
        'vendorjs': 'public/assets/javascript/vendor/**/*.js',
        'fonts': 'source/assets/fonts/**/*.*'
    },
    output = {
        'html': 'public',
        'stylesheets': 'public/assets/stylesheets',
        'sourcestylesheets': 'source/assets/stylesheets',
        'javascript': 'public/assets/javascript',
        'images': 'public/assets/images',
        'fonts': 'public/assets/fonts'
    };


gulp.task('default', ['watch']);

gulp.task('init', ['copy-html', 'build-css', 'build-js', 'image-opt', 'copy-fonts']);

gulp.task('build', ['copy-html', 'build-css', 'build-js', 'image-opt', 'copy-fonts', 'minify-css']);


gulp.task('watch', function () {
    gulp.start('serve');
    gulp.watch(input.javascript, ['jshint', 'build-js']);
    gulp.watch(input.sass, ['build-css']);
    gulp.watch(input.html, ['copy-html']);
    gulp.watch(input.images, ['image-opt']);
    gulp.watch(input.fonts, ['copy-fonts']);
});

gulp.task('jshint', function () {
    gulp.src(input.javascript)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('build-css', function () {
    gulp.src(input.sass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.sourcestylesheets))
        .pipe(gulp.dest(output.stylesheets))
        .pipe(reload({ stream:true }))
});

gulp.task('minify-css', function () {
    gulp.src(output.sourcestylesheets + '/*.css')
        .pipe(cleanCSS({compatibility: 'ie9'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(output.stylesheets));
    gulp.src(output.html+'/*.html')
        .pipe(replace('main.css', 'main.min.css'))
        .pipe(gulp.dest(output.html));
});

gulp.task('build-js', function () {
        gulp.src(input.javascript)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        //only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.javascript))
        .pipe(reload({ stream:true }))
});

gulp.task('image-opt', function () {
    gulp.src(input.images)
        .pipe(image())
        .pipe(gulp.dest(output.images))
        .pipe(reload({ stream:true }))
});

gulp.task('copy-html', function () {
    gulp.src(input.html)
        .pipe(gulp.dest(output.html))
        .pipe(reload({ stream:true }))
});

gulp.task('copy-fonts', function () {
    gulp.src(input.fonts)
        .pipe(gulp.dest(output.fonts))
        .pipe(reload({ stream:true }))
});

gulp.task('w3cjs', function () {
    gulp.src(output.html + '/*.html')
        .pipe(w3cjs())
        .pipe(w3cjs.reporter())
});

gulp.task('serve', function() {
    browserSync.init({
      server: {baseDir: "public"},
      port: "1337",
      ui: {port: "7331"}
    });
  });
