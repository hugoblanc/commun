app.controller('selectEdtCtrl', function ($scope, $state, $rootScope, CommandeService, GlobalItems) {
    $scope.commandes = [];
    $scope.groups = [];
    for (var i=0; i<3; i++) {
        $scope.groups[i] = {
          name: i,
          items: [],
          show: false
        };
        for (var j=3; j<6; j++) {
          $scope.groups[i].items.push(j);
        }
    }
  
    $scope.groups[0].name = "IRC";
    $scope.groups[1].name = "ETI";
    $scope.groups[2].name = "CGP";


    function  changeView(promo){
        $state.go('tab.edt', promo);
    }


  $scope.toggleGroup = function(group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function(group) {
    return group.show;
  };

  $scope.changeView = changeView;
});
