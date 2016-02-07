app.controller('DessertCtrl', function ($scope, $q, $stateParams, $state, DessertService, $rootScope, GlobalItems) {
  $scope.dessert = {};
  $scope.dessert.currentPrice = 0;


  function initValues() {
    for (var i = 0; i < $scope.dessert.desserts.length; i++) {
      for (var j = 0; $rootScope.user.commande.desserts.length > j; j++) {
        if ($scope.dessert.desserts[i].name == $rootScope.user.commande.desserts[j].name) {
          $scope.dessert.desserts[i].isChecked = true;
          $scope.dessert.desserts[i].nb = $rootScope.user.commande.desserts[j].nb;
        }
      }
    }
  }

  function dessertsChecked(desserts) {
    var result = [];
    $scope.nbDesserts = 0;
    for (var i = 0; i < desserts.length; i++) {
      if (desserts[i].nb > 0) {
          result.push(desserts[i]);
          $scope.nbDesserts += desserts[i].nb;
      }
    }
    return result;
  }


  function majPriceDesserts(desserts) {
    if (desserts != undefined) {
      //var dessertsSelected = dessertsChecked(desserts.desserts);
      $scope.dessert.currentPrice = GlobalItems.arrondiDixiem(GlobalItems.majValueItems(desserts.desserts));
    }
  }


  function getAll() {
    var dfd = $q.defer();
    DessertService.all().then(function (result) {
      $scope.dessert.desserts = result.data.data;

      for (var i = 0; i < $scope.dessert.desserts.length; i++) {
        $scope.dessert.desserts[i].prix = GlobalItems.arrondiDixiem($scope.dessert.desserts[i].prix); // on arrondi au dixieme près
      }
      dfd.resolve($scope.dessert.desserts);
    }, function (raison) {
      dfd.reject(raison);
    });

    return dfd.promise;
  }


  function submit(desserts) {
    var dessertsSelected = dessertsChecked(desserts.desserts);
    $rootScope.user.commande.desserts = dessertsSelected;
    $rootScope.user.commande.desserts.prix = $scope.dessert.currentPrice;
    $rootScope.user.commande.desserts.nb = $scope.nbDesserts;
    if ($rootScope.ordi) {
      $scope.$parent.buttonValiderOrdi(4);
    } else {
      $state.go('tab.commande');
    }
  }

  $scope.checkDessert = function(dessert, desserts)
  {
    dessert.nb = 1;
    majPriceDesserts(desserts);
  };

  $scope.changeNb = function (objet, nb) {
    if(objet.nb + nb >= 0 && objet.nb + nb <= 5) {
      objet.nb += nb;
      $scope.dessert.currentPrice = GlobalItems.arrondiDixiem( $scope.dessert.currentPrice + (nb * objet.prix));
      if(objet.nb == 0){
        objet.isChecked = false;
      }
    }
  };

  $scope.dessert.submit = submit;
  $scope.dessert.getAll = getAll().then(function (resultDessertsGetAll) {
    if ($rootScope.user.commande.desserts.length > 0) {
      $scope.dessert.initValues = initValues();
    }
  });
  $scope.majPriceDesserts = majPriceDesserts;
});

