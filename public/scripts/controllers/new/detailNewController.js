starApp.controller('detailNewController', function($scope, $routeParams, $location, accountService, genericService, starTable) {
    $scope.page.title = 'New - Detail - ';

    var id = $routeParams.id;
    $scope.new = {};
    $scope.new.citations = [];
    $scope.sameDate = [];
    $scope.articles = [];
    $scope.prevs = [];
    $scope.nexts = [];

    $scope.tableNexts = starTable.create($scope, 'nexts');
    $scope.tablePrevs = starTable.create($scope, 'prevs');
    $scope.tableSameDate = starTable.create($scope, 'sameDate');
    $scope.tableOtherArticles = starTable.create($scope, 'articles');
    $scope.tableTweets = starTable.create($scope, 'tweets');
    $scope.tableCitations = starTable.create($scope, 'new.citations');

    genericService.getDetail('news', id).then(function(data) {
        $scope.new = data.item;
        $scope.page.title += $scope.new.Title;
        $scope.sameDate = data.sameDate;
        $scope.tweets = data.tweets;
        $scope.articles = data.articles;
        $scope.prevs = data.prevs;
        $scope.nexts = data.nexts;
        $scope.tableCitations.reload();
        $scope.$apply();
    });

    $scope.promptDelete = function(model) {
        var response = confirm('Are you sure you want to delete this new?');
        if (response) {
            var data = {
                'id': model._id,
                'title': model.Title,
                'author': accountService.getUserName()
            };
            genericService.removeWithUserActions('news', data).then(function() {
                $location.path('/news');
                $scope.$apply();
            });
        }
    };
});