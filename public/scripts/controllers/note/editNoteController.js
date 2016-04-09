starApp.controller('editNoteController', ['$scope', '$routeParams', '$location', 'noteService', 'genericService', function($scope, $routeParams, $location, noteService, genericService) {
    $scope.tags = [];

    noteService.getNote($routeParams.id).success(function(data) {
        $scope.note._id = data.Note._id;
        $scope.note.VerseId = data.Note.VerseId;
        $scope.note.Description = data.Note.Description;
        $scope.note.Content = data.Note.Content;
        $scope.tags = data.Tags;
        $scope.tags.forEach(function(tag) {
            tag.Selected = tag.IsActive;
        });
    });

    $scope.valid = function() {
        return $scope.tags.filter(function(t) {
            return t.Selected === true;
        }).length > 0;
    };

    $scope.save = function() {
        var data = {
            '_id': $scope.note._id,
            'Description': $scope.note.Description,
            'Content': $scope.note.Content,
            'TagIdList': $scope.tags.filter(function(t) {
                return t.Selected === true;
            }).map(function(t) {
                return t._id;
            }),
            'VerseId': $scope.note.VerseId
        };
        genericService.update('notes', data).success(function() {
            $location.path('/');
        }).error(function(error) {
            console.log(error);
        });
    };
}]);