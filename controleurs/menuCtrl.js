  app.controller('MenuCtrl', function($scope, $state, $rootScope) {

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