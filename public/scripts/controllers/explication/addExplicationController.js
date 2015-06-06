starApp.controller('addExplicationController', function($scope, $routeParams, $http, $location, $cookieStore, ngTableParams, auth, _) {
    var id = $routeParams.id;

    $scope.read = {};
    $scope.read.verses = [];
    $scope.data = [];
    $scope.tags = [];

    $scope.explication = {};
    $scope.explication.Date = '';
    $scope.explication.Content = '';

    $scope.page.title = 'Explication - ';

    $http.post('/tags/find', {
        'Type': 'Explication'
    }).success(function(data) {
        $scope.tags = data;
    }).then(function() {
        if (id === undefined) {
            $scope.explication.Date = new Date().toISOString().split('T')[0];
        } else {
            $http.get('/explications/findOne/' + id).success(function(data) {
                $scope.explication = data;
                $scope.explication.Date = new Date(data.Date).toISOString().split('T')[0];

                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    for (var j = $scope.explication.TagIdList.length - 1; j >= 0; j--) {
                        if ($scope.tags[i]._id === $scope.explication.TagIdList[j]) {
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
        getData: function($defer, params) {
            $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            $data: {}
        }
    });

    $scope.tableVerses = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function($defer, params) {
            $defer.resolve($scope.read.verses.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            $data: {}
        }
    });

    $scope.$watch('explication.Date', function() {
        if ($scope.explication.Date === undefined || $scope.explication.Date === '') return;
        $http.get('/explications/getByDate/' + auth.getUserName() + '/' + $scope.explication.Date).success(function(data) {
            $scope.data = data;
            if (id !== undefined) {
                $scope.data = $scope.data.filter(function(t) {
                    return t._id !== id;
                });
                $scope.page.title += 'Edit - ' + $scope.explication.Title;
            } else {
                $scope.page.title += 'Add';
            }
            $scope.tableParams.reload();
        });
    });

    $scope.valid = function() {
        return $scope.tags.filter(function(t) {
            return t.Selected === true;
        }).length > 0 && $scope.read.verses.length > 0;
    };

    $scope.cancel = function() {
        if (id) {
            $location.path('/explications/detail/' + id);
        } else {
            $location.path('/explications');
        }
    };

    $scope.save = function() {
        var data = JSON.parse(JSON.stringify($scope.explication));
        data.Date = new Date($scope.explication.Date).getTime();
        data.CreatedBy = auth.getUserName();
        data.TagIdList = _.pluck(_.where($scope.tags, {
            Selected: true
        }), '_id');
        data.VerseReadList = $scope.read.verses;
        var userAction = {
            'collection': 'explications',
            'date': new Date().getTime(),
            'title': data.Title,
            'createdBy': auth.getUserName()
        };
        var url;
        if (id !== undefined) {
            data._id = id;
            url = '/explications/update';
            data.UpdatedBy = auth.getUserName();
            userAction.operation = 'Edit';
        } else {
            url = '/explications/insert';
            userAction.operation = 'Add';
        }
        $http({
            method: 'POST',
            data: data,
            url: url
        }).success(function(ret) {
            $cookieStore.put('lastExplication', $scope.explication.Date);
            if (id !== undefined) {
                $location.path('/explications/detail/' + id);
            } else {
                $location.path('explications/detail/' + ret[0]._id);
            }
        }).error(function(err) {
            console.log(err);
        });
        $http.post('/userActions/insert', userAction);
    };
});