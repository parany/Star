﻿// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config.json');

// set up environments
var app = express();
app.set('port', config.port);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, '/../public')));
app.use(express.static(path.join(__dirname, '/../public')));
app.configure('developpement', function () { app.use(express.errorHandler()); });

// include logics
var genericLogic = require('./logic/genericLogic.js');
var notes = require('./logic/notes.js');
var verses = require('./logic/verses.js');
var explications = require('./logic/explications.js');
var treaties = require('./logic/treaties.js');

app.get('/verses/search/:version/:text', verses.search);

app.get('/notes/getNotesByVerseId/:author/:verseId', notes.getNotesByVerseId);
app.get('/notes/getNoteById/:id', notes.getNoteById);
app.get('/notes/getAllNotesWithAssociatedBooks/:author', notes.getAllNotesWithAssociatedBooks);

app.get('/explications/getByDate/:author/:date', explications.getByDate);
app.get('/explications/search/:text', explications.search);

app.get('/treaties/getByDate/:author/:date', treaties.getByDate);
app.get('/treaties/search/:text', treaties.search);

app.get('/:collectionName/findAll', genericLogic.findAll);
app.post('/:collectionName/find', genericLogic.find);
app.get('/:collectionName/findOne/:id', genericLogic.findOne);
app.post('/:collectionName/update', genericLogic.update);
app.post('/:collectionName/insert', genericLogic.insert);
app.get('/:collectionName/getByDate/:author/:date', genericLogic.getByDate);
app.get('/:collectionName/delete/:id', genericLogic.delete);
app.post('/:collectionName/search/:text', genericLogic.search);
app.get('/:collectionName/getActivities/:author', genericLogic.getActivities);

// launch the server
http.createServer(app).listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});