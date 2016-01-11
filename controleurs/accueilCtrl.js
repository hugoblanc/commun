angular.module('starter.controllers', ['ui.router'])


    .controller('AccueilCtrl', function ($scope, $state, MessagesService) {
        
    
        function init(){
            $scope.accueil = {};
            $scope.user = JSON.parse(window.localStorage.getItem("currentUser"));
            if($scope.user.role === "Admin"){
                $scope.admin = true;
            }
        }
        function getAll() {
            MessagesService.all()
                    .then(function (result) {
                        $scope.accueil.messages = result.data.data;
                    }, function (data) {
                        console.log(data);
                    });
        }
        ;

        $scope.getAll = getAll();

        $scope.goToParametres = function () {
            $state.go("parametres");
        };
        
        $scope.goToAdmin = function(){
//           ServiceLogin.getUserDetails()
//                .then(function (data) {
//                    if(data.role === "Admin"){
//                        $state.go("admin");
//                    }
//                    else{
//                        $scope.error = "Vous n'avez pas le droit d'y acceder";
//                    }
//                },function(){
//                    $scope.error = "Erreur de connexion à la base";
//                });
            $state.go("admin");
        };
        
        init();
    })

    .controller('EventsCtrl', function ($scope, $state, EventsService) {
        $scope.accueil = {};
        var ctrl = this;

        function getAll() {
            EventsService.all()
                    .then(function (result) {
                        ctrl.events = result.data.data;
                    }, function (data) {
                        console.log(data);
                    });
        }
        ;

        $scope.getAll = getAll();
    });
    
    