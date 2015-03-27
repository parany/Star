starApp.controller('newController', function ($rootScope, $scope, $http, $location, ngTableParams, auth) {
    $scope.Date = '';
    $scope.Date = new Date().toISOString().split('T')[0];
    $scope.News = [];
    $scope.New = {};
    $scope.New.Citations = [];
    
    $scope.tableNews = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.News.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    $scope.tableNews.settings().scope = $scope;
    
    $scope.tableCitations = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.New.Citations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    $scope.tableCitations.settings().scope = $scope;
    
    $scope.$watch('Date', function () {
        $scope.textToSearch = '';
        $http.get('/news/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            $scope.News = data.Docs;
            if (data.Docs.length == 0) {
                $scope.News = [];
            }
            $scope.tableNews.reload();
            $scope.New = data.Docs.length > 0 ? data.Docs[0] : {};
            if ($scope.News.length > 0)
                $scope.changeNewSelected($scope.New);
            
            $scope.prev = data.Prev;
            $scope.next = data.Next;
            angular.element('.glyphicon-chevron-left').css('opacity', $scope.prev == null ? '0.4' : '1.0');
            angular.element('.glyphicon-chevron-right').css('opacity', $scope.next == null ? '0.4' : '1.0');
        });
    });
    
    $scope.prevNew = function () {
        if ($scope.prev == null) return;
        $scope.Date = $scope.prev;
    }
    
    $scope.nextNew = function () {
        if ($scope.next == null) return;
        $scope.Date = $scope.next;
    }
    
    $scope.changeNewSelected = function (model) {
        angular.forEach($scope.News, function (d) {
            d.$selected = false;
        });
        $scope.New = model;
        if ($scope.New.Citations == undefined)
            $scope.New.Citations = [];
        $scope.tableCitations.reload();
        if ($scope.textToSearch.length > 0) {
            $scope.Title = $scope.New.Title + ' (' + new Date(model.Date).toISOString().split('T')[0] + ')';
        } else {
            $scope.Title = $scope.New.Title;
        }
        $scope.New.$selected = true;
    }
    
    $scope.promptDelete = function (id) {
        var response = confirm("Are you sure you want to delete this new?");
        if (response) {
            $http.get('/news/deletev2/' + id).success(function () {
            }).success(function () {
                $scope.News = $scope.News.filter(function (d) { return d._id != id; });
                if ($scope.News.length > 0)
                    $scope.changeNewSelected($scope.News[0]);
                else
                    $scope.changeNewSelected({});
                $scope.tableNews.reload();
            });
        }
    }
    
    var searchTimeout;
    var searchDelay = 200;
    $scope.search = function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (!$scope.textToSearch || $scope.textToSearch.length < 1) return;
            $http.post('/news/searchv2/' + $scope.textToSearch, { 'filters': ['Title', 'Text'] }).success(function (data) {
                $scope.News = data;
                $scope.tableNews.reload();
                
                $scope.New = data.length > 0 ? data[0] : {};
                if (data.length > 0) {
                    $scope.Title = $scope.New.Title + ' (' + new Date($scope.New.Date).toISOString().split('T')[0] + ')';
                    $scope.New.$selected = true;
                }
            });
        }, searchDelay);
    }
});