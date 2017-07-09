/// <binding BeforeBuild='default' ProjectOpened='watch-less, watch-js' />
var gulp = require('gulp');
//var pug = require('gulp-pug');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');

gulp.task('css', function () {
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./wwwroot/css', { overwrite:true }));
});

gulp.task('watch-less', function () {
    gulp.watch('./less/*.less', ['css']);
});

gulp.task('font-awesome', function () {
    return gulp.src('./less/font-awesome/*.less')
        .pipe(concat('font-awesome.css'))
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./wwwroot/css/', { overwrite: true }));
});


gulp.task('jsLibs', function () {
    return gulp.src('./node_modules/**/*.js', { base:"./node_modules/" })
        .pipe(gulp.dest('./wwwroot/scripts/libs'));
});

gulp.task('jsCode', function () {
    return gulp.src(['./js/**/*.js', './js/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./wwwroot/scripts/app'));
});

gulp.task('watch-js', function () {
    gulp.watch('./js/**/*.js', ['jsCode']);
});

gulp.task('fonts', function () {
    return gulp.src('./fonts/*.*')
        .pipe(gulp.dest('./wwwroot/fonts'));
});


gulp.task('default', ['css', "jsLibs", "jsCode", "fonts", "font-awesome"]);