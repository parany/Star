starApp.controller('listNoteController', function($scope, $http, ngTableParams, auth) {
    $scope.notes = [];
    
    $scope.page.title = 'Note - List';

    $scope.tableNote = new ngTableParams({
        page: 1,
        count: 10
    }, {
        counts: [],
        getData: function($defer, params) {
            $defer.resolve($scope.notes.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.tableNote.settings().$scope = $scope;

    $http.get('/notes/getAllNotesWithAssociatedBooks/' + auth.getUserName()).success(function(data) {
        $scope.notes = data;
        $scope.tableNote.settings().total = $scope.notes.length;
        $scope.tableNote.parameters().page = 1;
        $scope.tableNote.reload();
    });

    $scope.changeNoteSelected = function(model) {
        $scope.notes.forEach(function(note){
            note.$selected = false;
        });
        model.$selected = !model.$selected;
        $scope.page.title = 'Note - ' + model.Verse;
        $http.get('/notes/getNotesByVerseId/' + auth.getUserName() + '/' + model.VerseId).success(function(data) {
            $scope.dtoNote = data;
        });
    };
});