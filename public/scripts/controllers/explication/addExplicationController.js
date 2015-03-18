starApp.controller('addExplicationController', function ($scope, $routeParams, $http, $location, ngTableParams, apiUrl, auth) {
    var id = $routeParams.id;
    
    $scope.read = {};
    $scope.read.verses = [];
    $scope.data = [];
    $scope.tags = [];
    
    $scope.explication = {};
    $scope.explication.Date = '';
    $scope.explication.Content = '';
    
    $http.get('/tag/getByType/Explication').success(function (data) {
        $scope.tags = data;
    }).then(function () {
        if (id == undefined) {
            $scope.explication.Date = new Date().toISOString().split('T')[0];
        } else {
            $http.get('/explications/get/' + id).success(function (data) {
                $scope.explication = data;
                $scope.explication.Date = new Date(data.Date).toISOString().split('T')[0];
                
                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    for (var j = $scope.explication.TagIdList.length - 1; j >= 0; j--) {
                        if ($scope.tags[i]._id == $scope.explication.TagIdList[j]) {
                            $scope.tags[i].IsSelected = true;
                            $scope.tags[i].Selected = true;
                        }
                    }
                }
                
                $scope.read.verses = $scope.explication.VerseReadList;
                $scope.tableVerses.reload();
            });
        }
    });
    
    $scope.tableParams = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
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
            $defer.resolve($scope.read.verses.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    
    $scope.$watch('explication.Date', function () {
        if ($scope.explication.Date == undefined || $scope.explication.Date == '') return;
        $http.get('/explications/getByDate/' + auth.getUserName() + '/' + $scope.explication.Date).success(function (data) {
            $scope.data = data.Explications;
            if (id != undefined) {
                $scope.data = $scope.data.filter(function (t) { return t._id != id; });
            }
            $scope.tableParams.reload();
        });
    });
    
    $scope.valid = function () {
        return $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0 
        && $scope.read.verses.length > 0;
    }
    
    $scope.save = function () {
        var data = JSON.parse(JSON.stringify($scope.explication));
        data.Date = new Date($scope.explication.Date).getTime();
        data.CreatedBy = auth.getUserName();
        data.TagIdList = $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t._id; });
        data.VerseReadList = $scope.read.verses;
        var url = '/explications/insert';
        if (id != undefined) {
            data.Id = id;
            url = '/explications/update';
            data.UpdatedBy = auth.getUserName();
        }
        $http({
            method: 'POST',
            data: data,
            url: url
        }).success(function () {
            $location.path('/explication');
        }).error(function (err) {
            console.log(err);
        });
    }
});