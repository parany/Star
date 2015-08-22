starApp.controller('agendaController', function($scope, $location, accountService, genericService, activityService, starTable) {
    $scope.page.title = 'Agenda - Home page';
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.getList('agendas', accountService.getUserName()).then(function(data) {
        $scope.datas = data;
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    });

    activityService.getActivities('agendas', accountService.getUserName()).then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/agendas/detail/' + model._id);
    };

    $scope.search = function() {
        if (!$scope.txtSearch || $scope.txtSearch.length < 1) {
            $scope.datas = _.sortBy($scope.datas, 'DateGroup');
            $scope.datas.reverse();
            return;
        }
        genericService.search('agendas', accountService.getUserName(), $scope.txtSearch).then(function(data) {
            $scope.datas = _.sortBy(data, 'DateGroup');
            $scope.datas.reverse();
            $scope.tableSearch.settings().total = $scope.datas.length;
            $scope.tableSearch.parameters().page = 1;
            $scope.tableSearch.reload();
        });
    };
});