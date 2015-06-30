starApp.controller('agendaController', function($scope, $location, accountService, genericService, activityService, starTable) {
    $scope.page.title = 'Agenda - Home page';
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.getList('agendas', accountService.getUserName()).then(function(data) {
        $scope.datas = data.data;
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    });

    activityService.getActivities('agendas', accountService.getUserName()).then(function(data) {
        $scope.activity = data;
        $scope.activity.operations.forEach(function(value) {
            value.date = new Date(value.date);
        });
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/agendas/detail/' + model._id);
    };

    $scope.search = function() {
        if (!$scope.txtSearch || $scope.txtSearch.length < 1) {
            return;
        }
        genericService.search('agendas', $scope.txtSearch).success(function(data) {
            $scope.datas = data;
            $scope.datas.forEach(function(d) {
                d.CreatedBy = accountService.getUserName();
                d.Date = new Date(d.Date);
                d.DateGroup = d.Date.toCompareString();
            });
            $scope.tableSearch.settings().total = $scope.datas.length;
            $scope.tableSearch.parameters().page = 1;
            $scope.tableSearch.reload();
        });
    };
});