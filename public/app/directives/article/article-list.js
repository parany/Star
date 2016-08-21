angular.module('starApp.directives').directive('articleList', function() {
    return {
        scope: false,
        templateUrl: 'app/directives/article/article-list.html',
        restrict: 'E',
        replace: true
    };
});