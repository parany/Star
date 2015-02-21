starApp.controller('EditNoteController', function ($scope, $routeParams, $http, $location, apiUrl, auth) {
    $scope.tags = [];

    $http.get(apiUrl + 'Note/GetNoteByVerseId/' + $routeParams.id + '/' + auth.getUserName()).success(function (data) {
        $scope.note.Id = data.Note.Id;
        $scope.note.Description = data.Note.Description;
        $scope.note.Content = data.Note.Content;
        $scope.tags = data.Tags;
        $scope.tags.forEach(function(tag) { tag.Selected = tag.IsActive; });
    });

    $scope.valid = function () {
        return $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0;
    }

    $scope.save = function () {
        var data = {
            'Id': $scope.note.Id,
            'Description': $scope.note.Description,
            'Content': $scope.note.Content,
            'TagIdList': $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t.Id; }),
            'VerseId': $routeParams.id,
            'UpdatedBy': auth.getUserName(),
            'CreatedBy': auth.getUserName()
        };
        $http({
            method: 'POST',
            url: apiUrl + 'Note/Update',
            data: data
        }).success(function () {
            $location.path('/');
        }).error(function (error) {
            console.log(error);
        });
    }
});