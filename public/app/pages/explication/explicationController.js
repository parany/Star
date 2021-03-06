angular.module('starApp.controllers').controller('explicationController', ['$scope', '$cookieStore', '$routeParams', '$location', 'genericService', 'starTable', 'activityService', function($scope, $cookieStore, $routeParams, $location, genericService, starTable, activityService) {
    $scope.page.title = 'Explication - Home page';

    var allExplications = [];
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.getList('explications').then(function(data) {
        allExplications = data;
        $scope.datas = allExplications;
        $scope.txtSearch = $cookieStore.get('lastExplicationSearch');
        $scope.search();
        reloadTable();
    });

    activityService.getActivities('explications').then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/explications/detail/' + model._id);
    };

    $scope.search = function() {
        $cookieStore.put('lastExplicationSearch', $scope.txtSearch);
        if (!$scope.txtSearch) {
            $scope.datas = allExplications;

        } else {
            var regSearch = new RegExp($scope.txtSearch, 'i');
            $scope.datas = allExplications.filter(function(explication) {
                return regSearch.test(explication.Title) || regSearch.test(explication.Content);
            });
        }
        reloadTable();
    };

    function reloadTable() {
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    }
}]);