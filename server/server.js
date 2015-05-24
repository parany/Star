/* global process */

// DEPENDENCIES
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var connect = require('connect');

var config = require('./config.json');
var log = require('./utils/log.js');

// SETTING UP ENVIRONNEMENTS
var port = process.env.PORT || config.port;
var app = express();
app.set('port', port);
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), '/../public')));
app.use(connect.logger('dev'));

// INCLUDE LOGICS
var genericLogic = require('./logic/genericLogic.js');
var notes = require('./logic/notes.js');
var verses = require('./logic/verses.js');
var explications = require('./logic/explications.js');
var treaties = require('./logic/treaties.js');

// ROUTES
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
app.get('/:collectionName/getActivities/:author/:limit?', genericLogic.getActivities);
app.get('/:collectionName/getArticlesInTheSameDate/:date', genericLogic.getArticlesInTheSameDate);
app.get('/:collectionName/getPrevNearArticles/:date', genericLogic.getPrevNearArticles);
app.get('/:collectionName/getNextNearArticles/:date', genericLogic.getNextNearArticles);

// ERROR
// error 404
app.use(function(req, res) {
	log.error('error 404 ' + req.url);
});
// error 500
app.use(function(err, req, res, next) {
	log.error(err.stack);
});

// LAUNCH THE SERVER
http.createServer(app).listen(config.port, function() {
	log.info('server created with success');
	log.info('listening on port ' + config.port);
});