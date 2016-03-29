var _ = require('underscore');

var repository = require('../model/repository.js');
require('../helpers/dateHelper.js');
require('../helpers/numberHelper.js');

exports.getByDate = function(req, res) {
    var date = new Date(req.params.date);
    var explications = [];
    var firstMsOfDay = date.getFirstMsOfDay();
    var lastMsOfDay = date.getLastMsOfDay();
    repository.find('explications', {
        CreatedBy: req.params.author,
        sort: {
            Date: 1
        },
        Date: {
            $gte: firstMsOfDay,
            $lte: lastMsOfDay
        }
    }).then(function(docs) {
        explications = docs;
        return repository.find('tags', {
            Type: 'Explication'
        });
    }).then(function(tagDocs) {
        tagDocs.forEach(function(tag) {
            tag._id = tag._id.toString();
        });
        for (var i = 0; i < explications.length; i++) {
            for (var j = 0; j < explications[i].TagIdList.length; j++) {
                explications[i].TagIdList[j] = _.where(tagDocs, {
                    _id: explications[i].TagIdList[j]
                }).Description;
            }
        }
        res.send(explications);
    });
};

exports.search = function(req, res) {
    repository.find('explications', {
        $or: [{
            Title: {
                $regex: req.params.text
            }
        }, {
            Content: {
                $regex: req.params.text
            }
        }]
    }).then(function(explications) {
        res.send(explications);
    });
};