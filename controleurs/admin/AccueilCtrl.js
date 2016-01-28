app.controller('AdminAccueilCtrl', function ($scope, $state, MessagesService, EventsService) {

    function init() {
        $scope.infos = {};
        $scope.success = "";
        $scope.error = "";
        $scope.message = {"titre" : "", "message" : ""};
    }

    $scope.addMessage = function (message) {
        if (message.titre.length < 3 ) {
            $scope.infos.messageTitre = true;
            return;
        }
        $scope.infos.messageTitre = false;
        if (message.message.length < 10) {
            $scope.infos.messageMsg = true;
            return;
        }
        $scope.infos.messageMsg = false;
        
        //ajouter le message a la base
        EventsService.create(message).then(function(){
           $scope.success = "Message Ajouté";
           $scope.error = ""; 
           $scope.message = {"titre" : "", "message" : ""};
        },
        function(result){
           $scope.success = "";
           $scope.error = "Erreur lors de l'ajout, voir détail dans la console"; 
           console.log(result);
        });   
    };
    
    $scope.addEvent = function (event, time) {
        //vérification des champs
        if (event.name.length < 3 ) {
            $scope.infos.eventName = true;
            return;
        }
        $scope.infos.eventName = false;
        if (event.description.length < 1) {
            $scope.infos.eventDesc = true;
            return;
        }
        $scope.infos.eventDesc = false;
        
        if (event.date === "jj/mm/aaaa") {
            $scope.infos.eventDate = true;
            return;
        }
        $scope.infos.eventDate = false;
        
        if(time === null){
            $scope.infos.eventTime = true;
            return;
        }
        $scope.infos.eventTime = false;
        
        if(event.lieu === null){
            $scope.infos.eventLieu = true;
            return;
        }
        $scope.infos.eventLieu = false;
        
        //ajout de l'heure au champs Date 
        event.date.setHours(time.getHours());
        event.date.setMinutes(time.getMinutes());
        
        //ajouter le message a la base
        EventsService.create(event).then(function(){
           $scope.success = "Evènement Ajouté";
           $scope.error = ""; 
//           $scope.event = {"name" : "", "description" : "", "lien" : "",
//                           "date" : "", "lieu" : ""};
        },
        function(result){
           $scope.success = "";
           $scope.error = "Erreur lors de l'ajout, voir détail dans la console"; 
           console.log(result);
        });   
    };

    init();


});

