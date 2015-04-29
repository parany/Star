starApp.controller('listTreatyController', function($scope, $routeParams, $filter, $http, $location, $cookieStore, ngTableParams, auth, dateHelper) {
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {Date: 'asc'}
    }, {
        counts: [], // hide page counts control
        groupBy: 'DateGroup',
        total: $scope.datas.length,
        getData: function($defer, params) {
            var orderedData = params.sorting() ? $filter('orderBy')($scope.datas, $scope.tableSearch.orderBy()) : $scope.datas.length;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            $data: {}
        }
    });

    $scope.tableOperations = new ngTableParams({
        page: 1,
        total: 1,
        count: 10
    }, {
        counts: [],
        getData: function($defer, params) {
            $defer.resolve($scope.activity.operations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            $data: {}
        }
    });

    $http.post('/treaties/find', {
        CreatedBy: auth.getUserName(),
        sort: {
            Date: -1
        },
        projection: {
            Title: 1,
            Date: 1
        }
    }).success(function(data) {
        $scope.datas = data;
        $scope.datas.forEach(function(d) {
            d.CreatedBy = auth.getUserName();
            d.Date = new Date(d.Date);
            d.DateGroup = d.Date.toCompareString();
        });
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    });

    $http.get('/treaties/getActivities/' + auth.getUserName()).success(function(data) {
        $scope.activity = data;
        $scope.activity.operations.forEach(function(value) {
            value.date = new Date(value.date);
        });
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/treaty/detail/' + model._id);
    };
});