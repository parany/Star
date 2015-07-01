starApp.controller('editAgendaController', function($scope, $routeParams, $http, $location, ngTableParams, genericService, accountService, starTable) {
    $scope.page.title = 'Agenda - Edit - ';

    var id = $routeParams.id;
    $scope.Date = '';
    $scope.agenda = {};
    $scope.data = [];

    genericService.findOne('agendas', id).then(function(data) {
        $scope.agenda = data.data;
        $scope.page.title += $scope.agenda.Title;
        $scope.Date = new Date($scope.agenda.Date).toISOString();
        $scope.tableParams.reload();
    });

    $scope.tableParams = starTable.create($scope, 'data');

    $scope.$watch('Date', function() {
        if ($scope.Date === undefined || $scope.Date === '') return;
        $scope.Date = $scope.Date.split('T')[0];
        genericService.getByDate('agendas', accountService.getUserName(), $scope.Date).success(function(data) {
            $scope.data = data.filter(function(d) {
                return d._id !== id;
            });
            $scope.tableParams.reload();
        });
    });

    $scope.cancel = function() {
        $location.path('/agendas/detail/' + id);
    };

    $scope.save = function() {
        var data = $scope.agenda;
        data.UpdatedBy = accountService.getUserName();
        data._id = id;
        data.Date = new Date($scope.Date).getTime();
        genericService.updateWithUserActions('agendas', data).then(function(id) {
            $location.path('/agendas/detail/' + id);
            $scope.$apply();
        });
    };
});