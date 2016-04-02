starApp.controller('addTreatyController', function($scope, $routeParams, $location, starTable, genericService) {
    $scope.page.title = 'Treaty - ';

    var id = $routeParams.id;
    $scope.data = [];
    $scope.treaty = {};
    $scope.tags = [];

    $scope.tableParams = starTable.create($scope, 'data');

    genericService.find('tags', {
        'Type': 'Treaty'
    }).then(function(data) {
        $scope.tags = data.data;
    }).then(function() {
        if (id === undefined) {
            $scope.page.title += 'Add';
            $scope.Date = new Date();
            $scope.changeDate();
        } else {
            genericService.findOne('treaties', id).success(function(data) {
                $scope.treaty = data;
                $scope.page.title += 'Edit ' + $scope.treaty.Title;
                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    for (var j = $scope.treaty.TagIdList.length - 1; j >= 0; j--) {
                        if ($scope.tags[i]._id === $scope.treaty.TagIdList[j]) {
                            $scope.tags[i].IsSelected = true;
                            $scope.tags[i].Selected = true;
                        }
                    }
                }
                $scope.Date = new Date(data.Date);
                $scope.changeDate();
            });
        }
    });

    $scope.changeDate = function() {
        genericService.getByDate('treaties', $scope.Date).success(function(data) {
            $scope.data = data;
            if (id !== undefined) {
                $scope.data = $scope.data.filter(function(t) {
                    return t._id !== id;
                });
            }
            $scope.tableParams.reload();
        });
    };

    $scope.valid = function() {
        return $scope.tags.filter(function(t) {
            return t.Selected === true;
        }).length > 0;
    };

    $scope.cancel = function() {
        if (id) {
            $location.path('/treaties/detail/' + id);
        } else {
            $location.path('/treaties');
        }
    };

    $scope.save = function() {
        var data = JSON.parse(JSON.stringify($scope.treaty));
        data.Date = new Date($scope.Date).getTime();
        data.TagIdList = $scope.tags.filter(function(t) {
            return t.Selected === true;
        }).map(function(t) {
            return t._id;
        });
        var method;
        if (id !== undefined) {
            data._id = id;
            method = 'updateWithUserActions';
        } else {
            method = 'insertWithUserActions';
        }
        var func = genericService[method].call({}, 'treaties', data);
        func.then(function(ret) {
            if (id !== undefined) {
                $location.path('/treaties/detail/' + id);
            } else {
                $location.path('treaties/detail/' + ret);
            }
            $scope.$apply();
        });
    };
});