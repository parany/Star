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
        tagDocs.forEach(function (tag) {
            tag._id = tag._id.toString();
        });
        for (var i = 0; i < treaties.length; i++) {
            for (var j = 0; j < treaties[i].TagIdList.length; j++) {
                treaties[i].TagIdList[j] = _.findWhere(tagDocs, { _id: treaties[i].TagIdList[j].toString() }).Description;
            }
        }
        res.send(treaties);
    });
};

exports.search = function (req, res) {
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
        res.send(docs);
    });
};