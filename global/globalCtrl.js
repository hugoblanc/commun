app.controller('GlobalCtrl', function ($scope, $timeout, $sce) {
    
    $scope.message = {};
    $scope.message.display = false;
    
    $scope.showMessage = function(message, success){
        $scope.message.text = message;
        if(success){
           $scope.message.class = "animated slideInDown bar bar-header bar-balanced"; 
        }
        else{
            $scope.message.class = "animated slideInDown bar bar-header bar-assertive";
        }
        $scope.message.display = true;
        
        $timeout(function () {
            hide(success);
        }, 5000);
    };
    
    
    function hide(success){
        if(success){
           $scope.message.class = "animated slideOutUp bar bar-header bar-balanced"; 
        }
        else{
            $scope.message.class = "animated slideOutUp bar bar-header bar-assertive";
        }
    }
});

