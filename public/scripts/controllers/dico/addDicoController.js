starApp.controller('addDicoController', function($scope, $routeParams, $location, _, accountService, genericService, starTable) {
    $scope.page.title = 'Dico - ';

    $scope.cultures = [];
    $scope.dico = {};
    $scope.dico.Meaning = '';
    $scope.illustrations = [];

    var id = $routeParams.id;
    genericService.findAll('cultures').then(function(data) {
        $scope.cultures = data.data;
        $scope.dico.To = $scope.cultures[2];
        $scope.dico.From = $scope.cultures[1];
        if (id !== undefined) {
            return genericService.findOne('dicos', id).then(function(data) {
                $scope.dico = data.data;
                $scope.page.title += 'Edit - ' + $scope.dico.Text;
                var culturesId = _.pluck($scope.cultures, '_id');
                $scope.dico.To = $scope.cultures[culturesId.indexOf($scope.dico.ToId)];
                $scope.dico.From = $scope.cultures[culturesId.indexOf($scope.dico.FromId)];
                $scope.illustrations = $scope.dico.Illustrations.map(function(i) {
                    return {
                        Text: i
                    };
                });
                $scope.tableIllustration.reload();
            });
        } else {
            $scope.page.title += 'Add';
            return Promise.resolve(null);
        }
    }).then(function(data) {
        if (!data) return;
        $scope.dico = data.data;
        $scope.page.title += 'Edit - ' + $scope.dico.Text;
        var culturesId = _.pluck($scope.cultures, '_id');
        $scope.dico.To = $scope.cultures[culturesId.indexOf($scope.dico.ToId)];
        $scope.dico.From = $scope.cultures[culturesId.indexOf($scope.dico.FromId)];
        $scope.illustrations = $scope.dico.Illustrations.map(function(i) {
            return {
                Text: i
            };
        });
        $scope.tableIllustration.reload();
    });

    $scope.tableIllustration = starTable.create($scope, 'illustrations');

    $scope.addIllustration = function() {
        $scope.illustrations.push({
            Text: $scope.newIllustration.Text
        });
        $scope.tableIllustration.reload();
        $scope.newIllustration.Text = '';
        $scope.newIllustration.$edit = false;
    };

    $scope.cancelAddIllustration = function() {
        $scope.newIllustration.Text = '';
        $scope.newIllustration.$edit = false;
    };

    $scope.removeIllustration = function(model) {
        $scope.illustrations = $scope.illustrations.filter(function(i) {
            return i.Text !== model.Text;
        });
        $scope.tableIllustration.reload();
    };

    $scope.editIllustration = function(model) {
        model.editIllustration.$edit = false;
    };

    $scope.cancelEditIllustration = function(model) {
        model.Text = currentIllustration;
        model.editIllustration.$edit = false;
    };

    var currentIllustration = '';
    $scope.startEditIllustration = function(model) {
        currentIllustration = model.Text;
    };

    $scope.save = function() {
        var data = JSON.parse(JSON.stringify($scope.dico));
        data.FromId = data.From._id;
        data.ToId = data.To._id;
        delete data.From;
        delete data.To;
        var method;
        if (id === undefined) {
            data.CreatedBy = accountService.getUserName();
            method = 'insert';
        } else {
            data.UpdatedBy = accountService.getUserName();
            method = 'update';
        }
        data.Illustrations = $scope.illustrations.map(function(i) {
            return i.Text;
        });
        var func = genericService[method].call({}, 'dicos', data);
        func.then(function() {
            $location.path('dicos');
        });
    };
});