starApp.controller('detailAgendaController', function($scope, $routeParams, $http, ngTableParams, _, accountService, $location, starTable) {
    $scope.page.title = 'Agenda - Detail - ';
    var id = $routeParams.id;
    var date;
    $scope.sameDate = [];
    $scope.articles = [];
    $scope.prevs = [];
    $scope.nexts = [];

    $scope.tableNexts = starTable.create($scope, 'nexts');
    $scope.tablePrevs = starTable.create($scope, 'prevs');
    $scope.tableSameDate = starTable.create($scope, 'sameDate');
    $scope.tableOtherArticles = starTable.create($scope, 'articles');

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
        _.forIn(data.data, function(value, key) {
            _.each(value, function(article) {
                $scope.articles.push({
                    _id: article._id,
                    Title: article.Title,
                    Type: key
                });
            });
        });
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