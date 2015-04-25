starApp.controller('detailTreatyController', function($scope, $routeParams, $http, $location, $cookieStore, ngTableParams, auth) {
    var id = $routeParams.id;

    $http.get('/treaties/findOne/' + id).success(function(data) {
        $scope.treaty = data;
    });


    $scope.promptDelete = function(model) {
        var response = confirm("Are you sure you want to delete this treaty?");
        if (response) {
            $http.get('/treaties/delete/' + model._id).success(function() {}).success(function() {
                $scope.data = $scope.data.filter(function(d) {
                    return d._id != model._id;
                });
                if ($scope.data.length > 0)
                    $scope.changeTreatySelected($scope.data[0]);
                else
                    $scope.changeTreatySelected({});
                $scope.tableParams.reload();
            });
            var userAction = {
                'collection': 'treaties',
                'operation': 'Delete',
                'date': new Date().getTime(),
                'title': model.Title,
                'createdBy': auth.getUserName()
            };
            $http.post('/userActions/insert', userAction);
        }
    };

    var searchTimeout;
    var searchDelay = 200;
    $scope.search = function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            if (!$scope.textToSearch || $scope.textToSearch.length < 1) return;
            $http.get('/treaties/search/' + $scope.textToSearch).success(function(data) {
                $scope.data = data;
                $scope.tableParams.reload();

                $scope.treaty = data.length > 0 ? data[0] : {};
                if (data.length > 0) {
                    $scope.Title = $scope.treaty.Title + ' (' + new Date($scope.treaty.Date).toISOString().split('T')[0] + ')';
                    $scope.treaty.$selected = true;
                }
            });
        }, searchDelay);
    };
});