angular.module('starApp').factory('htppInterceptor500', ['$rootScope', '$q', '$location', function($rootScope, $q, $location) {
	var interceptor = {
		'responseError': function(rejection) {
			if (rejection.status === 403 || rejection.status === 401) {
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				$rootScope.$emit('account.expired', true);
				$location.path('/login');
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