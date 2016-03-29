starApp.controller('activityController', function($scope, activityService, accountService, starTable) {
	$scope.page.title = 'Activity';

	// GENERAL
	activityService.getSummary(accountService.getUserName()).then(function(data) {
		$scope.generalLabels = data.labels;
		$scope.generalData = data.data;
	});

	activityService.getAllActivities(accountService.getUserName()).then(function(data) {
		$scope.operationsLabels = data.labels;
		$scope.operationsData = data.data;
	});

	// AGENDA
	$scope.agendaActivity = {};
	$scope.agendaActivity.operations = [];
	$scope.tableAgendaOperations = starTable.create($scope, 'agendaActivity.operations');
	activityService.getActivities('agendas', accountService.getUserName()).then(function(data) {
		$scope.agendaActivity = data;
		$scope.tableAgendaOperations.settings().total = $scope.agendaActivity.operations.length;
		$scope.tableAgendaOperations.parameters().page = 1;
		$scope.tableAgendaOperations.reload();
	});

	// EXPLICATION
	$scope.explicationActivity = {};
	$scope.explicationActivity.operations = [];
	$scope.tableExplicationOperations = starTable.create($scope, 'explicationActivity.operations');
	activityService.getActivities('explications', accountService.getUserName()).then(function(data) {
		$scope.explicationActivity = data;
		$scope.tableExplicationOperations.settings().total = $scope.explicationActivity.operations.length;
		$scope.tableExplicationOperations.parameters().page = 1;
		$scope.tableExplicationOperations.reload();
	});

	// TREATY
	$scope.treatyActivity = {};
	$scope.treatyActivity.operations = [];
	$scope.tableTreatyOperations = starTable.create($scope, 'treatyActivity.operations');
	activityService.getActivities('treaties', accountService.getUserName()).then(function(data) {
		$scope.treatyActivity = data;
		$scope.tableTreatyOperations.settings().total = $scope.treatyActivity.operations.length;
		$scope.tableTreatyOperations.parameters().page = 1;
		$scope.tableTreatyOperations.reload();
	});

	// NEW
	$scope.newActivity = {};
	$scope.newActivity.operations = [];
	$scope.tableNewOperations = starTable.create($scope, 'newActivity.operations');
	activityService.getActivities('news', accountService.getUserName()).then(function(data) {
		$scope.newActivity = data;
		$scope.tableNewOperations.settings().total = $scope.newActivity.operations.length;
		$scope.tableNewOperations.parameters().page = 1;
		$scope.tableNewOperations.reload();
	});

	// TWEET
	$scope.tweetActivity = {};
	$scope.tweetActivity.operations = [];
	$scope.tableTweetOperations = starTable.create($scope, 'tweetActivity.operations');
	activityService.getActivities('tweets', accountService.getUserName()).then(function(data) {
		$scope.tweetActivity = data;
		$scope.tableTweetOperations.settings().total = $scope.tweetActivity.operations.length;
		$scope.tableTweetOperations.parameters().page = 1;
		$scope.tableTweetOperations.reload();
	});
});