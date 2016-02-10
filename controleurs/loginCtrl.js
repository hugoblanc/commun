app.controller('LoginCtrl', function (Backand, $scope, $state, ServiceLogin, $rootScope, GlobalItems) {
    $scope.lblPseudo = false;
    $scope.lblMdp = false;
    $scope.error = "";
    $scope.filiere = "CGP";
    $scope.annee = "3";
    $scope.vue = {};
    $scope.vue.isCreate = true;
    $scope.vue.text = "S'identifier";
    $scope.isLoading = false;
    var localUser = JSON.parse(window.localStorage.getItem("infoConnexion") || null) || null;


    if(localUser != null && localUser != "" && localUser.mdp != undefined && localUser.pseudo != undefined && localUser.mdp.length > 0){
        login(localUser);
    }
        


    // function login (user, $scope){
    function login(user) {
        $scope.isLoading = true;
        if (checkField(user)) {
            console.log("pseudo ou mdp trop court ");
            $scope.isLoading = false;
        } else {
            //connexion 
            //if(!$scope.isLoading)
                ServiceLogin.signin(user.pseudo, user.mdp)
                    .then(
                            function (result) {
                                //stoker les infos du user en local
                                currentUser = {};
                                currentUser.fullName = result.fullName;
                                currentUser.role = result.role;
                                currentUser.username = result.username;

                                window.localStorage.setItem("infoConnexion", JSON.stringify(user));

                                //currentUser.token = result.access_token;

                                //recupérer les infos du user
                                ServiceLogin.getUserInfos(result.username).then(function (result) {
                                    //si on a récupérer l'id
                                    $scope.erreur = "";
                                    //stocker l'id
                                    currentUser.id =  result.data[0].id;
                                    currentUser.filiere =  result.data[0].filiere;
                                    currentUser.annee =  result.data[0].annee;
                                    currentUser.nbCmdSignaler = result.data[0].nbCmdSignaler;
                                    //mettre l'objet currentUser en local
                                    window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
                                    $rootScope.user.filiere = currentUser.filiere;
                                    $rootScope.user.role = currentUser.role;
                                    $rootScope.user.annee = currentUser.annee;
                                    $rootScope.user.id = currentUser.id;
                                    $rootScope.user.nbCmdSignaler = currentUser.nbCmdSignaler;

                                    $scope.isLoading = false;
                                    //si l'utilisateur a essayer d'acceder a une page sans être connecter
                                    //on le redirige vers la page
                                    if($rootScope.redirect != null){
                                        $state.go($rootScope.redirect);
                                    }
                                    else{
                                        //aller a la page tab.acceuil
                                        $state.go('tab.accueil'); 
                                        $rootScope.$state = "";
                                    }
////                                 window.localStorage.setItem("token", JSON.stringify(result));                                  
                                }, function (data) {
                                    $scope.erreur = "Erreur de connexion à la base";
                                    $scope.isLoading = false;
                                });
                            },
                            function (data) {
                                $scope.isLoading =false;
                                if (data.error === "invalid_grant") {
                                    $scope.error = "Email ou mot de passe incorrect";
                                } else {
                                    $scope.error = "Erreur inconnu, veuillez réessayer plus tard";
                                }

                                console.log(data);
                            }
                    );
        }
    }


    //Sign up to Backand
    function signup(form) {
        //$scope.isLoading = true;

        if (!checkEmail(form.email) && !isLoading) {
            $scope.error = "Email invalide, vous devez rentrer un email de CPE.";
            return;
        }
        return Backand.signup(form.firstName,
                                form.lastName,
                                form.email,
                                form.password,
                                form.confirmPassword,
                                {filiere: form.filiere, annee: form.annee})
                .then(function (response) {
                    //$rootScope.user.id = $scope.getUserId(user.pseudo);
                    $scope.error = "";
                    $state.go('verifEmail');

                    $scope.isLoading = false;

                },
                        function (data) {
                            $scope.isLoading = false;
                            $scope.error = data.data;
                            console.log(data);
                        });
    }

    function checkEmail(email) {
        return true;
        //return email.substr(email.length - 7) === "@cpe.fr";
    }

    function checkField(user){//Vérification si un des champs < 8 et 6
        if(user.pseudo.length >= 6){
            $scope.lblPseudo = false;
        } else {
            $scope.lblPseudo = true;
        }
        if(user.mdp.length >= 7){
            $scope.lblMdp = false;
             if(user.pseudo.length >= 6)
                return false;
        } 
        else {
            $scope.lblMdp = true;
            return true;
        }
    }


    $scope.goToResetPassword = function () {
        $state.go("resetPassword");
    };

    $scope.login = login;
    $scope.signup = signup;
});
