var gulp = require('gulp');

gulp.task('watch', function() {
	gulp.watch('../public/scripts/**/*.js', ['browserSync']);
	gulp.watch('../public/styles/**/*.css', ['browserSync']);
	gulp.watch('../public/views/**/*.html', ['browserSync']);
});

var browserSync = require('browser-sync');
browserSync.init({
	proxy: 'http://localhost:4444/#/'
});
gulp.task('browserSync', function() {
	browserSync.reload();
});

var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
gulp.task('assets', function() {
	return gulp.src('../public/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify().on('error', function(e) {
			console.log(e);
		})))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('../public/dist'));
});

var minifyHtml = require('gulp-minify-html');
var ngTemplate = require('gulp-ng-template');
gulp.task('templates', function() {
	return gulp.src('../public/**/*.html')
		.pipe(minifyHtml({
			empty: true,
			quotes: true
		}))
		.pipe(ngTemplate({
			moduleName: 'starApp',
			standalone: false,
			filePath: 'template/templates.js'
		}))
		.pipe(gulp.dest('../public/dist'));
});

var ngAnnotate = require('gulp-ng-annotate');
gulp.task('annotate', function() {
	return gulp.src('../public/scripts/**/*.js')
		.pipe(ngAnnotate({
			single_quotes: true,
			remove: true,
			add: true
		}))
		.pipe(gulp.dest('../public/dist'));
});
