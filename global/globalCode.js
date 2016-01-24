app.service('GlobalItems', function ($q) {
    var service = this;
    



    service.delete = function (id) {
        return $http.delete(getUrlForId(id));
    };


    service.prom = function(condition) {
        var deferred = $q.defer();

        if(condition) {
            deferred.resolve("Success");
        } else {
            deferred.reject("Error");
        }

        return deferred.promise;
    };


    service.majValueItems = function(tableau){
        var actualValue = 0.0;

        for(var i = 0 ; i < tableau.length ; i++){
            if(tableau[i].isChecked){
                actualValue = actualValue + tableau[i].prix;
            }
        }

        return actualValue;
    };

});