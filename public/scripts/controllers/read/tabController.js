starApp.controller('tabController', function($scope, $rootScope, noteService) {
	$rootScope.$on('read.changeSelect', function(event, id) {
		noteService.getNotes(id).success(function(data) {
			$scope.dtoNote = data;
		});
	});
});