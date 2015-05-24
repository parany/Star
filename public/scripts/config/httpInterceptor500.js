starApp.factory('htppInterceptor500', function($q, $location) {
	var interceptor = {
		'responseError': function(rejection) {
			$location.path('/error500');
			return $q.reject(rejection);
		}
	};
	return interceptor;
});

starApp.config(function($httpProvider) {
	$httpProvider.interceptors.push('htppInterceptor500');
});