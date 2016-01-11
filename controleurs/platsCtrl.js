  app.controller('PlatsCtrl', function($scope, $state, $rootScope, PlatsService) {

  	$scope.plats = {};
  	$scope.choix = {}; // Tout les choix possible sont préchargé ici
  	$scope.plats = {"isSandwich": false, "isPlatPrep": false};

	$scope.nouveauPlat = function(){
		
		//Quand l'utilisateur clique sur nouvelle commande on fabrique un objet vide et on incrémente l'id local de la commande

		$rootScope.user.currentCommande = $rootScope.user.currentCommande +1;

		//Et on navigue vers la page souhaité
		$state.go('tab.commande');
	}

	function getAllPossibilites(){
		//Récupère tous les choix possible (sauce, plats, ingredients)
		getAllSauces();
		getAllPlatsPrepare();
	}

	function getAllSauces(){
		PlatsService.updateBase("listesauces");
		PlatsService.all().then(function(resultatSauces){
			$scope.choix.sauces = resultatSauces.data.data;
		});
	}

	function getAllIngredients(){

	}

	function getAllPlatsPrepare(){
		PlatsService.updateBase("listeplatsprepare");
		PlatsService.all().then(function(resultatPlatsPrepare){
			$scope.choix.platsPrepares = resultatPlatsPrepare.data.data;
		});
	}
	
	$scope.getAllPossibilites = getAllPossibilites();



})