starApp.controller('loginController', function ($rootScope, $scope, $http, $location, auth) {

    $scope.page.title = 'Login';

    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/users/find',
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