
app.controller('FavorisCtrl', function ($scope,
        $q,
        $state,
        $rootScope,
        CommandeService,
        CommandeBoissonService,
        CommandeDessertService,
        CommandeParamService,
        PlatsService,
        SauceCommandeService) {

    autorisationCommander();

    //Gestion de l'autorisation a commander 
    $scope.autorise = {};
    $scope.autorise.autoriseToCommande = true;
    $scope.autorise.color = "button-balanced";
    $scope.autorise.message = "";
    $scope.commande = {};
    $scope.commande.id = null;
    $scope.listeCommandes = JSON.parse(window.localStorage.getItem("favoris")) || [];


    function autorisationCommander(){ // utilis� pour savoir si l'utilisateur peu commander ou non ? et le message a afficher
        CommandeParamService.all().then(function(resultParamOnline){
            $scope.autorise.autoriseToCommande = resultParamOnline.data.data[0].accesCommander;
            $scope.autorise.message = resultParamOnline.data.data[0].message;

            if($rootScope.user.nbCmdSignaler > 3){
                $scope.autorise.autoriseToCommande = false;
                $scope.autorise.message = "Tu n'est pas venu chercher ta commande 3 fois de suite, tu pensais nous niquer ? Viens au bde pour en parler :) ";
            }

            if($scope.autorise.autoriseToCommande)
                $scope.autorise.color = "button-balanced";
            else
                $scope.autorise.color = "button-dark";


        }, function(error){
            console.log("we are out brah");

            if($rootScope.user.nbCmdSignaler > 3){
                $scope.autorise.autoriseToCommande = false;
                $scope.autorise.message = "Tu n'est pas venu chercher ta commande 3 fois de suite, viens voir les BDE pour en parler";
            }
            if($rootScope.user.nbCmdSignaler == 2){
                $scope.autorise.autoriseToCommande = true;
                $scope.autorise.message = "Tu n'es pas venu chercher 2 commandes, fais attention !";
            }
            if($rootScope.user.nbCmdSignaler == 1){
                $scope.autorise.autoriseToCommande = true;
                $scope.autorise.message = "Si tu ne viens pas chercher ta commande 3 fois, tu ne pourras plus commander chez nous ! Ou viens au bde pour les payer ";
            }

            if($scope.autorise.autoriseToCommande)
                $scope.autorise.color = "button-balanced";
            else
                $scope.autorise.color = "button-dark";



        });

    }




    function updateCommande() {
            var id = $scope.commande.id;
           $scope.commande =  $scope.listeCommandes[$scope.commande.id];
           $scope.commande.id = id;
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
            $rootScope.user.commande = {"plats": [], "boissons": [], "desserts": [], "statut": "Non validé", "date": (new Date())};
        });
    }



    function submit() {
        /*Méthode fixé au bouton valider elle envoi la commande stocké dans la rootScope*/

        $rootScope.user.commande.prix = $scope.commande.prix;
        $rootScope.user.commande.user = $rootScope.user.id;
            if($scope.autorise.autoriseToCommande){ //Validation uniquement si user autoris�
                var createByAdmin = $rootScope.user.commande;
                envoiCommande($scope.listeCommandes[$scope.commande.id]);
                
                //si la commande a �t� cr�er par un admin dans l'onglet admin
                if(createByAdmin.admin){
                    //envoyer la commande en local
                    $rootScope.newCommande = createByAdmin;
                    $state.go('tab.commande');
                }
                else{
                    $state.go('tab.menu');
                }
            }



    }



    function annuler() {
        if (confirm('Voulez-vous vraiment annuler la commande?')) {
            $rootScope.user.commande = {"plats": [], "boissons": [], "desserts": [], "statut": "Non validé", "date": (new Date())};
            $state.go('tab.menu');
        }
    }

    $scope.commande.submit = submit; // lors du clique sur le boutton valider
    $scope.commande.annuler = annuler;
    //$scope.classe = classes; // fonction qui nous donne des infos sur la présence ou non de boissons, desserts et plats pour mettre a jour les infos visible sur la page commande
    $scope.updateCommande = updateCommande; // On actualise le prix de la commande en fonction des tableaux stockés dans le rootscope


	

});
