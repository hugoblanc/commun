angular.module('starter.controllers', ['ui.router'])


    .controller('AccueilCtrl', function ($scope, $state, MessagesService) {
        $scope.accueil = {};
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
    
    