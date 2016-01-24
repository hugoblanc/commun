app.controller('DessertCtrl', function ($scope, $q, $stateParams, $state, DessertService, $rootScope) {
    $scope.dessert = {};
    var userStocked = JSON.parse(window.localStorage.getItem("currentUser"));


    function initValues(){
        for(var i = 0; i < $scope.dessert.desserts.length; i++){
            for(var j=0; $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.length > j ;j++){
                if($scope.dessert.desserts[i].name == $rootScope.user.commandes[$rootScope.user.currentCommande].desserts[j].name){
                    $scope.dessert.desserts[i].isChecked = true;
                }
            }
        }
    }

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
        var dfd = $q.defer();
        DessertService.all().then(function (result) {
            $scope.dessert.desserts = result.data.data;
            dfd.resolve(result.data.data);
        }, function(raison){
            dfd.reject(raison);
        });

        return dfd.promise;
    }

    function submit(desserts) {
        var dessertsSelected = dessertsChecked(desserts.desserts);
        $rootScope.user.commandes[$rootScope.user.currentCommande].desserts = dessertsSelected;
        $state.go('tab.commande');
    }

    $scope.dessert.submit = submit;
    $scope.dessert.getAll = getAll().then(function(resultDessertsGetAll){
                if($rootScope.user.commandes[$rootScope.user.currentCommande] != undefined && $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.length > 0 ){
            $scope.dessert.initValues = initValues();
        }
    });
});

