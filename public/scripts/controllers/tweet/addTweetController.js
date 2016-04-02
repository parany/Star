starApp.controller('addTweetController', function($scope, $routeParams, $location, genericService, tweetService, activityService, starTable) {
    $scope.page.title = 'Tweet - ';
    
    $scope.datas = [];
    $scope.activity = {};
    $scope.activity.operations = [];
    
    $scope.model = {};
    $scope.model.Date = new Date();
    $scope.contentTypes = [];
    var id = $routeParams.id;

    $scope.tableSearch = starTable.create($scope, 'datas', true);
    $scope.tableOperations = starTable.create($scope, 'activity.operations');

    genericService.findAll('contentTypes').success(function(data) {
        $scope.contentTypes = _.pluck(data, 'name');
        $scope.model.Type = $scope.contentTypes[0];
    });

    if (id) {
        genericService.findOne('tweets', id).success(function(data) {
            $scope.model = data;
            $scope.page.title += 'Edit - ' + $scope.model.Title;
            $scope.model.Date = new Date(data.Date);
        });
    } else {
        $scope.page.title += 'Add';
    }

    activityService.getActivities('tweets').then(function(data) {
        $scope.activity = data;
        $scope.tableOperations.reload();
    });

    $scope.save = function() {
        var data = JSON.parse(JSON.stringify($scope.model));
        data.Date = $scope.model.Date.getTime();
        var method;
        if (id) {
            data._id = id;
            method = 'updateWithUserActions';
        } else {
            method = 'insertWithUserActions';
        }
        var func = genericService[method].call({}, 'tweets', data);
        func.then(function() {
            $location.path('/tweets');
            $scope.$apply();
        });
    };
});