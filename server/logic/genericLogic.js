﻿var ObjectId = require('mongodb').ObjectID;
var Q = require('Q');
var Repository = require('../model/repository.js');
require('../helpers/filterHelper.js');

exports.findAll = function(req, res) {
	var repository = new Repository(req.params.collectionName);
	repository.find({}).then(function(docs) {
		res.send(docs);
	});
};

exports.find = function(req, res) {
	var repository = new Repository(req.params.collectionName);
	var filters = req.body.toAnyFilter();
	repository.find(filters).then(function(docs) {
		res.send(docs);
	});
};

exports.findOne = function(req, res) {
	var repository = new Repository(req.params.collectionName);
	repository.findOne({
		_id: new ObjectId(req.params.id)
	}).then(function(docs) {
		res.send(docs);
	});
};

exports.update = function(req, res) {
	var repository = new Repository(req.params.collectionName);
	repository.save(req.body).then(function(ret) {
		res.json(ret);
	});
};

exports.insert = function(req, res) {
	var repository = new Repository(req.params.collectionName);
	var obj = req.body;
	obj.CreatedOn = new Date().getTime();
	repository.insert(obj).then(function(ret) {
		res.json(ret);
	});
};

exports.getByDate = function(req, res) {
	var date = new Date(req.params.date);
	var firstMsOfDay = date.getFirstMsOfDay();
	var lastMsOfDay = date.getLastMsOfDay();
	var repository = new Repository(req.params.collectionName);
	repository.find({
		CreatedBy: req.params.author,
		Date: {
			$gte: firstMsOfDay,
			$lte: lastMsOfDay
		}
	}).then(function(docs) {
		res.send(docs);
	});
};

exports.getActivities = function(req, res) {
	var repository = new Repository(req.params.collectionName);
	var userActionRepository = new Repository('userActions');
	var operations = [];
	var limit = 6;
	if (req.params.limit) {
		limit = parseInt(req.params.limit);
	}
	userActionRepository.find({
		collection: req.params.collectionName,
		createdBy: req.params.author,
		sort: {
			date: -1
		},
		limit: limit
	}).then(function(docs) {
		operations = docs;
		return repository.find({
			CreatedBy: req.params.author,
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
	var repository = new Repository(req.params.collectionName);
	var columns = req.body.filters;
	var filters = columns.map(function(column) {
		var filter = {};
		filter[column] = {
			$regex: req.params.text
		};
		return filter;
	});
	repository.find({
		$or: filters,
		projection: req.body.projection || {}
	}).then(function(agendas) {
		res.send(agendas);
	});
};

exports.delete = function(req, res) {
	var repository = new Repository(req.params.collectionName);
	repository.delete(new ObjectId(req.params.id)).then(function(ret) {
		res.json(ret);
	});
};

exports.getArticlesInTheSameDate = function(req, res) {
	var articles = ['treaties', 'agendas', 'explications', 'news'];
	var date = new Date(parseInt(req.params.date));
	var tasks = [];
	articles.forEach(function(article) {
		var repository = new Repository(article);
		var task = repository.find({
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
	var dateTime = date.getTime();
	var repository = new Repository(req.params.collectionName);
	repository.find({
		Date: {
			$lt: dateTime
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
	var dateTime = date.getTime();
	var repository = new Repository(req.params.collectionName);
	repository.find({
		Date: {
			$gt: dateTime
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
	var userActionRepository = new Repository('userActions');
	userActionRepository.group({
			operation: 1
		}, {
			createdBy: req.params.author
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
	var articles = ['treaties', 'agendas', 'explications', 'news'];
	var tasks = [];
	articles.forEach(function(article) {
		var repository = new Repository(article);
		var task = repository.count({
			CreatedBy: req.params.author
		});
		tasks.push(task);
	});
	var results = [];
	Q.all(tasks).spread(function(list0, list1, list2, list3) {
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
		res.send(results);
	});
};