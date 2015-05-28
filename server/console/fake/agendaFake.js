/* jshint node: true */

var phony = require('phony').make_phony();
var _ = require('underscore');
var Repository = require('../../model/repository.js');
var helper = require('./helper.js');

var agendasRepository = new Repository('agendas');

var days = _.sample(_.range(0, 30), _.random(15, 25));
var months = _.range(0, 4);
var year = 2015;
var agendas = [];

months.forEach(function(month) {
	days.forEach(function(day) {
		var nbOfItemsInDay = _.range(0, _.random(1, 4));
		nbOfItemsInDay.forEach(function() {
			var agenda = {
				CreatedBy: 'parany',
				CreatedOn: new Date().getTime(),
				UpdatedBy: 'parany',
				Date: helper.getRandomTime(year, month, day),
				Title: phony.lorem_title(),
				Text: helper.getText()
			};
			agendas.push(agenda);
		});
	});
});

agendasRepository.save(agendas);