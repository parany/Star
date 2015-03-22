starApp.controller('editNoteController', function ($scope, $routeParams, $http, $location, auth) {
    $scope.tags = [];

    var note;
    var tags = [];
    $http.get('/notes/findOnev2/' + $routeParams.id).then(function(data) {
        note = data.data;
        return $http({
            method: 'POST',
            url: '/tags/findv2',
            data: { Type: 'Note' }
        });
    }).then(function(data) {
        tags = data.data;
        for (var j = 0; j < note.TagIdList.length; j++) {
            note.TagIdList[j] = tags.filter(function (tag) { return tag._id == note.TagIdList[j]; })[0].Description;
        }
        for (var i = 0; i < tags.length; i++) {
            tags[i].IsActive = note.TagIdList.indexOf(tags[i].Description) != -1;
        }
        var result = {
            Note: note,
            Tags: tags
        };
        $scope.note._id = result.Note._id;
        $scope.note.VerseId = result.Note.VerseId;
        $scope.note.Description = result.Note.Description;
        $scope.note.Content = result.Note.Content;
        $scope.tags = result.Tags;
        $scope.tags.forEach(function (tag) { tag.Selected = tag.IsActive; });
    });
    
    $scope.valid = function () {
        return $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0;
    }
    
    $scope.save = function () {
        var data = {
            '_id': $scope.note._id,
            'Description': $scope.note.Description,
            'Content': $scope.note.Content,
            'TagIdList': $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t._id; }),
            'VerseId': $scope.note.VerseId,
            'UpdatedBy': auth.getUserName(),
            'CreatedBy': auth.getUserName()
        };
        $http({
            method: 'POST',
            url: '/notes/update',
            data: data
        }).success(function () {
            $location.path('/');
        }).error(function (error) {
            console.log(error);
        });
    }
});