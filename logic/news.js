var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var newsCollection = repository.getCollection('news');

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    newsCollection.find({ CreatedBy: req.params.author }).toArray(function (err, docs) {
        var news = docs.filter(function (a) {
            return a.Date >= date.getFirstMs() && a.Date <= date.getLastMs();
        });
        var dates = docs.map(function (a) { return a.Date; }).filter(function (d) { return d < date.getFirstMs() || d > date.getLastMs(); });
        var prevs = dates.filter(function (d) { return d < dateTime; }).sort(function (d1, d2) { return d2 - d1; });
        var nexts = dates.filter(function (d) { return d > dateTime; }).sort(function (d1, d2) { return d1 - d2; });
        var results = {
            Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
            Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
            News: news
        };
        res.send(results);
    });
}

exports.search = function (req, res) {
    newsCollection.find({
        $or: [
            { Title: { $regex: req.params.text } }, 
            { Content: { $regex: req.params.text } }]
    }).toArray(function (err, agendas) {
        res.send(agendas);
    });
}