// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var connect = require('connect');

// set up environments
var app = express();
app.set('port', 3333);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// include logics
var genericRoute = require('./logic/genericLogic.js');
var account = require('./logic/account.js');
var read = require('./logic/read.js');
var agenda = require('./logic/agenda.js');
var explication = require('./logic/explication.js');

// routes
app.post('/user/login', account.login);

app.get('/:collectionName/getAll', genericRoute.getAll);
app.get('/:collectionName/get/:id', genericRoute.get);
app.post('/:collectionName/update', genericRoute.update);
app.post('/:collectionName/insert', genericRoute.insert);
app.get('/:collectionName/delete/:id', genericRoute.delete);

app.get('/books/getByTestament/:testamentId', read.getBooksByTestament);
app.get('/verse/getChapters/:bookId', read.getChapters);
app.get('/verse/getParagraphs/:bookId/:chapter', read.getParagraphs);
app.post('/verse/getList', read.getList);
app.get('/verse/search/:version/:text', read.search);
app.get('/note/getNotesByVerseId/:verseId/:author', read.getNotesByVerseId);
app.get('/note/getNoteById/:noteId/:author', read.getNoteById);
app.get('/tag/getByType/:type', read.getTagsByType);
app.get('/note/search/:author', read.searchNotes);

app.get('/agendas/getByDate/:author/:date', agenda.getByDate);
app.get('/agendas/search/:text', agenda.search);

app.get('/explications/getByDate/:author/:date', explication.getByDate);
app.get('/explications/search/:text', explication.search);

// launch the server
http.createServer(app).listen(3333, function () {
    console.log('Express server listening on port 3333');
});
