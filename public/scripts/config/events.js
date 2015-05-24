starApp.run(function($rootScope, $location, auth) {
    $rootScope.$on('$routeChangeStart',
        function(evt, next, curr) {
            if (!auth.isLoggedIn()) {
                $location.path('/login');
                return;
            }

            angular.element('li').removeClass('active');
            if (next !== undefined) {
                angular.element('#' + next.menuId).addClass('active');
            }
        });
});