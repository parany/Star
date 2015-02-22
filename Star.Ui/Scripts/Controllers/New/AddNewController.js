starApp.controller('AddNewController', function ($scope, $routeParams, $http, $location, ngTableParams, apiUrl, auth) {
    var id = $routeParams.id;

    $scope.read = {};
    $scope.read.verses = [];
    $scope.data = [];
    $scope.tags = [];

    $scope.explication = {};
    $scope.explication.Date = '';
    $scope.explication.Content = '';

    $http.get(apiUrl + 'Tag/GetByType/Explication').success(function (data) {
        $scope.tags = data;
    }).then(function () {
        if (id == undefined) {
            $scope.explication.Date = new Date().toISOString().split('T')[0];
        } else {
            $http.get(apiUrl + 'Explication/Get/' + id).success(function (data) {
                $scope.explication = data;
                $scope.explication.Date = data.Date.split('T')[0];

                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    for (var j = $scope.explication.TagIdList.length - 1; j >= 0; j--) {
                        if ($scope.tags[i].Id == $scope.explication.TagIdList[j]) {
                            $scope.tags[i].IsSelected = true;
                            $scope.tags[i].Selected = true;
                        }
                    };
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
        $http.get(apiUrl + 'Explication/GetByDate/' + auth.getUserName() + '/' + $scope.explication.Date).success(function (data) {
            $scope.data = data.Explications;
            if (id != undefined) {
                $scope.data = $scope.data.filter(function (t) { return t.Id != id; });
            }
            $scope.tableParams.reload();
        });
    });

    $scope.valid = function () {
        return $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0
        && $scope.read.verses.length > 0;
    }

    $scope.save = function () {
        var data = $scope.explication;
        data.Date = $scope.explication.Date;
        data.CreatedBy = auth.getUserName();
        data.TagIdList = $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t.Id; });
        data.VerseReadList = $scope.read.verses;
        
        var url = apiUrl + 'Explication/Insert';
        if (id != undefined) {
            data.Id = id;
            url = apiUrl + 'Explication/Update';
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