/* jshint node: true */

var router = require('express').Router();
var genericLogic = require('../logic/genericLogic.js');

router.get('/:collectionName/:author/:limit?', genericLogic.getActivities);
router.get('/:author', genericLogic.getAllActivities);

module.exports = router;