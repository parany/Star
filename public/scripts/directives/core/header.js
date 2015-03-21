starApp.directive('header', function ($location, $rootScope, $route, auth) {
    $rootScope.$on('account.loggedIn', function (evt, fullName) {
        $rootScope.fullName = fullName;
        $rootScope.isLoggedIn = true;
    });

    return {
        scope: false,
        templateUrl: 'views/directives/core/header.html',
        restrict: 'E',
        link: function (scope, element, attrs) {
            scope.isLoggedIn = auth.isLoggedIn();

            scope.fullName = auth.getUserFullName();

            scope.logout = function () {
                auth.logout();
                scope.isLoggedIn = false;
                $location.path('/login');
            }
        }
    };
})