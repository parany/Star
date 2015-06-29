starApp.controller('detailAgendaController', function($scope, $routeParams, $location, $http, _, accountService, starTable, agendaService) {
    $scope.page.title = 'Agenda - Detail - ';

    $scope.tableNexts = starTable.create($scope, 'nexts');
    $scope.tablePrevs = starTable.create($scope, 'prevs');
    $scope.tableSameDate = starTable.create($scope, 'sameDate');
    $scope.tableOtherArticles = starTable.create($scope, 'articles');

    agendaService.findOne($routeParams.id).then(function(data) {
        $scope.agenda = data.agenda;
        $scope.page.title += $scope.agenda.Title;
        $scope.sameDate = data.sameDate;
        $scope.articles = data.articles;
        $scope.prevs = data.prevs;
        $scope.nexts = data.nexts;
        $scope.$apply();
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