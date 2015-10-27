var repository = require('../model/repository.js');

exports.listen = function(io) {
	io.on('connection', function(socket) {
		socket.on('join', function(name) {
			socket.nickname = name;
			var users = [];
			repository.find('users', {
				projection: {
					UserName: 1
				}
			}).then(function(data) {
				users = data;
				users.forEach(function(user) {
					var socUser = socket.nsp.sockets.filter(function(soc) {
						return user.UserName === soc.nickname;
					});
					user.nickname = user.UserName;
					if (socUser.length) {
						user.active = true;
						user.id = socUser[0].id;
					}
				});
				users = users.filter(function(user) {
					return user.nickname !== socket.nickname;
				});
				users.unshift({
					nickname: 'broadcast'
				});
				return repository.find('messages', {
					$or: [{
						from: name
					}, {
						to: name
					}, {
						to: 'broadcast'
					}],
					sort: {
						date: 1
					}
				});
			}).then(function(messages) {
				var data = {
					'messages': messages,
					'users': users
				};
				socket.emit('initialization', data);
				socket.broadcast.emit('status', {
					nickname: socket.nickname,
					status: true
				});
			});
		});

		socket.on('message', function sendMessage(data) {
			if (data.to === 'broadcast') {
				socket.broadcast.emit('message', data);
			} else {
				var soc = socket.nsp.sockets.filter(function(user) {
					return user.nickname === data.to;
				});
				soc[0].emit('message', data);
			}
			data.date = new Date(data.date).getTime();
			data.seen = false;
			repository.insert('messages', data);
		});

		socket.on('mark', function sendMessage(data) {
			repository.save('messages', data);
		});

		socket.on('disconnect', function() {
			socket.broadcast.emit('status', {
				nickname: socket.nickname,
				status: false
			});
		});
	});
};