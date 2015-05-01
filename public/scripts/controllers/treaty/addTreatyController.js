/* global starApp */
starApp.controller('addTreatyController', function ($scope, $routeParams, $http, $location, $cookieStore, ngTableParams, auth) {
    var id = $routeParams.id;
    $scope.Date = '';

    $scope.data = [];
    $scope.treaty = {};
    $scope.treaty.Text = '';

    $scope.tags = [];

    $http.post('/tags/find', { 'Type': 'Treaty' }).success(function (data) {
        $scope.tags = data;
    }).then(function () {
        if (id == undefined) {
            $scope.Date = new Date().toISOString().split('T')[0];
        } else {
            $http.get('/treaties/findOne/' + id).success(function (data) {
                $scope.treaty = data;
                $scope.Date = new Date(data.Date).toISOString().split('T')[0];

                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    for (var j = $scope.treaty.TagIdList.length - 1; j >= 0; j--) {
                        if ($scope.tags[i]._id == $scope.treaty.TagIdList[j]) {
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
        $http.get('/treaties/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            $scope.data = data.Treaties;
            if (id != undefined) {
                $scope.data = $scope.data.filter(function (t) { return t._id != id; });
            }
            $scope.tableParams.reload();
        });
    });

    $scope.valid = function () {
        return $scope.tags.filter(function (t) { return t.Selected == true; }).length > 0;
    };

    $scope.cancel = function () {
        if (id) {
            $location.path('/treaty/detail/' + id);
        } else {
            $location.path('/treaty');
        }
    };

    $scope.save = function () {
        var data = JSON.parse(JSON.stringify($scope.treaty));
        data.Date = new Date($scope.Date).getTime();
        data.CreatedBy = auth.getUserName();
        data.TagIdList = $scope.tags.filter(function (t) { return t.Selected == true; }).map(function (t) { return t._id; });
        var userAction = {
            'collection': 'treaties',
            'date': new Date().getTime(),
            'title': data.Title,
            'createdBy': auth.getUserName()
        };
        var url;
        if (id != undefined) {
            data._id = id;
            url = '/treaties/update';
            data.UpdatedBy = auth.getUserName();
            userAction.operation = 'Edit';
        } else {
            url = '/treaties/insert';
            userAction.operation = 'Add';
        }
        $http({
            method: 'POST',
            data: data,
            url: url
        }).success(function (ret) {
            $cookieStore.put('lastTreaty', $scope.Date);
            $location.path('/treaty/detail/' + ret[0]._id);
        }).error(function (err) {
            console.log(err);
        });
        $http.post('/userActions/insert', userAction);
    }
});