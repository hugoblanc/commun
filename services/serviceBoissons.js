

    app.service('CommandeBoissonService', function ($http, Backand, $q) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'boissons/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
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

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

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
        }
    })

      app.service('BoissonService', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'listeboissons/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (id) {
            return $http.get(getUrlForId(id));
        };

        service.create = function (object) {

            return $http.post(getUrl(), object);
        };

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForId(id));
        };
    })