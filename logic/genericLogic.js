﻿var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');
var Repository = require('../model/repository.js');
require('../helpers/filterHelper.js');

exports.findAll = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.find({}).then(function (docs) {
        res.send(docs);
    });
}

exports.find = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    var filters = req.body.toAnyFilter();
    repository.find(filters).then(function (docs) {
        res.send(docs);
    });
}

exports.findOne = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.findOne({ _id : new ObjectId(req.params.id) }).then(function (docs) {
        res.send(docs);
    });
}

exports.update = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    var obj = req.body;
    obj._id = new ObjectId(obj._id);
    obj.UpdatedOn = new Date().getTime();
    repository.save(obj).then(function (ret) {
        res.json(ret);
    });
}

exports.insert = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    var obj = req.body;
    obj.CreatedOn = new Date().getTime();
    repository.insert(obj).then(function (ret) {
        res.json(ret);
    });
}

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    var repository = new Repository(req.params.collectionName);
    repository.find({ CreatedBy: req.params.author }).then(function (docs) {
        var records = docs.filter(function (a) {
            return a.Date >= date.getFirstMs() && a.Date <= date.getLastMs();
        });
        var dates = docs.map(function (a) { return a.Date; }).filter(function (d) { return d < date.getFirstMs() || d > date.getLastMs(); });
        var prevs = dates.filter(function (d) { return d < dateTime; }).sort(function (d1, d2) { return d2 - d1; });
        var nexts = dates.filter(function (d) { return d > dateTime; }).sort(function (d1, d2) { return d1 - d2; });
        var results = {
            Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
            Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
            Docs: records
        };
        res.send(results);
    });
}

exports.getActivities = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.find({ CreatedBy: req.params.author, sort: { date: 1 } }).then(function (docs) {
        var item = {
            nbOfItems: docs.length,
            firstAdded: _.first(docs).Title,
            lastAdded: _.last(docs).Title
    };
        res.send(item);
    });
}

exports.search = function (req, res) {
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

exports.delete = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.delete(new ObjectId(req.params.id)).then(function (ret) {
        res.json(ret);
    });
}