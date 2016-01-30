app.service('GlobalItems', function ($q, $state, ServiceLogin, $rootScope) {
    var service = this;




    service.delete = function (id) {
        return $http.delete(getUrlForId(id));
    };


    service.prom = function (condition) {
        var deferred = $q.defer();

        if (condition) {
            deferred.resolve("Success");
        } else {
            deferred.reject("Error");
        }

        return deferred.promise;
    };


    service.majValueItems = function (tableau) {
        var actualValue = 0.0;

        for (var i = 0; i < tableau.length; i++) {
            if (tableau[i].isChecked) {
                actualValue = actualValue + tableau[i].prix;
            }
        }

        return actualValue;
    };



    service.arrondiDixiem = function arrondiDixiem(nombre) {
        return Math.round(nombre * 10) / 10;
    };

    service.go = function (page) {
        //si c'est un téléphone 
        if ($rootScope.mobile) {
            $state.go(page);
        } 
        else {
            //si un ordi souhaite accéder a une page mobile, on le redirige
            if (page.substring(0, 4) === "tab.") {
                $state.go('tabO.' + page.substring(4, page.length));
                return;
            }


            //si l'utilisateur veut accéder aux pages Admin, on verifie qu'il est admin
            if (page.substring(0, 8) === "tabAdmin") {
                ServiceLogin.getUserDetails()
                        .then(function (user) {
                            if (user.role !== "Admin") {
                                $state.go('tab.accueil');

                            }
                        }, function () {
                            $state.go('tab.accueil');
                        });
            }
            else{
                $state.go(page);
            }
        }
    };

});