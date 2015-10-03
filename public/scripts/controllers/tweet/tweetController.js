starApp.controller('tweetController', function($scope, $location, accountService, genericService, tweetService, activityService, starTable) {
    $scope.page.title = 'Tweet - Home page';
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    tweetService.getList('tweets', accountService.getUserName(), 'Type').then(function(data) {
        $scope.datas = data;
        $scope.tableSearch.settings().total = $scope.datas.length;
        $scope.tableSearch.parameters().page = 1;
        $scope.tableSearch.reload();
    });

    activityService.getActivities('tweets', accountService.getUserName()).then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.edit = function(model) {
        $location.path('/tweets/edit/' + model._id);
    };

    $scope.search = function() {
        if (!$scope.txtSearch || $scope.txtSearch.length < 1) {
            $scope.datas = _.sortBy($scope.datas, 'DateGroup');
            $scope.datas.reverse();
            return;
        }
        genericService.search('tweets', accountService.getUserName(), $scope.txtSearch).then(function(data) {
            $scope.datas = _.sortBy(data, 'DateGroup');
            $scope.datas.reverse();
            $scope.tableSearch.settings().total = $scope.datas.length;
            $scope.tableSearch.parameters().page = 1;
            $scope.tableSearch.reload();
        });
    };
});