app.controller('DessertCtrl', function ($scope, $q, $stateParams, $state, DessertService, $rootScope, GlobalItems) {
    $scope.dessert = {};
    $scope.dessert.currentPrice = 0;
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


    function majPriceDesserts(desserts){
        if(desserts != undefined){
            var dessertsSelected = dessertsChecked(desserts.desserts);
            $scope.dessert.currentPrice =  GlobalItems.arrondiDixiem(GlobalItems.majValueItems(dessertsSelected));
        }
    }


    function getAll() {
        var dfd = $q.defer();
        DessertService.all().then(function (result) {
            $scope.dessert.desserts = result.data.data;

            for(var i = 0 ; i < $scope.dessert.desserts.length ; i++){
                $scope.dessert.desserts[i].prix = GlobalItems.arrondiDixiem($scope.dessert.desserts[i].prix); // on arrondi au dixieme près 
            }
            dfd.resolve($scope.dessert.desserts);
        }, function(raison){
            dfd.reject(raison);
        });

        return dfd.promise;
    }




    function submit(desserts) {
        var dessertsSelected = dessertsChecked(desserts.desserts);
        $rootScope.user.commandes[$rootScope.user.currentCommande].desserts = dessertsSelected;
        $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.prix = $scope.dessert.currentPrice;
        $state.go('tab.commande');
    }

    $scope.dessert.submit = submit;
    $scope.dessert.getAll = getAll().then(function(resultDessertsGetAll){
        if($rootScope.user.commandes[$rootScope.user.currentCommande] != undefined && $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.length > 0 ){
            $scope.dessert.initValues = initValues();
        }
    });
    $scope.majPriceDesserts = majPriceDesserts;
});

