app.controller('LoginCtrl',function (Backand, $scope, $state, Connexion, $rootScope){  
  $scope.lblPseudo = false;
  $scope.lblMdp = false;
  /*var userStocked =  JSON.parse(window.localStorage.getItem("currentUser"));
  user.mdp = userStocked.mdp;
  user.pseudo = userStocked.pseudo;*/



  function login(user, $scope){
    if((''+user.pseudo).length < 4 || (''+user.mdp).length < 4){
      if((''+user.pseudo).length < 4)
        $scope.lblPseudo = true;
      if((''+user.mdp).length < 4)
        $scope.lblMdp = true;

    }else{
      //$scope.result = '  '+ user.mdp + '    ' + user.pseudo;
      console.log('Login', user.mdp);
      console.log('Login', user.pseudo);
      Connexion.signin(user.pseudo, user.mdp).then(function(result){
        $state.go('tab.dash');
        var stock = [];
                  Connexion.all().then(function (argument) {
                      stock = argument.data.data;
                      for(var i=0; i< stock.length; i++){
                        if(stock[i].email == user.pseudo){
                          window.localStorage.setItem("userId", JSON.stringify(stock[i].id));
                          $rootScope.user.id = stock[i].id;
                        }
                      }
            })

      window.localStorage.setItem("user", JSON.stringify(user));
      window.localStorage.setItem("token", JSON.stringify(result));
      });
    }
  }

  $scope.login = login;
});
