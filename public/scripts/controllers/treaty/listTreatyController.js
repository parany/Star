starApp.controller('listTreatyController', function($scope, $routeParams, $filter, $http, $location, $cookieStore, ngTableParams, auth, dateHelper) {
    $scope.datas = [];

    $scope.tableSearch = new ngTableParams({
        page: 1,
        count: 5,
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

    $http.post('/treaties/find', {
        CreatedBy: auth.getUserName(),
        sort: {
            Date: -1
        },
        projection: {
            Text: 1,
            Title: 1,
            CreatedBy: 1,
            Date: 1
        }
    }).success(function(data) {
        $scope.datas = data;
        $scope.datas.forEach(function(d) {
            d.Date = new Date(d.Date);
            d.DateGroup = d.Date.toAnyString();
        });
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    });

    $scope.goToDetail = function(model) {
        alert(model._id);
    }
});