starApp.controller('TabController', function ($scope, $rootScope, $http, apiUrl, auth) {
    $rootScope.$on('read.changeSelect', function (event, id) {
        $http.get(apiUrl + 'Note/GetNotesByVerseId/' + id + '/' + auth.getUserName()).success(function (data) {
            $scope.dtoNote = data;
        });
    });
});