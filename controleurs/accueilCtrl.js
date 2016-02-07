app.controller('AccueilCtrl', function ($scope, $state, MessagesService, $timeout) {


  function init() {
    $scope.accueil = {};
    $scope.user = JSON.parse(window.localStorage.getItem("currentUser"));
    if ($scope.user.role === "Admin") {
      $scope.admin = true;
    }
  }

  function getAll() {
    MessagesService.GetMessages()
      .then(function (result) {
        $scope.accueil.messages = result.data.data;
        //convertir tout les date en date...
        $scope.accueil.messages.forEach(function (message) {
          message.date = new Date(message.date);
        });
      }, function (data) {
        console.log(data);
      });
  }


  $scope.goToParametres = function () {
    $state.go("parametres");
  };

  $scope.goToAdmin = function () {
    $state.go("tabAdmin.accueil");
  };

  init();

  $scope.getAll = getAll();
}),
  app.controller('EventsCtrl', function ($scope, $state, EventsService) {
    $scope.accueil = {};
    $scope.events = [];

    function getAll() {
      EventsService.all()
        .then(function (result) {
          $scope.events = result.data.data;
          //convertir tout les date en date...
          $scope.events.forEach(function (event) {
            event.date = new Date(event.date);
          });
        }, function (data) {
          console.log(data);
        });
    }

    $scope.getAll = getAll();
  });

