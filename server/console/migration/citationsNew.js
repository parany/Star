var Q = require('Q');
var Repository = require('../../model/repository.js');

var newsRepository = new Repository('news');

newsRepository.find({}).then(function(docs) {
	var tasks = [];
	docs.forEach(function(doc) {
		console.log(doc.Title);
		doc.citations = [];
		doc.Citations.forEach(function(oldCitation) {
			console.log(doc.Title);
			doc.citations.push({
				text: oldCitation,
				author: 'any'
			});
			console.log(oldCitation);
		});
		console.log('deleting old citations');
		delete doc.Citations;
		console.log('inserting task');
		doc._id = doc._id.toString();
		tasks.push(newsRepository.save(doc));
		console.log('next doc');
	});
	Q.all(tasks).spread(function() {
		console.log('done');
	});
});