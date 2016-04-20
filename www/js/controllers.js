angular.module('starter.controllers', [])

.controller('TrackController', function($scope) {

})

.controller('ActionsController', function($window, $scope, $state, $filter, $ionicPopup, LocalStorage, TodaysDiary, ActionList, SkillRatings, IdGenerator) {
  var id = $state.params.aId;
  var curAction = TodaysDiary.getActionById(id, null);

  $scope.todaysActions = TodaysDiary.getActions();
  $scope.actionList = ActionList.all();
  $scope.skillRatings = SkillRatings.all();

  if (curAction == null) {
    $scope.title = "New Action"
    $scope.myAction = {
      date: new Date(),
      urge: 2.5,
      actedOn: false,
      skillRating: SkillRatings.get(0, null)
    }
  } else {
    $scope.title = "Edit Action"
    $scope.myAction = {
      id: curAction.id,
      name: curAction.name,
      date: new Date(curAction.date),
      urge: curAction.urge,
      actedOn: curAction.actedOn,
      skillRating: curAction.skillRating,
      notes: curAction.notes
    }
  }

  $scope.tapAction = function(actionId) {
    $window.location.href = '#/tab/editAction/' + actionId;
  };

  $scope.saveAction = function() {
    if ($scope.myAction.name == null) {
      $ionicPopup.alert({
        title: 'Missing Data',
        template: 'Please choose an action from the list.'
      });
    } else {
      if (id == null) {
        TodaysDiary.addAction({
          id: IdGenerator.getNextId(),
          name: $scope.myAction.name,
          date: $scope.myAction.date,
          urge: $scope.myAction.urge,
          actedOn: $scope.myAction.actedOn,
          skillRating: $scope.myAction.skillRating,
          notes: $scope.myAction.notes
        });
      } else {
        TodaysDiary.editAction({
          id: id,
          name: $scope.myAction.name,
          date: $scope.myAction.date,
          urge: $scope.myAction.urge,
          actedOn: $scope.myAction.actedOn,
          skillRating: $scope.myAction.skillRating,
          notes: $scope.myAction.notes
        });
      }
      $state.go('tab.todaysActions');
    }
  };

  $scope.removeAction = function(action) {
    var confirm = $ionicPopup.confirm({
      title: 'Delete Action',
      template: 'Are you sure you want to delete this action?'
    });
    confirm.then(function(res) {
      if(res) {
        TodaysDiary.removeAction(action);
      } else {
        console.log("user canceld action delete");
      }
    });
  };
})

.controller('EmotionsController', function($scope, $state, TodaysDiary, EmotionList) {
  // var diaryEmotions = [];
  // var emotionPromise = EmotionList.get();
  // emotionPromise.then(function(result){
  //   for (var entry in result) {
  //     var rawEmotion = result[entry];
  //     if (TodaysDiary.getEmotionByName(rawEmotion.name, null) == null) {
  //       TodaysDiary.addEmotion({
  //         name: rawEmotion.name,
  //         src: rawEmotion.src,
  //         strength: 0
  //       });
  //     }
  //   }
  //   diaryEmotions =  TodaysDiary.getEmotions();
  //   $scope.emotionTuples = [];
  //   while(diaryEmotions.length) {
  //     $scope.emotionTuples.push(diaryEmotions.splice(0,2));
  //   }
  // });
  var diaryEmotions = [];
  var emotionPromise = EmotionList.get();
  emotionPromise.then(function(result){
    for (var entry in result) {
      var rawEmotion = result[entry];
      if (TodaysDiary.getEmotionByName(rawEmotion.name, null) == null) {
        TodaysDiary.addEmotion({
          name: rawEmotion.name,
          src: rawEmotion.src,
          strength: 0
        });
      }
    }
    
    $scope.emotions =  TodaysDiary.getEmotions();
  });

  $scope.saveEmotions = function() {
    Array.prototype.forEach.call(document.querySelectorAll('.emotionContainer'), function (elem) {
      TodaysDiary.editEmotion({
        name: elem.querySelector('.emotionName').textContent,
        strength: elem.querySelector('.emotionStrength').value
      });
    });
    $state.go('tab.track');
    // for (var entry in saveList) {
    //   var rawEmotion = saveList[entry];
    //   var newStrength = angular.element(document.getElementById(rawEmotion.name + '.strength')).val();
    //   TodaysDiary.editEmotion({
    //       name: rawEmotion.name,
    //       src: rawEmotion.src,
    //       strength: newStrength
    //     });
    //   $state.go('tab.track');
    // }    
  };

  // var emotionPromise = EmotionList.get();
  // emotionPromise.then(function(result){
  //   rawEmotionList = result;
  // });

  // for (var rawEmotion in rawEmotionList) {
  //   if (TodaysDiary.getEmotionByName(rawEmotion.name, null) == null) {
  //     TodaysDiary.addEmotion({
  //       name: rawEmotion.name,
  //       src: rawEmotion.src,
  //       strength: 0
  //     });
  //     break;
  //   }
  // }

  // diaryEmotions =  TodaysDiary.getEmotions();
  // $scope.emotionList = diaryEmotions;
  // $scope.emotionTuples = [];
  // while(diaryEmotions.length) {
  //   $scope.emotionTuples.push(diaryEmotions.splice(0,2));
  // }
  // $scope.strengths = {};

  // $scope.saveEmotions = function() {
  //   for (var emotion in $scope.emotionList) {
  //     TodaysDiary.editEmotion({
  //       name: emotion.name,
  //       strength: strengths[emotion.name]
  //     });
  //   }
  //   // if ($scope.myAction.name == null) {
  //   //   $ionicPopup.alert({
  //   //     title: 'Missing Data',
  //   //     template: 'Please choose an action from the list.'
  //   //   });
  //   // } else {
  //   //   if (id == null) {
  //   //     TodaysDiary.addAction({
  //   //       id: IdGenerator.getNextId(),
  //   //       name: $scope.myAction.name,
  //   //       date: $scope.myAction.date,
  //   //       urge: $scope.myAction.urge,
  //   //       actedOn: $scope.myAction.actedOn,
  //   //       skillRating: $scope.myAction.skillRating,
  //   //       notes: $scope.myAction.notes
  //   //     });
  //   //   } else {
  //   //     TodaysDiary.editAction({
  //   //       id: id,
  //   //       name: $scope.myAction.name,
  //   //       date: $scope.myAction.date,
  //   //       urge: $scope.myAction.urge,
  //   //       actedOn: $scope.myAction.actedOn,
  //   //       skillRating: $scope.myAction.skillRating,
  //   //       notes: $scope.myAction.notes
  //   //     });
  //   //   }
  //   //   $state.go('tab.todaysActions');
  //   // }
  // }; 
})

.controller('CopingController', function($scope) {})

.controller('HistoryController', function($scope) {})

.controller('SettingsController', function($scope) {});
