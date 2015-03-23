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
    
    var notes = [];
    var verses = [];
    var books = [];
    $http({
        method: 'POST',
        url: '/notes/findv2',
        data: { CreatedBy: auth.getUserName() }
    }).then(function (data) {
        notes = data.data;
        var versesId = notes.map(function (v) { return v.VerseId; });
        return $http({
            method: 'POST',
            url: '/verses/findv2',
            data: { _id: { in: versesId } }
        });
    }).then(function (data) {
        verses = data.data;
        return $http.get('/books/findAllv2');
    }).then(function (data) {
        books = data.data;
        for (var i = 0; i < notes.length; i++) {
            var verse = verses.filter(function (v) {
                return notes[i].VerseId.toString() == v._id.toString();
            })[0];
            var book = books.filter(function (b) { return b._id == verse.BookId; })[0];
            notes[i].Verse = book.Description + ' ' + verse.Chapter + ',' + verse.Paragraph;
            notes[i].DisplayOrder = book.DisplayOrder;
            notes[i].Chapter = verse.Chapter;
            notes[i].Paragraph = verse.Paragraph;
            notes[i].VerseId = verse._id;
            notes[i].NoteId = notes[i]._id;
        }
        notes.sort(function (n1, n2) {
            if (n1.DisplayOrder > n2.DisplayOrder) return 1;
            if (n1.DisplayOrder < n2.DisplayOrder) return -1;
            if (n1.Chapter > n2.Chapter) return 1;
            if (n1.Chapter < n2.Chapter) return -1;
            if (n1.Paragraph > n2.Paragraph) return 1;
            if (n1.Paragraph < n2.Paragraph) return -1;
            return 0;
        });
        $scope.notes = notes;
        $scope.tableNote.reload();
    });
    
    $scope.changeNoteSelected = function (model) {
        angular.forEach($scope.notes, function (m) {
            m.$selected = false;
        });
        model.$selected = !model.$selected;
        var selectedNotes = [];
        var tags = [];
        $http({
            method: 'POST',
            url: '/notes/findv2',
            data: { VerseId: model.VerseId }
        }).then(function (data) {
            selectedNotes = data.data;
            return $http({
                method: 'POST',
                url: '/tags/findv2',
                data: { Type: 'Note' }
            });
        }).then(function (data) {
            tags = data.data;
            for (var i = 0; i < selectedNotes.length; i++) {
                for (var j = 0; j < selectedNotes[i].TagIdList.length; j++) {
                    selectedNotes[i].TagIdList[j] = tags.filter(function (tag) { return tag._id == selectedNotes[i].TagIdList[j]; })[0].Description;
                }
            }
            var myNote = selectedNotes.filter(function (note) { return note.CreatedBy == auth.getUserName(); })[0];
            var otherNotes = selectedNotes.filter(function (note) { return note.CreatedBy != auth.getUserName(); });
            var results = {
                MyNote: myNote,
                OtherNotes: otherNotes
            };
            $scope.dtoNote = results;
        });
    }
});