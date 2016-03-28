var router = require('express').Router();
var noteLogic = require('../logic/noteLogic.js');

router.get('/getNotesByVerseId/:verseId', noteLogic.getNotesByVerseId);
router.get('/getNoteById/:id', noteLogic.getNoteById);
router.get('/search/:text?', noteLogic.search);

module.exports = router;