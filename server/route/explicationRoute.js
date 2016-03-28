var router = require('express').Router();
var explicationLogic = require('../logic/explicationLogic.js');

router.get('/getByDate/:date', explicationLogic.getByDate);
router.get('/search/:text', explicationLogic.search);

module.exports = router;