var ObjectId = require('mongodb').ObjectID;
var mongodb = require('mongodb');
var Q = require('Q');
var dbConfig = require('../config/db.json');

var db = new mongodb.Db(
	dbConfig.name,
	new mongodb.Server(dbConfig.host, dbConfig.port, {
		auto_reconnect: true,
		poolSize: 20
	}), {
		w: 1
	}
);

exports.find = function(collectionName, filters) {
	var deferred = Q.defer();
	var sort = filters.sort || {};
	var limit = filters.limit || dbConfig.limit;
	var projection = filters.projection || {};

	delete filters.sort;
	delete filters.limit;
	delete filters.projection;

	db.collection(collectionName)
		.find(filters, projection)
		.sort(sort)
		.limit(limit)
		.toArray(function(err, doc) {
			if (err) return deferred.reject(err);
			return deferred.resolve(doc);
		});
	return deferred.promise;
};

exports.findOne = function(collectionName, filters) {
	var deferred = Q.defer();
	db.collection(collectionName).findOne(filters, function(err, doc) {
		if (err) return deferred.reject(err);
		return deferred.resolve(doc);
	});
	return deferred.promise;
};

exports.insert = function(collectionName, obj) {
	var deferred = Q.defer();
	db.collection(collectionName).insert(obj, function(err, ret) {
		if (err) return deferred.reject(err);
		return deferred.resolve(ret);
	});
	return deferred.promise;
};

exports.save = function(collectionName, obj) {
	var deferred = Q.defer();
	obj.UpdatedOn = new Date().getTime();
	var id = new ObjectId(obj._id);
	delete obj._id;
	db.collection(collectionName).update({
		_id: id
	}, {
		$set: obj
	}, function(err, doc) {
		if (err) return deferred.reject(err);
		return deferred.resolve(doc);
	});
	return deferred.promise;
};

exports.delete = function(collectionName, id) {
	var deferred = Q.defer();
	db.collection(collectionName).remove({
		_id: id
	}, {
		atomic: true
	}, function(err, doc) {
		if (err) return deferred.reject(err);
		return deferred.resolve(doc);
	});
	return deferred.promise;
};

exports.group = function(collectionName, key, condition, reduce, initial) {
	var deferred = Q.defer();
	db.collection(collectionName).group(key, condition, initial, reduce, {}, {}, function(err, doc) {
		if (err) return deferred.reject(err);
		return deferred.resolve(doc);
	});
	return deferred.promise;
};

exports.count = function(collectionName, filter) {
	var deferred = Q.defer();
	db.collection(collectionName).count(filter, function(err, nb) {
		if (err) return deferred.reject(err);
		return deferred.resolve(nb);
	});
	return deferred.promise;
};