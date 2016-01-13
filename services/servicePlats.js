
app.service('PlatsService', function ($http, Backand, $q) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'plats/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    service.all = function () {
        return $http.get(getUrl());
    };

    service.create = function (object) {
        var deferred = $q.defer();
        $http.post(getUrl(), object).then(function successCallback(resultat){
            deferred.resolve(resultat);
        }, function errorCallback(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };
});

app.service('SaucesService', function ($http, Backand) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'listesauces/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    service.all = function () {
        return $http.get(getUrl());
    };
});

app.service('PlatPrepService', function ($http, Backand) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'listeplatsp/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    service.all = function () {
        return $http.get(getUrl());
    };
});


app.service('PlatPrepCommandeService', function ($http, Backand) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'platprepares/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    service.all = function () {
        return $http.get(getUrl());
    };
});

app.service('SauceCommandeService', function ($http, Backand, $q) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'sauces/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    service.all = function () {
        return $http.get(getUrl());
    };

    service.create = function (object) {
        var deferred = $q.defer();
        $http.post(getUrl(), object).then(function successCallback(resultat){
            deferred.resolve(resultat);
        }, function errorCallback(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

});

app.service('PlatPrepService', function ($http, Backand, $q) {
    var service = this,
        baseUrl = '/1/objects/',
        objectName = 'listePlatsPrepare/';

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    service.all = function () {
        return $http.get(getUrl());
    };

    service.create = function (object) {
        var deferred = $q.defer();
        $http.post(getUrl(), object).then(function successCallback(resultat){
            deferred.resolve(resultat);
        }, function errorCallback(response) {
            deferred.reject(response);
        });
        return deferred.promise;
    };

});