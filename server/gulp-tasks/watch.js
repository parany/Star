var gulp = require('gulp');
var browserSync = require('browser-sync');

browserSync.init({
	proxy: 'http://localhost:4444/#/'
});
gulp.task('browserSync', function() {
	browserSync.reload();
});

gulp.task('live-reload', function() {
	gulp.watch('../public/scripts/**/*.js', ['browserSync']);
	gulp.watch('../public/styles/**/*.css', ['browserSync']);
	gulp.watch('../public/views/**/*.html', ['browserSync']);
});

