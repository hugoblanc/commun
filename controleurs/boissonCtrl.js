  app.controller('BoissonCtrl', function($scope, GlobalItems,  $stateParams, $q, $state, BoissonService, CommandeBoissonService, $rootScope) {
	$scope.boisson ={};
    $scope.boisson.boissons = [];
    $scope.boisson.currentPrice = 0.0;
    //$rootScope.user.commandes[$rootScope.user.currentCommande].boissons = [];
	var userStocked =  JSON.parse(window.localStorage.getItem("currentUser"));


	
        function initValues(){
            for(var i = 0; i < $scope.boisson.boissons.length; i++){
                for(var j=0; $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length > j ;j++){
                    if($scope.boisson.boissons[i].name == $rootScope.user.commandes[$rootScope.user.currentCommande].boissons[j].name){
                        $scope.boisson.boissons[i].isChecked = true;
                    }
                }
            }
            majPriceBoissons($scope.boisson);
        }

		function boissonsChecked(boissons){
			var result = [];
			for(var i = 0; i < boissons.length; i++){
        		if(boissons[i].isChecked){
        			result.push(boissons[i]);
        		}
        	}
        	return result;
		}


        function majPriceBoissons(boissons){
            if(boissons != undefined){
                var boissonsSelected = boissonsChecked(boissons.boissons);
                $scope.boisson.currentPrice =  GlobalItems.majValueItems(boissonsSelected);
            }
        }



        function getAll() {
            var dfd = $q.defer();
            BoissonService.all()
                .then(function (result) {
                    $scope.boisson.boissons = result.data.data;
                    dfd.resolve(result.data.data);
                }, function(raison) {
				  console.log('In your face brah !');
                  dfd.reject(raison);
				});

                return dfd.promise;
            }

        function submit(boissons){
        	var boissonsSelected = boissonsChecked(boissons.boissons);


        	$rootScope.user.commandes[$rootScope.user.currentCommande].boissons = boissonsSelected;
        	$state.go('tab.commande');


        	// CommandeBoissonService.create(boissonsSelected).then(function(result){
        	// 	console.log("correcte ! ");
        	// });
        }

        


        $scope.boisson.submit = submit;
        $scope.boisson.getAll = getAll().then(function(resultGetAll){
            if($rootScope.user.commandes[$rootScope.user.currentCommande] != undefined && $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length > 0 ){
                $scope.boisson.initValues = initValues();
            }
        });
        $scope.majPriceBoissons = majPriceBoissons;

});