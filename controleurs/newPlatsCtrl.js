app.controller('NewPlatsCtrl', function ($scope, $state, $rootScope, $q, PlatPrepService, SaucesService) {


  $scope.plats = $rootScope.user.commande.plats;

  function deletePlat(plat) {
    //enlever le prix
    $rootScope.user.commande.plats.prix -= plat.prix * plat.nb;
    //$rootScope.user.commande.prix -= plat.prix * plat.nb;
    $rootScope.user.commande.plats.nb -= plat.nb;

    if ($rootScope.ordi) {
      $scope.updateCommandePrice();
    }
    //retirer le plat de la liste
    $scope.plats.splice($scope.plats.indexOf(plat), 1);
  }

  function addPlat() {
    $rootScope.user.commande.plats = $scope.plats;
    if ($rootScope.ordi) {
      $scope.$parent.setDisplay("plats");
    } else {
      $state.go('tab.plats');
    }
  }

  function submit() {
    $rootScope.user.commande.plats = $scope.plats;
    if ($rootScope.ordi) {
        $scope.submitAlimentOrdi("plats", $rootScope.user.commande.plats.nb);
    } else {
      $state.go('tab.commande');
    }

  }

  $scope.deletePlat = deletePlat;
  $scope.addPlat = addPlat;
  $scope.submit = submit;
});
