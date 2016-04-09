var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('useref', function() {
	return gulp.src('../public/scripts/**/*.js')
		.pipe(ngAnnotate({
			single_quotes: true
		}))
		// .pipe(useref())
		// .pipe(gulpIf('*.js', uglify().on('error', function(e){
		//           console.log(e);
		//        })))
		.pipe(gulp.dest('../public/dist'));
});