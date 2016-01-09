app.service('Connexion', function (Backand, $http) {
    // Might use a resource here that returns a JSON array
    var self = this,
            baseUrl = '/1/objects/',
            objectName = 'users/';
    self.appName = 'mabase';

    self.signin = function (email, password, appName) {
        //call Backand for sign in
        return Backand.signin(email, password);
    };


    self.anonymousLogin = function () {
        // don't have to do anything here,
        // because we set app token att app.js
    };

    self.signout = function () {
        return Backand.signout();
    };


    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    function getUrlForId(id) {
        return getUrl() + id;
    }

    self.all = function () {
        return $http.get(getUrl());
    };

    self.changePassword = function (oldPassword, newPassword) {
        return Backand.changePassword(oldPassword, newPassword);
    };

    self.requestResetPassword = function (username) {
        return Backand.requestResetPassword(username, self.appName);
    };

    self.resetPassword = function (password, token) {
        return Backand.resetPassword(password, token);
    };

    self.logout = function () {
        Backand.signout().then(function () {
            angular.copy({}, self.currentUser);
        });
    };


});
