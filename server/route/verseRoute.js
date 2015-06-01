/* jshint node: true */

var router = require('express').Router();
var verseLogic = require('../logic/verseLogic.js');

router.get('/search/:version/:text', verseLogic.search);

module.exports = router;