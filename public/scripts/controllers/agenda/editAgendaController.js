starApp.controller('editAgendaController', function($scope, $routeParams, $location, genericService, accountService, starTable) {
    $scope.page.title = 'Agenda - Edit - ';

    $scope.id = $routeParams.id;
    $scope.Date = new Date();
    $scope.agenda = {};
    $scope.data = [];
    $scope.tableParams = starTable.create($scope, 'data');

    genericService.findOne('agendas', $scope.id).then(function(data) {
        $scope.agenda = data.data;
        $scope.page.title += $scope.agenda.Title;
        $scope.Date = new Date($scope.agenda.Date);
        $scope.changeDate();
        $scope.tableParams.reload();
    });

    $scope.changeDate = function() {
        genericService.getByDate('agendas', $scope.Date).success(function(data) {
            $scope.data = data.filter(function(d) {
                return d._id !== $scope.id;
            });
            $scope.tableParams.reload();
        });
    };

    $scope.save = function() {
        var data = $scope.agenda;
        data._id = $scope.id;
        data.Date = new Date($scope.Date).getTime();
        genericService.updateWithUserActions('agendas', data).then(function(id) {
            $location.path('/agendas/detail/' + id);
            $scope.$apply();
        });
    };
});