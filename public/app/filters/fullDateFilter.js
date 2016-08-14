angular.module('starApp.services').filter('fullDate', ['$filter', function ($filter) {
    return function (input) {
        return $filter('date')(input, 'dd MMM yyyy hh:mm');
    };
}]);
