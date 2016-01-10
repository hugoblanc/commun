  /*var userStocked =  JSON.parse(window.localStorage.getItem("currentUser"));
  user.mdp = userStocked.mdp;
  user.pseudo = userStocked.pseudo;*/
app.controller('LoginCtrl', function (Backand, $scope, $state, Connexion, $http, $rootScope) {
    $scope.lblPseudo = false;
    $scope.lblMdp = false;
    $scope.error = "";
    $scope.filiere = "CGP";
    $scope.annee = "3";


    // function login (user, $scope){
    function login(user) {
        if (('' + user.pseudo).length < 4 || ('' + user.mdp).length < 4) {
            if (('' + user.pseudo).length < 4)
                $scope.lblPseudo = true;
            if (('' + user.mdp).length < 6)
                $scope.lblMdp = true;

        } else {
            //$scope.result = '  '+ user.mdp + '    ' + user.pseudo;
            Connexion.signin(user.pseudo, user.mdp)
                    .then(
                            function (result) {
                                //$rootScope.user.id = $scope.getUserId(user.pseudo);
                                $scope.getUserId(user.pseudo);
                                $scope.erreur = "";
//                                window.localStorage.setItem("user", JSON.stringify(user));
//                                window.localStorage.setItem("token", JSON.stringify(result));
                                $state.go('accueil');
                            },
                            function (data) {
                                if(data.error === "invalid_grant"){
                                    $scope.error = "Email ou mot de passe incorrect";
                                }
                                else{
                                    $scope.error = "Erreur inconnu, veuillez r�essayer plus tard"; 
                                }
                               
                                console.log(data);
                            }
                    );
        }
    }

    $scope.getUserId = function (email) {
        $http({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/query/data/GetUser',
            params: {
                parameters: {
                    email: email
                }
            }
        }).then(function (result) {
            window.localStorage.setItem("userId", JSON.stringify(result.data[0].id));
        }, function (data) {
            console.log(data);
        });
    };
    

    //Sign up to Backand
    function signup(form) {
        if( !checkEmail(form.email) ){
            $scope.error = "Email invalide, vous devez rentrer un email de CPE.";
            return;
        }
        return Backand.signup(form.firstName, form.lastName, form.email,
                form.password, form.password, {filiere: form.filiere, annee: form.annee}
                )
                .then(function (response) {
                    //$rootScope.user.id = $scope.getUserId(user.pseudo);
                    $scope.error = "";
                    $state.go('verifEmail');
                    
                }, 
                function (data) {
                    $scope.error = data.data;
                    console.log(data);
                });
    };
    
    function checkEmail(email){
       return true;
      //return email.substr(email.length - 7) === "@cpe.fr";
    };
    
    $scope.goToResetPassword = function(){
       $state.go("resetPassword");
    };
    
    

      window.localStorage.setItem("user", JSON.stringify(user));
      window.localStorage.setItem("token", JSON.stringify(result));

    $scope.login = login;
    $scope.signup = signup;
});
