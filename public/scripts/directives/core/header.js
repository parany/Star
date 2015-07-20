starApp.directive('header', function($location, $rootScope, $route, accountService) {
    return {
        scope: true,
        templateUrl: 'views/directives/core/header.html',
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope[$route.current.$$route.menuId] = true;
            scope.isLoggedIn = accountService.isLoggedIn();
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
        }
    };
});