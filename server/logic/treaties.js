var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var Repository = require('../model/repository.js');
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var treatiesRepository = new Repository('treaties');
var tagsRepository = new Repository('tags');

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var treaties = [];
    var firstMsOfDay = date.getFirstMsOfDay();
    var lastMsOfDay = date.getLastMsOfDay();
    treatiesRepository.find({
        CreatedBy: req.params.author,
        sort: { Date: 1 },
        Date: { $gte: firstMsOfDay, $lte: lastMsOfDay }
    }).then(function (docs) {
        treaties = docs;
        return tagsRepository.find({
            Type: 'Treaty'
        });
    }).then(function (tagDocs) {
        for (var i = 0; i < treaties.length; i++) {
            for (var j = 0; j < treaties[i].TagIdList.length; j++) {
                treaties[i].TagIdList[j] = _.find(tagDocs, function (t) {
                    return t._id.equals(new ObjectId(treaties[i].TagIdList[j]));
                }).Description;
            }
        }
        res.send(treaties);
    });
};

exports.search = function (req, res) {
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
    }).then(function (docs) {
        treatiesDocs = docs;
        return tagsRepository.find({
            Type: 'Treaty'
        });
    }).then(function (tagDocs) {
        for (var i = 0; i < treatiesDocs.length; i++) {
            for (var j = 0; j < treatiesDocs[i].TagIdList.length; j++) {
                treatiesDocs[i].TagIdList[j] = _.find(tagDocs, function (t) {
                    return t._id.equals(new ObjectId(treatiesDocs[i].TagIdList[j]));
                }).Description;
            }
        }
        res.send(treatiesDocs);
    });
}