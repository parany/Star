starApp.controller('addDicoController', function ($rootScope, $scope, $routeParams, $http, $location, ngTableParams, apiUrl, auth) {
    $scope.cultures = [];
    $scope.dico = {};
    $scope.dico.Meaning = '';
    $scope.illustrations = [];

    var id = $routeParams.id;
    $http.get(apiUrl + 'Culture/GetAll').success(function(data) {
        $scope.cultures = data;
        $scope.dico.To = $scope.cultures[2];
        $scope.dico.From = $scope.cultures[1];
    }).then(function() {
        if (id != undefined) {
            $http.get(apiUrl + 'Dico/Get/' + id).success(function (data) {
                $scope.dico = data;
                $scope.dico.To = $scope.cultures[$scope.cultures.map(function(c) { return c.Id; }).indexOf(data.ToId)];
                $scope.dico.From = $scope.cultures[$scope.cultures.map(function (c) { return c.Id; }).indexOf(data.FromId)];
                $scope.illustrations = data.Illustrations.map(function (i) { return { Text: i }; });
                $scope.tableIllustration.reload();
            });
        }
    });

    $scope.tableDico = new ngTableParams({
        page: 1,
        count: 10
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.dicos.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { dicos: {} }
    });
    $scope.tableDico.settings().$scope = $scope;

    $scope.tableIllustration = new ngTableParams({
        page: 1,
        count: 10
    }, {
        counts: [],
        getData: function ($defer, params) {
            $defer.resolve($scope.illustrations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { illustrations: {} }
    });
    $scope.tableDico.settings().$scope = $scope;

    $scope.addIllustration = function () {
        $scope.illustrations.push({ Text: $scope.newIllustration.Text });
        $scope.tableIllustration.reload();
        $scope.newIllustration.Text = '';
        $scope.newIllustration.$edit = false;
    }

    $scope.cancelAddIllustration = function () {
        $scope.newIllustration.Text = '';
        $scope.newIllustration.$edit = false;
    }

    $scope.removeIllustration = function (model) {
        $scope.illustrations = $scope.illustrations.filter(function (i) { return i.Text != model.Text; });
        $scope.tableIllustration.reload();
    }

    $scope.editIllustration = function (model) {
        model.editIllustration.$edit = false;
    }

    $scope.cancelEditIllustration = function (model) {
        model.Text = currentIllustration;
        model.editIllustration.$edit = false;
    }

    var currentIllustration = '';
    $scope.startEditIllustration = function (model) {
        currentIllustration = model.Text;
    }

    $scope.save = function () {
        var data = $scope.dico;
        data.FromId = data.From.Id;
        data.ToId = data.To.Id;
        var url;
        if (id == undefined) {
            data.CreatedBy = auth.getUserName();
            url = apiUrl + '/Dico/Insert';
        } else {
            data.UpdatedBy = auth.getUserName();
            url = apiUrl + '/Dico/Update';
        }
        data.Illustrations = $scope.illustrations.map(function (i) { return i.Text; });
        $http({
            method: 'POST',
            url: url,
            data: data
        }).success(function() {
            $location.path('dicos');
        }).error(function(err) {
            console.log(err);
        });
    }
});