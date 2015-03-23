starApp.controller('addNoteController', function ($scope, $routeParams, $http, $location, auth) {
    $scope.tags = [];
    $http({
        method: 'POST',
        url: '/tags/findv2',
        data: { Type: 'Note' }
    }).success(function (data) {
        $scope.tags = data;
    });
    
    $scope.Content = '';
    
    $scope.valid = function () {
        return $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0;
    }
    
    $scope.save = function () {
        var data = {
            'Description': $scope.Description,
            'Content': $scope.Content,
            'TagIdList': $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t._id; }),
            'VerseId': $routeParams.id,
            'CreatedBy': auth.getUserName()
        };
        $http({
            method: 'POST',
            url: '/notes/insertv2',
            data: data
        }).success(function () {
            $location.path('/');
        }).error(function (error) {
            console.log(error);
        });
    }
});