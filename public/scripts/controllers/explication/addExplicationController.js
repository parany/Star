starApp.controller('addExplicationController', function($scope, $routeParams, $location, accountService, genericService, starTable) {
    var id = $routeParams.id;

    $scope.read = {};
    $scope.read.verses = [];
    $scope.data = [];
    $scope.tags = [];

    $scope.explication = {};
    $scope.explication.Date = '';
    $scope.explication.Content = '';

    $scope.page.title = 'Explication - ';

    genericService.find('tags', {
        'Type': 'Explication'
    }).then(function(data) {
        $scope.tags = data.data;
        if (id === undefined) {
            $scope.explication.Date = new Date().toISOString().split('T')[0];
        } else {
            genericService.findOne('explications', id).success(function(data) {
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

    $scope.tableParams = starTable.create($scope, 'data');
    $scope.tableVerses = starTable.create($scope, 'read.verses');

    $scope.$watch('explication.Date', function() {
        if ($scope.explication.Date === undefined || $scope.explication.Date === '') return;
        genericService.getByDate('explications', accountService.getUserName(), $scope.explication.Date).success(function(data) {
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
        data.TagIdList = _.pluck(_.where($scope.tags, {
            Selected: true
        }), '_id');
        data.VerseReadList = $scope.read.verses;
        var method;
        if (id !== undefined) {
            data.UpdatedBy = accountService.getUserName();
            data._id = id;
            method = 'updateWithUserActions';
        } else {
            data.CreatedBy = accountService.getUserName();
            method = 'insertWithUserActions';
        }
        var func = genericService[method].call({}, 'explications', data);
        func.then(function(ret) {
            if (id !== undefined) {
                $location.path('/explications/detail/' + id);
            } else {
                $location.path('explications/detail/' + ret.data[0]._id);
            }
            $scope.$apply();
        });
    };
});