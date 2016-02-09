angular.module('starter.controllers', [])

.controller('TrackController', function($scope) {})

.controller('ActionsController', function($scope, $state, $filter, LocalStorage, TodaysActions, ActionList) {
  var addAction = function(action) {
    TodaysActions.add(action);
  }

  $scope.todaysActions = TodaysActions.all();
  $scope.actionList = ActionList.all();
  $scope.newAction = {
    date: new Date(),
    urge: 2.5,
    actedOn: false
  }

  $scope.saveAction = function() {
    // LocalStorage.set('test', 'WINNER' );
    console.log("date test " + $scope.newAction.name);
    console.log("date test " + $scope.newAction.date);
    console.log("date test " + $scope.newAction.urge);
    console.log("date test " + $scope.newAction.actedOn);
    console.log("date test " + $scope.newAction.notes);
    addAction({
      name: $scope.newAction.name,
      date: $scope.newAction.date,
      urge: $scope.newAction.urge,
      actedOn: $scope.newAction.actedOn,
      notes: $scope.newAction.notes
    });
    var jsonTest = [];
    jsonTest.push($scope.todaysActions);
    console.log(angular.toJson(jsonTest));
    // LocalStorage.set($filter('date')(Date.Now(), 'yyyyMMdd');
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
