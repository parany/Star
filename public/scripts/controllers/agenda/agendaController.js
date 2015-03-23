﻿starApp.controller('agendaController', function ($scope, $routeParams, $http, $location, ngTableParams, auth, dateHelper) {
    $scope.Date = '';
    $scope.Date = new Date().toISOString().split('T')[0];
    $scope.agenda = {};
    $scope.data = [];

    $scope.tableParams = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params){ 
            $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    $scope.tableParams.settings().$scope = $scope;

    $scope.$watch('Date', function () {
        $scope.textToSearch = '';
        $http.get('/agendas/getByDate/' + auth.getUserName() + '/' + $scope.Date).success(function (data) {
            $scope.data = data.Agendas;
            $scope.tableParams.reload();

            $scope.agenda = data.Agendas.length > 0 ? data.Agendas[0] : {};
            $scope.Title = $scope.agenda.Title;
            $scope.agenda.$selected = true;

            $scope.prev = data.Prev;
            $scope.next = data.Next;
            angular.element('.glyphicon-chevron-left').css('opacity', $scope.prev == null ? '0.4' : '1.0');
            angular.element('.glyphicon-chevron-right').css('opacity', $scope.next == null ? '0.4' : '1.0');
        });
    });

    $scope.prevAgenda = function() {
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
            }).success(function() {
                $scope.data = $scope.data.filter(function (d) { return d._id != id; });
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
            $http.get('/agendas/search/' + $scope.textToSearch).success(function (data) {
                $scope.data = data;
                $scope.tableParams.reload();

                $scope.agenda = data.length > 0 ? data[0] : {};
                if (data.length > 0) {
                    console.log($scope.agenda.Date);
                    $scope.Title = $scope.agenda.Title + ' (' + new Date($scope.agenda.Date).toISOString().split('T')[0] + ')';
                    var d = new Date($scope.agenda.Date);
                    $scope.agenda.$selected = true;
                }
            });
        }, searchDelay);
    }
});