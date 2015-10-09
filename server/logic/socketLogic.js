var repository = require('../model/repository.js');

var socket = null;

exports.listen = function(io) {
	io.on('connection', function(soc) {
		socket = soc;
		socket.on('join', join);
		socket.on('message', sendMessage);
	});
};

function join(name) {
	socket.nickname = name;
	var users = socket.nsp.sockets.filter(function(user) {
		return user.nickname !== socket.nickname;
	});
	users = users.map(function(soc) {
		return {
			id: soc.id,
			nickname: soc.nickname
		};
	});
	users.unshift({
		nickname: 'broadcast'
	});
	repository.find('messages', {
		$or: [{
			from: name
		}, {
			to: name
		}],
		sort: {
			date: 1
		}
	}).then(function(messages) {
		var data = {
			'messages': messages,
			'users': users
		};
		socket.emit('initialization', data);
	});
}

function sendMessage(data) {
	var soc = socket.nsp.sockets.filter(function(user) {
		return user.nickname === data.to;
	});
	soc[0].emit('message', data);
	data.date = new Date(data.date).getTime();
	repository.insert('messages', data);
}