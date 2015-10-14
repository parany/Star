starApp.controller('chatController', function($rootScope, $scope, starTable, accountService) {
	$scope.page.title = 'Chat';

	$scope.selectedMessages = [];
	$scope.tableUser = starTable.create($scope, 'page.users', false, 100);
	$scope.tableMessage = starTable.create($scope, 'selectedMessages', false, 100);

	$scope.changeUserSelected = function(model) {
		$scope.page.users.forEach(function(d) {
			d.$selected = false;
		});
		model.$selected = true;
		$scope.user = model;
		$scope.selectedMessages = $scope.page.messages[model.nickname];
		$scope.tableMessage.reload();
	};

	$rootScope.$on('chat.users', function() {
		$scope.tableUser.reload();
	});

	$rootScope.$on('chat.messages', function() {
		$scope.tableMessage.reload();
	});

	$scope.writting = function() {
		console.log('writting in');
	};

	$scope.sendMessage = function() {
		var data = {
			from: accountService.getUserName(),
			message: $scope.message,
			to: $scope.user.nickname,
			date: new Date()
		};
		$rootScope.$emit('chat.send', data);
		$scope.page.messages[data.to].push({
			author: 'Me',
			message: data.message,
			date: data.date
		});
		$scope.tableMessage.reload();
		$scope.message = '';
	};
});