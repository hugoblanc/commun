
app.controller('AdminCommandeCtrl', function ($scope, $state, CommandeService, ServiceLogin, $timeout, $rootScope) {

    function init() {
        //stock les commandes
        $scope.commandes = [[], [], []];
        
        //permet de trier les commandes
        $scope.ordreCommande = {};
        $scope.nbCommande = [0, 0, 0];
        
        //utiliser pour rafraichir
        $scope.lastCommande = 0;
        
        //declencher le rafraichissement des commandes toute les 30 sec
        $timeout(function () {
            refreshCommande();
        }, 30000);
    }
    
    //r�cuperer toutes les commandes
    //appeler a l'affichage de la page
    function getAll() {
        CommandeService.getAllCommandes()
                .then(function (result) {
                    $scope.commandesId = result.data.data;
                    //boucle sur toutes les commandes pour avoir les d�tails
                    $scope.commandesId.forEach(function (commande) {
                         getDetailCommande(commande);
                    });
                }, function (data) {
                    console.log(data);
                });
    };

    //stock dans $scope.commandes les d�tails d'une commande mis en param�tres
    function getDetailCommande(commande) {
        //s'il n'y a pas de colonne assigner a la commande on l'a met
        //a la premi�re
        if (commande.colonne === null) {
            commande.colonne = 0;
        }
        //mettre a jour les objets aider aux tris
        $scope.ordreCommande[commande.id] = $scope.nbCommande[commande.colonne];
        $scope.nbCommande[commande.colonne]++;
        $scope.lastCommande = commande.id;

        //appeler le service pour recuperer les d�tails
        CommandeService.getCommandesDetail(commande.id)
                .then(function (result) {
                    if (result.data.colonne === "") {
                        result.data.colonne = 0;
                    }
                    //si la commande � �t� rentr� par un admin
                    if(result.data.user === ""){
                        result.data.user = {'firstName' : "Local" };
                    }
                    var y = $scope.ordreCommande[commande.id];
                    $scope.commandes[result.data.colonne][y] = result.data;
                }, function (data) {

                });
    }

    //on passe le status de la commande � prete en ligne et en local
    $scope.commandePrete = function (commande) { 
        CommandeService.update(commande.id, {"statut": "pret"})
                .then(function () {
                    commande.statut = "pret";
                }, function (error) {

                });
    };

    //permet d'afficher ou non le d�tail des commandes pour celles pr�tes
    $scope.afficherCommande = function (commande, afficher) {
        commande.afficher = afficher;
    };

    //supprimer la commande de la base et met a jour les variables en local
    $scope.validerCommande = function (commande) {
        var colonne = commande.colonne;
        CommandeService.delete(commande.id)
                .then(function () {
//                    $scope.commandes[$scope.ordreCommande[commande.id]] = null;
                    $scope.commandes[colonne].splice($scope.ordreCommande[commande.id], 1);
                    delete $scope.ordreCommande[commande.id];
                    $scope.nbCommande[colonne] = 0;
                    $scope.commandes[colonne].forEach(function (commande) {
                        $scope.ordreCommande[commande.id] = $scope.nbCommande[colonne];
                        $scope.nbCommande[colonne]++;
                    });
                }, function (error) {

                });
    };

    //d�clencher lorsque l'on souhait supprimer une commande sans la valid�
    $scope.deleteCommande = function (commande) {
        if (confirm('Voulez-vous vraiment supprimer cette commande?')) {
            $scope.validerCommande(commande);
        }
    };

    //permet de signaler qu'une personne n'a pas pris sa commande
    //et supprime la commande
    $scope.signalerCommande = function (commande) {
        if (confirm("Etes vous sûr de vouloir signaler que " + commande.user.firstName + " " + commande.user.lastName + " n'a pas récupéré sa commande?")) {
            ServiceLogin.update(commande.user.id, {"nbCmdSignaler": commande.user.nbCmdSignaler + 1})
                    .then(function () {
                        commande.statut = "pret";
                    }, function (error) {

                    });
            $scope.validerCommande(commande);
        }
    };

    //met a jour l'affiche en r�cup�rer les commande manquante en ligne
    //d�clencher toutes les 30 secondes
    function refreshCommande() {
        console.log("aa");
        CommandeService.getCommandesSup($scope.lastCommande)
                .then(function (result) {
                    var newCommande = result.data;
                    newCommande.forEach(function (commande) {
                        getDetailCommande(commande);
                    });
                }, function (error) {

                });
        $timeout(function () {
            refreshCommande();
        }, 30000);
    }
    
    $scope.ajouterCommande = function(){
        $rootScope.user.commande = {"plats":[], "boissons": [], "desserts": [], "statut": "Non validé", "date": (new Date()), "admin" : true};
        $state.go('tabO.commande'); 
    };

    //fonction ex�cut�e a l'affichage
    init();
    $scope.getAll = getAll();

});

