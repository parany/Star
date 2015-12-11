starApp.run(function($rootScope, $location, accountService) {
    $rootScope.$on('$routeChangeStart',
        function(evt, next, curr) {
            // if (!accountService.isLoggedIn()) {
            //     $location.path('/login');
            //     return;
            // }

            angular.element('li').removeClass('active');
            if (next !== undefined) {
                angular.element('#' + next.menuId).addClass('active');
            }
        });
});