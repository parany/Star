var ObjectId = require('mongodb').ObjectID;
var mongodb = require('mongodb');
var Q = require('Q');
var config = require('../config.json');
var log = require('../utils/log.js');

module.exports = Repository;

function Repository(collectionName) {
    var db = new mongodb.Db(
        config.db.name,
        new mongodb.Server(config.db.host, config.db.port, {
            auto_reconnect: true,
            poolSize: 20
        }), {
            w: 1
        }
    );
    this.collection = db.collection(collectionName);
}

Repository.prototype.find = function(filters) {
    var deferred = Q.defer();
    var sort = filters.sort || {};
    var limit = filters.limit || config.db.limit;
    var projection = filters.projection || {};

    delete filters.sort;
    delete filters.limit;
    delete filters.projection;

    this.collection
        .find(filters, projection)
        .sort(sort)
        .limit(limit)
        .toArray(function(err, doc) {
            if (err) return deferred.reject(err);
            return deferred.resolve(doc);
        });
    return deferred.promise;
};

Repository.prototype.findOne = function(filters) {
    var deferred = Q.defer();
    this.collection.findOne(filters, function(err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};

Repository.prototype.insert = function(obj) {
    var deferred = Q.defer();
    this.collection.insert(obj, function(err, ret) {
        if (err) return deferred.reject(err);
        return deferred.resolve(ret);
    });
    return deferred.promise;
};

Repository.prototype.save = function(obj) {
    var deferred = Q.defer();
    obj.UpdatedOn = new Date().getTime();
    var id = new ObjectId(obj._id);
    delete obj._id;
    this.collection.update({
        _id: id
    }, {
        $set: obj
    }, function(err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};

Repository.prototype.delete = function(id) {
    var deferred = Q.defer();
    this.collection.remove({
        _id: id
    }, {
        atomic: true
    }, function(err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};

Repository.prototype.group = function(key, condition, reduce, initial) {
    var deferred = Q.defer();
    this.collection.group(key, condition, initial, reduce, {}, {}, function(err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};

Repository.prototype.count = function(filter) {
    var deferred = Q.defer();
    this.collection.count(filter, function(err, nb) {
        if (err) return deferred.reject(err);
        return deferred.resolve(nb);
    });
    return deferred.promise;
};