angular.module('starApp.controllers', []);

starApp = angular.module('starApp', [
	'starApp.controllers',
	'ngRoute',
	'ngTable',
	'ngCookies',
	'textAngular',
	'chart.js',
	'ui.bootstrap'
]);

starApp.config(['$compileProvider', 'STAR_CONFIG', function($compileProvider, STAR_CONFIG) {
	$compileProvider.debugInfoEnabled(STAR_CONFIG.debug);
}]);