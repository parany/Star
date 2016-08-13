angular.module('starApp.controllers', []);
angular.module('starApp.directives', []);
angular.module('starApp.factories', []);
angular.module('starApp.services', []);

angular.module('starApp', [
	'starApp.controllers',
	'starApp.directives',
	'starApp.factories',
	'starApp.services',
	'ngRoute',
	'ngTable',
	'ngCookies',
	'textAngular',
	'chart.js',
	'ui.bootstrap'
]).config(['$compileProvider', 'STAR_CONFIG', function($compileProvider, STAR_CONFIG) {
	$compileProvider.debugInfoEnabled(STAR_CONFIG.debug);
}]);