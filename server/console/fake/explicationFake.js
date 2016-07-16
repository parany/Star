/* jshint node: true */

var phony = require('phony').make_phony();
var _ = require('underscore');
var helper = require('./helper.js');
var repository = require('../../model/repository.js');

var days = _.sample(_.range(0, 30), _.random(15, 25));
var months = _.range(0, 8);
var year = 2016;
var allVerses = [];
var explications = [];
var allTags = [];
var allBooks = [];
var versesWithBooks = [];

repository.find('tags', {
	Type: 'Explication'
}).then(function(docTags) {
	allTags = docTags.map(function(t) {
		return t._id.toString();
	});
	return repository.find('books', {});
}).then(function(docBooks) {
	allBooks = docBooks;
	return repository.find('verses', {
		limit: 62193
	});
}).then(function(docVerseIds) {
	allVerses = docVerseIds;

	var verses = _.sample(allVerses, _.random(3, 6));
	versesWithBooks = verses.map(function(v) {
		return {
			Book: _.find(allBooks, function(b) {
				return b._id.equals(v.BookId);
			}).Description,
			Chapter: v.Chapter,
			ParagraphMin: v.Paragraph,
			ParagraphMax: v.Paragraph + 3
		};
	});

	months.forEach(function(month) {
		days.forEach(function(day) {
			var nbOfItemsInDay = _.range(0, _.random(1, 4));
			nbOfItemsInDay.forEach(function() {
				var verses = _.sample(allVerses, _.random(3, 6));
				var tags = _.sample(allTags, _.random(1, allTags.length));
				versesWithBooks = verses.map(function(v) {
					return {
						Book: _.find(allBooks, function(b) {
							return b._id.equals(v.BookId);
						}).Description,
						Chapter: v.Chapter,
						ParagraphMin: v.Paragraph,
						ParagraphMax: v.Paragraph + 3
					};
				});
				var date = helper.getRandomTime(year, month, day);
				console.log((new Date(date)).toLocaleString());
				var explication = {
					CreatedBy: 'parany',
					CreatedOn: new Date().getTime(),
					UpdatedBy: 'parany',
					UpdatedOn: null,
					Date: date,
					Title: phony.lorem_title(),
					Content: helper.getText(),
					VerseReadList: versesWithBooks,
					TagIdList: tags
				};
				explications.push(explication);
			});
		});
	});
	repository.insert('explications', explications);
});