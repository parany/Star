starApp.controller('addTweetController', function($scope, $routeParams, $location, accountService, genericService) {
    $scope.page.title = 'Tweet - ';

    $scope.model = {};
    $scope.model.Text = '';
    $scope.model.Date = new Date();
    $scope.contentTypes = [];
    var id = $routeParams.id;

    genericService.findAll('contentTypes').success(function(data) {
        $scope.contentTypes = _.pluck(data, 'name');
        $scope.model.Type = $scope.contentTypes[0];
    });

    $scope.save = function() {
        var data = JSON.parse(JSON.stringify($scope.model));
        data.Date = $scope.model.Date.getTime();
        var method;
        if (id) {
            data.UpdatedBy = accountService.getUserName();
            data._id = id;
            method = 'updateWithUserActions';
        } else {
            data.CreatedBy = accountService.getUserName();
            method = 'insertWithUserActions';
        }
        var func = genericService[method].call({}, 'tweets', data);
        func.then(function() {
            $location.path('/tweets');
            $scope.$apply();
        });
    };
});