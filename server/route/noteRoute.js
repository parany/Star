/* jshint node: true */

var router = require('express').Router();
var noteLogic = require('../logic/noteLogic.js');

router.get('/getNotesByVerseId/:author/:verseId', noteLogic.getNotesByVerseId);
router.get('/getNoteById/:id', noteLogic.getNoteById);
router.get('/search/:author/:text?', noteLogic.search);

module.exports = router;