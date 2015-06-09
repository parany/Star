starApp.controller('tableSearchController', function($scope, $http, $rootScope, ngTableParams) {
    $scope.dataSearch = [];

    $scope.changeResultSelected = function(model) {
        angular.forEach($scope.dataSearch, function(d) {
            d.$selected = false;
        });
        model.$selected = true;
        $scope.read.selected = model;
        $rootScope.$emit('read.changeSelect', model._id);
    };

    var searchTimeout;
    var searchDelay = 200;
    $scope.search.searchContent = function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            if (!$scope.search.textToSearch || $scope.search.textToSearch.length < 1) return;

            $scope.page.title = 'Read';
            $scope.page.title += ' -  Searching for';
            $scope.page.title += ' ' + $scope.search.textToSearch;

            $http.get('/verses/search/' + $scope.read.version.Code + '/' + $scope.search.textToSearch).success(function(data) {
                $scope.dataSearch = data;
                $scope.tableSearch.settings().total = data.length;
                $scope.tableSearch.parameters().page = 1;
                $scope.tableSearch.reload();
            });
        }, searchDelay);
    };

    $scope.tableSearch = new ngTableParams({
        page: 1,
        count: 10
    }, {
        counts: [], // hide page counts control
        getData: function($defer, params) {
            $defer.resolve($scope.dataSearch.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            dataSearch: {}
        }
    });
    $scope.tableSearch.settings().$scope = $scope;
});