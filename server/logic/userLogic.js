var jwt = require('jsonwebtoken');
var repository = require('../model/repository.js');
var config = require('../config/config.json');

exports.login = function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username === '' || password === '') {
        console.log('Empty credentials');
        return res.sendStatus(401);
    }

    repository.findOne('users', {
        UserName: username
    }).then(function(data) {
        if (!data) {
            console.log('User ' + username + ' not found!');
            return res.sendStatus(401);
        }
        if (data.Password !== password) {
            console.log('Attempt failed to login with ' + username);
            return res.sendStatus(401);
        }
        var token = jwt.sign(data, config.secretToken, {
            expiresIn: 6000
        });
        console.log(username + ' looged in successfully!');
        return res.json({
            token: token,
            user: data
        });
    });
};