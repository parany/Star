starApp.controller('tabController', function($scope, $rootScope, $http, auth) {
	$rootScope.$on('read.changeSelect', function(event, id) {
		$http.get('/notes/getNotesByVerseId/' + auth.getUserName() + '/' + id).success(function(data) {
			$scope.dtoNote = data;
		});
	});
});