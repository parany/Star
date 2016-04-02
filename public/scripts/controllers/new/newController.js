starApp.controller('newController', function($scope, $routeParams, $filter, $http, $cookieStore, $location, activityService, starTable, genericService) {
    $scope.page.title = 'New - Home page';

    var allNews =  [];
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.getList('news').then(function(data) {
        allNews = data;
        $scope.datas = allNews;
        $scope.txtSearch = $cookieStore.get('lastNewSearch');
        $scope.search();
        reloadTable();
    });

    activityService.getActivities('news').then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/news/detail/' + model._id);
    };

    $scope.search = function() {
        $cookieStore.put('lastNewSearch', $scope.txtSearch);
        if (!$scope.txtSearch) {
            $scope.datas = allNews;

        } else {
            var regSearch = new RegExp($scope.txtSearch, 'i');
            $scope.datas = allNews.filter(function(nw) {
                return regSearch.test(nw.Title) || regSearch.test(nw.Content);
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