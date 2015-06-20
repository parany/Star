starApp.controller('detailAgendaController', function($scope, $routeParams, $http, ngTableParams, _, accountService, $location) {
    var id = $routeParams.id;
    var date;
    $scope.sameDate = [];
    $scope.articles = [];
    $scope.prevs = [];
    $scope.nexts = [];

    $scope.page.title = 'Agenda - Detail - ';

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

    $http.get('/agendas/findOne/' + id).then(function(dataAgenda) {
        $scope.agenda = dataAgenda.data;
        $scope.page.title += $scope.agenda.Title;
        date = new Date($scope.agenda.Date);
        return $http.get('/agendas/getArticlesInTheSameDate/' + date.getTime());
    }).then(function(data) {
        $scope.sameDate = data.data.agendas.filter(function(d) {
            return d._id !== id;
        });
        delete data.data.agendas;
        for (var prop in data.data) {
            for (var i = 0; i < data.data[prop].length; i++) {
                var article = data.data[prop][i];
                $scope.articles.push({
                    _id: article._id,
                    Title: article.Title,
                    Type: prop
                });
            }
        }
        return $http.get('/agendas/getPrevNearArticles/' + date.getTime());
    }).then(function(data) {
        $scope.prevs = data.data;
        $scope.prevs.forEach(function(d) {
            d.Date = new Date(d.Date);
        });
        return $http.get('/agendas/getNextNearArticles/' + date.getTime());
    }).then(function(data) {
        $scope.nexts = data.data;
        $scope.nexts.forEach(function(d) {
            d.Date = new Date(d.Date);
        });
    });

    $scope.promptDelete = function(model) {
        var response = confirm('Are you sure you want to delete this agenda?');
        if (response) {
            $http.get('/agendas/delete/' + model._id).success(function() {
                $location.path('/agendas');
            });
            var userAction = {
                'collection': 'agendas',
                'operation': 'Delete',
                'date': new Date().getTime(),
                'title': model.Title,
                'createdBy': accountService.getUserName()
            };
            $http.post('/userActions/insert', userAction);
        }
    };
});