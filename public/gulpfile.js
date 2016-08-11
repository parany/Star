var gulp = require('gulp');
require('require-dir')('./gulp-tasks');

gulp.task('watch', function() {
	gulp.watch('scripts/**/*.js', ['browserSync']);
	gulp.watch('styles/**/*.css', ['browserSync']);
	gulp.watch('views/**/*.html', ['browserSync']);
});

gulp.task('build-all', ['minify-assets', 'minify-templates'], function() {
	console.log('Building files');
});