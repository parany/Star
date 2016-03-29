var _ = require('underscore');

var repository = require('../model/repository.js');
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

exports.getByDate = function(req, res) {
    var date = new Date(req.params.date);
    var treaties = [];
    var firstMsOfDay = date.getFirstMsOfDay();
    var lastMsOfDay = date.getLastMsOfDay();
    repository.find('treaties', {
        CreatedBy: req.params.author,
        sort: {
            Date: 1
        },
        Date: {
            $gte: firstMsOfDay,
            $lte: lastMsOfDay
        }
    }).then(function(docs) {
        treaties = docs;
        return repository.find('tags', {
            Type: 'Treaty'
        });
    }).then(function(tagDocs) {
        tagDocs.forEach(function(tag) {
            tag._id = tag._id.toString();
        });
        for (var i = 0; i < treaties.length; i++) {
            for (var j = 0; j < treaties[i].TagIdList.length; j++) {
                treaties[i].TagIdList[j] = _.findWhere(tagDocs, {
                    _id: treaties[i].TagIdList[j].toString()
                }).Description;
            }
        }
        res.send(treaties);
    });
};

exports.search = function(req, res) {
    repository.find('treaties', {
        $or: [{
            Title: {
                $regex: req.params.text
            }
        }, {
            Content: {
                $regex: req.params.text
            }
        }]
    }).then(function(docs) {
        res.send(docs);
    });
};