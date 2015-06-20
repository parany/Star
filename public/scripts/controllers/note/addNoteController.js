starApp.controller('addNoteController', function($scope, $routeParams, $http, $location, accountService) {
    $scope.tags = [];
    $http({
        method: 'POST',
        url: '/tags/find',
        data: {
            Type: 'Note'
        }
    }).success(function(data) {
        $scope.tags = data;
    });

    $scope.Content = '';

    $scope.valid = function() {
        return $scope.tags.filter(function(t) {
            return t.Selected === true;
        }).length > 0;
    };

    $scope.save = function() {
        var data = {
            'Description': $scope.Description,
            'Content': $scope.Content,
            'TagIdList': $scope.tags.filter(function(t) {
                return t.Selected === true;
            }).map(function(t) {
                return t._id;
            }),
            'VerseId': $routeParams.id,
            'CreatedBy': accountService.getUserName()
        };
        $http({
            method: 'POST',
            url: '/notes/insert',
            data: data
        }).success(function() {
            $location.path('/');
        }).error(function(error) {
            console.log(error);
        });
    };
});