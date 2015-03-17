var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var explicationsCollection = repository.getCollection('explications');
var tagsCollection = repository.getCollection('tags');

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    explicationsCollection.find({ CreatedBy: req.params.author }).sort({ Date: 1 }).toArray(function (explicationErr, explicationDocs) {
        tagsCollection.find({ Type: 'Explication' }).toArray(function (tagErr, tagDocs) {
            var explications = explicationDocs.filter(function (a) {
                return a.Date >= date.getFirstMs() && a.Date <= date.getLastMs();
            });
            var dates = explicationDocs.map(function (a) { return a.Date; }).filter(function (d) { return d < date.getFirstMs() || d > date.getLastMs(); });
            var prevs = dates.filter(function (d) { return d < dateTime; }).sort(function (d1, d2) { return d2 - d1; });
            var nexts = dates.filter(function (d) { return d > dateTime; }).sort(function (d1, d2) { return d1 - d2; });
            for (var i = 0; i < explications.length; i++) {
                for (var j = 0; j < explications[i].TagIdList.length; j++) {
                    explications[i].TagIdList[j] = tagDocs.filter(function(t) { return t._id.equals(new ObjectId(explications[i].TagIdList[j])); })[0].Description;
                }
            }
            var results = {
                Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
                Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
                Explications: explications
            };
            res.send(results);
        });
        
    });
}

exports.search = function (req, res) {
    explicationsCollection.find({ Title: { $regex: req.params.text }, Text: { $regex: req.params.text } }).toArray(function (err, agendas) {
        res.send(agendas);
    });
}