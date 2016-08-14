var jshint = require('gulp-jshint');
var gulp = require('gulp');

gulp.task('jshint', function () {
    return gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));
});