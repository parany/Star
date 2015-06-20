starApp.controller('tabController', function($scope, $rootScope, $http, accountService) {
	$rootScope.$on('read.changeSelect', function(event, id) {
		$http.get('/notes/getNotesByVerseId/' + accountService.getUserName() + '/' + id).success(function(data) {
			$scope.dtoNote = data;
		});
	});
});