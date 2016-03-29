/* jshint node: true */

var router = require('express').Router();
var treatyLogic = require('../logic/treatyLogic.js');

router.get('/getByDate/:author/:date', treatyLogic.getByDate);
router.get('/search/:text', treatyLogic.search);

module.exports = router;