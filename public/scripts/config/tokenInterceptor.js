starApp.factory('tokenInterceptor', ['$q', '$location', function ($q, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (localStorage.token) {
                config.headers.Authorization = localStorage.token;
            }
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            return response || $q.when(response);
        },
 
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection !== null && rejection.status === 401 && (localStorage.token)) {
                localStorage.removeItem('token');
                $location.path('/login');
            }
 
            return $q.reject(rejection);
        }
    };
}]);

starApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
}]);