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
	socket.emit('users', users);
}

function sendMessage(data) {
	var soc = socket.nsp.sockets.filter(function(user) {
		return user.nickname === data.to;
	});
	soc[0].emit('message', data);
}