
app.controller('CommandeCtrl', function ($scope,
        $q,
        $state,
        $rootScope,
        CommandeService,
        CommandeBoissonService,
        CommandeDessertService,
        PlatsService,
        SauceCommandeService) {

    $scope.commande = {};
    $scope.user.nbBoisson = 0;
    $scope.user.nbPlats = 0;
    $scope.user.nbDesserts = 0;
    $scope.commande.prix = 0.0;



    function classes(type) {
        if ($rootScope.user.commandes != null &&
                $rootScope.user.commande.boissons.length > 0 &&
                type == "boisson") {
            $scope.user.nbBoisson = $rootScope.user.commande.boissons.length;
            return{'isSelected': true};
        }

        if ($rootScope.user.commandes != null &&
                $rootScope.user.commande.desserts.length > 0 &&
                type == "dessert") {
            $scope.user.nbDesserts = $rootScope.user.commande.desserts.length;
            return{'isSelected': true};
        }

        if ($rootScope.user.commandes != null &&
                $rootScope.user.commande.plats.length > 0 &&
                type == "plat") {
            $scope.user.nbPlats = $rootScope.user.commande.plats.length;
            return{'isSelected': true};
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
    function createCommande(userId) {
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


    function updateCommandePrice() {
        $scope.commande.prix = 0;
        if ($rootScope.user.commande.desserts.prix > 0)
            $scope.commande.prix = $rootScope.user.commande.desserts.prix;
        if ($rootScope.user.commande.boissons.prix > 0)
            $scope.commande.prix = $rootScope.user.commande.boissons.prix + $scope.commande.prix;
        if ($rootScope.user.commande.plats.prix > 0)
            $scope.commande.prix = $rootScope.user.commande.plats.prix + $scope.commande.prix;


    }

    function envoiCommande(currentCommande) {
        /*Méthode qui envoi les commande à la partie service
         fonctionne avec une fonction controleCOmmande qui fabrique un tableau de boolean
         en fonction de la présence ou non d'éléments dans les tableaux: 
         -boissons
         -plats
         -dessert
         */

        CommandeService.createCommande(currentCommande).then(function (resultCommande) {/*Si l'envoi dans la base c'est bien passé 
         alors on envoi le reste (boissons, desserts, plats)*/
            $rootScope.user.commande.id = resultCommande.data.__metadata.id;
            $rootScope.user.commandes.push($rootScope.user.commande);
            $rootScope.user.commande = {"plats": [], "boissons": [], "desserts": [], "statut": "Non validé", "date": (new Date())};
        });
    }

    function changeViewPlats() {
        if ($rootScope.user.commande.plats.length > 0)
            $state.go('tab.newplats');
        else
            $state.go('tab.plats');
    }

    function submit() {
        /*Méthode fixé au bouton valider elle envoi la commande stocké dans la rootScope*/

        $rootScope.user.commande.prix = $scope.commande.prix;
        $rootScope.user.commande.user = $rootScope.user.id;
        var createByAdmin = $rootScope.user.commande;
        envoiCommande($rootScope.user.commande);
        
        //si la commande a �t� cr�er par un admin dans l'onglet admin
        if(createByAdmin.admin){
            //envoyer la commande en local
            $rootScope.newCommande = createByAdmin;
            $state.go('tabAdmin.commande');
        }
        else{
            $state.go('tab.menu');
        }
        
    }

    function annuler() {
        if (confirm('Voulez-vous vraiment annuler la commande?')) {
            $rootScope.user.commande = {"plats": [], "boissons": [], "desserts": [], "statut": "Non validé", "date": (new Date())};
            $state.go('tab.menu');
        }
    }

    $scope.commande.creerCommande = createCommande($rootScope.user.id); //tranféré dans la page précédente (menu) car plus logique de créer la commande au moment de l'appuie sur "nouvelle commande"
    $scope.commande.submit = submit; // lors du clique sur le boutton valider
    $scope.commande.annuler = annuler;
    $scope.changeViewPlats = changeViewPlats; // Les plats sont complexe a gérer, si non null on va sur une page de gestion si null on va sur la page d'ajout
    $scope.classe = classes; // fonction qui nous donne des infos sur la présence ou non de boissons, desserts et plats pour mettre a jour les infos visible sur la page commande
    $scope.majCommandePrice = updateCommandePrice(); // On actualise le prix de la commande en fonction des tableaux stockés dans le rootscope
});
