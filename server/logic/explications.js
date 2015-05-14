var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var Repository = require('../model/repository.js');
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var explicationsRepository = new Repository('explications');
var tagsRepository = new Repository('tags');

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var explications = [];
    var firstMsOfDay = date.getFirstMsOfDay();
    var lastMsOfDay = date.getLastMsOfDay();
    explicationsRepository.find({
        CreatedBy: req.params.author,
        sort: { Date: 1 },
        Date: { $gte: firstMsOfDay, $lte: lastMsOfDay }
    }).then(function (docs) {
        explications = docs;
        return tagsRepository.find({
            Type: 'Explication'
        });
    }).then(function (tagDocs) {
        for (var i = 0; i < explications.length; i++) {
            for (var j = 0; j < explications[i].TagIdList.length; j++) {
                explications[i].TagIdList[j] = _.find(tagDocs, function (t) {
                    return t._id.equals(new ObjectId(explications[i].TagIdList[j]));
                }).Description;
            }
        }
        res.send(explications);
    });
}

exports.search = function (req, res) {
    var explicationDocs = [];
    explicationsRepository.find({
        $or: [{
            Title: {
                $regex: req.params.text
            }
        }, {
                Content: {
                    $regex: req.params.text
                }
            }]
    }).then(function (docs) {
        explicationDocs = docs;
        return tagsRepository.find({
            Type: 'Explication'
        });
    }).then(function (tagDocs) {
        for (var i = 0; i < explicationDocs.length; i++) {
            for (var j = 0; j < explicationDocs[i].TagIdList.length; j++) {
                explicationDocs[i].TagIdList[j] = _.find(tagDocs, function (t) {
                    return t._id.equals(new ObjectId(explicationDocs[i].TagIdList[j]));
                }).Description;
            }
        }
        res.send(explicationDocs);
    });
}