starApp.controller('tableSearchController', ['$scope', '$rootScope', 'verseService', 'starTable', function($scope, $rootScope, verseService, starTable) {
    $scope.dataSearch = [];

    $scope.tableSearch = starTable.create($scope, 'dataSearch', false, 10);

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

            verseService.search($scope.read.version.Code, $scope.search.textToSearch).success(function(data) {
                $scope.dataSearch = data;
                $scope.tableSearch.settings().total = data.length;
                $scope.tableSearch.parameters().page = 1;
                $scope.tableSearch.reload();
            });
        }, searchDelay);
    };
}]);