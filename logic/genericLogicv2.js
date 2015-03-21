﻿var ObjectId = require('mongodb').ObjectID;
var Repository = require('../model/repositoryv2.js');
var repository = require('../model/repository.js');

exports.findAllv2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.find({}).then(function (docs) {
        res.send(docs);
    });
}

exports.findv2 = function (req, res) {
    var repository = new Repository(req.params.collectionName);
    repository.find(req.body).then(function (docs) {
        res.send(docs);
    });
}

exports.findOnev2 = function (req, res) {
    var collection = repository.getCollection(req.params.collectionName);
    collection.get({ _id: new ObjectId(req.params.id) }).then(function (err, doc) {
        res.send(doc);
    });
}