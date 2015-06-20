starApp.controller('activityController', function($scope, $http, ngTableParams, _, activityService, auth) {
	$scope.page.title = 'Activity';

	// GENERAL
	activityService.getSummary(auth.getUserName()).then(function(data) {
		$scope.generalLabels = data.labels;
		$scope.generalData = data.data;
	});

	activityService.getAllActivities(auth.getUserName()).then(function(data) {
		$scope.operationsLabels = data.labels;
		$scope.operationsData = data.data;
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

	activityService.getActivities('agendas', auth.getUserName()).then(function(data) {
		$scope.agendaActivity = data;
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

	activityService.getActivities('explications', auth.getUserName()).then(function(data) {
		$scope.explicationActivity = data;
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

	activityService.getActivities('treaties', auth.getUserName()).then(function(data) {
		$scope.treatyActivity = data;
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

	activityService.getActivities('news', auth.getUserName()).then(function(data) {
		$scope.newActivity = data;
		$scope.tableNewOperations.settings().total = $scope.newActivity.operations.length;
		$scope.tableNewOperations.parameters().page = 1;
		$scope.tableNewOperations.reload();
	});
});