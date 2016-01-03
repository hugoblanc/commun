angular.module('starter.controllers', ["ui.router", ])

.controller('DashCtrl', function ($scope){

})

.controller('FriendsCtrl', function($scope, $state) {
	var test = 25;
	$scope.changeView = function($state){
		$state.go('tab.account');
	}
})

.controller('MenuCtrl', function($scope, $state) {
	var test = 25;
	function changeView(){
		$state.go('tab.account');
	}
})

.controller('CommandeCtrl', function($scope, $state, $rootScope, CommandeService) {
	$scope.commande = {};
	$scope.user.nbBoisson = 0;
	$scope.user.nbPlats = 0;
	$scope.user.nbDesserts = 0;


	function classes(){
		if($rootScope.user.commandes != null && $rootScope.user.commandes[0].boissons != undefined && $rootScope.user.commandes[0].boissons.length > 0){
			$scope.user.nbBoisson = $rootScope.user.commandes[0].boissons.length;
			return{'isSelected' :true};
		} else {
			return {'isSelected': false};
		}
	};

	//Crer en rootScope un objet qui correspond à la commande actuelle
	function createCommande(userId){
		/*******Schema NoSQL*********
		var newCommande = {
			"user": userId,
			"date": (new Date()),
			"statut": "Non validé"
		};

		*/
		$rootScope.user.commandes.push( {"plats":[],
										"boissons": [],
										"desserts": [],
										"statut": "Non validé",
										"date": (new Date())});
		$rootScope.user.currentCommande = $rootScope.user.currentCommande +1;
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

	function envoiCommande(currentCommande){
		/*Méthode qui envoi les commande à la partie service
		fonctionne avec une fonction controleCOmmande qui fabrique un tableau de boolean
		en fonction de la présence ou non d'éléments dans les tableaux: 
		-boissons
		-plats
		-dessert*/

		CommandeService.create(currentCommande).then(function(resultCommande){
			$rootScope.user.currentCommande = resultCommande.data.__metadata.id;
			var controlMethode = controleCommande(currentCommande);
			if(controlMethode.boissons == true){
				envoiBoissons(currentCommande.boissons, $rootScope.user.currentCommande);
			}
			if(controlMethode.desserts == true){
				
			}
			if(controlMethode.plats == true){
				
			}
		});
	}

	function envoiBoissons(boissons, commandeId){

		var newBoisson = {
			"name": boissons.name,
			"prix": boissons.prix,
			"commande": commandeId
		};




	}

	function submit(){
		/*Méthode fixé au bouton valider elle envoi la commande stocké dans la rootScope
		elle appel pour cela envoi commande qui appel:
		- envoiBoissons
		- envoiPlats
		- envoiDesserts*/

		var currentCommande = $rootScope.user.commandes[$rootScope.user.currentCommande];
	    envoiCommande(currentCommande);
	}

	$scope.commande.creerCommande = createCommande($rootScope.user.id);
	$scope.commande.submit = submit;
	$scope.classe = classes;
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

