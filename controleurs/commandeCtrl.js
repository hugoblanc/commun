  
app.controller('CommandeCtrl', function ($scope,
										 $q,
										 $state,
										 $rootScope,
										 CommandeService,
										 CommandeBoissonService,
										 CommandeDessertService,
										 PlatsService,
										 SauceCommandeService){

	$scope.commande = {};
	$scope.user.nbBoisson = 0;
	$scope.user.nbPlats = 0;
	$scope.user.nbDesserts = 0;
	$scope.commande.prix = 0.0;



	function classes(type){
		if($rootScope.user.commandes != null &&
		 $rootScope.user.currentCommande >=0 &&
		  $rootScope.user.commandes[$rootScope.user.currentCommande].boissons != undefined &&
		   $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length > 0 &&
		   type=="boisson" ){
			$scope.user.nbBoisson = $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length;
			return{'isSelected' :true};
		}

		if ($rootScope.user.commandes != null &&
		 $rootScope.user.currentCommande >=0 &&
		 $rootScope.user.commandes[$rootScope.user.currentCommande].desserts != undefined &&
         $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.length > 0 && 
         type =="dessert") {
	        $scope.user.nbDesserts = $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.length;
			return{'isSelected' :true};
		} 

		if ($rootScope.user.commandes != null &&
		 $rootScope.user.currentCommande >=0 &&
		 $rootScope.user.commandes[$rootScope.user.currentCommande].plats != undefined &&
            $rootScope.user.commandes[$rootScope.user.currentCommande].plats.length > 0 && 
            type=="plat") {
	        $scope.user.nbPlats = $rootScope.user.commandes[$rootScope.user.currentCommande].plats.length;
			return{'isSelected' :true};
		} else {
			return {'isSelected': false};
		}

	}


	// function classes() {
	//     //if ($rootScope.user.commandes != null && $rootScope.user.currentCommande >= 0) {
	//     if ($rootScope.user.commandes[$rootScope.user.currentCommande].boissons != undefined &&
 //            $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length > 0) {

	//         $scope.user.nbBoisson = $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length;
	//         return { 'boissonSelected': true };

	//     }


	// };




	//J'ai transféré ce code dans la page précédente (menu) a voir si il faut garder la fonction ou pas ...
	//Crer en rootScope un objet qui correspond à la commande actuelle
	function createCommande(userId){
		/*******Schema NoSQL*********
		var newCommande = {
			"user": userId,
			"date": (new Date()),
			"statut": "Non validé"
		};

		*/

	}

	//Préparer la commande anvant l'envoi en base (check quoi envoyer)
	// function preparCommande(){
	// 	var currentCommande = $rootScope.user.commandes[$rootScope.user.currentCommande];
		
	// 		var newCommande = {
	// 		"user": $rootScope.user.id,
	// 		"date": currentCommande.date,
	// 		"statut": "Envoyé"
	// 	};
	// 	return currentCommande;

	// }



	function controleCommande(currentCommande){
		
		//fabrique un tableau qui contient les informations sur la présence ou non des éléments si dessous
		var resultControl = {"plats": false,
							 "boissons": false,
							 "desserts": false};

		if(currentCommande.boissons.length > 0 
			|| currentCommande.plats.length > 0 
			|| currentCommande.desserts.length > 0){
			if(currentCommande.boissons.length > 0){
				resultControl.boissons = true;
			}
			if(currentCommande.plats.length > 0){
				resultControl.plats = true
			}
			if(currentCommande.desserts.length > 0){
				resultControl.desserts = true;
			}
			return resultControl;
		}
	}



	function envoiBoissons(boissons, commandeId){

		/********Forme de l'objet a envoyer a la base ********

		var newBoisson = { 
			"name": boissons.name,
			"prix": boissons.prix,
			"commande": commandeId
		};*/


		for(var i =0; i < boissons.length; i++){

			// On assigne l'ID de la commande créé en base, cette id est utilisé pour retrouvé a qui appartient la boisson dans la base
			boissons[i].commande = commandeId; 


			//Block ci dessous à décommenter pour envoyer les boissons pour de vrai, fanant de supprimer les objet un par un dans la base
			CommandeBoissonService.create(boissons[i]).then(function(resultatBoissons){
				console.log("n°"+(i+1));
				//dfd.resolve(resultatBoissons);
			});
		}

	}

	function envoiPlats(plats, commandeId){
		/* Model du format du plat

		{
			"name": "string",
			"prix": "number",
			"commande": "parent"
		}   */

		var plat = {
			"name": "string",
			"prix": "number",
			"commande": commandeId
		};



		for(var i=0; i<plats.length ; i++){
			plats[i].commande = commandeId;
			plats[i].localId = i;
			PlatsService.create(plats[i]).then(function(resultatPlat){

				var idCurrentPlat = resultatPlat.data.__metadata.id;
				var idLocalCurrentPlat = resultatPlat.config.data.localId;

				//resultatPlat.config.data.type

				if(resultatPlat.config.data.type == "sandwich"){
					envoiIngredients(plats[idLocalCurrentPlat],
					 commandeId,
					  idCurrentPlat);
				}
				//envoiIngredients()
				console.log("That's a test bro");
			});
		}

	}

	function envoiIngredients(sandwich, commandeId, platId){
		/* Model de donné pour sauce
		{
			"name": "string",
			"plat": "parent"
		}*/

			var sauces = sandwich.sauce;


			if(sandwich.type != undefined && sandwich.type == "sandwich"){
				for(var j =0; j < sauces.length ; j++){
					sauces[j].plat = platId;
					SauceCommandeService.create(sauces[j]).then(function(resultIngredients){
						console.log("We're in bro ! ");
					})
				}
			} 
	}


	function envoiDesserts(desserts, commandeId) {

	    for (var i = 0; i < desserts.length; i++) {
	        desserts[i].commande = commandeId;
	        CommandeDessertService.create(desserts[i]).then(function(resultatDesserts){
	        	console.log("Desserts on brah ");
	        });
	    }
	}


	function updateCommandePrice(){
		$scope.commande.prix = 0;
		if($rootScope.user.commandes[$rootScope.user.currentCommande].desserts.prix != undefined && $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.prix > 0 )
			$scope.commande.prix = $rootScope.user.commandes[$rootScope.user.currentCommande].desserts.prix;
		if($rootScope.user.commandes[$rootScope.user.currentCommande].boissons.prix != undefined && $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.prix > 0 )
			$scope.commande.prix = $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.prix + $scope.commande.prix;
		if($rootScope.user.commandes[$rootScope.user.currentCommande].plats.prix != undefined && $rootScope.user.commandes[$rootScope.user.currentCommande].plats.prix > 0 )
			$scope.commande.prix = $rootScope.user.commandes[$rootScope.user.currentCommande].plats.prix + $scope.commande.prix;

	}

	function envoiCommande(currentCommande){
		/*Méthode qui envoi les commande à la partie service
		fonctionne avec une fonction controleCOmmande qui fabrique un tableau de boolean
		en fonction de la présence ou non d'éléments dans les tableaux: 
		-boissons
		-plats
		-dessert
		*/


		CommandeService.create(currentCommande).then(function(resultCommande){/*Si l'envoi dans la base c'est bien passé 
			alors on envoi le reste (boissons, desserts, plats)*/


			$rootScope.user.IDcurrentCommande = resultCommande.data.__metadata.id; // récupération de l'id de la commande qui vient d'être crée
			$rootScope.user.commandes[$rootScope.user.currentCommande].id = resultCommande.data.__metadata.id;
			var controlMethode = controleCommande(currentCommande);	//On check quels éléments sont présent dans notre commande: boissons ? desserts ? plats ? 
			//Objet JSON retourné avec trois champs boolean : boissons desserts, et plats

			if(controlMethode.boissons == true){
				envoiBoissons(currentCommande.boissons, $rootScope.user.IDcurrentCommande);/*.then(function(retourEnvoiBoissons){
					console.log("L'envoi des boissons est une reussite");
				});*/
			}
			if(controlMethode.desserts == true){
				envoiDesserts(currentCommande.desserts, $rootScope.user.IDcurrentCommande);
			}
			if(controlMethode.plats == true){
				envoiPlats(currentCommande.plats, $rootScope.user.IDcurrentCommande);
			}
		});
	}

	function changeViewPlats(){
		if($rootScope.user.commandes[$rootScope.user.currentCommande].plats != undefined && $rootScope.user.commandes[$rootScope.user.currentCommande].plats.length > 0)
			$state.go('tab.newplats');
		else
			$state.go('tab.plats');
	}

	function submit(){
		/*Méthode fixé au bouton valider elle envoi la commande stocké dans la rootScope
		elle appel pour cela envoi commande qui appel:
		- envoiBoissons
		- envoiPlats
		- envoiDesserts*/

		var currentCommande = $rootScope.user.commandes[$rootScope.user.currentCommande];
		$rootScope.user.commandes[$rootScope.user.currentCommande].prix = $scope.commande.prix;
	    envoiCommande(currentCommande);
	    $state.go('tab.menu');
	}

	function annuler(){

		$rootScope.user.commandes.pop();
		$rootScope.user.currentCommande = $rootScope.user.currentCommande +1;
	    $state.go('tab.menu');
	}

	$scope.commande.creerCommande = createCommande($rootScope.user.id); //tranféré dans la page précédente (menu) car plus logique de créer la commande au moment de l'appuie sur "nouvelle commande"
	$scope.commande.submit = submit; // lors du clique sur le boutton valider
	$scope.annuler = annuler;
	$scope.changeViewPlats = changeViewPlats; // Les plats sont complexe a gérer, si non null on va sur une page de gestion si null on va sur la page d'ajout
	$scope.classe = classes; // fonction qui nous donne des infos sur la présence ou non de boissons, desserts et plats pour mettre a jour les infos visible sur la page commande
	$scope.majCommandePrice = updateCommandePrice(); // On actualise le prix de la commande en fonction des tableaux stockés dans le rootscope
});
