app.controller('DessertCtrl', function ($scope, $stateParams, $state, DessertService, $rootScope) {
    $scope.dessert = {};
    var userStocked = JSON.parse(window.localStorage.getItem("currentUser"));

    function dessertsChecked(desserts) {
        var result = [];
        for (var i = 0; i < desserts.length; i++) {
            if (desserts[i].isChecked) {
                result.push(desserts[i]);   
            }
        }
        return result;
    }

    function getAll() {
        DessertService.all().then(function (result) {
            $scope.dessert.desserts = result.data.data;
        });
    }

    function submit(desserts) {
        var dessertsSelected = dessertsChecked(desserts.desserts);
        $rootScope.user.commandes[$rootScope.user.currentCommande].desserts = dessertsSelected;
        $state.go('tab.commande');
    }

    $scope.dessert.submit = submit;
    $scope.dessert.getAll = getAll();
});