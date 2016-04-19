starApp.controller('listNoteController', ['$scope', 'noteService', 'starTable', function($scope, noteService, starTable) {
    $scope.page.title = 'Note - List';

    $scope.notes = [];
    $scope.tableNote = starTable.create($scope, 'notes');

    $scope.search = function() {
        noteService.search($scope.txtSearch).success(function(data) {
            $scope.notes = data;
            $scope.tableNote.settings().total = $scope.notes.length;
            $scope.tableNote.parameters().page = 1;
            $scope.tableNote.reload();
        });
    };

    $scope.search();

    $scope.changeNoteSelected = function(model) {
        $scope.notes.forEach(function(note) {
            note.$selected = false;
        });
        model.$selected = !model.$selected;
        $scope.page.title = 'Note - ' + model.Verse;
        noteService.getNotes(model.VerseId).success(function(data) {
            $scope.dtoNote = data;
        });
    };
}]);