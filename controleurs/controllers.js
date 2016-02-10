angular.module('starter.controllers', ["ui.router", ])





.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})



.controller('AccountCtrl', function($scope) {
    
});

