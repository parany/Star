/* global starApp */
starApp.controller('activityController', function ($scope, $http, _, auth) {
    $http.get('/getTotal/' + auth.getUserName()).success(function(data){
    	$scope.generalLabels = _.pluck(data, 'article');
    	$scope.generalData = _.pluck(data, 'total');
    });

    $http.get('/getAllActivities/' + auth.getUserName()).success(function(data){
    	$scope.operationsLabels = _.pluck(data, 'operation');
    	$scope.operationsData = _.pluck(data, 'total');
    });
});