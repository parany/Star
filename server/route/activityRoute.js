var router = require('express').Router();
var genericLogic = require('../logic/genericLogic.js');

router.get('/:collectionName/:limit?', genericLogic.getActivities);
router.get('', genericLogic.getAllActivities);

module.exports = router;