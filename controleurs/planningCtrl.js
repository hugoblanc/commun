app.controller('planningCtrl', function ($scope, $state, $rootScope, CommandeService, GlobalItems) {



    function changeView(choix){
        if(choix=="monPlanning"){
            var promo = {"filiere": $rootScope.user.filiere, "annee": $rootScope.user.annee};
            $state.go("tab.edt", promo);
        } else if(choix=="autrePlanning"){
            $state.go("tab.selectEdt")
        }
    }


    $scope.changeView = changeView;
});
