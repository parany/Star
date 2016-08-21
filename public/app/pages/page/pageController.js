angular.module('starApp.controllers').controller('pageController',
    ['$scope', '$rootScope', '$location', '$route','accountService',
        function ($scope, $rootScope, $location, $route, accountService) {
    $scope.page = {};
    $scope.page.users = [];
    $scope.page.messages = {};
    $scope.page.nbOfNotifications = 0;

    $scope.isLoggedIn = accountService.isLoggedIn();
    $scope.fullName = accountService.getUserFullName();

    $scope.logout = function () {
        accountService.logout();
        $scope.isLoggedIn = false;
        $location.path('/login');
    };

    $rootScope.$on('account.expired', function () {
        $scope.isLoggedIn = false;
        $location.path('/login');
    });
}]);