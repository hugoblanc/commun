app.controller('PlatsCtrl', function ($scope,
                                      $state,
                                      $rootScope,
                                      $q,
                                      PlatPrepService,
                                      SaucesService,
                                      GlobalItems) {

  $scope.choix = {"sauces": [], "platsPrepares": []}; // Tout les choix possible sont préchargé ici

  //$scope.plats = {"isSandwich": false, "isPlatPrep": false};
  //$scope.plats.currentPrice = 0;


  function initValues() {
    $scope.choix.platsPrepares.prix = 0;
    var plats = $rootScope.user.commande.plats;
    if (plats.length > 0) {
      for (var i = 0; i < $scope.choix.platsPrepares.length; i++) {
        for (var j = 0; j < plats.length; j++) {
          if (plats[j].name == $scope.choix.platsPrepares[i].name) {
            $scope.choix.platsPrepares[i].isChecked = true;
            $scope.choix.platsPrepares[i].nb = plats[j].nb;
            $scope.choix.platsPrepares.prix += plats[j].prix * plats[j].nb;
          }
        }
      }
    }
  }


  $scope.nouveauPlat = function () {
    //On navigue vers la page souhaité
    $state.go('tab.commande');
  };

  function getAllPossibilites() {
    //Récupère tous les choix possible (sauce, plats, ingredients)

    getAllSauces().then(function (retourSauce) {
      getAllPlatsPrepare().then(function () {
        initValues();
      });
    });

  }

  function getAllSauces() {
    var dfd = $q.defer();

    SaucesService.all().then(function (resultatSauces) {
      $scope.choix.sauces = resultatSauces.data.data;
      dfd.resolve(resultatSauces.data.data);
    }, function (raison) {
      dfd.reject(raison);
    });

    return dfd.promise;
  }

  function getAllPlatsPrepare() {
    var dfd = $q.defer();

    PlatPrepService.all().then(function (resultatPlatsPrepare) {
      $scope.choix.platsPrepares = resultatPlatsPrepare.data.data;
      dfd.resolve(resultatPlatsPrepare.data.data);
    }, function (raison) {
      dfd.reject(raison);
    });

    return dfd.promise;
  }

  function submit(liste, type) {

    //On commence par selectionner uniquement les items selectionné
    var listeItemsSelected = itemsSelected(liste);

    if (type == "sauces") {//Si il s'agit de sauces alors un seul plat est créé
      $rootScope.user.commande.plats.push({
        "name": "hotdog",
        "type": "sandwich",
        "prix": 1.50,
        "nb": 1,
        "sauces": listeItemsSelected
      });
      for (var j = 0; j < listeItemsSelected.length; j++) {
        listeItemsSelected[j].isChecked = false;
      }

    } else if (type == "platsPrep") {/* Si il s'agit de plat préparé alors on ajout
     un plat pour chaque case du tableau plats[]  de rootscope*/
      removePlatsPrepare();
      for (var j = 0; j < listeItemsSelected.length; j++) {
        $rootScope.user.commande.plats.push({
          "type": "platsPrep",
          "name": listeItemsSelected[j].name,
          "prix": listeItemsSelected[j].prix,
          "nb": listeItemsSelected[j].nb
        });
      }
    }

    updatePrixAndNb();

    if ($rootScope.ordi) {
      $scope.$parent.buttonValiderOrdi(2);
    } else {
      $state.go('tab.commande');
    }
  }

  function itemsSelected(liste) {
    var result = [];
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].isChecked) {
        result.push(liste[i]);
      }
    }
    return result;
  }

  function removePlatsPrepare() {
    for (var i = 0; i < $rootScope.user.commande.plats.length; i++) {
      if ($rootScope.user.commande.plats[i].type == "platsPrep") {
        $rootScope.user.commande.plats.splice(i, 1);
      }
    }
  }

  function majPricePlatsPrep(prix) {
    $scope.choix.platsPrepares.prix += prix;
  }

  $scope.checkPlat = function (plat, plats) {
    plat.nb = 1;
    majPricePlatsPrep(plat.prix);
  };

  $scope.changeNb = function (objet, nb) {
    if (objet.nb + nb >= 0 && objet.nb + nb <= 5) {
      objet.nb += nb;
      majPricePlatsPrep(objet.prix * nb);
      if (objet.nb == 0) {
        objet.isChecked = false;
      }
    }
  };

  function updatePrixAndNb() {
    var prix = 0;
    var nb = 0;
    $rootScope.user.commande.plats.forEach(function (plat) {
      prix += plat.prix * plat.nb;
      nb += plat.nb;
    });

    $rootScope.user.commande.plats.prix = prix;
    $rootScope.user.commande.plats.nb = nb;

  }

  $scope.getAllPossibilites = getAllPossibilites();
  $scope.submit = submit;
  $scope.majPricePlatsPrep = majPricePlatsPrep;

});
