angular.module('starApp').run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeStart',
        function(evt, next) {
            $rootScope.pageClass = 'master-view';
            angular.element('li').removeClass('active');
            if (next !== undefined) {
                angular.element('#' + next.menuId).addClass('active');
            }
            if (next.$$route) {
                $rootScope[next.$$route .menuId] = true;
            }
        });
    $rootScope.$on('$locationChangeStart',
        function(evt, next) {
            $rootScope.pageClass = 'detail-view';
        });
}]);