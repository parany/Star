var phony = require('phony').make_phony();
var _ = require('underscore');
var Repository = require('../../model/repository.js');
var helper = require('./helper.js');

var dicosRepository = new Repository('dicos');
var dicos = [];
var nbOfItems = _.range(0, 250);

nbOfItems.forEach(function() {
	var dico = {
		CreatedBy: 'parany',
		CreatedOn: new Date().getTime(),
		UpdatedBy: 'parany',
		UpdatedOn: new Date().getTime(),
		FromId: '54d75e77e328290d200128d7',
		ToId: '54d75e77e328290d200128d8',
		Text: phony.word(),
		Meaning: '<p>' + phony.lorem_paragraph() + '</p>',
		Illustrations: []
	};
	var nbOfIllustrations = _.range(2, _.random(3, 6));
	nbOfIllustrations.forEach(function() {
		dico.Illustrations.push(phony.lorem_paragraph());
	});
	dicos.push(dico);
});

dicosRepository.save(dicos);