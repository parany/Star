starApp.controller('addAgendaController', function($scope, $routeParams, $http, $location, $cookieStore, ngTableParams, accountService) {
    $scope.agenda = {};
    $scope.Date = '';
    $scope.Date = new Date().toISOString().split('T')[0];
    $scope.data = [];
    $scope.agenda.Text = '';

    $scope.page.title = 'Agenda - Add';

    $scope.tableParams = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function($defer, params) {
            $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
            $data: {}
        }
    });
    $scope.tableParams.settings().$scope = $scope;

    $scope.$watch('Date', function() {
        $http.get('/agendas/getByDate/' + accountService.getUserName() + '/' + $scope.Date).success(function(data) {
            $scope.data = data;
            $scope.tableParams.reload();
        });
    });

    $scope.save = function() {
        var data = $scope.agenda;
        data.Date = (new Date($scope.Date)).getTime();
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