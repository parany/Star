var phony = require('phony').make_phony();
var _ = require('underscore');
var Repository = require('../../model/repository.js');

var tagRepository = new Repository('tags');

var types = ['Note', 'Explication', 'Treaty'];
var tags = [];
var nbMin = 4;
var nbMax = 10;

types.forEach(function(value, index){
	var nbs = _.range(0, _.random(nbMin, nbMax));
	nbs.forEach(function(){
		var tag = {
			CreatedBy: 'System',
			CreatedOn: new Date().getTime(),
			UpdatedBy: null,
			Description: phony.first_name(),
			IsActive: true,
			Type: value
		};
		tags.push(tag);
	});
});

tagRepository.save(tags);