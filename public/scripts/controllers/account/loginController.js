starApp.controller('loginController', function ($rootScope, $scope, $http, $location, apiUrl, auth) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/user/login',
            data: $scope.user
        }).success(function (data) {
            if (data != "") {
                auth.setUser(data);
                $rootScope.$emit('account.loggedIn', data.FullName);
                $location.path('/');
            }
        }).error(function (error) {
            console.log(error);
        });
    }
});