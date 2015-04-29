starApp.controller('detailTreatyController', function($scope, $routeParams, $http, ngTableParams, _, auth, dateHelper) {
    var id = $routeParams.id;
    var tags;
    $scope.sameDate = [];
    $scope.articles = [];

    $scope.tableSameDate = new ngTableParams({
        page: 1,
        total: 1,
        count: 10
    }, {
        counts: [],
        getData: function($defer, params) {
            $defer.resolve($scope.sameDate.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            $data: {}
        }
    });

    $scope.tableOtherArticles = new ngTableParams({
        page: 1,
        total: 1,
        count: 10
    }, {
        counts: [],
        getData: function($defer, params) {
            $defer.resolve($scope.articles.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            $data: {}
        }
    });

    $http.post('/tags/find', {
        'Type': 'Treaty'
    }).then(function(dataTags) {
        tags = dataTags.data;
        return $http.get('/treaties/findOne/' + id);
    }).then(function(dataTreaty) {
        $scope.treaty = dataTreaty.data;
        $scope.treaty.TagIdList.forEach(function(tag, index, array) {
            array[index] = _.findWhere(tags, {
                '_id': tag
            }).Description;
        });
    }).then(function() {
        var date = new Date($scope.treaty.Date);
        $http.get('/treaties/getArticlesInTheSameDate/' + date.getTime()).success(function(data) {
            $scope.sameDate = data.treaties.filter(function(d) {
                return d._id !== id;
            });
            for (var prop in data) {
                if (prop !== 'treaties') {
                    data[prop].forEach(function(d) {
                        $scope.articles.push({
                            _id: d._id,
                            Title: d.Title,
                            Type: prop
                        });
                    });
                }
            }
            console.log($scope.articles);
        });
    });


    $scope.promptDelete = function(model) {
        var response = confirm("Are you sure you want to delete this treaty?");
        if (response) {
            $http.get('/treaties/delete/' + model._id).success(function() {}).success(function() {
                $scope.data = $scope.data.filter(function(d) {
                    return d._id !== model._id;
                });
                if ($scope.data.length > 0)
                    $scope.changeTreatySelected($scope.data[0]);
                else
                    $scope.changeTreatySelected({});
                $scope.tableParams.reload();
            });
            var userAction = {
                'collection': 'treaties',
                'operation': 'Delete',
                'date': new Date().getTime(),
                'title': model.Title,
                'createdBy': auth.getUserName()
            };
            $http.post('/userActions/insert', userAction);
        }
    };
});