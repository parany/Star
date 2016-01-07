starApp.controller('agendaController', function($scope, $location, accountService, genericService, activityService, starTable) {
    $scope.page.title = 'Agenda - Home page';
    
    var allAgendas = [];
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.getList('agendas', accountService.getUserName()).then(function(data) {
        allAgendas = data;
        $scope.datas = allAgendas;
        reloadTable();
    });

    activityService.getActivities('agendas', accountService.getUserName()).then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.goToDetail = function(model) {
        $location.path('/agendas/detail/' + model._id);
    };

    $scope.search = function() {
        if (!$scope.txtSearch) {
            $scope.datas = allAgendas;

        } else {
            var regSearch = new RegExp($scope.txtSearch, 'i');
            $scope.datas = allAgendas.filter(function(agenda) {
                return regSearch.test(agenda.Title) || regSearch.test(agenda.Text);
            });
        }
        reloadTable();
    };

    function reloadTable() {
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    }
});