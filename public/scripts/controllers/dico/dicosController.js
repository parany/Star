starApp.controller('dicosController', function ($rootScope, $scope, $http, $location, ngTableParams, _) {
    var allDicos = [];
    $scope.cultures = [];
    $scope.dico = {};
    $scope.dicos = [];
    $scope.filter = {};
    $scope.illustrations = [];

    $scope.page.title = 'Dico - Home page';

    $scope.tableDico = new ngTableParams({
        page: 1,
        count: 100
    }, {
            counts: [], // hide page counts control
            getData: function ($defer, params) {
                $defer.resolve($scope.dicos.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                dicos: {}
            }
        });
    $scope.tableDico.settings().$scope = $scope;

    $scope.tableIllustration = new ngTableParams({
        page: 1,
        count: 10
    }, {
            counts: [], // hide page counts control
            getData: function ($defer, params) {
                $defer.resolve($scope.illustrations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                illustrations: {}
            }
        });
    $scope.tableDico.settings().$scope = $scope;

    $http.get('/cultures/findAll').then(function (cultures) {
        $scope.cultures = cultures.data;
        return $http.get('/dicos/findAll');
    }).then(function (dicos) {
        allDicos = dicos.data;
        $scope.dicos = dicos.data;
        updateDicosTable();
    });

    $scope.changeLabelSelected = function (model) {
        $scope.dicos.forEach(function (d) {
            d.$selected = false;
        });
        model.$selected = !model.$selected;
        $scope.dico = model;

        $scope.dico.From = _.findWhere($scope.cultures, {
            _id: $scope.dico.FromId
        }).Description;
        $scope.dico.To = _.findWhere($scope.cultures, {
            _id: $scope.dico.ToId
        }).Description;

        $scope.illustrations = $scope.dico.Illustrations;
        $scope.tableIllustration.reload();
    };

    $scope.remove = function (id) {
        var response = confirm("Are you sure you want to delete this dico?");
        if (!response) {
            return;
        }
        $http.get('/dicos/delete/' + id).success(function () {
            $scope.dicos = $scope.dicos.filter(function (d) {
                return d._id !== id;
            });
            $scope.tableDico.reload();
            $scope.changeLabelSelected($scope.dicos[0]);
        });
    };

    $scope.search = function () {
        if ($scope.filter.Text) {
            $scope.dicos = _.filter(allDicos, function (d) {
                return $scope.filter.Text === d.Text.substring(0, $scope.filter.Text.length);
            });
        } else {
            $scope.dicos = allDicos;
        }
        updateDicosTable();
    };

    var updateDicosTable = function () {
        $scope.dicos = _.sortBy($scope.dicos, 'Text');
        $scope.dico = $scope.dicos.length > 0 ? $scope.dicos[0] : {};
        $scope.tableDico.reload();
        $scope.changeLabelSelected($scope.dico);
    };
});