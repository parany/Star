var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');
var Repository = require('../model/repositoryv2.js');

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
                notes[i].TagIdList[j] = _.find(tags, function (tag) { return tag._id == notes[i].TagIdList[j]; }).Description;
            }
        }
        var myNote = _.find(notes, function (note) { return note.CreatedBy == req.params.author; });
        var otherNotes = notes.filter(function (note) { return note.CreatedBy != req.params.author; });
        var results = {
            MyNote: myNote,
            OtherNotes: otherNotes
        };
        res.send(results);
    });
}

exports.getNoteById = function (req, res) {
    var notesRepository = new Repository('notes');
    var tagsRepository = new Repository('tags');
    var note;
    notesRepository.findOne({ _id: new ObjectId(req.params.id) }).then(function (doc) {
        note = doc;
        return tagsRepository.find({ Type: 'Note' });
    }).then(function (tags) {
        for (var j = 0; j < note.TagIdList.length; j++) {
            note.TagIdList[j] = tags.filter(function (tag) { return tag._id == note.TagIdList[j]; })[0].Description;
        }
        for (var i = 0; i < tags.length; i++) {
            tags[i].IsActive = note.TagIdList.indexOf(tags[i].Description) != -1;
        }
        var result = {
            Note: note,
            Tags: tags
        };
        res.send(result);
    });
}