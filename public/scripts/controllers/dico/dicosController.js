starApp.controller('dicosController', function ($rootScope, $scope, $http, $location, ngTableParams, _) {
    $scope.cultures = [];
    $scope.dico = {};
    $scope.dicos = [];
    $scope.filter = {};
    
    $http.get('/cultures/findAll').success(function (data) {
        $scope.cultures = data;
    }).then(function () {
        $http.get('/dicos/findAll').success(function (data) {
            data = _.sortBy(data, 'Text');
            $scope.dicos = data;
            $scope.dico = $scope.dicos.length > 0 ? $scope.dicos[0] : {};
            $scope.dico.$selected = true;
            $scope.dico.From = $scope.cultures.filter(function (d) { return d._id == $scope.dico.FromId; })[0].Description;
            $scope.dico.To = $scope.cultures.filter(function (d) { return d._id == $scope.dico.ToId; })[0].Description;
            $scope.illustrations = $scope.dico.Illustrations;
            $scope.tableIllustration.reload();
            
            $scope.tableDico.reload();
        });
    });
    
    $scope.tableDico = new ngTableParams({
        page: 1,
        count: 100
    }, {
        counts: [], // hide page counts control
        getData: function ($defer, params) {
            $defer.resolve($scope.dicos.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { dicos: {} }
    });
    $scope.tableDico.settings().$scope = $scope;
    
    $scope.changeLabelSelected = function (model) {
        angular.forEach($scope.dicos, function (d) {
            d.$selected = false;
        });
        model.$selected = !model.$selected;
        $scope.dico = model;
        $scope.dico.From = $scope.cultures.filter(function (d) { return d._id == $scope.dico.FromId; })[0].Description;
        $scope.dico.To = $scope.cultures.filter(function (d) { return d._id == $scope.dico.ToId; })[0].Description;
        $scope.illustrations = $scope.dico.Illustrations;
        $scope.tableIllustration.reload();
    }
    
    $scope.illustrations = [];
    $scope.tableIllustration = new ngTableParams({
        page: 1,
        count: 10
    }, {
        counts: [], // hide page counts control
        getData: function ($defer, params) {
            $defer.resolve($scope.illustrations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { illustrations: {} }
    });
    $scope.tableDico.settings().$scope = $scope;
    
    $scope.remove = function (id) {
        var response = confirm("Are you sure you want to delete this dico?");
        if (response) {
            $http.get('/dicos/delete/' + id).success(function () {
            }).success(function () {
                $scope.dicos = $scope.dicos.filter(function (d) { return d._id != id; });
                $scope.tableDico.reload();
            });
        }
    }
    
    $scope.search = function () {
        var action = $http.post('/dicos/search/' + $scope.filter.Text, { 'filters': ['Text'] });
        if ($scope.filter.Text == undefined)
            action = $http.get('/dicos/findAll');
        action.success(function (response) {
            $scope.dicos = response;
            if (response.length == 0)
                $scope.dicos = [];
            
            $scope.dicos = _.sortBy($scope.dicos, 'Text');
            $scope.dico = $scope.dicos.length > 0 ? $scope.dicos[0] : {};
            $scope.dico.$selected = true;
            
            var from = $scope.cultures.filter(function (d) { return d.Id == $scope.dico.FromId; });
            if (from.length > 0)
                $scope.dico.From = from[0].Description;
            
            var to = $scope.cultures.filter(function (d) { return d.Id == $scope.dico.ToId; });
            if (to.length > 0)
                $scope.dico.To = to[0].Description;
            
            $scope.illustrations = $scope.dico.Illustrations;
            if (response.length == 0)
                $scope.illustrations = [];
            
            $scope.tableIllustration.reload();
            
            $scope.tableDico.reload();
        });
    }
});