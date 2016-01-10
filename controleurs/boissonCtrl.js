  app.controller('BoissonCtrl', function($scope, $stateParams, $state, BoissonService, CommandeBoissonService, $rootScope) {
	$scope.boisson ={};
	var userStocked =  JSON.parse(window.localStorage.getItem("currentUser"));
	
		function boissonsChecked(boissons){
			var result = [];
			for(var i = 0; i < boissons.length; i++){
        		if(boissons[i].isChecked){
        			result.push(boissons[i]);
        		}
        	}
        	return result;
		}

        function getAll() {
            BoissonService.all()
                .then(function (result) {
                    $scope.boisson.boissons = result.data.data;
                }, function(raison) {
				  console.log('In your face brah !');
				});
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
        $scope.boisson.getAll = getAll();

});