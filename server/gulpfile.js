var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var cssnano = require('gulp-cssnano');
var minifyHtml = require('gulp-minify-html');
var ngTemplate = require('gulp-ng-template');

gulp.task('useref', function() {
	return gulp.src('../public/index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify().on('error', function(e) {
			console.log(e);
		})))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('../public/dist'));
});

gulp.task('template', function() {
	return gulp.src('../public/**/*.html')
		.pipe(minifyHtml({
			empty: true,
			quotes: true
		}))
		.pipe(ngTemplate({
			moduleName: 'starTemplateApp',
			standalone: true,
			filePath: 'template/templates.js'
		}))
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