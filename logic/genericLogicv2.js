var ObjectId = require('mongodb').ObjectID;
var Repository = require('../model/repositoryv2.js');
require('../helpers/filterHelper.js');

exports.findAllv2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.find({}).then(function (docs) {
        res.send(docs);
    });
}

exports.findv2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    var filters = req.body.toAnyFilter();
    repository.find(filters).then(function (docs) {
        res.send(docs);
    });
}

exports.findOnev2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.findOne({_id : new ObjectId(req.params.id) }).then(function (docs) {
        res.send(docs);
    });
}

exports.updatev2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    var obj = req.body;
    obj._id = new ObjectId(obj._id);
    obj.UpdatedOn = new Date().getTime();
    repository.save(obj).then(function (ret) {
        res.json(ret);
    });
}

exports.insertv2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    var obj = req.body;
    obj.CreatedOn = new Date().getTime();
    repository.insert(obj).then(function (ret) {
        res.json(ret);
    });
}