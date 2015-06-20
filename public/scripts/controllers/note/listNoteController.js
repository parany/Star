starApp.controller('listNoteController', function($scope, $http, ngTableParams, accountService) {
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

    $scope.search = function() {
        var url = '/notes/search/' + accountService.getUserName();
        if ($scope.txtSearch) {
            url += '/' + $scope.txtSearch;
        }
        $http.get(url).success(function(data) {
            $scope.notes = data;
            console.log($scope.notes.length);
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
        $http.get('/notes/getNotesByVerseId/' + accountService.getUserName() + '/' + model.VerseId).success(function(data) {
            $scope.dtoNote = data;
        });
    };
});