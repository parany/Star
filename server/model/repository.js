var mongodb = require('mongodb');
var Q = require('Q');
var config = require('../config.json');

module.exports = Repository;

function Repository(collectionName) {
    var db = new mongodb.Db(
        config.db.name,
        new mongodb.Server(config.db.host, config.db.port, { auto_reconnect: true, poolSize: 20 }),
        { w: 1 }
    );
    this.collection = db.collection(collectionName);
}

Repository.prototype.find = function (filters) {
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
    .toArray(function (err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};

Repository.prototype.findOne = function (filters) {
    var deferred = Q.defer();
    this.collection.findOne(filters, function (err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};

Repository.prototype.insert = function (obj) {
    var deferred = Q.defer();
    this.collection.insert(obj, function (err, ret) {
        if (err) return deferred.reject(err);
        return deferred.resolve(ret);
    });
    return deferred.promise;
};

Repository.prototype.save = function (obj) {
    var deferred = Q.defer();
    this.collection.save(obj, { safe: true }, function (err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};

Repository.prototype.delete = function (id) {
    var deferred = Q.defer();
    this.collection.remove({ _id: id }, { atomic: true }, function (err, doc) {
        if (err) return deferred.reject(err);
        return deferred.resolve(doc);
    });
    return deferred.promise;
};