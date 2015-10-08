starApp.controller('chatController', function($scope, starTable, accountService) {
	$scope.page.title = 'Chat';

	$scope.users = [];
	$scope.tableUser = starTable.create($scope, 'users', false, 100);

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
	});

	$scope.changeUserSelected = function(model) {
		$scope.users.forEach(function(d) {
			d.$selected = false;
		});
		model.$selected = !model.$selected;
		$scope.user = model;
	};

	$scope.writting = function() {};

	$scope.sendMessage = function() {
		var data = {
			from: accountService.getUserName(),
			message: $scope.message,
			to: $scope.user.nickname
		};
		socket.emit('message', data);
	};
});