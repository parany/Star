starApp.controller('detailNewController', function ($scope, $routeParams, $http, ngTableParams, _, auth, dateHelper, $location) {
    var id = $routeParams.id;
    $scope.new = {};
    $scope.new.Citations = [];
    $scope.sameDate = [];
    $scope.articles = [];
    $scope.prevs = [];
    $scope.nexts = [];

    $scope.tableNexts = new ngTableParams({
        page: 1,
        total: 1,
        count: 10
    }, {
            counts: [],
            getData: function ($defer, params) {
                $defer.resolve($scope.nexts.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                $data: {}
            }
        });

    $scope.tablePrevs = new ngTableParams({
        page: 1,
        total: 1,
        count: 10
    }, {
            counts: [],
            getData: function ($defer, params) {
                $defer.resolve($scope.prevs.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                $data: {}
            }
        });

    $scope.tableSameDate = new ngTableParams({
        page: 1,
        total: 1,
        count: 10
    }, {
            counts: [],
            getData: function ($defer, params) {
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
            getData: function ($defer, params) {
                $defer.resolve($scope.articles.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                $data: {}
            }
        });

    $scope.tableCitations = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
            counts: [],
            getData: function ($defer, params) {
                $defer.resolve($scope.new.Citations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: { $data: {} }
        });

    $http.get('/news/findOne/' + id).then(function (dataNew) {
        $scope.new = dataNew.data;
        $scope.tableCitations.reload();
        
        var date = new Date($scope.new.Date);
        $http.get('/news/getArticlesInTheSameDate/' + date.getTime()).success(function (data) {
            $scope.sameDate = data.news.filter(function (d) {
                return d._id !== id;
            });
            for (var prop in data) {
                if (prop !== 'news') {
                    data[prop].forEach(function (d) {
                        $scope.articles.push({
                            _id: d._id,
                            Title: d.Title,
                            Type: prop
                        });
                    });
                }
            }
        });

        $http.get('/news/getPrevNearArticles/' + date.getTime()).success(function (data) {
            $scope.prevs = data;
            $scope.prevs.forEach(function (d) {
                d.Date = new Date(d.Date);
            });
        });

        $http.get('/news/getNextNearArticles/' + date.getTime()).success(function (data) {
            $scope.nexts = data;
            $scope.nexts.forEach(function (d) {
                d.Date = new Date(d.Date);
            });
        });
    });


    $scope.promptDelete = function (model) {
        var response = confirm("Are you sure you want to delete this new?");
        if (response) {
            $http.get('/news/delete/' + model._id).success(function () {
                $location.path('/news');
            });
            var userAction = {
                'collection': 'news',
                'operation': 'Delete',
                'date': new Date().getTime(),
                'title': model.Title,
                'createdBy': auth.getUserName()
            };
            $http.post('/userActions/insert', userAction);
        }
    };
});