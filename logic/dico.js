var repository = require('../model/repository.js');
var ObjectId = require('mongodb').ObjectID;
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

var dicosCollection = repository.getCollection('dicos');

exports.search = function (req, res) {
    dicosCollection.find({ Text: { $regex: req.params.text } }).toArray(function (err, dicos) {
        res.send(dicos);
    });
}