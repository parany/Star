angular.module('starApp.controllers').controller('editNoteController', ['$scope', '$routeParams', '$location', 'noteService', 'genericService', function($scope, $routeParams, $location, noteService, genericService) {
    $scope.tags = [];

    noteService.getNote($routeParams.id).success(function(data) {
        $scope.note = data.Note;
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