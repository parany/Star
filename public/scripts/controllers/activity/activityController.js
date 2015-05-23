/* global starApp */
starApp.controller('activityController', function($scope, $http, ngTableParams, _, auth) {
	$scope.page.title = 'Activity';


	// GENERAL
	$http.get('/getTotal/' + auth.getUserName()).success(function(data) {
		$scope.generalLabels = _.pluck(data, 'article');
		$scope.generalData = _.pluck(data, 'total');
	});

	$http.get('/getAllActivities/' + auth.getUserName()).success(function(data) {
		$scope.operationsLabels = _.pluck(data, 'operation');
		$scope.operationsData = _.pluck(data, 'total');
	});


	// AGENDA
	$scope.agendaActivity = {};
	$scope.agendaActivity.operations = [];

	$scope.tableAgendaOperations = new ngTableParams({
		page: 1,
		count: 10
	}, {
		counts: [],
		getData: function($defer, params) {
			$defer.resolve($scope.agendaActivity.operations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		},
		$scope: {
			$data: {}
		}
	});

	$http.get('/agendas/getActivities/' + auth.getUserName() + '/250').success(function(data) {
		$scope.agendaActivity = data;
		$scope.agendaActivity.operations.forEach(function(value) {
			value.date = new Date(value.date);
		});
		$scope.tableAgendaOperations.settings().total = $scope.agendaActivity.operations.length;
		$scope.tableAgendaOperations.parameters().page = 1;
		$scope.tableAgendaOperations.reload();
	});


	// EXPLICATION
	$scope.explicationActivity = {};
	$scope.explicationActivity.operations = [];

	$scope.tableExplicationOperations = new ngTableParams({
		page: 1,
		count: 10
	}, {
		counts: [],
		getData: function($defer, params) {
			$defer.resolve($scope.explicationActivity.operations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		},
		$scope: {
			$data: {}
		}
	});

	$http.get('/explications/getActivities/' + auth.getUserName() + '/250').success(function(data) {
		$scope.explicationActivity = data;
		$scope.explicationActivity.operations.forEach(function(value) {
			value.date = new Date(value.date);
		});
		$scope.tableExplicationOperations.settings().total = $scope.explicationActivity.operations.length;
		$scope.tableExplicationOperations.parameters().page = 1;
		$scope.tableExplicationOperations.reload();
	});


	// TREATY
	$scope.treatyActivity = {};
	$scope.treatyActivity.operations = [];

	$scope.tableTreatyOperations = new ngTableParams({
		page: 1,
		count: 10
	}, {
		counts: [],
		getData: function($defer, params) {
			$defer.resolve($scope.treatyActivity.operations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		},
		$scope: {
			$data: {}
		}
	});

	$http.get('/treaties/getActivities/' + auth.getUserName() + '/250').success(function(data) {
		$scope.treatyActivity = data;
		$scope.treatyActivity.operations.forEach(function(value) {
			value.date = new Date(value.date);
		});
		$scope.tableTreatyOperations.settings().total = $scope.treatyActivity.operations.length;
		$scope.tableTreatyOperations.parameters().page = 1;
		$scope.tableTreatyOperations.reload();
	});


	// NEW
	$scope.newActivity = {};
	$scope.newActivity.operations = [];

	$scope.tableNewOperations = new ngTableParams({
		page: 1,
		count: 10
	}, {
		counts: [],
		getData: function($defer, params) {
			$defer.resolve($scope.newActivity.operations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		},
		$scope: {
			$data: {}
		}
	});

	$http.get('/news/getActivities/' + auth.getUserName() + '/250').success(function(data) {
		$scope.newActivity = data;
		$scope.newActivity.operations.forEach(function(value) {
			value.date = new Date(value.date);
		});
		$scope.tableNewOperations.settings().total = $scope.newActivity.operations.length;
		$scope.tableNewOperations.parameters().page = 1;
		$scope.tableNewOperations.reload();
	});
});