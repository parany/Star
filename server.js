// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var connect = require('connect');
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
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.configure('developpement', function () { app.use(express.errorHandler()); });

// include logics
var genericRoute = require('./logic/genericLogic.js');
var agenda = require('./logic/agenda.js');
var treaty = require('./logic/treaty.js');
var explication = require('./logic/explication.js');
var dico = require('./logic/dico.js');
var news = require('./logic/news.js');

// routes
app.get('/:collectionName/getAll', genericRoute.getAll);
app.get('/:collectionName/get/:id', genericRoute.get);
app.post('/:collectionName/update', genericRoute.update);
app.post('/:collectionName/insert', genericRoute.insert);
app.get('/:collectionName/delete/:id', genericRoute.delete);
app.get('/tag/getByType/:type', genericRoute.getTagsByType);

app.get('/agendas/getByDate/:author/:date', agenda.getByDate);
app.get('/agendas/search/:text', agenda.search);

app.get('/explications/getByDate/:author/:date', explication.getByDate);
app.get('/explications/search/:text', explication.search);

app.get('/treaties/getByDate/:author/:date', treaty.getByDate);
app.get('/treaties/search/:text', treaty.search);

app.get('/dicos/search/:text', dico.search);

app.get('/news/getByDate/:author/:date', news.getByDate);
app.get('/news/search/:text', news.search);

// v2
var genericRoutev2 = require('./logic/genericLogicv2.js');
var notes = require('./logic/notes.js');
var verses = require('./logic/verses.js');

app.get('/:collectionName/findAllv2', genericRoutev2.findAllv2);
app.post('/:collectionName/findv2', genericRoutev2.findv2);
app.get('/:collectionName/findOnev2/:id', genericRoutev2.findOnev2);
app.post('/:collectionName/updatev2', genericRoutev2.updatev2);
app.post('/:collectionName/insertv2', genericRoutev2.insertv2);

app.get('/verses/search/:version/:text', verses.search);

app.get('/notes/getNotesByVerseId/:author/:verseId', notes.getNotesByVerseId);
app.get('/notes/getNoteById/:id', notes.getNoteById);
app.get('/notes/getAllNotesWithAssociatedBooks/:author', notes.getAllNotesWithAssociatedBooks);

// launch the server
http.createServer(app).listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});
