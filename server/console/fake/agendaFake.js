var phony = require('phony').make_phony();
var _ = require('underscore');
var repository = require('../../model/repository.js');
var helper = require('./helper.js');

var days = _.sample(_.range(0, 30), _.random(15, 25));
var months = _.range(6, 8);
var year = 2016;
var agendas = [];

months.forEach(function(month) {
	days.forEach(function(day) {
		var nbOfItemsInDay = _.range(0, _.random(1, 4));
		nbOfItemsInDay.forEach(function() {
			var date = helper.getRandomTime(year, month, day);
			console.log((new Date(date)).toLocaleString());
			var agenda = {
				CreatedBy: 'parany',
				CreatedOn: new Date().getTime(),
				UpdatedBy: 'parany',
				Date: date,
				Title: phony.lorem_title(),
				Text: helper.getText()
			};
			agendas.push(agenda);
		});
	});
});

repository.insert('agendas', agendas);