angular.module('starApp.controllers').controller('dicosController', ['$scope', '$cookieStore', '$location', 'genericService', 'starTable', function($scope, $cookieStore, $location, genericService, starTable) {
    var allDicos = [];
    $scope.cultures = [];
    $scope.dico = {};
    $scope.dicos = [];
    $scope.filter = {};
    $scope.illustrations = [];

    $scope.page.title = 'Dico - Home page';

    $scope.tableDico = starTable.create($scope, 'dicos', false, 1000);
    $scope.tableIllustration = starTable.create($scope, 'illustrations');

    genericService.findAll('cultures').then(function(cultures) {
        $scope.cultures = cultures.data;
        $scope.cultures.unshift({
            'Description': 'All',
            _id: -1
        });
        var indexFrom = 0;
        var indexTo = 0;
        $scope.filter = $cookieStore.get('dicosFilter') || {};
        if (!_.isEmpty($scope.filter)) {
            indexFrom = $scope.filter.From;
            indexTo = $scope.filter.To;
        }
        $scope.filter.To = $scope.cultures[indexTo];
        $scope.filter.From = $scope.cultures[indexFrom];
        return genericService.findAll('dicos');
    }).then(function(dicos) {
        allDicos = dicos.data;
        allDicos.forEach(function(d) {
            d.StrIllustrations = d.Illustrations ? d.Illustrations.join('.') : '';
        });
        $scope.dicos = dicos.data;
        $scope.search();
    });

    $scope.changeLabelSelected = function(model) {
        $scope.dicos.forEach(function(d) {
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

    $scope.remove = function(id) {
        var response = confirm('Are you sure you want to delete this dico?');
        if (!response) {
            return;
        }
        genericService.remove('dicos', id).success(function() {
            $scope.dicos = $scope.dicos.filter(function(d) {
                return d._id !== id;
            });
            $scope.tableDico.reload();
            $scope.changeLabelSelected($scope.dicos[0]);
        });
    };

    $scope.search = function() {
        $cookieStore.put('dicosFilter', {
            Text: $scope.filter.Text,
            From: _.findIndex($scope.cultures, {
                _id: $scope.filter.From._id
            }),
            To: _.findIndex($scope.cultures, {
                _id: $scope.filter.To._id
            })
        });
        $scope.dicos = _.filter(allDicos, function(d) {
            return ($scope.filter.To._id === -1 || $scope.filter.To._id === d.ToId) 
            && ($scope.filter.From._id === -1 || $scope.filter.From._id === d.FromId) 
            && ((!$scope.filter.Text || $scope.filter.Text === d.Text.substring(0, $scope.filter.Text.length))
                || (!$scope.filter.Text || ($scope.includeMeaning && d.Meaning.includes($scope.filter.Text))))
                || (!$scope.filter.Text || ($scope.includeIllustration && d.StrIllustrations.includes($scope.filter.Text)));
        });
        updateDicosTable();
    };

    var updateDicosTable = function() {
        $scope.dicos = _.sortBy($scope.dicos, 'Text');
        $scope.tableDico.reload();
        if ($scope.dicos.length > 0) {
            $scope.dico = $scope.dicos[0];
            $scope.changeLabelSelected($scope.dico);
        }
    };
}]);