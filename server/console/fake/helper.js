/* jshint node: true */

var _ = require('underscore');
var phony = require('phony').make_phony();

exports.getRandomTime = function(year, month, day) {
	return new Date(year, month, day, _.random(0, 24), _.random(0, 60), _.random(0, 60), _.random(0, 1000)).getTime();
};

exports.getText = function() {
	var text = '';
	var nbOfParagraphs = _.range(0, _.random(1, 4));
	nbOfParagraphs.forEach(function() {
		if (_.random(1)) {
			text += '<b>' + phony.lorem_title() + '</b><br /><br />';
		}
		text += phony.lorem_paragraphs(_.random(2, 5));
		text += '<br /><br /><br />';
	});
	return text;
};