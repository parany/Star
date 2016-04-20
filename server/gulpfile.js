var gulp = require('gulp');
require('require-dir')('./gulp-tasks');

gulp.task('watch', function() {
	gulp.watch('../public/scripts/**/*.js', ['browserSync']);
	gulp.watch('../public/styles/**/*.css', ['browserSync']);
	gulp.watch('../public/views/**/*.html', ['browserSync']);
});

gulp.task('build-all', ['minify-assets', 'minify-templates'], function() {
	console.log('Building files');
});