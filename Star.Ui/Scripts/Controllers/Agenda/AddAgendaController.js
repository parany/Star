starApp.controller('AddAgendaController', function ($scope, $routeParams, $http, $location, ngTableParams, apiUrl, auth) {
    $scope.agenda = {};
    $scope.Date = '';
    $scope.Date = new Date().toISOString().split('T')[0];
	$scope.data = [];
	$scope.agenda.Text = '';

	$scope.tableParams = new ngTableParams({
		page: 1,  
		total: 1, 
		count: 5 
	}, {
		counts: [],
		getData: function ($defer, params) {
			$defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		},
		$scope: { $data: {} }
	});
	$scope.tableParams.settings().$scope = $scope;

	$scope.$watch('Date', function () {
	    $http.get(apiUrl + 'Agenda/GetByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
	        $scope.data = data.Agendas;
	        $scope.tableParams.reload();
	    });
	});

	$scope.save = function() {
	    var data = $scope.agenda;
	    data.Date = $scope.Date;
		data.CreatedBy = auth.getUserName();
		$http({
            method: 'POST',
			data: data,
			url: apiUrl + 'Agenda/Insert'
		}).success(function() {
		    $location.path('/agenda/index');
		}).error(function(err) {
		    console.log(err);
		});
	}
});