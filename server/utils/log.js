/* jshint node: true */

var fs = require('fs');
var path = require('path');
var Log = require('log');

var filename = path.join(__dirname, '/../logs/log.txt');

var log = new Log('debug', fs.createWriteStream(filename), {
	flag: 'a'
});

exports.emergency = function(msg) {
	log.emergency(msg);
};

exports.alert = function(msg) {
	log.alert(msg);
};

exports.critical = function(msg) {
	log.critical(msg);
};

exports.error = function(msg) {
	log.error(msg);
};

exports.warning = function(msg) {
	log.warning(msg);
};

exports.notice = function(msg) {
	log.notice(msg);
};

exports.info = function(msg) {
	log.info(msg);
};

exports.debug = function(msg) {
	log.debug(msg);
};