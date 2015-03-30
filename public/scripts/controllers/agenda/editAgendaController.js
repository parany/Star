starApp.controller('editAgendaController', function ($scope, $routeParams, $http, $location, ngTableParams, auth) {
    var id = $routeParams.id;
    $scope.Date = '';
    $scope.agenda = {};
    $scope.data = [];
    $http.get('/agendas/findOne/' + id).success(function (data) {
        $scope.agenda = data;
        $scope.Date = new Date(data.Date).toISOString();
        $scope.tableParams.reload();
    });
    
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
        if ($scope.Date == undefined || $scope.Date == '') return;
        $scope.Date = $scope.Date.split('T')[0];
        $http.get('/agendas/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            $scope.data = data.Docs.filter(function (d) { return d._id != id; });
            $scope.tableParams.reload();
        });
    });
    
    
    $scope.save = function () {
        var data = $scope.agenda;
        data.Date = $scope.Date;
        data.CreatedBy = auth.getUserName();
        data.UpdatedBy = auth.getUserName();
        data._id = id;
        data.Date = (new Date($scope.Date)).getTime();
        $http({
            method: 'POST',
            data: data,
            url: '/agendas/update'
        }).success(function () {
            $location.path('/agenda/index');
        }).error(function (err) {
            console.log(err);
        });
    }
});