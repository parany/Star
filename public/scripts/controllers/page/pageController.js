starApp.controller('pageController', ['$scope', function($scope) {
	$scope.page = {};
	$scope.page.users = [];
	$scope.page.messages = {};
	$scope.page.nbOfNotifications = 0;
}]);