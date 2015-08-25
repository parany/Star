starApp = angular.module('starApp', [
	'ngRoute',
	'ngTable',
	'ngCookies',
	'textAngular',
	'chart.js',
	'ui.bootstrap'
]);

starApp.config(function($compileProvider, STAR_CONFIG) {
	$compileProvider.debugInfoEnabled(STAR_CONFIG.debug);
});