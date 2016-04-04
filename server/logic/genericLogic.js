var ObjectId = require('mongodb').ObjectID;
var Q = require('Q');
var repository = require('../model/repository.js');
require('../helpers/filterHelper.js');

exports.findAll = function(req, res) {
	repository.find(req.params.collectionName, {}).then(function(docs) {
		res.send(docs);
	});
};

exports.find = function(req, res) {
	var collectionName = req.params.collectionName;
	var filters = req.body.toAnyFilter(collectionName, req.user.UserName);
	repository.find(collectionName, filters).then(function(docs) {
		res.send(docs);
	});
};

exports.getOthers = function(req, res) {
	var collectionName = req.params.collectionName;
	var filters = {
		$and: [{
			CreatedBy: {
				$nin: [req.user.UserName],
			}
		}, {
			Public: true
		}],
		sort: {
			Date: -1
		},
		projection: {
			Title: 1,
			Date: 1,
			Text: 1,
			Content: 1,
		}
	};
	repository.find(collectionName, filters).then(function(docs) {
		res.send(docs);
	});
};

exports.findOne = function(req, res) {
	repository.findOne(req.params.collectionName, {
		_id: new ObjectId(req.params.id)
	}).then(function(docs) {
		res.send(docs);
	});
};

exports.update = function(req, res) {
	var obj = req.body;
	obj.UpdatedBy = req.user.UserName;
	obj.UpdatedOn = new Date().getTime();
	repository.save(req.params.collectionName, obj).then(function(ret) {
		res.json(ret);
	});
};

exports.insert = function(req, res) {
	var obj = req.body;
	obj.CreatedBy = req.user.UserName;
	obj.CreatedOn = new Date().getTime();
	repository.insert(req.params.collectionName, obj).then(function(ret) {
		res.json(ret);
	});
};

exports.getByDate = function(req, res) {
	var date = new Date(req.params.date);
	var firstMsOfDay = date.getFirstMsOfDay();
	var lastMsOfDay = date.getLastMsOfDay();
	repository.find(req.params.collectionName, {
		CreatedBy: req.user.UserName,
		Date: {
			$gte: firstMsOfDay,
			$lte: lastMsOfDay
		}
	}).then(function(docs) {
		res.send(docs);
	});
};

exports.getActivities = function(req, res) {
	var operations = [];
	var limit = 6;
	if (req.params.limit) {
		limit = parseInt(req.params.limit);
	}
	repository.find('userActions', {
		collection: req.params.collectionName,
		CreatedBy: req.user.UserName,
		sort: {
			date: -1
		},
		limit: limit
	}).then(function(docs) {
		operations = docs;
		return repository.find(req.params.collectionName, {
			CreatedBy: req.user.UserName,
			sort: {
				Date: 1
			}
		});
	}).then(function(docs) {
		var date = new Date();
		var firstTimeOfYear = date.getFirstMsOfYear();
		var lastTimeOfYear = date.getLastMsOfYear();
		var yearItems = docs.filter(function(a) {
			return a.Date >= firstTimeOfYear && a.Date <= lastTimeOfYear;
		});
		date = new Date();
		var firstTimeOfMonth = date.getFirstMsOfMonth();
		var lastTimeOfMonth = date.getLastMsOfMonth();
		var monthItems = docs.filter(function(a) {
			return a.Date >= firstTimeOfMonth && a.Date <= lastTimeOfMonth;
		});
		date = new Date();
		var firstMsOfWeek = date.getFirstMsOfWeek();
		var lastMsOfWeek = date.getLastMsOfWeek();
		var weekItems = docs.filter(function(a) {
			return a.Date >= firstMsOfWeek && a.Date <= lastMsOfWeek;
		});
		var item = {
			nbOfItems: docs.length,
			nbOfYearItems: yearItems.length,
			nbOfMonthItems: monthItems.length,
			nbOfWeekItems: weekItems.length,
			operations: operations
		};
		res.send(item);
	});
};

exports.search = function(req, res) {
	var columns = req.body.filters;
	var filters = columns.map(function(column) {
		var filter = {};
		filter[column] = {
			$regex: req.params.text
		};
		return filter;
	});
	repository.find(req.params.collectionName, {
		$or: filters,
		projection: req.body.projection || {}
	}).then(function(agendas) {
		res.send(agendas);
	});
};

exports.delete = function(req, res) {
	repository.delete(req.params.collectionName, new ObjectId(req.params.id)).then(function(ret) {
		res.json(ret);
	});
};

exports.getArticlesInTheSameDate = function(req, res) {
	var articles = ['treaties', 'agendas', 'explications', 'news', 'tweets'];
	var date = new Date(parseInt(req.params.date));
	var tasks = [];
	articles.forEach(function(article) {
		var task = repository.find(article, {
			Date: {
				$gte: date.getFirstMsOfDay(),
				$lte: date.getLastMsOfDay()
			}
		});
		tasks.push(task);
	});
	var results = {};
	Q.all(tasks).then(function(lists) {
		for (var i = 0; i < articles.length; i++) {
			results[articles[i]] = lists[i];
		}
		res.send(results);
	});
};

exports.getPrevNearArticles = function(req, res) {
	var date = new Date(parseInt(req.params.date));
	repository.find(req.params.collectionName, {
		Date: {
			$lt: date.getFirstMsOfDay()
		},
		sort: {
			Date: -1
		},
		projection: {
			Date: 1,
			Title: 1
		},
		limit: 5
	}).then(function(docs) {
		res.send(docs);
	});
};

exports.getNextNearArticles = function(req, res) {
	var date = new Date(parseInt(req.params.date));
	repository.find(req.params.collectionName, {
		Date: {
			$gt: date.getLastMsOfDay()
		},
		sort: {
			Date: 1
		},
		projection: {
			Date: 1,
			Title: 1
		},
		limit: 5
	}).then(function(docs) {
		res.send(docs);
	});
};

exports.getAllActivities = function(req, res) {
	repository.group('userActions', {
			operation: 1
		}, {
			CreatedBy: req.user.UserName
		},
		function(curr, result) {
			result.total++;
		}, {
			total: 0
		}
	).then(function(docs) {
		res.send(docs);
	});
};

exports.getTotal = function(req, res) {
	var articles = ['treaties', 'agendas', 'explications', 'news', 'tweets'];
	var tasks = [];
	articles.forEach(function(article) {
		var task = repository.count(article, {
			CreatedBy: req.user.UserName
		});
		tasks.push(task);
	});
	var results = [];
	Q.all(tasks).spread(function(list0, list1, list2, list3, list4) {
		results.push({
			'article': articles[0],
			'total': list0
		});
		results.push({
			'article': articles[1],
			'total': list1
		});
		results.push({
			'article': articles[2],
			'total': list2
		});
		results.push({
			'article': articles[3],
			'total': list3
		});
		results.push({
			'article': articles[4],
			'total': list4
		});
		res.send(results);
	});
};