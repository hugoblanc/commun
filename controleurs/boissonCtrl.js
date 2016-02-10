app.controller('BoissonCtrl', function ($scope, GlobalItems, $stateParams, $q, $state, BoissonService, CommandeBoissonService, $rootScope) {
  $scope.boisson = {};
  $scope.boisson.boissons = [];
  $scope.boisson.currentPrice = 0.0;
  //$rootScope.user.commandes[$rootScope.user.currentCommande].boissons = [];
  var userStocked = JSON.parse(window.localStorage.getItem("currentUser"));


  function initValues() {
    for (var i = 0; i < $scope.boisson.boissons.length; i++) {
      for (var j = 0; $rootScope.user.commande.boissons.length > j; j++) {
        if ($scope.boisson.boissons[i].name == $rootScope.user.commande.boissons[j].name) {
          $scope.boisson.boissons[i].isChecked = true;
          $scope.boisson.boissons[i].nb = $rootScope.user.commande.boissons[j].nb;
        }
      }
    }
    majPriceBoissons($scope.boisson);
  }


  function boissonsChecked(boissons) {//Controle quelles boissons on été coché
    var result = [];
    $scope.nbBoissons = 0;
    for (var i = 0; i < boissons.length; i++) {
      if (boissons[i].nb > 0) {
        result.push(boissons[i]);
        $scope.nbBoissons += boissons[i].nb;
      }
    }
    return result;
  }


  function majPriceBoissons(boissons) {
    if (boissons != undefined) {
      //var boissonsSelected = boissonsChecked(boissons.boissons);
      $scope.boisson.currentPrice = GlobalItems.majValueItems(boissons.boissons);
    }
  }


  function getAll() {
    var dfd = $q.defer();
    BoissonService.all()
      .then(function (result) {
        $scope.boisson.boissons = result.data.data;
        dfd.resolve(result.data.data);
      }, function (raison) {
        console.log('In your face brah !');
        dfd.reject(raison);
      });

    return dfd.promise;
  }

  function submit(boissons) {
    var boissonsSelected = boissonsChecked(boissons.boissons);


    $rootScope.user.commande.boissons = boissonsSelected;
    $rootScope.user.commande.boissons.prix = $scope.boisson.currentPrice;
    $rootScope.user.commande.boissons.nb = $scope.nbBoissons;
    if ($rootScope.ordi) {
      $scope.$parent.buttonValiderOrdi(3);
    } else {
      $state.go('tab.commande');
    }



  }

  $scope.checkBoisson = function(boisson, boissons)
  {
    boisson.nb = 1;
    majPriceBoissons(boissons);
  };

  $scope.changeNb = function (objet, nb) {
    if(objet.nb + nb >= 0 && objet.nb + nb <= 5) {
      objet.nb += nb;
      $scope.boisson.currentPrice = GlobalItems.arrondiDixiem( $scope.boisson.currentPrice + (nb * objet.prix));
      if(objet.nb == 0){
        objet.isChecked = false;
      }
    }
  };


  $scope.boisson.submit = submit;
  $scope.boisson.getAll = getAll().then(function (resultGetAll) {
    if ($rootScope.user.commande.boissons.length > 0) {
      $scope.boisson.initValues = initValues();
    }
  });
  $scope.majPriceBoissons = majPriceBoissons;

});
