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

	socket.on('users', function(users) {
		$scope.users = users;
		$scope.tableUser.reload();
	});

	socket.on('message', function(data) {
		console.log(data);
		if (!$scope.messages[data.from]) {
			$scope.messages[data.from] = [];
		}
		$scope.messages[data.from].push({
			author: data.from,
			message: data.message,
			date: data.date
		});
		$scope.tableMessage.reload();
	});

	$scope.changeUserSelected = function(model) {
		$scope.users.forEach(function(d) {
			d.$selected = false;
		});
		model.$selected = !model.$selected;
		$scope.user = model;
		if (!$scope.messages[model.nickname]) {
			$scope.messages[model.nickname] = [];
		}
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
		if (!$scope.messages[data.to]) {
			$scope.messages[data.to] = [];
		}
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