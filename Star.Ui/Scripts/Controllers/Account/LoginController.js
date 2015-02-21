﻿starApp.controller('LoginController', function ($rootScope, $scope, $http, $location, apiUrl, auth) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: apiUrl + 'User/Login',
            data: $scope.user
        }).success(function (data) {
            if (data != "null") {
                auth.setUser(data);
                $rootScope.$emit('account.loggedIn', data.FullName);
                $location.path('/');
            }
        }).error(function (error) {
            console.log(error);
        });
    }
});