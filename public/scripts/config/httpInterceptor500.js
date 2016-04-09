starApp.factory('htppInterceptor500', ['$q', '$location', function($q, $location) {
	var interceptor = {
		'responseError': function(rejection) {
			if (rejection.status === 403)
				$location.path('/login');
			else if (rejection.status !== 401)
				$location.path('/error500');

			return $q.reject(rejection);
		}
	};
	return interceptor;
}]);

starApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('htppInterceptor500');
}]);