angular.module('starter.controllers', [])

.controller('TrackController', function($scope) {})

.controller('ActionsController', function($scope, $state, $filter, $ionicPopup, LocalStorage, TodaysActions, ActionList, IdGenerator) {
  var id = $state.params.aId;
  var curAction = TodaysActions.get(id, null);
  var addAction = function(action) {
    TodaysActions.add(action);
  }
  var editAction = function(modifiedAction) {
    TodaysActions.edit(modifiedAction);
  }

  $scope.todaysActions = TodaysActions.all();
  $scope.actionList = ActionList.all();

  if (curAction == null) {
    $scope.title = "New Action"
    $scope.myAction = {
      date: new Date(),
      urge: 2.5,
      actedOn: false
    }
  } else {
    $scope.title = "Edit Action"
    $scope.myAction = {
      id: curAction.id,
      name: curAction.name,
      date: new Date(curAction.date),
      urge: curAction.urge,
      actedOn: curAction.actedOn,
      notes: curAction.notes
    }
  }

  $scope.saveAction = function() {
    if ($scope.myAction.name == null) {
      $ionicPopup.alert({
        title: 'Missing Data',
        template: 'Please choose an action from the list.'
      });
    } else {
      if (id == null) {
        addAction({
          id: IdGenerator.getNextId(),
          name: $scope.myAction.name,
          date: $scope.myAction.date,
          urge: $scope.myAction.urge,
          actedOn: $scope.myAction.actedOn,
          notes: $scope.myAction.notes
        });
      } else {
        editAction({
          id: id,
          name: $scope.myAction.name,
          date: $scope.myAction.date,
          urge: $scope.myAction.urge,
          actedOn: $scope.myAction.actedOn,
          notes: $scope.myAction.notes
        });
      }
      LocalStorage.set($filter('date')(Date.now(), 'yyyyMMdd'), angular.toJson($scope.todaysActions));
      $state.go('tab.todaysActions');
    }
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
