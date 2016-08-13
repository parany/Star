var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('annotate-templates', function() {
	return gulp.src('scripts/**/*.js')
		.pipe(ngAnnotate({
			single_quotes: true,
			remove: true,
			add: true
		}))
		.pipe(gulp.dest('dist'));
});