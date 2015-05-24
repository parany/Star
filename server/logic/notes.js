var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');
var Repository = require('../model/repository.js');

exports.getNotesByVerseId = function (req, res) {
    var notesRepository = new Repository('notes');
    var tagsRepository = new Repository('tags');
    var notes;
    notesRepository.find({
        VerseId: req.params.verseId
    }).then(function (docs) {
        notes = docs;
        return tagsRepository.find({
            Type: 'Note'
        });
    }).then(function (tags) {
        tags.forEach(function (tag) {
            tag._id = tag._id.toString();
        });
        for (var i = 0; i < notes.length; i++) {
            for (var j = 0; j < notes[i].TagIdList.length; j++) {
                notes[i].TagIdList[j] = _.findWhere(tags, { _id: notes[i].TagIdList[j] }).Description;
            }
        }
        var myNote = _.findWhere(notes, { CreatedBy: req.params.author });
        var otherNotes = notes.filter(function (note) {
            return note.CreatedBy !== req.params.author;
        });
        var results = {
            MyNote: myNote,
            OtherNotes: otherNotes
        };
        res.send(results);
    });
};

exports.getNoteById = function (req, res) {
    var notesRepository = new Repository('notes');
    var tagsRepository = new Repository('tags');
    var note;
    notesRepository.findOne({
        _id: new ObjectId(req.params.id)
    }).then(function (doc) {
        note = doc;
        return tagsRepository.find({
            Type: 'Note'
        });
    }).then(function (tags) {
        tags.forEach(function (tag) {
            tag._id = tag._id.toString();
        });
        for (var j = 0; j < note.TagIdList.length; j++) {
            note.TagIdList[j] = _.findWhere(tags, { _id: note.TagIdList[j] }).Description;
        }
        for (var i = 0; i < tags.length; i++) {
            tags[i].IsActive = note.TagIdList.indexOf(tags[i].Description) !== -1;
        }
        var result = {
            Note: note,
            Tags: tags
        };
        res.send(result);
    });
};

exports.getAllNotesWithAssociatedBooks = function (req, res) {
    var notesRepository = new Repository('notes'),
        versesRepository = new Repository('verses'),
        booksRepository = new Repository('books'),
        notes = [],
        verses = [];
    notesRepository.find({
        CreatedBy: req.params.author
    }).then(function (docs) {
        notes = docs;
        var versesId = notes.map(function (n) {
            return new ObjectId(n.VerseId);
        });
        return versesRepository.find({
            _id: {
                $in: versesId
            }
        });
    }).then(function (docs) {
        verses = docs;
        return booksRepository.find({});
    }).then(function (books) {
        verses.forEach(function(verse){
            verse._id = verse._id.toString();
        });
        books.forEach(function(book){
           book._id = book._id.toString(); 
        });
        for (var i = 0; i < notes.length; i++) {
            var verse = _.findWhere(verses, { _id : notes[i].VerseId.toString() });
            var book = _.findWhere(books, { _id: verse.BookId.toString() });
            notes[i].Verse = book.Description + ' ' + verse.Chapter + ',' + verse.Paragraph;
            notes[i].DisplayOrder = book.DisplayOrder;
            notes[i].TestamentId = book.TestamentId;
            notes[i].Chapter = verse.Chapter;
            notes[i].Paragraph = verse.Paragraph;
            notes[i].VerseId = verse._id;
            notes[i].NoteId = notes[i]._id;
        }
        notes.sort(function (n1, n2) {
            if (n1.TestamentId > n2.TestamentId) return 1;
            if (n1.TestamentId < n2.TestamentId) return -1;
            if (n1.DisplayOrder > n2.DisplayOrder) return 1;
            if (n1.DisplayOrder < n2.DisplayOrder) return -1;
            if (n1.Chapter > n2.Chapter) return 1;
            if (n1.Chapter < n2.Chapter) return -1;
            if (n1.Paragraph > n2.Paragraph) return 1;
            if (n1.Paragraph < n2.Paragraph) return -1;
            return 0;
        });
        res.send(notes);
    });
};