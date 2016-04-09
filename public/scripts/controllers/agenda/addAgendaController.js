starApp.controller('addAgendaController', ['$scope', '$location', 'genericService', 'starTable', function($scope, $location, genericService, starTable) {
    $scope.page.title = 'Agenda - Add';

    $scope.agenda = {};
    $scope.Date = new Date();
    $scope.data = [];
    $scope.tableParams = starTable.create($scope, 'data');

    $scope.changeDate = function() {
        genericService.getByDate('agendas', $scope.Date).success(function(data) {
            $scope.data = data;
            $scope.tableParams.reload();
        });
    };
    $scope.changeDate();

    $scope.save = function() {
        var data = $scope.agenda;
        data.Date = new Date($scope.Date).getTime();
        genericService.insertWithUserActions('agendas', data).then(function(id) {
            $location.path('/agendas/detail/' + id);
            $scope.$apply();
        });
    };
}]);