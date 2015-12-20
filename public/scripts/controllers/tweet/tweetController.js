starApp.controller('tweetController', function($scope, $location, accountService, genericService, tweetService, activityService, starTable) {
    $scope.page.title = 'Tweet - Home page';

    var allTweets = [];
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    tweetService.getList('tweets', accountService.getUserName(), 'Type').then(function(data) {
        allTweets = data;
        $scope.datas = allTweets;
        reloadTable();
    });

    activityService.getActivities('tweets', accountService.getUserName()).then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.edit = function(model) {
        $location.path('/tweets/edit/' + model._id);
    };

    $scope.search = function() {
        if (!$scope.txtSearch) {
            $scope.datas = allTweets;

        } else {
            var regSearch = new RegExp($scope.txtSearch, 'i');
            $scope.datas = allTweets.filter(function(tweet) {
                return regSearch.test(tweet.Title);
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