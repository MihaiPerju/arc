var gulp = require('gulp');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('svg-sprite', function () {
    return gulp
        .src(config.devFilesSvgIcons)
        .pipe($.svgmin())
        .pipe($.svgstore())
        .pipe(gulp.dest(config.prodPathIcons));
});

//install gulp-watch if you want to run this
// gulp.task('default', ['svg-sprite'], function () {
//     $.watch(config.devFilesSvgIcons, function() {
//         gulp.start('svg-sprite');
//     });
//
// });

