var repository = require('../model/repository.js');
var usersCollection = repository.getCollection('users');

exports.login = function (req, res) {
    usersCollection.findOne({ UserName: req.body.UserName, Password: req.body.Password }, function (err, doc) {
        res.send(doc);
    });
}