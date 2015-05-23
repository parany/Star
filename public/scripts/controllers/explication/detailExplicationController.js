starApp.controller('detailExplicationController', function($scope, $routeParams, $http, $location, ngTableParams, _, auth, dateHelper) {
    var id = $routeParams.id;
    var tags;
    $scope.explication = {};
    $scope.explication.VerseReadList = [];
    $scope.sameDate = [];
    $scope.articles = [];
    $scope.prevs = [];
    $scope.nexts = [];
    
    $scope.page.title = 'Explication - Detail - ';

    $scope.tableNexts = new ngTableParams({
        page: 1,
        total: 1,
        count: 10
    }, {
        counts: [],
        getData: function($defer, params) {
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
        getData: function($defer, params) {
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
    
    $scope.tableVerses = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.explication.VerseReadList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });

    $http.post('/tags/find', {
        'Type': 'Explication'
    }).then(function(dataTags) {
        tags = dataTags.data;
        return $http.get('/explications/findOne/' + id);
    }).then(function(dataExplication) {
        $scope.explication = dataExplication.data;
        $scope.page.title += $scope.explication.Title;
        $scope.explication.TagIdList.forEach(function(tag, index, array) {
            array[index] = _.findWhere(tags, {
                '_id': tag
            }).Description;
        });
        $scope.tableVerses.reload();
    }).then(function() {
        var date = new Date($scope.explication.Date);
        $http.get('/explications/getArticlesInTheSameDate/' + date.getTime()).success(function(data) {
            $scope.sameDate = data.explications.filter(function(d) {
                return d._id !== id;
            });
            delete data.explications;
            for (var prop in data) {
                for (var i = 0; i < data[prop].length; i++) {
                    var article = data[prop][i];
                    $scope.articles.push({
                        _id: article._id,
                        Title: article.Title,
                        Type: prop
                    });
                }
            }
        });

        $http.get('/explications/getPrevNearArticles/' + date.getTime()).success(function(data) {
            $scope.prevs = data;
            $scope.prevs.forEach(function(d) {
                d.Date = new Date(d.Date);
            });
        });

        $http.get('/explications/getNextNearArticles/' + date.getTime()).success(function(data) {
            $scope.nexts = data;
            $scope.nexts.forEach(function(d) {
                d.Date = new Date(d.Date);
            });
        });
    });


    $scope.promptDelete = function(model) {
        var response = confirm("Are you sure you want to delete this explication?");
        if (response) {
            $http.get('/explications/delete/' + model._id).success(function() {
                $location.path('/explications');
            });
            var userAction = {
                'collection': 'explications',
                'operation': 'Delete',
                'date': new Date().getTime(),
                'title': model.Title,
                'createdBy': auth.getUserName()
            };
            $http.post('/userActions/insert', userAction);
        }
    };
});