var fs = require('fs');
var Log = require('log');

var log = new Log('debug', fs.createWriteStream('debug.log'), {
	flag: "a"
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