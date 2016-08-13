angular.module('starApp.controllers', []);
angular.module('starApp.directives', []);
angular.module('starApp.factories', []);

starApp = angular.module('starApp', [
	'starApp.controllers',
	'starApp.directives',
	'starApp.factories',
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