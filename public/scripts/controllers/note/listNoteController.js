starApp.controller('listNoteController', function($scope, accountService, noteService, starTable) {
    $scope.page.title = 'Note - List';

    $scope.notes = [];
    $scope.tableNote = starTable.create($scope, 'notes');

    $scope.search = function() {
        noteService.search(accountService.getUserName(), $scope.txtSearch).success(function(data) {
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
        noteService.getNotes(accountService.getUserName(), model.VerseId).success(function(data) {
            $scope.dtoNote = data;
        });
    };
});