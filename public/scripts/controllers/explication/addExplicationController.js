starApp.controller('addExplicationController', ['$scope', '$routeParams', '$location', 'genericService', 'starTable', function($scope, $routeParams, $location, genericService, starTable) {
    $scope.page.title = 'Explication - ';

    var id = $routeParams.id;
    $scope.read = {};
    $scope.read.verses = [];
    $scope.data = [];
    $scope.tags = [];
    $scope.explication = {};

    $scope.tableParams = starTable.create($scope, 'data');
    $scope.tableVerses = starTable.create($scope, 'read.verses');

    genericService.find('tags', {
        'Type': 'Explication'
    }).then(function(data) {
        $scope.tags = data.data;
        if (id === undefined) {
            $scope.page.title += 'Add';
            $scope.explication.Date = new Date();
            $scope.changeDate();
        } else {
            genericService.findOne('explications', id).success(function(data) {
                $scope.explication = data;
                $scope.page.title += 'Edit - ' + $scope.explication.Title;
                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    for (var j = $scope.explication.TagIdList.length - 1; j >= 0; j--) {
                        if ($scope.tags[i]._id === $scope.explication.TagIdList[j]) {
                            $scope.tags[i].IsSelected = true;
                            $scope.tags[i].Selected = true;
                        }
                    }
                }
                $scope.read.verses = $scope.explication.VerseReadList;
                $scope.explication.Date = new Date(data.Date);
                $scope.changeDate();
                $scope.tableVerses.reload();
            });
        }
    });

    $scope.changeDate = function() {
        genericService.getByDate('explications', $scope.explication.Date).success(function(data) {
            $scope.data = data;
            if (id !== undefined) {
                $scope.data = _.reject($scope.data, { _id: id });
            }
            $scope.tableParams.reload();
        });
    };

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
            data._id = id;
            method = 'updateWithUserActions';
        } else {
            method = 'insertWithUserActions';
        }
        var func = genericService[method].call({}, 'explications', data);
        func.then(function(ret) {
            if (id !== undefined) {
                $location.path('/explications/detail/' + id);
            } else {
                $location.path('explications/detail/' + ret);
            }
            $scope.$apply();
        });
    };
}]);