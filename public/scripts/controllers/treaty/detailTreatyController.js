angular.module('starApp.controllers').controller('detailTreatyController', ['$scope', '$location', '$routeParams', 'starTable', 'genericService', function($scope, $location, $routeParams, starTable, genericService) {
    $scope.page.title = 'Treaty - Detail - ';

    var id = $routeParams.id;
    $scope.sameDate = [];
    $scope.articles = [];
    $scope.prevs = [];
    $scope.nexts = [];

    $scope.tableNexts = starTable.create($scope, 'nexts');
    $scope.tablePrevs = starTable.create($scope, 'prevs');
    $scope.tableSameDate = starTable.create($scope, 'sameDate');
    $scope.tableTweets = starTable.create($scope, 'tweets');
    $scope.tableOtherArticles = starTable.create($scope, 'articles');

    genericService.getDetail('treaties', id).then(function(data) {
        $scope.treaty = data.item;
        $scope.page.title += $scope.treaty.Title;
        $scope.sameDate = data.sameDate;
        $scope.tweets = data.tweets;
        $scope.articles = data.articles;
        $scope.prevs = data.prevs;
        $scope.nexts = data.nexts;
        return genericService.find('tags', {
            'Type': 'Treaty'
        });
    }).then(function(data) {
        $scope.treaty.TagIdList.forEach(function(tag, index, array) {
            array[index] = _.findWhere(data.data, {
                '_id': tag
            }).Description;
        });
        $scope.$apply();
    });


    $scope.promptDelete = function(model) {
        var response = confirm('Are you sure you want to delete this treaty?');
        if (response) {
            var data = {
                'id': model._id,
                'title': model.Title
            };
            genericService.removeWithUserActions('treaties', data).then(function() {
                $location.path('/treaties');
                $scope.$apply();
            });
        }
    };
}]);