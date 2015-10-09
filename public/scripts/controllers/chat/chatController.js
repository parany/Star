starApp.controller('chatController', function($scope, starTable, accountService) {
	$scope.page.title = 'Chat';

	$scope.messages = {};
	$scope.selectedMessages = [];
	$scope.users = [];

	$scope.tableUser = starTable.create($scope, 'users', false, 100);
	$scope.tableMessage = starTable.create($scope, 'selectedMessages', false, 100);

	var socket = io.connect();

	socket.on('connect', function() {
		socket.emit('join', accountService.getUserName());
	});

	socket.on('initialization', function(data) {
		$scope.users = data.users;
		data.users.forEach(function(user) {
			var nickname = user.nickname;
			$scope.messages[nickname] = [];
			data.messages.forEach(function(message) {
				if (message.from === nickname || message.to === nickname) {
					$scope.messages[user.nickname].push({
						author: message.from === nickname ? nickname : message.from,
						message: message.message,
						date: new Date(message.date)
					});
				}
			});
		});
		$scope.tableUser.reload();
	});

	socket.on('message', function(data) {
		if (data.to === 'broadcast') {
			$scope.messages[data.to].push({
				author: data.from,
				message: data.message,
				date: data.date
			});
		} else {
			$scope.messages[data.from].push({
				author: data.from,
				message: data.message,
				date: data.date
			});
		}
		$scope.tableMessage.reload();
	});

	$scope.changeUserSelected = function(model) {
		$scope.users.forEach(function(d) {
			d.$selected = false;
		});
		model.$selected = true;
		$scope.user = model;
		$scope.selectedMessages = $scope.messages[model.nickname];
		$scope.tableMessage.reload();
	};

	$scope.writting = function() {};

	$scope.sendMessage = function() {
		var data = {
			from: accountService.getUserName(),
			message: $scope.message,
			to: $scope.user.nickname,
			date: new Date()
		};
		$scope.messages[data.to].push({
			author: data.from,
			message: data.message,
			date: data.date
		});
		$scope.tableMessage.reload();
		socket.emit('message', data);
		$scope.message = '';
	};
});