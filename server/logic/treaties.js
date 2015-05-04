﻿var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var Repository = require('../model/repository.js');
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var treatiesRepository = new Repository('treaties');
var tagsRepository = new Repository('tags');

exports.getByDate = function(req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    var treatiesDocs = [];
    treatiesRepository.find({
        CreatedBy: req.params.author,
        sort: {
            Date: 1
        }
    }).then(function(docs) {
        treatiesDocs = docs;
        return tagsRepository.find({
            Type: 'Treaty'
        });
    }).then(function(tagDocs) {
        var firstMsOfDay = date.getFirstMsOfDay();
        var lastMsOfDay = date.getLastMsOfDay();
        var treaties = treatiesDocs.filter(function(a) {
            return a.Date >= firstMsOfDay && a.Date <= lastMsOfDay;
        });
        var dates = treatiesDocs.map(function(a) {
            return a.Date;
        }).filter(function(d) {
            return d < firstMsOfDay || d > lastMsOfDay;
        });
        var prevs = dates.filter(function(d) {
            return d < dateTime;
        }).sort(function(d1, d2) {
            return d2 - d1;
        });
        var nexts = dates.filter(function(d) {
            return d > dateTime;
        }).sort(function(d1, d2) {
            return d1 - d2;
        });
        for (var i = 0; i < treaties.length; i++) {
            for (var j = 0; j < treaties[i].TagIdList.length; j++) {
                treaties[i].TagIdList[j] = _.find(tagDocs, function(t) {
                    return t._id.equals(new ObjectId(treaties[i].TagIdList[j]));
                }).Description;
            }
        }
        var results = {
            Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
            Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
            Treaties: treaties
        };
        res.send(results);
    });
}

exports.search = function(req, res) {
    var treatiesDocs = [];
    treatiesRepository.find({
        $or: [{
            Title: {
                $regex: req.params.text
            }
        }, {
            Content: {
                $regex: req.params.text
            }
        }]
    }).then(function(docs) {
        treatiesDocs = docs;
        return tagsRepository.find({
            Type: 'Treaty'
        });
    }).then(function(tagDocs) {
        for (var i = 0; i < treatiesDocs.length; i++) {
            for (var j = 0; j < treatiesDocs[i].TagIdList.length; j++) {
                treatiesDocs[i].TagIdList[j] = _.find(tagDocs, function(t) {
                    return t._id.equals(new ObjectId(treatiesDocs[i].TagIdList[j]));
                }).Description;
            }
        }
        res.send(treatiesDocs);
    });
}