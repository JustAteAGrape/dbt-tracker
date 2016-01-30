angular.module('starter.controllers', [])

.controller('TrackController', function($scope) {})

.controller('ActionsController', function($scope, $state, ActionLog, ActionList) {
  var addAction = function(action) {
    ActionLog.add(action);
  }

  $scope.actionLog = ActionLog.all();
  $scope.actionList = ActionList.all();

  $scope.saveAction = function() {
    addAction({name: 'New Action'});
    $state.go('tab.actions');
  };
})

.controller('EmotionsController', function($scope) {})

.controller('CopingController', function($scope) {})

.controller('HistoryController', function($scope) {})

.controller('SettingsController', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
