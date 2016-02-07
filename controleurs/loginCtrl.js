app.controller('LoginCtrl', function (Backand, $scope, $state, ServiceLogin, $rootScope, GlobalItems) {
  $scope.user = {};
  $scope.user.filiere = "CGP";
  $scope.user.annee = "3";
  $scope.vue = {};
  $scope.vue.isCreate = true;
  $scope.vue.text = "S'identifier";
  $scope.isLoading = false;
  var localUser = JSON.parse(window.localStorage.getItem("infoConnexion") || null) || null;


//    if (localUser != null && localUser != "" && localUser.mdp != undefined && localUser.pseudo != undefined && localUser.mdp.length > 0) {
//        login(localUser);
//    }


  // function login (user, $scope){
  function login(user) {
    $scope.isLoading = true;
    if (('' + user.pseudo).length < 4 || ('' + user.mdp).length < 4) {
      if (('' + user.pseudo).length < 4)
        $scope.showMessage("Veuillez entrer un email valide !", false);
      if (('' + user.mdp).length < 6)
        $scope.showMessage("Veuillez entrer un mot de passe valide !", false);

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
            currentUser.email = result.username;

            if ($rootScope.app == true) {
              window.localStorage.setItem("infoConnexion", JSON.stringify(user));
            }

            //currentUser.token = result.access_token;

            //recupérer les infos du user
            ServiceLogin.getUserInfos(result.username).then(function (result) {

              var user = result.data.data[0];
              //stockage des infos
              currentUser.id = user.id;
              currentUser.filiere = user.filiere;
              currentUser.annee = user.annee;
              currentUser.firstName = user.firstName;
              currentUser.lastName = user.lastName;
              currentUser.nbCmdSignaler = user.nbCmdSignaler;

              //mettre l'objet currentUser en local
              window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
              $rootScope.user = {};
              $rootScope.user.id = currentUser.id;
              $rootScope.user.role = currentUser.role;
              $rootScope.user.filiere = currentUser.filiere;
              $rootScope.user.annee = currentUser.annee;
              $rootScope.user.email = currentUser.username;
              $rootScope.user.firstName = currentUser.firstName;
              $rootScope.user.lastName = currentUser.lastName;
              $rootScope.user.commande = {
                "plats": [],
                "boissons": [],
                "desserts": [],
                "statut": "Non validé",
                "date": (new Date())
              };
              $rootScope.user.nbCmdSignaler = currentUser.nbCmdSignaler;

              $scope.isLoading = false;

              //si l'utilisateur a essayer d'acceder a une page sans �tre connecter
              //on le redirige vers la page
              if ($rootScope.redirect != null) {
                $state.go($rootScope.redirect);
              } else {
                //aller a la page tab.acceuil
                $state.go('tab.accueil');
                $rootScope.$state = "";
              }
            }, function (data) {
              $scope.showMessage("Erreur de connexion à la base", false);
              $scope.isLoading = false;
            });
          },
          function (data) {
            $scope.isLoading = false;
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
    ).then(function (response) {
        //$rootScope.user.id = $scope.getUserId(user.pseudo);
        $scope.showMessage("Inscription réussit", true);
        $state.go('verifEmail');

        $scope.isLoading = false;

      },
      function (data) {
        //si le user est déjà cr�éer
        if (data.status === 406) {
          $scope.showMessage("Adresse Email déjà utilisée", false);
        } else {
          $scope.showMessage(data.data.error_description, false);
        }
        $scope.isLoading = false;
        console.log(data);
      });
  }

  function checkEmail(email) {
    //return email.substr(email.length - 7) === "@cpe.fr";
    return true;
  }


  $scope.goToResetPassword = function () {
    $state.go("resetPassword");
  };

  $scope.login = login;
  $scope.signup = signup;
});
