﻿var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;

exports.getAll = function (req, res) {
    var collection = repository.getCollection(req.params.collectionName);
    collection.find({}).toArray(function (err, docs) {
        res.send(docs);
    });
}

exports.get = function (req, res) {
    var collection = repository.getCollection(req.params.collectionName);
    collection.findOne({ _id: new ObjectId(req.params.id) }, function (err, doc) {
        res.send(doc);
    });
}

exports.update = function (req, res) {
    var doc = req.body;
    doc._id = new ObjectId(doc._id);
    doc.UpdatedOn = new Date().getTime();
    var collection = repository.getCollection(req.params.collectionName);
    collection.save(doc, { safe: true }, function (err, ret) {
        res.json(ret);
    });
}

exports.insert = function (req, res) {
    var doc = req.body;
    var collection = repository.getCollection(req.params.collectionName);
    doc.CreatedOn = new Date().getTime();
    collection.insert(doc, { safe: true }, function (err, ret) {
        res.json(ret);
    });
}