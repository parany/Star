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
    this.collection.find(filters).toArray(function (err, doc) {
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
    obj.IsActive = 0;
    this.collection.insert(obj, function (err, ret) {
        if (err) return deferred.reject(err);
        return deferred.resolve(ret);
    });
    return deferred.promise;
};