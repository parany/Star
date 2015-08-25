var _ = require('underscore');
var repository = require('../model/repository.js');

exports.search = function(req, res) {
    var verses;
    repository.find('verses', {
        Version: req.params.version,
        Content: {
            $regex: req.params.text
        }
    }).then(function(docs) {
        verses = docs;
        return repository.find('books', {});
    }).then(function(books) {
        books.forEach(function(b) {
            b._id = b._id.toString();
        });
        for (var i = 0; i < verses.length; i++) {
            var book = _.findWhere(books, {
                _id: verses[i].BookId.toString()
            }).Description;
            verses[i].BookId = book + ' ' + verses[i].Chapter + ' ' + verses[i].Paragraph;
        }
        res.send(verses);
    });
};