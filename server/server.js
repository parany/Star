/* global process */
// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var connect = require('connect');

var config = require('./config.json');

// setting up environnements
var port = process.env.PORT || config.port;
var app = express();
app.set('port', port);
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), '/../public')));
app.use(connect.logger('dev'));

// include logics
var genericLogic = require('./logic/genericLogic.js');
var notes = require('./logic/notes.js');
var verses = require('./logic/verses.js');
var explications = require('./logic/explications.js');
var treaties = require('./logic/treaties.js');

// routes
app.get('/verses/search/:version/:text', verses.search);

app.get('/notes/getNotesByVerseId/:author/:verseId', notes.getNotesByVerseId);
app.get('/notes/getNoteById/:id', notes.getNoteById);
app.get('/notes/getAllNotesWithAssociatedBooks/:author', notes.getAllNotesWithAssociatedBooks);

app.get('/explications/getByDate/:author/:date', explications.getByDate);
app.get('/explications/search/:text', explications.search);
app.get('/treaties/getByDate/:author/:date', treaties.getByDate);

app.get('/treaties/search/:text', treaties.search);

app.get('/getAllActivities/:author', genericLogic.getAllActivities);
app.get('/getTotal/:author', genericLogic.getTotal);

app.get('/:collectionName/findAll', genericLogic.findAll);
app.post('/:collectionName/find', genericLogic.find);
app.get('/:collectionName/findOne/:id', genericLogic.findOne);
app.post('/:collectionName/update', genericLogic.update);
app.post('/:collectionName/insert', genericLogic.insert);
app.get('/:collectionName/getByDate/:author/:date', genericLogic.getByDate);
app.get('/:collectionName/delete/:id', genericLogic.delete);
app.post('/:collectionName/search/:text', genericLogic.search);
app.get('/:collectionName/getActivities/:author', genericLogic.getActivities);
app.get('/:collectionName/getArticlesInTheSameDate/:date', genericLogic.getArticlesInTheSameDate);
app.get('/:collectionName/getPrevNearArticles/:date', genericLogic.getPrevNearArticles);
app.get('/:collectionName/getNextNearArticles/:date', genericLogic.getNextNearArticles);

// launch the server
http.createServer(app).listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});
