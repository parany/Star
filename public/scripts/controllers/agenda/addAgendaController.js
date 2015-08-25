starApp.controller('addAgendaController', function($scope, $location, accountService, genericService, starTable) {
    $scope.page.title = 'Agenda - Add';

    $scope.agenda = {};
    $scope.Date = new Date();
    $scope.data = [];
    $scope.tableParams = starTable.create($scope, 'data');

    $scope.changeDate = function() {
        genericService.getByDate('agendas', accountService.getUserName(), $scope.Date).success(function(data) {
            $scope.data = data;
            $scope.tableParams.reload();
        });
    };
    $scope.changeDate();

    $scope.save = function() {
        var data = $scope.agenda;
        data.Date = new Date($scope.Date).getTime();
        data.CreatedBy = accountService.getUserName();
        genericService.insertWithUserActions('agendas', data).then(function(id) {
            $location.path('/agendas/detail/' + id);
            $scope.$apply();
        });
    };
});