starApp.controller('loginController', function($rootScope, $scope, $http, $location, $modal, auth) {
    $scope.page.title = 'Login';

    $scope.login = function() {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'message'
        });
        $http({
            method: 'POST',
            url: '/users/find',
            data: {
                UserName: $scope.user.UserName,
                Password: $scope.user.Password
            }
        }).success(function(data) {
            modalInstance.dismiss('cancel');
            if (data.length) {
                auth.setUser(data[0]);
                $rootScope.$emit('account.loggedIn', data[0].FullName);
                $location.path('/');
            } else {
                $scope.error = true;
            }
        });
    };
});