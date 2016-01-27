  app.controller('PlatsCtrl', function($scope,
									   $state,
									   $rootScope,
									   $q,
									   PlatPrepService,
									   SaucesService){

  	$scope.plats = {};
  	$scope.choix = {}; // Tout les choix possible sont préchargé ici
  	$scope.plats = {"isSandwich": false, "isPlatPrep": false};


  	function initValues(){
  		var plats = $rootScope.user.commandes[$rootScope.user.currentCommande].plats;
  		if(plats != undefined){
  			if(plats.length > 0 && plats[plats.length - 1 ].type == "sandwich"){
  				$scope.plats.isSandwich = true;

  				for(var i = 0 ; i < $scope.choix.sauces.length ; i++){
  					for(var j = 0 ; j < plats[plats.length - 1 ].sauce.length; j++){
  						if(plats[plats.length - 1 ].sauce[j].name == $scope.choix.sauces[i].name)
  							$scope.choix.sauces[i].isChecked = true;
  					}
  				}
  			} else if (plats.length > 0 && plats[plats.length - 1 ].type == "platsPrep"){
  				$scope.plats.isSandwich = false;

  				for(var i = 0 ; i < $scope.choix.platsPrepares.length ; i++){
  					for(var j = 0 ; j < plats.length; j++){
  						console.log("test");
  						if(plats[j].name == $scope.choix.platsPrepares[i].name)
  							$scope.choix.platsPrepares[i].isChecked = true;
  					}
  				}

  			}
  		}
  	}


	$scope.nouveauPlat = function(){
		
		//Quand l'utilisateur clique sur nouvelle commande on fabrique un objet vide et on incrémente l'id local de la commande

		$rootScope.user.currentCommande = $rootScope.user.currentCommande +1;

		//Et on navigue vers la page souhaité
		$state.go('tab.commande');
	}

	function getAllPossibilites(){
		//Récupère tous les choix possible (sauce, plats, ingredients)

		getAllSauces().then(function(retourSauce){
			getAllPlatsPrepare().then(function(){
				initValues();
			});
		});

	}

	function getAllSauces(){
		var dfd = $q.defer();

		SaucesService.all().then(function(resultatSauces){
			$scope.choix.sauces = resultatSauces.data.data;
			dfd.resolve(resultatSauces.data.data);
		}, function(raison){
			dfd.reject(raison);
		});

		return dfd.promise;
	}

	function getAllIngredients(){

	}

	function getAllPlatsPrepare(){
		var dfd = $q.defer();

		PlatPrepService.all().then(function(resultatPlatsPrepare){
			$scope.choix.platsPrepares = resultatPlatsPrepare.data.data;
			dfd.resolve(resultatPlatsPrepare.data.data);
		}, function(raison){
			dfd.reject(raison);
		});

		return dfd.promise;
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

});