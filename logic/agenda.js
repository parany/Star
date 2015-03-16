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

exports.getByDate = function (req, res) {
    var date = new Date(req.params.date);
    agendasCollection.find({ CreatedBy: req.params.author, Date: { $in: [date, req.params.date + 'T00:00:00.000Z'] } }).toArray(function (err, docs) {
        agendasCollection
        .find({ Date: { $lt: date } }, { Date: 1 })
        .sort({ Date: -1 }).limit(1)
        .toArray(function (prevErr, prevs) {
            agendasCollection
                .find({ Date: { $gt: date } }, { Date: 1 })
                .sort({ Date: -1 }).limit(1)
                .toArray(function (nextErr, nexts) {
                var results = {
                    Prev: prevs.length == 0 ? null : prevs[0].Date.toAnyString(),
                    Next: nexts.length == 0 ? null : nexts[0].Date.toAnyString(),
                    Agendas: docs
                };
                res.send(results);
            });
        });
    });
}