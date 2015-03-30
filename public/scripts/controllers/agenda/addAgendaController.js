starApp.controller('addAgendaController', function ($scope, $routeParams, $http, $location, ngTableParams, auth) {
    $scope.agenda = {};
    $scope.Date = '';
    $scope.Date = new Date().toISOString().split('T')[0];
    $scope.data = [];
    $scope.agenda.Text = '';
    
    $scope.tableParams = new ngTableParams({
        page: 1,  
        total: 1, 
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    $scope.tableParams.settings().$scope = $scope;
    
    $scope.$watch('Date', function () {
        $http.get('/agendas/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            $scope.data = data.Docs;
            $scope.tableParams.reload();
        });
    });
    
    $scope.save = function () {
        var data = $scope.agenda;
        data.Date = (new Date($scope.Date)).getTime();
        data.CreatedBy = auth.getUserName();
        $http({
            method: 'POST',
            data: data,
            url: '/agendas/insert'
        }).success(function () {
            $location.path('/agenda/index');
        }).error(function (err) {
            console.log(err);
        });
    }
});