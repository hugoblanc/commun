app.service('MessagesService', function ($http, Backand) {
    var service = this,
            baseUrl = '/1/objects/',
            objectName = 'messages/';

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

    service.GetMessages = function (offset) {
        return $http({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/query/data/GetMessages',
            params: {
                parameters: {"offset" : offset}
            }
        });
    };
});

app.service('EventsService', function ($http, Backand) {
    var service = this,
            baseUrl = '/1/objects/',
            objectName = 'events/';

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
});