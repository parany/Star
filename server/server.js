// DEPENDENCIES
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config/config.json');
var log = require('./utils/log.js');
var jwt = require('jsonwebtoken');

// SETTING UP ENVIRONNEMENTS
var port = process.env.PORT || config.port;
var app = module.exports = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', port);
app.use(bodyParser.json());

var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
	app.use(express.static(path.join(__dirname, '/../public', {
		maxAge: 86400000
	})));
}
if (env === 'development') {
	app.use(express.static(path.join(__dirname, '/../public')));
}

// ROUTES
var userRoute = require('./route/userRoute.js');
var verseRoute = require('./route/verseRoute.js');
var noteRoute = require('./route/noteRoute.js');
var explicationRoute = require('./route/explicationRoute.js');
var treatyRoute = require('./route/treatyRoute.js');
var activityRoute = require('./route/activityRoute.js');
var genericRoute = require('./route/genericRoute.js');

app.use('/user', userRoute);

app.use(function(req, res, next) {
	var token = req.headers.authorization;
	if (token) {
		jwt.verify(token, config.secretToken, function(err, decoded) {
			if (err) {
				res.json({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				req.user = decoded;
				next();
			}
		});
	} else {
		res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}
});

app.use('/user', userRoute);
app.use('/verses', verseRoute);
app.use('/notes', noteRoute);
app.use('/explications', explicationRoute);
app.use('/treaties', treatyRoute);
app.use('/activities', activityRoute);
app.use('/', genericRoute);

// ERRORS
// error 404
app.use(function(req) {
	log.error('error 404 ' + req.url);
});
// error 500
app.use(function(err) {
	log.error(err.stack);
});

// LAUNCH THE SERVER
server.listen(config.port, function() {
	log.info('server created with success');
	log.info('listening on port ' + config.port);
});

// SOCKET
require('./logic/socketLogic.js').listen(io);