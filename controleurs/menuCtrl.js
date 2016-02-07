app.controller('MenuCtrl', function ($scope, $state, $rootScope, CommandeService, GlobalItems) {
    $scope.commandes = [];



    $scope.nouvelleCommande = function () {
        $rootScope.user.commande = {"plats": [], "boissons": [], "desserts": [], "statut": "Non validé", "date": (new Date())};
        //Et on navigue vers la page souhaité
        $state.go('tab.commande');
    };



    function displayInformation(commande) {

        var informationCommande = 'Commande N°' + commande.id + '  à ';
        informationCommande = informationCommande + commande.date.getHours() + "h" + commande.date.getMinutes() + '  ';

        if (commande.plats[0] != undefined)
            informationCommande = informationCommande + commande.plats[0].name;
        else if (commande.desserts[0] != undefined)
            informationCommande = informationCommande + commande.desserts[0].name;
        else if (commande.boissons[0] != undefined)
            informationCommande = informationCommande + commande.boissons[0].name;

        informationCommande = informationCommande + '    ' + GlobalItems.arrondiDixiem(commande.prix) + '€';
        return informationCommande;
    }

    function getUserCommandes() {
        CommandeService.getUserCommandes($rootScope.user.id)
                .then(function (result) {
                    $scope.commandes = [];
                    result.data.data.forEach(function (commande) {
                        CommandeService.getCommandesDetail(commande.id)
                                .then(function (result) {
                                    result.data.date = new Date(result.data.date);
                                    $scope.commandes.push(result.data);
                                });
                    });
                },
                        function () {
                            $scope.showMessage("Impossible de chargé vos commandes", false);
                        });
    }

    $scope.displayInformation = displayInformation;
    $scope.getUserCommandes = getUserCommandes();
});
