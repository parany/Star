starApp.controller('loginController', function($rootScope, $scope, $location, $modal, accountService) {
    $scope.page.title = 'Login';

    $scope.login = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'message'
        });
        accountService.authenticate($scope.user.UserName, $scope.user.Password).success(function(data) {
            modalInstance.dismiss('cancel');
            if (data) {
                accountService.setData(data);
                $rootScope.$emit('account.loggedIn', data.user.FullName);
                $location.path('/');
            } else {
                $scope.error = true;
            }
        }).error(function() {
            $scope.error = true;
            modalInstance.dismiss('cancel');
        });
    };
});