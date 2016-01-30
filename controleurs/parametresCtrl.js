//(function () {
//    app.controller('parametresCtrl', ['Connexion', '$location', $rootScope, parametresCtrl]);
app.controller('parametresCtrl', function (ServiceLogin, $scope, $state) {
//    function parametresCtrl(Connexion, $location) {
    $scope.control = {};
    $scope.user = {};

    //$scope.user = $rootScope.user; 
    function init() {
        $scope.user = JSON.parse(window.localStorage.getItem("currentUser"));
        $scope.changeMDP = false;
    }

    $scope.update = function () {
        $scope.error = null;
        $scope.success = null;
        if ($scope.oldPassword && $scope.newPassword && $scope.confirmPassword) {
            if ($scope.newPassword !== $scope.confirmPassword) {
                $scope.newPassword = $scope.confirmPassword = null;
                $scope.error = 'Les mot de passes sont différents';
            } else {
                ServiceLogin.changePassword($scope.oldPassword, $scope.newPassword)
                        .then(changePasswordSuccess, changePasswordError);
            }
        }
    };

    function changePasswordSuccess() {
        $scope.oldPassword = $scope.newPassword = $scope.confirmPassword = null;
        $scope.success = 'Le mot de passe à été changé';
        $scope.error = "";
    }

    function changePasswordError(response) {
        console.log(response);
        $scope.oldPassword = $scope.newPassword = $scope.confirmPassword = null;
        if(response.status === 417){
            $scope.error = "Ancien mot de passe incorrect";
        }
        else{
            $scope.error = "Erreur inconnu, réessaye plus tard!";
        }
    }

    $scope.setChangeMDP = function () {
        $scope.changeMDP = true;
    };
    
    function changeUserParams(){
        //mettre a jour année et filiere
        ServiceLogin.update($scope.user.id, {"filiere" : $scope.user.filiere, "annee" : $scope.user.annee}).then(function(){
            $scope.error = null;
            $scope.success = 'Informations enregistrées!';
            window.localStorage.setItem("currentUser", JSON.stringify($scope.user));
        },function(){
            $scope.error = "Erreur inconnu, réessaye plus tard!";
            $scope.success = null;
        });
    };


     function signout(){

        var test =  1;

        ServiceLogin.signout().then(function(){
            window.localStorage.setItem("infoConnexion", "");
            $state.go('signup');
        });
    }

    $scope.control.signout = signout;
    $scope.changeUserParams = changeUserParams;
    init();
    
});
//});