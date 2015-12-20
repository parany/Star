starApp.controller('treatyController', function($scope, $routeParams, $filter, $http, $location, starTable, activityService, accountService, genericService) {
    $scope.page.title = 'Treaty - Home page';

    var allTreaties = [];
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.getList('treaties', accountService.getUserName()).then(function(data) {
        allTreaties = data;
        $scope.datas = allTreaties;
        reloadTable();
    });

    activityService.getActivities('treaties', accountService.getUserName()).then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/treaties/detail/' + model._id);
    };

    $scope.search = function() {
        if (!$scope.txtSearch) {
            $scope.datas = allTreaties;

        } else {
            var regSearch = new RegExp($scope.txtSearch, 'i');
            $scope.datas = allTreaties.filter(function(treaty) {
                return regSearch.test(treaty.Title) || regSearch.test(treaty.Text);
            });
        }
        reloadTable();
    };

    function reloadTable() {
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    }
});