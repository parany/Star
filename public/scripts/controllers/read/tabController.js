starApp.controller('tabController', function ($scope, $rootScope, $http, auth) {
    $rootScope.$on('read.changeSelect', function (event, id) {
        $http.get('/note/getNotesByVerseId/' + id + '/' + auth.getUserName()).success(function (data) {
            $scope.dtoNote = data;
        });
    });
});