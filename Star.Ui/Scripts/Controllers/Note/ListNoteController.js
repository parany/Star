starApp.controller('ListNoteController', function ($scope, $http, ngTableParams, apiUrl, auth) {
    $scope.notes = [];

    //$scope.tags = [];
    //$http.get(apiUrl + 'Tag/GetAll').success(function (data) {
    //    $scope.tags = data;
    //});

    $scope.tableNote = new ngTableParams({
        page: 1,
        total: 1,
        count: 250
    }, {
        counts: [], // hide page counts control
        getData: function ($defer, params) {
            $defer.resolve($scope.notes.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.tableNote.settings().$scope = $scope;

    $http({
        method: 'POST',
        url: apiUrl + 'Note/SearchNotes',
        data: {
            UserName: auth.getUserName(),
            //TextToSearch: $scope.textToSearch,
            //TagIds: $scope.tags.filter(function(t) { return t.Selected == true; })
        }
    }).success(function (data) {
        $scope.notes = data;
        $scope.tableNote.reload();
    }).error(function(err) {
        console.log(err);
    });

    $scope.changeNoteSelected = function (model) {
        angular.forEach($scope.notes, function(m) {
            m.$selected = false;
        });
        model.$selected = !model.$selected;
        $http.get(apiUrl + 'Note/GetNotesByVerseId/' + model.NoteId + '/' + auth.getUserName()).success(function (data) {
            $scope.dtoNote = data;
        });
    }
});