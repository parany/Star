var phony = require('phony').make_phony();
var _ = require('underscore');
var repository = require('../../model/repository.js');
var helper = require('./helper.js');

var days = _.sample(_.range(0, 30), _.random(15, 25));
var months = _.range(0, 11);
var year = 2015;

repository.find('contentTypes', {}).then(function(data) {
	try {
		var types = _.pluck(data, 'name');
		months.forEach(function(month) {
			days.forEach(function(day) {
				var nbOfItemsInDay = _.range(0, _.random(1, 4));
				nbOfItemsInDay.forEach(function() {
					var tweet = {
						CreatedBy: 'parany',
						CreatedOn: new Date().getTime(),
						UpdatedBy: 'parany',
						Date: helper.getRandomTime(year, month, day),
						Title: phony.lorem_paragraph(),
						Type: types[_.random(0, types.length - 1)]
					};
					repository.insert('tweets', tweet);
				});
			});
		});
	} catch (ex) {
		console.log(ex);
	}
});