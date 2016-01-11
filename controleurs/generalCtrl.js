app.controller('generalCtrl', function ($state) {
    
    var self = this;
    //self.user = $rootScope.user; 
    function init() {
        self.user = JSON.parse(window.localStorage.getItem("currentUser"));
        if(self.user === null){
            $state.go('signin');
        }
    }
    
    init();
    
});

