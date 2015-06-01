/* jshint node: true */

var phony = require('phony').make_phony();
var _ = require('underscore');
var Repository = require('../../model/repository.js');
var helper = require('./helper.js');

var treatiesRepository = new Repository('treaties');
var tagsRepository = new Repository('tags');

var days = _.sample(_.range(0, 30), _.random(15, 25));
var months = _.range(0, 4);
var year = 2015;
var treaties = [];
var allTags = [];

tagsRepository.find({
	Type: 'Treaty'
}).then(function(docTags) {
	allTags = docTags.map(function(t) {
		return t._id.toString();
	});
	months.forEach(function(month) {
		days.forEach(function(day) {
			var nbOfItemsInDay = _.range(0, _.random(1, 4));
			nbOfItemsInDay.forEach(function() {
				var tags = _.sample(allTags, _.random(1, allTags.length));
				var treaty = {
					CreatedBy: 'parany',
					CreatedOn: new Date().getTime(),
					UpdatedBy: null,
					UpdatedOn: null,
					Date: helper.getRandomTime(year, month, day),
					Title: phony.lorem_title(),
					Text: helper.getText(),
					TagIdList: tags
				};
				treaties.push(treaty);
			});
		});
	});
	console.log(treaties[0]);
	treatiesRepository.save(treaties);
});