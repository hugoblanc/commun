  app.controller('PlatsCtrl', function($scope, $state, $rootScope, PlatPrepService, SaucesService) {

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

		SaucesService.all().then(function(resultatSauces){
			$scope.choix.sauces = resultatSauces.data.data;
		});
	}

	function getAllIngredients(){

	}

	function getAllPlatsPrepare(){
		PlatPrepService.all().then(function(resultatPlatsPrepare){
			$scope.choix.platsPrepares = resultatPlatsPrepare.data.data;
		});
	}

	function submit(liste, type){

		//On commence par selectionner uniquement les items selectionné
		var listeItemsSelected = itemsSelected(liste);

		if(type == "sauces"){//Si il s'agit de sauces alors un seul plat est créé
			$rootScope.user.commandes[$rootScope.user.currentCommande].plats.push({
				"name":"hotdog",
				"type":"sandwich",
				"prix": 1.50,
				"sauce":listeItemsSelected
			});
		} else if (type == "platsPrep"){/* Si il s'agit de plat préparé alors on ajout
			un plat pour chaque case du tableau plats[]  de rootscope*/

			for(var j = 0 ; j < listeItemsSelected.length ; j++){
				$rootScope.user.commandes[$rootScope.user.currentCommande].plats.push({
					"type":"platsPrep",
					"name": listeItemsSelected[j].name,
					"prix": listeItemsSelected[j].prix
				});
			}
		}

		$state.go('tab.commande');
	}

	function itemsSelected(liste){
		var result = [];
		for(var i = 0; i < liste.length; i++){
    		if(liste[i].isChecked){
    			result.push(liste[i]);
    		}
    	}
    	return result;
	}



	
	$scope.getAllPossibilites = getAllPossibilites();
	$scope.plats.submit = submit;



})