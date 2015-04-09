starApp.controller('newController', function ($rootScope, $scope, $http, $location, $cookieStore, ngTableParams, auth) {
    $scope.Date = '';
    $scope.Date = $cookieStore.get('lastNew') || new Date().toISOString().split('T')[0];
    $scope.News = [];
    $scope.New = {};
    $scope.New.Citations = [];
    $scope.activity = {};
    $scope.activity.operations = [];
    
    $scope.tableOperations = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.activity.operations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    
    $http.get('/news/getActivities/' + auth.getUserName()).success(function (data) {
        $scope.activity = data;
        $scope.activity.operations.forEach(function (value) { value.date = new Date(value.date); });
        $scope.tableOperations.reload();
    });
    
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
        $cookieStore.put('lastNew', $scope.Date);
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
    
    $scope.promptDelete = function (model) {
        var response = confirm("Are you sure you want to delete this new?");
        if (response) {
            $http.get('/news/delete/' + model._id).success(function () {
                $scope.News = $scope.News.filter(function (d) { return d._id != model._id; });
                if ($scope.News.length > 0)
                    $scope.changeNewSelected($scope.News[0]);
                else
                    $scope.changeNewSelected({});
                $scope.tableNews.reload();
            });
            var userAction = {
                'collection': 'news',
                'operation': 'Delete',
                'date': new Date().getTime(),
                'title': model.Title,
                'createdBy': auth.getUserName()
            };
            $http.post('/userActions/insert', userAction);
        }
    }
    
    var searchTimeout;
    var searchDelay = 200;
    $scope.search = function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (!$scope.textToSearch || $scope.textToSearch.length < 1) return;
            $http.post('/news/search/' + $scope.textToSearch, { 'filters': ['Title', 'Text'] }).success(function (data) {
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