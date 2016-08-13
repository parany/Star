var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var ngTemplate = require('gulp-ng-template');

gulp.task('minify-templates', function() {
	return gulp.src(['../public/**/*.html', '!./node_modules/**'])
		.pipe(minifyHtml({
			empty: true,
			quotes: true
		}))
		.pipe(ngTemplate({
			moduleName: 'starApp',
			standalone: false,
			filePath: 'template/templates.js'
		}))
		.pipe(gulp.dest('dist'));
});