﻿starApp.controller('loginController', function ($rootScope, $scope, $http, $location, auth) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/users/findv2',
            data: { UserName: $scope.user.UserName, Password: $scope.user.Password }
        }).success(function (data) {
            if (data != "") {
                auth.setUser(data[0]);
                $rootScope.$emit('account.loggedIn', data[0].FullName);
                $location.path('/');
            }
        }).error(function (error) {
            console.log(error);
        });
    }
});