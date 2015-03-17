var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;

var agendasCollection = repository.getCollection('agendas');

Date.prototype.toAnyString = function () {
    return this.getFullYear() + '-' + parseInt(this.getMonth() + 1).format() + '-' + this.getDate().format();
}

Number.prototype.format = function () {
    if ((this + '').length < 2) return '0' + this;
    return this;
};

Date.prototype.getFirstMs = function() {
    return this.setUTCHours(0, 0, 0, 0);
}

Date.prototype.getLastMs = function() {
    return this.setUTCHours(23, 59, 59, 999);
}

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    var dateTime = date.getTime();
    agendasCollection.find({ CreatedBy: req.params.author }).toArray(function (err, docs) {
        var agendas = docs.filter(function (a) {
            return a.Date >= date.getFirstMs() && a.Date <= date.getLastMs();
        });
        var dates = docs.map(function (a) { return a.Date; });
        var prevs = dates.filter(function(d) { return d < dateTime; }).sort(function(d1, d2) { return d2 - d1; });
        var nexts = dates.filter(function(d) { return d > dateTime; }).sort(function (d1, d2) { return d1 - d2; });
        var results = {
            Prev: prevs.length == 0 ? null : new Date(prevs[0]).toAnyString(),
            Next: nexts.length == 0 ? null : new Date(nexts[0]).toAnyString(),
            Agendas: agendas
        };
        res.send(results);
    });
}