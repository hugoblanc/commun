angular.module('starter.controllers', ['ui.router'])


        .controller('AccueilCtrl', function ($scope, $state, MessagesService, ServiceLogin) {

            function init() {
                $scope.accueil = {};
                $scope.messageOffset = 0;
                $scope.user = JSON.parse(window.localStorage.getItem("currentUser"));
                if ($scope.user.role === "Admin") {
                    $scope.admin = true;
                }
            }
            $scope.getAll = function () {
                MessagesService.GetMessages($scope.messageOffset)
                        .then(function (result) {
                            $scope.accueil.messages = result.data;
                            $scope.messageOffset += result.data.length;
                        }, function (data) {
                            console.log(data);
                        });
            };




            $scope.goToParametres = function () {
                $state.go("parametres");
            };

            $scope.goToAdmin = function () {
                $state.go("tabAdmin.accueil");
            };

            init();
//        $scope.getAll = getAll();
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

    