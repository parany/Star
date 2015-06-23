starApp.controller('addAgendaController', function($scope, $http, $location, ngTableParams, accountService, agendaService, starTable) {
    $scope.page.title = 'Agenda - Add';
    $scope.agenda = {};
    $scope.Date = '';
    $scope.Date = new Date().toISOString().split('T')[0];
    $scope.data = [];
    $scope.agenda.Text = '';
    $scope.tableParams = starTable.create($scope, 'data');

    $scope.$watch('Date', function() {
        agendaService.getByDate(accountService.getUserName(), $scope.Date).success(function(data) {
            $scope.data = data;
            $scope.tableParams.reload();
        });
    });

    $scope.save = function() {
        var data = $scope.agenda;
        data.Date = new Date($scope.Date).getTime();
        data.CreatedBy = accountService.getUserName();
        var userAction = {
            'collection': 'agendas',
            'operation': 'Add',
            'date': new Date().getTime(),
            'title': data.Title,
            'createdBy': accountService.getUserName()
        };
        var id;
        $http({
            method: 'POST',
            data: data,
            url: '/agendas/insert'
        }).success(function(ret) {
            id = ret[0]._id;
            return $http.post('/userActions/insert', userAction);
        }).then(function() {
            $location.path('/agendas/detail/' + id);
        });
    };
});