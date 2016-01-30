  app.controller('NewPlatsCtrl', function($scope, $state, $rootScope, $q, PlatPrepService, SaucesService) {


  	$scope.plats = $rootScope.user.commande.plats;

  	function deletePlat(plat){
  		$scope.plats.splice($scope.plats.indexOf(plat), 1);
  	}

  	function addPlat(){
  		$rootScope.user.commande.plats = $scope.plats;
  		$state.go('tab.plats');
  	}

  	function submit(){
  		$rootScope.user.commande.plats = $scope.plats;
  		$state.go('tab.commande');
  	}

  	$scope.deletePlat = deletePlat;
  	$scope.addPlat = addPlat;
  	$scope.submit = submit;
});