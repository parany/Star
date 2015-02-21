starApp.controller('AddTreatyController', function ($scope, $routeParams, $http, $location, ngTableParams, apiUrl, auth) {
    var id = $routeParams.id;
    $scope.Date = '';

    $scope.data = [];
    $scope.treaty = {};
    $scope.treaty.Text = '';

    $scope.tags = [];

    $http.get(apiUrl + 'Tag/GetByType/Treaty').success(function (data) {
        $scope.tags = data;
    }).then(function () {
        if (id == undefined) {
            $scope.Date = new Date().toISOString().split('T')[0];
        } else {
            $http.get(apiUrl + 'Treaty/Get/' + id).success(function (data) {
                $scope.treaty = data;
                $scope.Date = data.Date.split('T')[0];

                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    for (var j = $scope.treaty.TagIdList.length - 1; j >= 0; j--) {
                        if ($scope.tags[i].Id == $scope.treaty.TagIdList[j]) {
                            $scope.tags[i].IsSelected = true;
                            $scope.tags[i].Selected = true;
                        }
                    };
                }
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
    $scope.tableParams.settings().$scope = $scope;

    $scope.$watch('Date', function () {
        if ($scope.Date == undefined || $scope.Date == '') return;
        $http.get(apiUrl + 'Treaty/GetByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            $scope.data = data.Treaties;
            if (id != undefined) {
                $scope.data = $scope.data.filter(function (t) { return t.Id != id; });
            }
            $scope.tableParams.reload();
        });
    });

    $scope.valid = function () {
        return $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0;
    }

    $scope.save = function () {
        var data = $scope.treaty;
        data.Date = $scope.Date;
        data.CreatedBy = auth.getUserName();
        data.TagIdList = $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t.Id; });

        var url = apiUrl + 'Treaty/Insert';
        if (id != undefined) {
            data.Id = id;
            url = apiUrl + 'Treaty/Update';
            data.UpdatedBy = auth.getUserName();
        }
        $http({
            method: 'POST',
            data: data,
            url: url
        }).success(function () {
            $location.path('/treaty');
        }).error(function (err) {
            console.log(err);
        });
    }
});