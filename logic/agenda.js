var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var agendasCollection = repository.getCollection('agendas');

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    agendasCollection.find({ CreatedBy: req.params.author }).toArray(function (err, docs) {
        var agendas = docs.filter(function (a) {
            return a.Date >= date.getFirstMs() && a.Date <= date.getLastMs();
        });
        var dates = docs.map(function (a) { return a.Date; });
        var prevs = dates.filter(function (d) { return d < dateTime; }).sort(function (d1, d2) { return d2 - d1; });
        var nexts = dates.filter(function (d) { return d > dateTime; }).sort(function (d1, d2) { return d1 - d2; });
        var results = {
            Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
            Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
            Agendas: agendas
        };
        res.send(results);
    });
}

exports.search = function (req, res) {
    agendasCollection.find({ Title: { $regex: req.params.text }, Text: { $regex: req.params.text } }).toArray(function (err, agendas) {
        res.send(agendas);
    });
}