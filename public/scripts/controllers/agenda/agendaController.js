starApp.controller('agendaController', function ($scope, $routeParams, $http, $location, $cookieStore, ngTableParams, auth) {
    $scope.Date = '';
    $scope.Date = $cookieStore.get('lastAgenda') || new Date().toISOString().split('T')[0];
    
    $scope.agenda = {};
    $scope.data = [];
    $scope.activity = {};

    $scope.operations = [
        'Add "La vie et la nature" on 12/08/2015',
        'Edit "Une journée..." on 11/06/2015',
        'Delete "Difficulté passagère" on 21/11/2016'
    ];
    
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

    $http.get('/agendas/getActivities/' + auth.getUserName()).success(function (data) {
        $scope.activity = data;
    });
    
    $scope.$watch('Date', function () {
        $scope.textToSearch = '';
        $cookieStore.put('lastAgenda', $scope.Date);
        $http.get('/agendas/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            $scope.data = data.Docs;
            $scope.tableParams.reload();
            
            $scope.agenda = data.Docs.length > 0 ? data.Docs[0] : {};
            $scope.Title = $scope.agenda.Title;
            $scope.agenda.$selected = true;
            
            $scope.prev = data.Prev;
            $scope.next = data.Next;
            angular.element('.glyphicon-chevron-left').css('opacity', $scope.prev == null ? '0.4' : '1.0');
            angular.element('.glyphicon-chevron-right').css('opacity', $scope.next == null ? '0.4' : '1.0');
        });
    });
    
    $scope.prevAgenda = function () {
        if ($scope.prev == null) return;
        $scope.Date = $scope.prev;
    }
    
    $scope.nextAgenda = function () {
        if ($scope.next == null) return;
        $scope.Date = $scope.next;
    }
    
    $scope.changeAgendaSelected = function (model) {
        angular.forEach($scope.data, function (d) {
            d.$selected = false;
        });
        $scope.agenda = model;
        if ($scope.textToSearch.length > 0) {
            $scope.Title = $scope.agenda.Title + ' (' + new Date(model.Date).toISOString().split('T')[0] + ')';
        } else {
            $scope.Title = $scope.agenda.Title;
        }
        $scope.agenda.$selected = true;
    }
    
    $scope.promptDelete = function (id) {
        var response = confirm("Are you sure you want to delete this agenda?");
        if (response) {
            $http.get('/agendas/delete/' + id).success(function () {
            }).success(function () {
                $scope.data = $scope.data.filter(function (d) { return d._id != id; });
                if ($scope.data.length > 0) {
                    $scope.changeAgendaSelected($scope.data[0]);
                } else {
                    $scope.changeAgendaSelected({});
                }
                $scope.tableParams.reload();
            });
        }
    }
    
    var searchTimeout;
    var searchDelay = 200;
    $scope.search = function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (!$scope.textToSearch || $scope.textToSearch.length < 1) return;
            $http({
                url: '/agendas/search/' + $scope.textToSearch,
                method: 'POST',
                data: { 'filters': ['Title', 'Text'] }
            }).success(function (data) {
                $scope.data = data;
                $scope.tableParams.reload();
                
                $scope.agenda = data.length > 0 ? data[0] : {};
                if (data.length > 0) {
                    $scope.Title = $scope.agenda.Title + ' (' + new Date($scope.agenda.Date).toISOString().split('T')[0] + ')';
                    $scope.agenda.$selected = true;
                }
            });
        }, searchDelay);
    }
});