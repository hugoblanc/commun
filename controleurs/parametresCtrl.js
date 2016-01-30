//(function () {
//    app.controller('parametresCtrl', ['Connexion', '$location', $rootScope, parametresCtrl]);
app.controller('parametresCtrl', function (ServiceLogin, $scope, $state) {
//    function parametresCtrl(Connexion, $location) {
    var self = this;
    $scope.control = {};

    //self.user = $rootScope.user; 
    function init() {
        self.user = JSON.parse(window.localStorage.getItem("currentUser"));
        self.changeMDP = false;
    }

    self.update = function () {
        self.error = null;
        self.success = null;
        if (self.oldPassword && self.newPassword && self.confirmPassword) {
            if (self.newPassword !== self.confirmPassword) {
                self.newPassword = self.confirmPassword = null;
                self.error = 'Les mot de passes sont différents';
            } else {
                ServiceLogin.changePassword(self.oldPassword, self.newPassword)
                        .then(changePasswordSuccess, changePasswordError);
            }
        }
    };

    function changePasswordSuccess() {
        self.oldPassword = self.newPassword = self.confirmPassword = null;
        self.success = 'Le mot de passe à été changé';
        self.error = "";
    }

    function changePasswordError(response) {
        console.log(response);
        self.oldPassword = self.newPassword = self.confirmPassword = null;
        if(response.status === 417){
            self.error = "Ancien mot de passe incorrect";
        }
        else{
            self.error = "Erreur inconnu, réessaye plus tard!";
        }
    }

    self.setChangeMDP = function () {
        self.changeMDP = true;
    };
    
    self.changeUserParams = function(){
        //mettre a jour année et filiere
        ServiceLogin.update(self.user.id, {"filiere" : self.user.filiere, "annee" : self.user.annee}).then(function(){
            self.error = null;
            self.success = 'Informations enregistrées!';
            window.localStorage.setItem("currentUser", JSON.stringify(self.user));
        },function(){
            self.error = "Erreur inconnu, réessaye plus tard!";
            self.success = null;
        });
    };


     function signout(){

        var test =  1;

        ServiceLogin.signout().then(function(){
            window.localStorage.setItem("infoConnexion", null);
            $state.go('signup');
        });
    }

    $scope.control.signout = signout;
    init();
    
});
//});