app.controller('LoginCtrl', function (Backand, $scope, $state, ServiceLogin, $rootScope, GlobalItems) {
    $scope.lblPseudo = false;
    $scope.lblMdp = false;
    $scope.filiere = "CGP";
    $scope.annee = "3";
    $scope.vue = {};
    $scope.vue.isCreate = true;
    $scope.vue.text = "S'identifier";
    var localUser = JSON.parse(window.localStorage.getItem("infoConnexion") || null) || null;


//    if (localUser != null && localUser != "" && localUser.mdp != undefined && localUser.pseudo != undefined && localUser.mdp.length > 0) {
//        login(localUser);
//    }



    // function login (user, $scope){
    function login(user) {
        if (('' + user.pseudo).length < 4 || ('' + user.mdp).length < 4) {
            if (('' + user.pseudo).length < 4)
                $scope.showMessage("Veuillez entrer un email valide !", false);
            if (('' + user.mdp).length < 6)
                $scope.showMessage("Veuillez entrer un mot de passe valide !", false);

        } else {
            //connexion
            ServiceLogin.signin(user.pseudo, user.mdp)
                    .then(
                            function (result) {
                                //stoker les infos du user en local
                                currentUser = {};
                                currentUser.fullName = result.fullName;
                                currentUser.role = result.role;
                                currentUser.email = result.username;

                              if($rootScope.app == true) {
                                window.localStorage.setItem("infoConnexion", JSON.stringify(user));
                              }

                                //currentUser.token = result.access_token;

                                //recupérer les infos du user
                                ServiceLogin.getUserInfos(result.username).then(function (result) {
                                    //si on a récupérer l'id
                                    //stocker l'id
                                    currentUser.id = result.data[0].id;
                                    currentUser.filiere = result.data[0].filiere;
                                    currentUser.annee = result.data[0].annee;
                                    currentUser.firstName = result.data[0].firstName;
                                    currentUser.lastName = result.data[0].lastName;

                                    //mettre l'objet currentUser en local
                                    window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
                                    $rootScope.user = {};
                                    $rootScope.user.id = currentUser.id;
                                    $rootScope.user.role = currentUser.role;
                                    $rootScope.user.filiere = currentUser.filiere;
                                    $rootScope.user.annee = currentUser.annee;
                                    $rootScope.user.email = currentUser.username;
                                    $rootScope.user.firstName = currentUser.firstName;
                                    $rootScope.user.lastname = currentUser.lastName;
                                    $rootScope.user.commandes = [];
                                    $rootScope.user.commande = {"plats": [], "boissons": [], "desserts": [], "statut": "Non validé", "date": (new Date())};

                                    //si l'utilisateur a essayer d'acceder a une page sans être connecter
                                    //on le redirige vers la page
                                    if ($rootScope.redirect != null) {
                                        $state.go($rootScope.redirect);
                                    } else {
                                        //aller a la page tab.acceuil
                                        $state.go('tab.accueil');
                                    }
////                                 window.localStorage.setItem("token", JSON.stringify(result));
                                }, function (data) {
                                    $scope.showMessage("Erreur de connexion à la base", false);
                                });
                            },
                            function (data) {
                                if (data.error === "invalid_grant") {
                                    $scope.$parent.showMessage("Email ou mot de passe incorrect", false);
                                } else {
                                    $scope.showMessage("Erreur inconnu, veuillez réessayer plus tard", false);
                                }

                                console.log(data);
                            }
                    );
        }
    }


    //Sign up to Backand
    function signup(user) {
        if (!checkEmail(user.email)) {
            $scope.$parent.showMessage("Email invalide, vous devez rentrer un email de CPE", false);

            return;
        }
        if (user.mdp !== user.mdp2) {
            $scope.$parent.showMessage("Les mots de passes sont différents", false);
            return;
        }

        return Backand.signup(user.firstName, user.lastName, user.email,
                user.mdp, user.mdp2, {filiere: user.filiere, annee: user.annee}
        )
                .then(function (response) {
                    //$rootScope.user.id = $scope.getUserId(user.pseudo);
                    $state.go('verifEmail');

                },
                        function (data) {
                            //si le user est déjà cr�éer
                            if (data.status === 406) {
                                $scope.$parent.showMessage("Adresse Email déjà utilisée", false);
                            } else {
                                $scope.$parent.showMessage(data.data.error_description, false);
                            }
                            console.log(data);
                        });
    }

    function checkEmail(email) {
        return email.substr(email.length - 7) === "@cpe.fr";
    }


    $scope.goToResetPassword = function () {
        $state.go("resetPassword");
    };

    $scope.login = login;
    $scope.signup = signup;
});
