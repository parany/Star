var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');
var Repository = require('../model/repository.js');

exports.search = function (req, res) {
    var versesRepository = new Repository('verses');
    var booksRepository = new Repository('books');
    var verses;
    versesRepository.find({
        Version: req.params.version,
        Content: { $regex: req.params.text }
    }).then(function (docs) {
        verses = docs;
        return booksRepository.find({});
    }).then(function (books) {
        for (var i = 0; i < verses.length; i++) {
            var book = _.find(books, function (b) { return b._id.equals(verses[i].BookId); }).Description;
            verses[i].BookId = book + ' ' + verses[i].Chapter + ' ' + verses[i].Paragraph;
        }
        res.send(verses);
    });
}