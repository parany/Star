starApp.controller('AddNoteController', function ($scope, $routeParams, $http, $location, apiUrl, auth) {
    $scope.tags = [];
    $http.get(apiUrl + 'Tag/GetByType/Note').success(function (data) {
        $scope.tags = data;
    });

    $scope.Content = '';

    $scope.valid = function () {
        return $scope.addTreaty.$invalid 
                && $scope.treaty.Text == ''
                && $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0;
    }

    $scope.save = function () {
        var data = {
            'Description': $scope.Description,
            'Content': $scope.Content,
            'TagIdList': $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t.Id; }),
            'VerseId': $routeParams.id,
            'CreatedBy': auth.getUserName()
        };
        $http({
            method: 'POST',
            url: apiUrl + 'Note/Insert',
            data: data
        }).success(function () {
            $location.path('/');
        }).error(function (error) {
            console.log(error);
        });
    }
});