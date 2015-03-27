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

exports.searchv2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    var columns = req.body.filters;
    var filters = columns.map(function (column) {
        var filter = {};
        filter[column] = { $regex: req.params.text };
        return filter;
    });
    repository.find({
        $or: filters
    }).then(function (agendas) {
        res.send(agendas);
    });
}

exports.deletev2 = function(req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.delete(new ObjectId(req.params.id)).then(function(ret) {
        res.json(ret);
    });
}