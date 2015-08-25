// DEPENDENCIES
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var connect = require('connect');

var config = require('./config/config.json');
var log = require('./utils/log.js');

// SETTING UP ENVIRONNEMENTS
var port = process.env.PORT || config.port;
var app = express();
app.set('port', port);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../public')));

// ROUTES
var verseRoute = require('./route/verseRoute.js');
var noteRoute = require('./route/noteRoute.js');
var explicationRoute = require('./route/explicationRoute.js');
var treatyRoute = require('./route/treatyRoute.js');
var activityRoute = require('./route/activityRoute.js');
var genericRoute = require('./route/genericRoute.js');

app.use('/verses', verseRoute);
app.use('/notes', noteRoute);
app.use('/explications', explicationRoute);
app.use('/treaties', treatyRoute);
app.use('/activities', activityRoute);
app.use('/', genericRoute);

// ERROR
// error 404
app.use(function(req) {
	log.error('error 404 ' + req.url);
});
// error 500
app.use(function(err) {
	log.error(err.stack);
});

// LAUNCH THE SERVER
http.createServer(app).listen(config.port, function() {
	log.info('server created with success');
	log.info('listening on port ' + config.port);
});