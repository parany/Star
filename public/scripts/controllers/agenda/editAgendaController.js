starApp.controller('editAgendaController', function($scope, $routeParams, $http, $location, ngTableParams, auth) {
    var id = $routeParams.id;
    $scope.Date = '';
    $scope.agenda = {};
    $scope.data = [];

    $scope.page.title = 'Agenda - Edit - ';

    $http.get('/agendas/findOne/' + id).success(function(data) {
        $scope.agenda = data;
        $scope.page.title += $scope.agenda.Title;
        $scope.Date = new Date(data.Date).toISOString();
        $scope.tableParams.reload();
    });

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
        if ($scope.Date === undefined || $scope.Date === '') return;
        $scope.Date = $scope.Date.split('T')[0];
        $http.get('/agendas/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function(data) {
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
        data.Date = $scope.Date;
        data.CreatedBy = auth.getUserName();
        data.UpdatedBy = auth.getUserName();
        data._id = id;
        data.Date = (new Date($scope.Date)).getTime();
        var userAction = {
            'collection': 'agendas',
            'operation': 'Edit',
            'date': new Date().getTime(),
            'title': data.Title,
            'createdBy': auth.getUserName()
        };
        $http({
            method: 'POST',
            data: data,
            url: '/agendas/update'
        }).success(function() {
            return $http.post('/userActions/insert', userAction);
        }).then(function() {
            $location.path('/agendas/detail/' + id);
        });


    };
});