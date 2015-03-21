starApp.controller('listNoteController', function ($scope, $http, ngTableParams, auth) {
    $scope.notes = [];
    
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
        method: 'GET',
        url: '/note/search/' + auth.getUserName()
    }).success(function (data) {
        $scope.notes = data;
        $scope.tableNote.reload();
    }).error(function (err) {
        console.log(err);
    });
    
    $scope.changeNoteSelected = function (model) {
        angular.forEach($scope.notes, function (m) {
            m.$selected = false;
        });
        model.$selected = !model.$selected;
        $http.get('/note/getNotesByVerseId/' + model.VerseId + '/' + auth.getUserName()).success(function (data) {
            $scope.dtoNote = data;
        });
    }
});