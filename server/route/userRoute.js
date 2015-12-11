var router = require('express').Router();
var userLogic = require('../logic/userLogic.js');

router.post('/login', userLogic.login);

module.exports = router;