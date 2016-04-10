var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var cssnano = require('gulp-cssnano');

gulp.task('useref', function() {
	return gulp.src('../public/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify().on('error', function(e) {
			console.log(e);
		})))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('../public/dist'));
});

gulp.task('ng-annotate', function() {
	return gulp.src('../public/scripts/**/*.js')
		.pipe(ngAnnotate({
			single_quotes: true,
			remove: true,
			add: true
		}))
		.pipe(gulp.dest('../public/dist'));
});