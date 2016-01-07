angular.module('starter.controllers', ["ui.router", ])

.controller('DashCtrl', function ($scope){

})

.controller('FriendsCtrl', function($scope, $state) {
	var test = 25;
	$scope.changeView = function($state){
		$state.go('tab.account');
	}
})


.controller('MenuCtrl', function($scope, $state, $rootScope) {

	$scope.nouvelleCommande = function(){
		
		//Quand l'utilisateur clique sur nouvelle commande on fabrique un objet vide et on incrémente l'id local de la commande

		$rootScope.user.commandes.push( {"plats":[],
										"boissons": [],
										"desserts": [],
										"statut": "Non validé",
										"date": (new Date())});

		$rootScope.user.currentCommande = $rootScope.user.currentCommande +1;

		//Et on navigue vers la page souhaité
		$state.go('tab.commande');
	}
})

.controller('CommandeCtrl', function($scope, $q, $state, $rootScope, CommandeService, CommandeBoissonService) {
	$scope.commande = {};
	$scope.user.nbBoisson = 0;
	$scope.user.nbPlats = 0;
	$scope.user.nbDesserts = 0;


	//
	function classes(){
		if($rootScope.user.commandes != null &&
		 $rootScope.user.currentCommande >=0 &&
		  $rootScope.user.commandes[$rootScope.user.currentCommande].boissons != undefined &&
		   $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length > 0){

			$scope.user.nbBoisson = $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length;
			return{'isSelected' :true};
		} else {
			return {'isSelected': false};
		}
	};




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
			|| currentCommande.desserts){
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
			/*CommandeBoissonService.create(boissons[i]).then(function(resultatBoissons){
				console.log("n°"+(i+1));
				//dfd.resolve(resultatBoissons);
			});*/
		}

	}

	function envoiCommande(currentCommande){
		/*Méthode qui envoi les commande à la partie service
		fonctionne avec une fonction controleCOmmande qui fabrique un tableau de boolean
		en fonction de la présence ou non d'éléments dans les tableaux: 
		-boissons
		-plats
		-dessert*/

		CommandeService.create(currentCommande).then(function(resultCommande){/*Si l'envoi dans la base c'est bien passé 
			alors on envoi le reste (boissons, desserts, plats)*/


			$rootScope.user.IDcurrentCommande = resultCommande.data.__metadata.id; // récupération de l'id de la commande qui vient d'être crée

			var controlMethode = controleCommande(currentCommande);	//On check quels éléments sont présent dans notre commande: boissons ? desserts ? plats ? 
			//Objet JSON retourné avec trois champs boolean : boissons desserts, et plats

			if(controlMethode.boissons == true){
				envoiBoissons(currentCommande.boissons, $rootScope.user.IDcurrentCommande);/*.then(function(retourEnvoiBoissons){
					console.log("L'envoi des boissons est une reussite");
				});*/
			}
			if(controlMethode.desserts == true){
				//Creer envoiDesserts
			}
			if(controlMethode.plats == true){
				//creer envoiPlats
			}
		});
	}

	function submit(){
		/*Méthode fixé au bouton valider elle envoi la commande stocké dans la rootScope
		elle appel pour cela envoi commande qui appel:
		- envoiBoissons
		- envoiPlats
		- envoiDesserts*/

		var currentCommande = $rootScope.user.commandes[$rootScope.user.currentCommande];
	    envoiCommande(currentCommande);
	    $state.go('tab.menu', {}, {reload: true});
	}

	$scope.commande.creerCommande = createCommande($rootScope.user.id); //tranféré dans la page précédente (menu) car plus logique de créer la commande au moment de l'appuie sur "nouvelle commande"
	$scope.commande.submit = submit; // lors du clique sur le boutton valider
	$scope.classe = classes; // fonction qui nous donne des infos sur la présence ou non de boissons, desserts et plats pour mettre a jour les infos visible sur la page commande
})


.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('MainCtrl', function($scope, $stateParams) {

})

.controller('BoissonCtrl', function($scope, $stateParams, $state, BoissonService, CommandeBoissonService, $rootScope) {
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

})

.controller('AccountCtrl', function($scope) {

});

