angular.module('starApp.directives').directive('activity', function() {
    return {
        scope: false,
        templateUrl: 'app/directives/activity/activity.html',
        restrict: 'E',
        replace: true
    };
});