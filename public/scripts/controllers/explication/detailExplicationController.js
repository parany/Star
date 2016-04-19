starApp.controller('detailExplicationController', ['$scope', '$routeParams', '$location', 'genericService', 'starTable', function($scope, $routeParams, $location, genericService, starTable) {
    $scope.page.title = 'Explication - Detail - ';

    $scope.explication = {};
    $scope.explication.VerseReadList = [];
    $scope.sameDate = [];
    $scope.articles = [];
    $scope.prevs = [];
    $scope.nexts = [];

    $scope.tableNexts = starTable.create($scope, 'nexts');
    $scope.tablePrevs = starTable.create($scope, 'prevs');
    $scope.tableSameDate = starTable.create($scope, 'sameDate');
    $scope.tableOtherArticles = starTable.create($scope, 'articles');
    $scope.tableTweets = starTable.create($scope, 'tweets');
    $scope.tableVerses = starTable.create($scope, 'explication.VerseReadList');

    genericService.getDetail('explications', $routeParams.id).then(function(data) {
        $scope.explication = data.item;
        $scope.page.title += $scope.explication.Title;
        $scope.sameDate = data.sameDate;
        $scope.tweets = data.tweets;
        $scope.articles = data.articles;
        $scope.prevs = data.prevs;
        $scope.nexts = data.nexts;
        $scope.tableVerses.reload();
        return genericService.find('tags', {
            'Type': 'Explication'
        });
    }).then(function(data) {
        $scope.explication.TagIdList.forEach(function(tag, index, array) {
            array[index] = _.findWhere(data.data, {
                '_id': tag
            }).Description;
        });
        $scope.$apply();
    });

    $scope.promptDelete = function(model) {
        var response = confirm('Are you sure you want to delete this explication?');
        if (response) {
            var data = {
                'id': model._id,
                'title': model.Title
            };
            genericService.removeWithUserActions('explications', data).then(function() {
                $location.path('/explications');
                $scope.$apply();
            });
        }
    };
}]);