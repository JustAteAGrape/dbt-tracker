angular.module('starter.controllers', [])

.controller('TrackController', function($scope) {})

.controller('ActionsController', function($scope, $state, $filter, LocalStorage, TodaysActions, ActionList, IdGenerator) {
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
    $scope.newAction = {
      date: new Date(),
      urge: 2.5,
      actedOn: false
    }
  } else {
    $scope.newAction = {
      id: curAction.id,
      name: curAction.name,
      date: new Date(curAction.date),
      urge: curAction.urge,
      actedOn: curAction.actedOn,
      notes: curAction.notes
    }
  }

  $scope.saveAction = function() {
    if (id == null) {
      addAction({
        id: IdGenerator.getNextId(),
        name: $scope.newAction.name,
        date: $scope.newAction.date,
        urge: $scope.newAction.urge,
        actedOn: $scope.newAction.actedOn,
        notes: $scope.newAction.notes
      });
    } else {
      editAction({
        id: id,
        name: $scope.newAction.name,
        date: $scope.newAction.date,
        urge: $scope.newAction.urge,
        actedOn: $scope.newAction.actedOn,
        notes: $scope.newAction.notes
      });
    }
    LocalStorage.set($filter('date')(Date.now(), 'yyyyMMdd'), angular.toJson($scope.todaysActions));
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
