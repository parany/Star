angular.module('starApp.controllers').controller('loginController', ['$rootScope', '$scope', '$location', '$modal', 'accountService', function($rootScope, $scope, $location, $modal, accountService) {
    $scope.page.title = 'Login';

    $scope.login = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'message'
        });
        accountService.authenticate($scope.user.UserName, $scope.user.Password).success(function(data) {
            modalInstance.dismiss('cancel');
            if (data) {
                accountService.login(data);
                $scope.$parent.fullName = data.user.FullName;
                $scope.$parent.isLoggedIn = true;
                $location.path('/');
            } else {
                $scope.error = true;
            }
        }).error(function() {
            $scope.error = true;
            modalInstance.dismiss('cancel');
        });
    };
}]);