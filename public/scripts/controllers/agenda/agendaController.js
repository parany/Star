starApp.controller('agendaController', function($scope, $routeParams, $filter, $location, ngTableParams, accountService, agendaService, starTable, activityService) {
    $scope.page.title = 'Agenda - Home page';
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    agendaService.find({
        CreatedBy: accountService.getUserName(),
        sort: {
            Date: -1
        },
        projection: {
            Title: 1,
            Date: 1
        }
    }).then(function(data) {
        $scope.datas = data;
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
        agendaService.search($scope.txtSearch).success(function(data) {
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