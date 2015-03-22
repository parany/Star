starApp.controller('tableSearchController', function ($scope, $http, $rootScope, ngTableParams) {
    $scope.dataSearch = [];
    
    $scope.changeResultSelected = function (model) {
        angular.forEach($scope.dataSearch, function (d) {
            d.$selected = false;
        });
        model.$selected = true;
        $scope.read.selected = model;
        $rootScope.$emit('read.changeSelect', model._id);
    }
    
    var searchTimeout;
    var searchDelay = 200;
    $scope.search.searchContent = function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (!$scope.search.textToSearch || $scope.search.textToSearch.length < 1) return;
            var verses;
            var books;
            $http({
                method: 'POST',
                url: '/verses/findv2',
                data: {
                    Version: $scope.read.version.Code,
                    Content: { regex: $scope.search.textToSearch }
                }
            }).then(function (data) {
                verses = data.data;
                return $http.get('/books/findAllv2');
            }).then(function (data) {
                books = data.data;
                for (var i = 0; i < verses.length; i++) {
                    var book = books.filter(function (b) { return b._id == verses[i].BookId; })[0].Description;
                    verses[i].BookId = book + ' ' + verses[i].Chapter + ' ' + verses[i].Paragraph;
                }
                $scope.dataSearch = verses;
                $scope.tableSearch.settings().total = verses.length;
                $scope.tableSearch.parameters().page = 1;
                $scope.tableSearch.reload();
            });
        }, searchDelay);
    }
    
    $scope.tableSearch = new ngTableParams({
        page: 1,
        count: 10
    }, {
        counts: [], // hide page counts control
        getData: function ($defer, params) {
            $defer.resolve($scope.dataSearch.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { dataSearch: {} }
    });
    $scope.tableSearch.settings().$scope = $scope;
});