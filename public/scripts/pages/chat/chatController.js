angular.module('starApp.controllers').controller('chatController', ['$rootScope', '$scope', 'starTable', 'accountService', function($rootScope, $scope, starTable, accountService) {
	$scope.page.title = 'Chat';

	$scope.userName = accountService.getUserName();
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

	$scope.sendMessage = function() {
		var data = {
			from: $scope.userName,
			message: $scope.message,
			to: $scope.user.nickname,
			date: new Date()
		};
		$rootScope.$emit('chat.send', data);
		$scope.page.messages[data.to].push({
			author: 'Me',
			message: data.message,
			date: data.date,
			seen: true
		});
		$scope.tableMessage.reload();
		$scope.message = '';
	};

	$scope.markSeen = function(model) {
		if (model.seen) {
			return;
		}
		$scope.page.nbOfNotifications--;
		model.seen = true;
		$rootScope.$emit('chat.mark', model);
	};

	setInterval(function(){
		_.forIn($scope.page.messages, function(messages) {
			messages.forEach(function(message) {
				message.displayDate = message.date.getElapsed();
			});
		});
		$scope.tableMessage.reload();
	}, 10000);
}]);