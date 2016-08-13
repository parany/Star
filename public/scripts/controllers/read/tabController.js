angular.module('starApp.controllers').controller('tabController', ['$scope', '$rootScope', 'noteService', function($scope, $rootScope, noteService) {
	$rootScope.$on('read.changeSelect', function(event, id) {
		noteService.getNotes(id).success(function(data) {
			$scope.dtoNote = data;
		});
	});
}]);