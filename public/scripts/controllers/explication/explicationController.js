starApp.controller('explicationController', function ($rootScope, $scope, $http, $location, $cookieStore, ngTableParams, auth) {
    $scope.Date = '';
    $scope.Date = $cookieStore.get('lastExplication') || new Date().toISOString().split('T')[0];
    $scope.explication = {};
    $scope.verses = [];
    $scope.explications = [];
    
    $scope.tableExplications = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.explications.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    
    $scope.tableVerses = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.verses.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    
    $scope.$watch('Date', function () {
        $scope.textToSearch = '';
        $cookieStore.put('lastExplication', $scope.Date);
        $http.get('/explications/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            if (data.Explications.length == 0) {
                data.Explications = [];
            }
            $scope.explications = data.Explications;
            $scope.tableExplications.reload();
            $scope.explication = data.Explications.length > 0 ? data.Explications[0] : {};
            if ($scope.explications.length > 0)
                $scope.changeExplicationSelected($scope.explication);
            
            $scope.prev = data.Prev;
            $scope.next = data.Next;
            angular.element('.glyphicon-chevron-left').css('opacity', $scope.prev == null ? '0.4' : '1.0');
            angular.element('.glyphicon-chevron-right').css('opacity', $scope.next == null ? '0.4' : '1.0');
        });
    });
    
    $scope.prevExplication = function () {
        if ($scope.prev == null) return;
        $scope.Date = $scope.prev;
    }
    
    $scope.nextExplication = function () {
        if ($scope.next == null) return;
        $scope.Date = $scope.next;
    }
    
    $scope.changeExplicationSelected = function (model) {
        angular.forEach($scope.explications, function (d) {
            d.$selected = false;
        });
        $scope.explication = model;
        $scope.verses = $scope.explication.VerseReadList;
        if ($scope.verses == undefined) $scope.verses = [];
        $scope.tableVerses.reload();
        if ($scope.textToSearch.length > 0) {
            $scope.Title = $scope.explication.Title + ' (' + new Date(model.Date).toISOString().split('T')[0] + ')';
        } else {
            $scope.Title = $scope.explication.Title;
        }
        $scope.explication.$selected = true;
    }
    
    $scope.promptDelete = function (id) {
        var response = confirm("Are you sure you want to delete this explication?");
        if (response) {
            $http.get('/explications/delete/' + id).success(function () {
            }).success(function () {
                $scope.explications = $scope.explications.filter(function (d) { return d._id != id; });
                if ($scope.explications.length > 0)
                    $scope.changeExplicationSelected($scope.explications[0]);
                else
                    $scope.changeExplicationSelected({});
                $scope.tableExplications.reload();
            });
        }
    }
    
    var searchTimeout;
    var searchDelay = 200;
    $scope.search = function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (!$scope.textToSearch || $scope.textToSearch.length < 1) return;
            $http.get('/explications/search/' + $scope.textToSearch).success(function (data) {
                $scope.explications = data;
                $scope.tableExplications.reload();
                
                $scope.explication = data.length > 0 ? data[0] : {};
                if (data.length > 0) {
                    $scope.Title = $scope.explication.Title + ' (' + new Date($scope.explication.Date).toISOString().split('T')[0] + ')';
                    $scope.explication.$selected = true;
                }
            });
        }, searchDelay);
    }
});