var router = require('express').Router();
var treatyLogic = require('../logic/treatyLogic.js');

router.get('/getByDate/:date', treatyLogic.getByDate);
router.get('/search/:text', treatyLogic.search);

module.exports = router;