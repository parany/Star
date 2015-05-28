/* jshint node: true */

var phony = require('phony').make_phony();
var _ = require('underscore');
var ObjectId = require('mongodb').ObjectID;
var Repository = require('../../model/repository.js');
var helper = require('./helper.js');

var notesRepository = new Repository('notes');
var tagsRepository = new Repository('tags');
var versesRepository = new Repository('verses');

var items = _.range(0, 1000);
var allVersesIds = [];
var allAuthors = ['parany', 'admin', 'manjaka'];
var allTags = [];
var notes = [];

tagsRepository.find({
	Type: 'Note'
}).then(function(docTags) {
	allTags = docTags.map(function(t) {
		return t._id.toString();
	});
	return versesRepository.find({
		limit: 31090,
		projection: {
			_id: 1
		}
	});
}).then(function(docVerseIds) {
	allVersesIds = docVerseIds.map(function(v){
		return v._id.toString();	
	});

	items.forEach(function() {
		var nbOfAuthorsInDay = _.range(0, _.random(1, allAuthors.length));
		nbOfAuthorsInDay.forEach(function(author) {
			var verse = _.sample(allVersesIds);
			var tags = _.sample(allTags, _.random(1, allTags.length));
			var note = {
				CreatedBy: allAuthors[author],
				CreatedOn: new Date().getTime(),
				UpdatedBy: null,
				UpdatedOn: null,
				Description: phony.lorem_title(),
				Content: helper.getText(),
				VerseId: verse,
				TagIdList: tags
			};
			notes.push(note);
		});
	});
	console.log(notes[0]);
	notesRepository.save(notes);
});