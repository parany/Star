angular.module('starApp').factory('htppInterceptor500', ['$q', '$location', function($q, $location) {
	var interceptor = {
		'responseError': function(rejection) {
			if (rejection.status === 403) {
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				$location.path('/login');
			} else if (rejection.status !== 401) {
				$location.path('/error500');
			}

			return $q.reject(rejection);
		}
	};
	return interceptor;
}]);

angular.module('starApp').config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('htppInterceptor500');
}]);