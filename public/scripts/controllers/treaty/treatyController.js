starApp.controller('treatyController', function($scope, $routeParams, $filter, $http, $location, starTable, activityService, accountService, genericService) {
    $scope.page.title = 'Treaty - Home page';

    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.getList('treaties', accountService.getUserName()).then(function(data) {
        $scope.datas = data;
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    });

    activityService.getActivities('treaties', accountService.getUserName()).then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/treaties/detail/' + model._id);
    };

    $scope.search = function() {
        if (!$scope.txtSearch || $scope.txtSearch.length < 1) {
            return;
        }
        genericService.search('treaties', accountService.getUserName(), $scope.txtSearch).then(function(data) {
            $scope.datas = data;
            $scope.tableSearch.settings().total = $scope.datas.length;
            $scope.tableSearch.parameters().page = 1;
            $scope.tableSearch.reload();
        });
    };
});