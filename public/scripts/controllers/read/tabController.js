starApp.controller('tabController', function($scope, $rootScope, noteService, accountService) {
	$rootScope.$on('read.changeSelect', function(event, id) {
		noteService.getNotes(accountService.getUserName(), id).success(function(data) {
			$scope.dtoNote = data;
		});
	});
});