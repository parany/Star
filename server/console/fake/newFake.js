/* jshint node: true */

var phony = require('phony').make_phony();
var _ = require('underscore');
var Repository = require('../../model/repository.js');
var helper = require('./helper.js');

var newsRepository = new Repository('news');
var sourcesRepository = new Repository('sources');

var days = _.sample(_.range(0, 30), _.random(15, 25));
var months = _.range(0, 4);
var year = 2015;
var allSources = [];
var news = [];

sourcesRepository.find({}).then(function(sourcesDoc) {
	allSources = sourcesDoc;
	months.forEach(function(month) {
		days.forEach(function(day) {
			var nbOfItemsInDay = _.range(0, _.random(1, 4));
			nbOfItemsInDay.forEach(function() {
				var citations = [];
				for (var i = 0; i < _.random(1, 6); i++) {
					citations.push(phony.lorem_paragraph());
				}
				var newOne = {
					CreatedBy: 'parany',
					CreatedOn: new Date().getTime(),
					UpdatedBy: 'parany',
					UpdatedOn: null,
					Date: helper.getRandomTime(year, month, day),
					Title: phony.lorem_title(),
					Content: helper.getText(),
					Source: _.sample(allSources),
					Citations: citations
				};
				news.push(newOne);
			});
		});
	});
	console.log(news[0]);
	newsRepository.save(news);
});