
app.service('CommandeService', function ($http, Backand) {
    var service = this,
            baseUrl = '/1/objects/',
            objectName = 'commandes/';

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

    service.getAllCommandes = function () {
        return $http({
            method: 'GET',
            url: getUrl(),
            params: {
                sort: [{"fieldName": "date", "order": "asc"}],
                pageSize : 1000
            }
        });
    };

    service.getCommandesDetail = function (id) {
        return $http({
            method: 'GET',
            url: getUrl() + '/' + id,
            params: {
                deep: true,
                level: 3
            }
        });
    };

    service.getCommandesSup = function (id) {
        return $http({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/query/data/GetCommandeSup',
            params: {
                parameters: {
                    id: id
                }
            }
        });
    };
    
    service.createCommande = function(commande){
        return $http({
            method: 'POST',
            url: getUrl(),
            data : commande,
            params: {
                deep: true
            }
        });
    };


    

});