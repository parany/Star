var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;

var booksCollection = repository.getCollection('books');
var versesCollection = repository.getCollection('verses');
var notesCollection = repository.getCollection('notes');
var tagsCollection = repository.getCollection('tags');

exports.searchNotes = function (req, res) {
    notesCollection.find({ CreatedBy: req.params.author }).toArray(function (noteErr, notes) {
        var versesId = notes.map(function (note) { return note.VerseId; });
        versesCollection.find({ _id: { $in: versesId } }).toArray(function (verseErr, verses) {
            booksCollection.find({}).toArray(function (booErr, books) {
                for (var i = 0; i < notes.length; i++) {
                    var verse = verses.filter(function (v) {
                        return notes[i].VerseId.toString() == v._id.toString();
                    })[0];
                    var book = books.filter(function (b) { return b._id.equals(verse.BookId); })[0];
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
                res.send(notes);
            });
        });
    });
}

exports.search = function (req, res) {
    versesCollection.find({ Version: req.params.version, Content: { $regex: req.params.text } }).toArray(function (err, docs) {
        var verses = docs;
        booksCollection.find({}).toArray(function (bookErr, books) {
            for (var i = 0; i < verses.length; i++) {
                var book = books.filter(function (b) { return b._id.equals(verses[i].BookId); })[0].Description;
                verses[i].BookId = book + ' ' + verses[i].Chapter + ' ' + verses[i].Paragraph;
            }
            res.send(verses);
        });
    });
}

exports.getTagsByType = function (req, res) {
    tagsCollection.find({ Type: req.params.type }).toArray(function (err, docs) {
        res.send(docs);
    });
}

exports.getNotesByVerseId = function (req, res) {
    notesCollection.find({ 'VerseId': { $in: [new ObjectId(req.params.verseId), req.params.verseId] } }).toArray(function (err, docs) {
        var notes = docs;
        tagsCollection.find({ 'Type': 'Note' }).toArray(function (tagErr, tagDocs) {
            var tags = tagDocs;
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
    });
}

exports.getNoteById = function (req, res) {
    notesCollection.findOne({ '_id': new ObjectId(req.params.noteId) }, function (err, docs) {
        var note = docs;
        tagsCollection.find({ 'Type': 'Note' }).toArray(function (tagErr, tagDocs) {
            var tags = tagDocs;
            for (var j = 0; j < note.TagIdList.length; j++) {
                note.TagIdList[j] = tags.filter(function (tag) { return tag._id == note.TagIdList[j]; })[0].Description;
            }
            for (var i = 0; i < tags.length; i++) {
                tags[i].IsActive = note.TagIdList.indexOf(tags[i].Description) != -1;
            }
            var results = {
                Note: note,
                Tags: tags
            };
            res.send(results);
        });
    });
}

exports.getBooksByTestament = function (req, res) {
    booksCollection
        .find({ 'TestamentId': new ObjectId(req.params.testamentId) })
        .sort({ DisplayOrder: 1 })
        .toArray(function (err, docs) {
        res.send(docs);
    });
}

exports.getChapters = function (req, res) {
    versesCollection
        .find({ BookId: ObjectId(req.params.bookId) }, { Chapter: 1 })
        .sort({ Chapter: -1 })
        .limit(1)
        .toArray(function (err, docs) {
        var chapters = [];
        var maxChapter = docs[0].Chapter;
        for (var i = 1; i < maxChapter;) {
            chapters.push(i++);
        }
        res.send(chapters);
    });
}

exports.getParagraphs = function (req, res) {
    versesCollection
        .find({ BookId: ObjectId(req.params.bookId), Chapter: parseInt(req.params.chapter) }, { Paragraph: 1 })
        .sort({ Paragraph: -1 })
        .limit(1)
        .toArray(function (err, docs) {
        var paragraphs = [];
        var maxParagraph = docs[0].Paragraph;
        for (var i = 1; i < maxParagraph;) {
            paragraphs.push(i++);
        }
        res.send(paragraphs);
    });
}

exports.getList = function (req, res) {
    versesCollection
        .find({
        BookId: ObjectId(req.body.BookId),
        Chapter: req.body.Chapter,
        Paragraph: { $gte: req.body.ParagraphMin, $lte: req.body.ParagraphMax },
        Version: req.body.Version
    })
        .sort({ Paragraph: 1 })
        .toArray(function (err, docs) {
        res.send(docs);
    });
}