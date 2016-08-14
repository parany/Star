angular.module('starApp.directives').directive('header', ['$location', '$rootScope', '$route', 'accountService', function($location, $rootScope, $route, accountService) {
    return {
        scope: true,
        templateUrl: 'app/directives/header/header.html',
        restrict: 'E',
        link: function(scope) {
            if ($route.current) {
                scope[$route.current.$$route.menuId] = true;
            }
            scope.isLoggedIn = accountService.isLoggedIn() && localStorage.getItem('token');
            scope.fullName = accountService.getUserFullName();

            scope.logout = function() {
                accountService.logout();
                scope.isLoggedIn = false;
                $location.path('/login');
            };

            $rootScope.$on('account.loggedIn', function(evt, fullName) {
                scope.fullName = fullName;
                scope.isLoggedIn = true;
            });

            $rootScope.$on('account.expired', function() {
                scope.isLoggedIn = false;
            });
        }
    };
}]);