starApp.controller('detailAgendaController', function($scope, $routeParams, $location, genericService, starTable) {
    $scope.page.title = 'Agenda - Detail - ';

    $scope.tableNexts = starTable.create($scope, 'nexts');
    $scope.tablePrevs = starTable.create($scope, 'prevs');
    $scope.tableSameDate = starTable.create($scope, 'sameDate');
    $scope.tableTweets = starTable.create($scope, 'tweets');
    $scope.tableOtherArticles = starTable.create($scope, 'articles');

    genericService.getDetail('agendas', $routeParams.id).then(function(data) {
        $scope.agenda = data.item;
        $scope.page.title += $scope.agenda.Title;
        $scope.sameDate = data.sameDate;
        $scope.tweets = data.tweets;
        $scope.articles = data.articles;
        $scope.prevs = data.prevs;
        $scope.nexts = data.nexts;
        $scope.$apply();
    });

    $scope.promptDelete = function(model) {
        var response = confirm('Are you sure you want to delete this agenda?');
        if (response) {
            var data = {
                'id': model._id,
                'title': model.Title
            };
            genericService.removeWithUserActions('agendas', data).then(function() {
                $location.path('/agendas');
                $scope.$apply();
            });
        }
    };
});