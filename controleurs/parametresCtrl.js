//(function () {
//    app.controller('parametresCtrl', ['Connexion', '$location', $rootScope, parametresCtrl]);
app.controller('parametresCtrl', function (ServiceLogin, $scope, $state, $rootScope) {
//    function parametresCtrl(Connexion, $location) {
    $scope.control = {};
    $scope.user = {};
    $scope.passwords = {};

    //$scope.user = $rootScope.user;
    function init() {
        $scope.user = $rootScope.user;
        $scope.changeMDP = false;
    }

    $scope.changePassword = function () {
        if ($scope.passwords.oldPassword && $scope.passwords.newPassword && $scope.passwords.confirmPassword) {
            if ($scope.passwords.newPassword !== $scope.passwords.confirmPassword) {
                $scope.passwords.newPassword = $scope.passwords.confirmPassword = null;
                $scope.showMessage("Les mot de passes sont différents", false);
            } else {
                ServiceLogin.changePassword($scope.passwords.oldPassword, $scope.passwords.newPassword)
                        .then(changePasswordSuccess, changePasswordError);
            }
        }
      else{
          $scope.showMessage("Entrez un mot de passe", false);
        }
    };

    function changePasswordSuccess() {
        $scope.passwords.oldPassword = $scope.passwords.newPassword = $scope.passwords.confirmPassword = null;
        $scope.showMessage("Le mot de passe à été changé", true);
    }

    function changePasswordError(response) {
        $scope.passwords.oldPassword = $scope.passwords.newPassword = $scope.passwords.confirmPassword = null;
        if(response.status === 417){
            $scope.showMessage("Ancien mot de passe incorrect", false);
        }
        else{
            $scope.showMessage("Erreur inconnu, réessayez plus tard!", false);
        }
    }

    $scope.setChangeMDP = function () {
        $scope.changeMDP = true;
    };

    function changeUserParams(){
        //mettre a jour année et filiere
        ServiceLogin.update($scope.user.id, {"filiere" : $scope.user.filiere, "annee" : $scope.user.annee}).then(function(){
            $scope.showMessage("Informations enregistrées!", true);
            window.localStorage.setItem("currentUser", JSON.stringify($scope.user));
        },function(){
            $scope.showMessage("Erreur inconnu, réessayez plus tard!", false);
        });
    };


     function signout(){
        ServiceLogin.signout().then(function(){
            window.localStorage.setItem("infoConnexion", "");
            localStorage.removeItem("currentUser");
            $state.go('signin');
        });
    }

    $scope.control.signout = signout;
    $scope.changeUserParams = changeUserParams;
    init();

});
//});
