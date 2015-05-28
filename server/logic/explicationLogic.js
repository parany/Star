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
        tagDocs.forEach(function (tag) {
            tag._id = tag._id.toString();
        });
        for (var i = 0; i < explications.length; i++) {
            for (var j = 0; j < explications[i].TagIdList.length; j++) {
                explications[i].TagIdList[j] = _.where(tagDocs, { _id: explications[i].TagIdList[j] }).Description;
            }
        }
        res.send(explications);
    });
};

exports.search = function (req, res) {
    explicationsRepository.find({
        $or: [
            {
                Title: {
                    $regex: req.params.text
                }
            }, {
                Content: {
                    $regex: req.params.text
                }
            }]
    }).then(function (explications) {
        res.send(explications);
    });
};