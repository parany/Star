starApp.directive('header', function($location, $rootScope, $route, auth) {
    return {
        scope: true,
        templateUrl: 'views/directives/core/header.html',
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope[$route.current.$$route.menuId] = true;
            scope.isLoggedIn = auth.isLoggedIn();
            scope.fullName = auth.getUserFullName();

            scope.logout = function() {
                auth.logout();
                scope.isLoggedIn = false;
                $location.path('/login');
            };

            $rootScope.$on('account.loggedIn', function(evt, fullName) {
                scope.fullName = fullName;
                scope.isLoggedIn = true;
            });
        }
    };
});