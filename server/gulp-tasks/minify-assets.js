var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

gulp.task('minify-assets', function() {
	return gulp.src('../public/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify().on('error', function(e) {
			console.log(e);
		})))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('../public/dist'));
});