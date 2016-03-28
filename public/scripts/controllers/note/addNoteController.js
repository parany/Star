starApp.controller('addNoteController', function($scope, $routeParams, $location, accountService, genericService) {
    $scope.tags = [];
    genericService.find('tags', {
        Type: 'Note'
    }).success(function(data) {
        $scope.tags = data;
    });

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
            'VerseId': $routeParams.id
        };
        genericService.insert('notes', data).success(function() {
            $location.path('/');
        }).error(function(error) {
            console.log(error);
        });
    };
});