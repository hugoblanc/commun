(function () {
    app.controller('parametresCtrl', ['Connexion', '$location', parametresCtrl]);
    
    function parametresCtrl(Connexion, $location) {
        var self = this;

        function init() {
            self.token = $location.search().token;
        }

        self.update = function () {
            self.error = null;
            self.success = null;

            if (self.newPassword !== self.confirmPassword) {
                self.error = 'Les mot de passes sont différents';
            } else {
                if(self.token){
                    Connexion.resetPassword(self.newPassword, self.token)
                        .then(changePasswordSuccess, changePasswordError);
                }
                else{
                    Connexion.changePassword(self.oldPassword, self.newPassword)
                        .then(changePasswordSuccess, changePasswordError);
                }
                         
                        
            }
        };

        function changePasswordSuccess() {
            self.oldPassword = self.newPassword = self.confirmPassword = null;
            self.success = 'Password was changed successfully.';
        }

        function changePasswordError(response) {
            self.error = response && response.data || 'Unknown error from server';
        }

        init();
    }
})();