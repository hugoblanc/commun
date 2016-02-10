app.controller('AdminAccueilCtrl', function ($scope, $state, MessagesService, EventsService) {

  function init() {
    $scope.infos = {};
    $scope.error = "";
    $scope.message = {"titre": "", "message": ""};
    $scope.event = {"name" : "", "description" : "", "lien" : "","date" : "", "lieu" : ""};
  }

  $scope.addMessage = function (message) {
    if (message.titre.length < 3) {
      $scope.showMessage("Veuillez entrer un titre d'au moins 3 caractères", false);
      return;
    }
    if (message.message.length < 10) {
      $scope.showMessage("Veuillez entrer un message d'au moins 10 caractères" , false);
      return;
    }

    //ajouter le message a la base
    EventsService.create(message).then(function () {
        $scope.showMessage("Message Ajouté", true);
        $scope.message = {"titre": "", "message": ""};
      },
      function (result) {
        $scope.showMessage( "Erreur lors de l'ajout, voir détail dans la console", false);
        console.log(result);
      });
  };

  $scope.addEvent = function (event, time) {
    //vérification des champs
    if (event.name.length < 3) {
      $scope.showMessage("Veuillez entrer un nom d'au moins 3 caractères", false);
      return;
    }
    $scope.infos.eventName = false;
    if (event.description.length < 1) {
      $scope.showMessage("Veuillez entrer une description", false);
      return;
    }

    if (event.date === null) {
      $scope.showMessage("Veuillez entrer une date", false);
      return;
    }

    if (time === null) {
      $scope.showMessage("Veuillez entrer une heure", false);
      return;
    }

    if (event.lieu === null) {
      $scope.showMessage("Veuillez entrer un lieu", false);
      return;
    }

    //ajout de l'heure au champs Date
    event.date.setHours(time.getHours());
    event.date.setMinutes(time.getMinutes());

    //ajouter le message a la base
    EventsService.create(event).then(function () {
        $scope.showMessage("Evènement Ajouté", true);
//           $scope.event = {"name" : "", "description" : "", "lien" : "",
//                           "date" : "", "lieu" : ""};
      },
      function (result) {
        $scope.showMessage("Erreur lors de l'ajout, voir détail dans la console", false);
        console.log(result);
      });
  };

  init();


});

