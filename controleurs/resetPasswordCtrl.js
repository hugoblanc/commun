'use strict';
(function () {
    /**
     * @ngdoc function
     * @name todoApp.controller:ResetPasswordCtrl
     * @description
     * # ResetPasswordCtrl
     * Backand reset password controller - request change password link to be sent via email
     */

app.controller('resetPasswordCtrl', ['Connexion', '$location', '$state', ResetPasswordCtrl]);

    function ResetPasswordCtrl(Connexion, $location, $state) {
        var self = this;

        function init() {
            self.token = $location.search().token;
            self.sendEmail = !angular.isDefined(self.token);
        }

        self.reset = function () {
            self.error = null;
            self.success = null;

            if (self.sendEmail) {
                Connexion.requestResetPassword(self.username)
                    .then(
                    function () {
                        self.success = 'Please check your email to continue';
                    },
                    function (response) {
                        if(response.status === 406){
                            self.error = "Veuillez entrer l'email d'un compte existant";
                        }
                        else{
                            self.error = "Erreur inconnue";
                            //self.error = response && response.data || 'Unknown error from server';
                        }
                        console.log(response);
                    }
                );
            }
            else {
                if (self.newPassword !== self.confirmPassword) {
                    self.error = 'Les mots de passes sont différents';
                }
                else
                    Connexion.resetPassword(self.newPassword, self.token)
                        .then(
                        function () {
                            $state.go('signin');
                        },
                        function (response) {
                            self.error = response && response.data || 'Unknown error from server';
                            console.log(response);
                        }
                    );
            }
        };

        init();
    }


})();