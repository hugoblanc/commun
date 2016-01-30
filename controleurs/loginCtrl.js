app.controller('LoginCtrl', function (Backand, $scope, $state, ServiceLogin, $rootScope) {
    $scope.lblPseudo = false;
    $scope.lblMdp = false;
    $scope.error = "";
    $scope.filiere = "CGP";
    $scope.annee = "3";
    $scope.vue = {};
    $scope.vue.isCreate = true;
    $scope.vue.text = "S'identifier";
    var localUser = JSON.parse(window.localStorage.getItem("infoConnexion") || null) || null;


    if(localUser != null && localUser != "" && localUser.mdp != undefined && localUser.pseudo != undefined && localUser.mdp.length > 0){
        login(localUser);
    }
        


    // function login (user, $scope){
    function login(user) {
        if (('' + user.pseudo).length < 4 || ('' + user.mdp).length < 4) {
            if (('' + user.pseudo).length < 4)
                $scope.lblPseudo = true;
            if (('' + user.mdp).length < 6)
                $scope.lblMdp = true;

        } else {
            //connexion 
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

                                //recup�rer les infos du user
                                ServiceLogin.getUserInfos(result.username).then(function (result) {
                                    //si on a r�cup�rer l'id
                                    $scope.erreur = "";
                                    //stocker l'id
                                    currentUser.id =  result.data[0].id;
                                    currentUser.filiere =  result.data[0].filiere;
                                    currentUser.annee =  result.data[0].annee;
                                    //mettre l'objet currentUser en local
                                    window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
                                    $rootScope.user.filiere = currentUser.filiere;
                                    $rootScope.user.role = currentUser.role;
                                    $rootScope.user.annee = currentUser.annee;
                                    $rootScope.user.id = currentUser.id;


                                    //si l'utilisateur a essayer d'acceder a une page sans �tre connecter
                                    //on le redirige vers la page
                                    if($rootScope.redirect != null){
                                        $state.go($rootScope.redirect);
                                    }
                                    else{
                                        //aller a la page tab.acceuil
                                        window.local
                                        $state.go('tab.accueil'); 
                                    }
////                                 window.localStorage.setItem("token", JSON.stringify(result));                                  
                                }, function (data) {
                                    $scope.erreur = "Erreur de connexion � la base";
                                });
                            },
                            function (data) {
                                if (data.error === "invalid_grant") {
                                    $scope.error = "Email ou mot de passe incorrect";
                                } else {
                                    $scope.error = "Erreur inconnu, veuillez r�essayer plus tard";
                                }

                                console.log(data);
                            }
                    );
        }
    }


    //Sign up to Backand
    function signup(form) {
        if (!checkEmail(form.email)) {
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
    }

    function checkEmail(email) {
        return true;
        //return email.substr(email.length - 7) === "@cpe.fr";
    }


    $scope.goToResetPassword = function () {
        $state.go("resetPassword");
    };

    $scope.login = login;
    $scope.signup = signup;
});
