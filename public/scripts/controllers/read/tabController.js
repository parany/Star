starApp.controller('tabController', function ($scope, $rootScope, $http, auth) {
    $rootScope.$on('read.changeSelect', function (event, id) {
        var notes = [];
        var tags = [];
        $http({
            method: 'POST',
            url: '/notes/findv2',
            data: { VerseId: id }
        }).then(function(data) {
            notes = data.data;
            return $http({
                method: 'POST',
                url: '/tags/findv2',
                data: { Type: 'Note' }
            });
        }).then(function(data) {
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
    });
});