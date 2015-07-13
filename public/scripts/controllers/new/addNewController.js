starApp.controller('addNewController', function($scope, $routeParams, $location, starTable, accountService, genericService) {
    $scope.page.title = 'New - ';

    var id = $routeParams.id;
    $scope.news = [];
    $scope.new = {};
    $scope.new.Date = '';
    $scope.new.Content = '';
    $scope.new.Citations = [];
    $scope.sources = [];


    genericService.findAll('sources').then(function(data) {
        $scope.sources = data.data;
    }).then(function() {
        if (id === undefined) {
            $scope.new.Date = new Date().toISOString().split('T')[0];
            $scope.page.title += 'Add';
        } else {
            genericService.findOne('news', id).success(function(data) {
                $scope.new = data;
                $scope.page.title += 'Edit - ' + $scope.new.Title;
                $scope.new.Date = new Date(data.Date).toISOString().split('T')[0];
                $scope.tableCitations.reload();
                var sourcesId = _.pluck($scope.sources, '_id');
                $scope.new.Source = $scope.sources[sourcesId.indexOf($scope.new.Source._id)];
            });
        }
    });

    $scope.tableNews = starTable.create($scope, 'news');
    $scope.tableCitations = starTable.create($scope, 'new.Citations');

    $scope.$watch('new.Date', function() {
        if ($scope.new.Date === undefined || $scope.new.Date === '') return;
        genericService.getByDate('news', accountService.getUserName(), $scope.new.Date).success(function(data) {
            $scope.news = data;
            if (id !== undefined) {
                $scope.news = $scope.news.filter(function(t) {
                    return t._id !== id;
                });
            }
            $scope.tableNews.reload();
        });
    });

    $scope.valid = function() {
        return $scope.new.Citations.length > 0 && $scope.new.Content.length > 0 && $scope.new.Source !== undefined;
    };

    $scope.addCitation = function(citation) {
        $scope.new.Citations.push(citation);
        $scope.tableCitations.reload();
        $scope.citation = '';
    };

    $scope.removeCitation = function(citation) {
        $scope.new.Citations = $scope.new.Citations.filter(function(c) {
            return c !== citation;
        });
        $scope.tableCitations.reload();
    };

    $scope.cancel = function() {
        if (id) {
            $location.path('/news/detail/' + id);
        } else {
            $location.path('/news');
        }
    };

    $scope.save = function() {
        var data = JSON.parse(JSON.stringify($scope.new));
        data.Date = new Date($scope.new.Date).getTime();
        data.CreatedBy = accountService.getUserName();
        var method;
        if (id !== undefined) {
            data.UpdatedBy = accountService.getUserName();
            data._id = id;
            method = 'updateWithUserActions';
        } else {
            data.CreatedBy = accountService.getUserName();
            method = 'insertWithUserActions';
        }
        var func = genericService[method].call({}, 'news', data);
        func.then(function(ret) {
            if (id !== undefined) {
                $location.path('/news/detail/' + id);
            } else {
                $location.path('news/detail/' + ret.data[0]._id);
            }
            $scope.$apply();
        });
    };
});