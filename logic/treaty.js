var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var treatiesCollection = repository.getCollection('treaties');
var tagsCollection = repository.getCollection('tags');

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    treatiesCollection.find({ CreatedBy: req.params.author }).sort({ Date: 1 }).toArray(function (treatyErr, treatyDocs) {
        tagsCollection.find({ Type: 'Treaty' }).toArray(function (tagErr, tagDocs) {
            var treaties = treatyDocs.filter(function (a) {
                return a.Date >= date.getFirstMs() && a.Date <= date.getLastMs();
            });
            var dates = treatyDocs.map(function (a) { return a.Date; }).filter(function (d) { return d < date.getFirstMs() || d > date.getLastMs(); });
            var prevs = dates.filter(function (d) { return d < dateTime; }).sort(function (d1, d2) { return d2 - d1; });
            var nexts = dates.filter(function (d) { return d > dateTime; }).sort(function (d1, d2) { return d1 - d2; });
            for (var i = 0; i < treaties.length; i++) {
                for (var j = 0; j < treaties[i].TagIdList.length; j++) {
                    treaties[i].TagIdList[j] = tagDocs.filter(function (t) { return t._id.equals(new ObjectId(treaties[i].TagIdList[j])); })[0].Description;
                }
            }
            var results = {
                Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
                Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
                Treaties: treaties
            };
            res.send(results);
        });
        
    });
}

exports.search = function (req, res) {
    treatiesCollection.find({
        $or: [
            { Title: { $regex: req.params.text } }, 
            { Text: { $regex: req.params.text } }]
    }).toArray(function (treatyErr, treatyDocs) {
        tagsCollection.find({ Type: 'Treaty' }).toArray(function (tagErr, tagDocs) {
            for (var i = 0; i < treatyDocs.length; i++) {
                for (var j = 0; j < treatyDocs[i].TagIdList.length; j++) {
                    treatyDocs[i].TagIdList[j] = tagDocs.filter(function (t) { return t._id.equals(new ObjectId(treatyDocs[i].TagIdList[j])); })[0].Description;
                }
            }
            res.send(treatyDocs);
        });
    });
}