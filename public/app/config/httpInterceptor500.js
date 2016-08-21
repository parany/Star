angular.module('starApp').factory('htppInterceptor500',
		['$rootScope', '$q', '$location', 'accountService',
			function($rootScope, $q, $location, accountService) {
	var interceptor = {
		'responseError': function(rejection) {
			if (rejection.status === 403 || rejection.status === 401) {
				accountService.logout();
				$rootScope.$emit('account.expired', true);
			} else if (rejection.status !== 500) {
				$location.path('/login');
			}
			return $q.reject(rejection);
		}
	};
	return interceptor;
}]);

angular.module('starApp').config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('htppInterceptor500');
}]);