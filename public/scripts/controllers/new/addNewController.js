starApp.controller('addNewController', function ($scope, $routeParams, $http, $location, ngTableParams, auth) {
    var id = $routeParams.id;
    $scope.news = [];
    $scope.new = {};
    $scope.new.Date = '';
    $scope.new.Content = '';
    $scope.new.Citations = [];
    $scope.sources = [];

    $http.get('/sources/findAllv2').success(function (data) {
        $scope.sources = data;
    }).then(function () {
        if (id == undefined) {
            $scope.new.Date = new Date().toISOString().split('T')[0];
        } else {
            $http.get('/news/findOnev2/' + id).success(function (data) {
                $scope.new = data;
                $scope.new.Date = new Date(data.Date).toISOString().split('T')[0];
                $scope.tableCitations.reload();
                $scope.new.Source = $scope.sources[$scope.sources.map(function (s) { return s._id; }).indexOf($scope.new.Source._id)];
            });
        }
    });

    $scope.tableNews = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.news.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });
    $scope.tableNews.settings().$scope = $scope;

    $scope.tableCitations = new ngTableParams({
        page: 1,
        total: 1,
        count: 5
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.new.Citations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
    });

    $scope.$watch('new.Date', function () {
        if ($scope.new.Date == undefined || $scope.new.Date == '') return;
        $http.get('/news/getByDate/' + auth.getUserName() + '/' + $scope.new.Date).success(function (data) {
            $scope.news = data.Docs;
            if (id != undefined) {
                $scope.news = $scope.news.filter(function (t) { return t._id != id; });
            }
            $scope.tableNews.reload();
        });
    });

    $scope.valid = function () {
        return $scope.new.Citations.length > 0 && $scope.new.Content.length > 0 && $scope.new.Source != undefined;
    }

    $scope.addCitation = function (citation) {
        $scope.new.Citations.push(citation);
        $scope.tableCitations.reload();
        $scope.citation = '';
    }

    $scope.removeCitation = function (citation) {
        $scope.new.Citations = $scope.new.Citations.filter(function (c) { return c != citation; });
        $scope.tableCitations.reload();
    }

    $scope.save = function () {
        var data = JSON.parse(JSON.stringify($scope.new));
        data.Date = new Date($scope.new.Date).getTime();
        data.CreatedBy = auth.getUserName();
        var url = '/news/insertv2';
        if (id != undefined) {
            data.Id = id;
            url = '/news/updatev2';
            data.UpdatedBy = auth.getUserName();
        }
        $http({
            method: 'POST',
            data: data,
            url: url
        }).success(function () {
            $location.path('/new');
        }).error(function (err) {
            console.log(err);
        });
    }
});