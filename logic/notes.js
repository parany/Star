var ObjectId = require('mongodb').ObjectID;
var Repository = require('../model/repositoryv2.js');
require('../helpers/filterHelper.js');

exports.getNotesByVerseId = function (req, res) {
    var notesRepository = new Repository('notes');
    var tagsRepository = new Repository('tags');
    var notes;
    notesRepository.find({ VerseId: req.params.verseId }).then(function (docs) {
        notes = docs;
        return tagsRepository.find({ Type: 'Note' });
    }).then(function (tags) {
        for (var i = 0; i < notes.length; i++) {
            for (var j = 0; j < notes[i].TagIdList.length; j++) {
                notes[i].TagIdList[j] = tags.filter(function (tag) { return tag._id == notes[i].TagIdList[j]; })[0].Description;
            }
        }
        var myNote = notes.filter(function (note) { return note.CreatedBy == req.params.author; })[0];
        var otherNotes = notes.filter(function (note) { return note.CreatedBy != req.params.author; });
        var results = {
            MyNote: myNote,
            OtherNotes: otherNotes
        };
        res.send(results);
    });
}