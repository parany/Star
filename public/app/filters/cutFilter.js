angular.module('starApp.services').filter('cut', ['$filter', function ($filter) {
    var limit = 40;
    return function (input) {
        if (!input) return;
        if (input.length <= limit) {
            return input;
        }
        return $filter('limitTo')(input, limit) + '...';
    };
}]);
