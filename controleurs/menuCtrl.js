app.controller('MenuCtrl', function ($scope, $state, $rootScope) {
    $scope.commandes = $rootScope.user.commandes || null;



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

        informationCommande = informationCommande + '    ' + commande.prix + '€';
        return informationCommande;
    }

    $scope.displayInformation = displayInformation;
});