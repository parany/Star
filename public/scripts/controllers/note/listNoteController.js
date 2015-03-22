starApp.controller('listNoteController', function ($scope, $http, ngTableParams, auth) {
    $scope.notes = [];
    
    $scope.tableNote = new ngTableParams({
        page: 1,
        total: 1,
        count: 250
    }, {
        counts: [],
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
        var notes = [];
        var tags = [];
        $http({
            method: 'POST',
            url: '/notes/findv2',
            data: { VerseId: model.VerseId }
        }).then(function (data) {
            notes = data.data;
            return $http({
                method: 'POST',
                url: '/tags/findv2',
                data: { Type: 'Note' }
            });
        }).then(function (data) {
            tags = data.data;
            for (var i = 0; i < notes.length; i++) {
                for (var j = 0; j < notes[i].TagIdList.length; j++) {
                    notes[i].TagIdList[j] = tags.filter(function (tag) { return tag._id == notes[i].TagIdList[j]; })[0].Description;
                }
            }
            var myNote = notes.filter(function (note) { return note.CreatedBy == auth.getUserName(); })[0];
            var otherNotes = notes.filter(function (note) { return note.CreatedBy != auth.getUserName(); });
            var results = {
                MyNote: myNote,
                OtherNotes: otherNotes
            };
            $scope.dtoNote = results;
        });
    }
});