app.controller('CommandeCtrl', function ($scope,
                                         $q,
                                         $state,
                                         $rootScope,
                                         CommandeService,
                                           CommandeParamService) {


  $scope.commande = {};
  $scope.user.nbBoisson = 0;
  $scope.user.nbPlats = 0;
  $scope.user.nbDesserts = 0;
  $scope.commande.prix = 0.0;

  //variable pour affichage des commandes sur ordi
  //différent afficher des fenetres
  $scope.display = 0;
  if ($rootScope.user.commande.plats.prix == undefined) {
    $rootScope.user.commande.plats.prix = 0;
  }

  autorisationCommander();

  //Gestion de l'autorisation a commander
  $scope.autorise = {};
  $scope.autorise.autoriseToCommande = true;
  $scope.autorise.color = "button-balanced";
  $scope.autorise.message = "";



  $scope.user.nbBoisson = $rootScope.user.commande.boissons.nb;

  $scope.user.nbDesserts = $rootScope.user.commande.desserts.nb;

  $scope.user.nbPlats = $rootScope.user.commande.plats.nb;


  // function classes() {
  //     //if ($rootScope.user.commandes != null && $rootScope.user.currentCommande >= 0) {
  //     if ($rootScope.user.commandes[$rootScope.user.currentCommande].boissons != undefined &&
  //            $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length > 0) {

  //         $scope.user.nbBoisson = $rootScope.user.commandes[$rootScope.user.currentCommande].boissons.length;
  //         return { 'boissonSelected': true };

  //     }

    function autorisationCommander(){ // utilis� pour savoir si l'utilisateur peu commander ou non ? et le message a afficher
        if($rootScope.user.commande.commandeType == "commande"){
            CommandeParamService.all().then(function(resultParamOnline){
                $scope.autorise.autoriseToCommande = resultParamOnline.data.data[0].accesCommander;
                $scope.autorise.message = resultParamOnline.data.data[0].message;

                checkNbCommandeSignal()


            }, function(error){
                console.log("we are out brah");
                checkNbCommandeSignal()
            });

        } else {
            if($rootScope.user.nbCmdSignaler > 3){
                checkNbCommandeSignal();
            }
        }



    }

    function checkNbCommandeSignal(paramsBase){
        if($rootScope.user.nbCmdSignaler > 1){
            $scope.autorise.message = "Tu n'es pas venu chercher ta commande 1 fois, fais attention, à trois tu ne pourra plus rien commander !";
        }

        if($rootScope.user.nbCmdSignaler > 2){
            $scope.autorise.message = "Tu n'es pas venu chercher ta commande 2 fois dernière chance";
        }
        if($rootScope.user.nbCmdSignaler > 3){
            $scope.autorise.autoriseToCommande = false;
            $scope.autorise.message = "Tu n'es pas venu chercher ta commande 3 fois de suite, tu pensais nous niquer ? Viens au BDE pour en parler";
        }


        if($scope.autorise.autoriseToCommande)
            $scope.autorise.color = "button-balanced";
        else
            $scope.autorise.color = "button-dark";
    }




  $scope.updateCommandePrice = function () {
    $scope.commande.prix = 0;
    if ($rootScope.user.commande.desserts.prix > 0)
      $scope.commande.prix = $rootScope.user.commande.desserts.prix;
    if ($rootScope.user.commande.boissons.prix > 0)
      $scope.commande.prix = $rootScope.user.commande.boissons.prix + $scope.commande.prix;
    if ($rootScope.user.commande.plats.prix > 0)
      $scope.commande.prix = $rootScope.user.commande.plats.prix + $scope.commande.prix;


  };

  function envoiCommande(currentCommande) {
    /*Méthode qui envoi les commande à la partie service
     fonctionne avec une fonction controleCOmmande qui fabrique un tableau de boolean
     en fonction de la présence ou non d'éléments dans les tableaux:
     -boissons
     -plats
     -dessert
     */

     if($rootScope.user.commande.commandeType == "commande"){
    CommandeService.createCommande(currentCommande)
      .then(function (resultCommande) {/*Si l'envoi dans la base c'est bien passé
       alors on envoi le reste (boissons, desserts, plats)*/
        $rootScope.user.commande.id = resultCommande.data.__metadata.id;
        resetCommande();
        $scope.showMessage("Commande enregistrée", true);
      }, function () {
        $scope.showMessage("Erreur de connexion a la base", false);
      });
    } else {
        var listeCommandes = JSON.parse(window.localStorage.getItem("favoris") || []) || [];
        listeCommandes.push(currentCommande);
        window.localStorage.setItem("favoris", JSON.stringify(listeCommandes));
    }
  }

    function envoiFavoris(currentCommande) {

        //Ajout d'un favoris dans le local storage

        var listeCommandes = JSON.parse(window.localStorage.getItem("favoris") || []) || [];
        listeCommandes.push(currentCommande);
        window.localStorage.setItem("favoris", JSON.stringify(listeCommandes));
  }

  function submit() {
    /*Méthode fixé au bouton valider elle envoi la commande stocké dans la rootScope*/

    if (!commandeIsEmpty()) {

        if($rootScope.user.commande.commandeType == "commande"){
          $rootScope.user.commande.prix = $scope.commande.prix;
          $rootScope.user.commande.user = $rootScope.user.id;
          var createByAdmin = $rootScope.user.commande;

          var tabs = ["plats", "boissons", "desserts"];
          for (var i = 0; i < tabs.length; i++) {
            var length = $rootScope.user.commande[tabs[i]].length;
            for (var j = 0; j < length; j++) {
              for(k = 0; k< $rootScope.user.commande[tabs[i]][k].nb -1 ; k++){
                $rootScope.user.commande[tabs[i]].push($rootScope.user.commande[tabs[i]][k]);
              }
            }
          }

          envoiCommande($rootScope.user.commande);

          //si la commande a été créer par un admin dans l'onglet admin
          if (createByAdmin.admin) {
            //envoyer la commande en local
            $rootScope.newCommande = createByAdmin;
            $state.go('tabAdmin.commande');
          } else {
            $state.go('tab.menu');
          }
        } else {
            envoiFavoris($rootScope.user.commande);
            $state.go('tab.favoris');
        }
    }
    else {
      $scope.showMessage("Vous ne pouvez pas faire une commande vide", false);
    }

  }

  function annuler() {
    if (!commandeIsEmpty()) {
      if (confirm('Voulez-vous vraiment annuler la commande?')) {
        resetCommande();
        $state.go('tab.menu');
      }
    }
    else {
      $state.go('tab.menu');
    }
  }

  function commandeIsEmpty() {

    if (($rootScope.user.commande.plats.length == 0 &&
      $rootScope.user.commande.boissons.length == 0 &&
      $rootScope.user.commande.desserts.length == 0) ||
      $scope.commande.prix == 0) {

      return true;
    }
    return false;
  }

  function resetCommande() {
    $rootScope.user.commande = {
      "plats": [],
      "boissons": [],
      "desserts": [],
      "statut": "Non validé",
      "date": (new Date())
    };
    $scope.commande.prix = 0;
  }

  $scope.changeNb = function (objet, nb) {
    object.nb += nb;
  };


  /////////////////////////////// FONCTION POUR ORDI ///////////////////////////////////
  function changeViewPlats() {
    if ($rootScope.user.commande.plats.length > 0)
      $state.go('tab.newplats');
    else
      $state.go('tab.plats');
  }

  $scope.displayViewPlats = function () {
    if ($rootScope.user.commande.plats.length > 0) {
      $scope.display = 1;
    } else {
      $scope.display = 0;
    }
  };

  $scope.setDisplay = function (num) {
    $scope.display = num;
  };

  function colorButton(num) {
    if (num <= 1 && this.display <= 1) {
      return 'button button-full button-balanced';
    } else if (this.display == num) {
      return 'button button-full button-balanced';
    } else {
      return 'button button-full item';
    }
  }

  $scope.buttonValiderOrdi = function (num) {
    $scope.display = num;
    $scope.updateCommandePrice();

  };

  $scope.commande.submit = submit; // lors du clique sur le boutton valider
  $scope.commande.annuler = annuler;
  $scope.changeViewPlats = changeViewPlats; // Les plats sont complexe a gérer, si non null on va sur une page de gestion si null on va sur la page d'ajout
  //$scope.majCommandePrice = updateCommandePrice(); // On actualise le prix de la commande en fonction des tableaux stockés dans le rootscope
  $scope.updateCommandePrice();
  //gestion des vue pour ordinateur
//    displayViewPlats();
  $scope.colorButton = colorButton;


});