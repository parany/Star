/* jshint node: true */

var router = require('express').Router();
var noteLogic = require('../logic/noteLogic.js');

router.get('/getNotesByVerseId/:author/:verseId', noteLogic.getNotesByVerseId);
router.get('/getNoteById/:id', noteLogic.getNoteById);
router.get('/getAllNotesWithAssociatedBooks/:author', noteLogic.getAllNotesWithAssociatedBooks);

module.exports = router;