var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var Repository = require('../model/repository.js');
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var explicationsRepository = new Repository('explications');
var tagsRepository = new Repository('tags');

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    var explicationDocs = [];
    explicationsRepository.find({ CreatedBy: req.params.author, sort: { Date: 1 } }).then(function (docs) {
        explicationDocs = docs;
        return tagsRepository.find({ Type: 'Explication' });
    }).then(function (tagDocs) {
        var explications = explicationDocs.filter(function (a) {
            return a.Date >= date.getFirstMs() && a.Date <= date.getLastMs();
        });
        var dates = explicationDocs.map(function (a) { return a.Date; }).filter(function (d) { return d < date.getFirstMs() || d > date.getLastMs(); });
        var prevs = dates.filter(function (d) { return d < dateTime; }).sort(function (d1, d2) { return d2 - d1; });
        var nexts = dates.filter(function (d) { return d > dateTime; }).sort(function (d1, d2) { return d1 - d2; });
        for (var i = 0; i < explications.length; i++) {
            for (var j = 0; j < explications[i].TagIdList.length; j++) {
                explications[i].TagIdList[j] = _.find(tagDocs, function (t) {
                    return t._id.equals(new ObjectId(explications[i].TagIdList[j]));
                }).Description;
            }
        }
        var results = {
            Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
            Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
            Explications: explications
        };
        res.send(results);
    });
}

exports.search = function (req, res) {
    var explicationDocs = [];
    explicationsRepository.find({
        $or: [
            { Title: { $regex: req.params.text } }, 
            { Content: { $regex: req.params.text } }]
    }).then(function (docs) {
        explicationDocs = docs;
        return tagsRepository.find({ Type: 'Explication' });
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