var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

gulp.task('useref', function() {
	return gulp.src('../public/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify().on('error', function(e){
            console.log(e);
         })))
		.pipe(gulp.dest('../public/dist'));
});