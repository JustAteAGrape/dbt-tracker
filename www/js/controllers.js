angular.module('starter.controllers', [])

.controller('DiaryController', function($scope, $ionicHistory, TodaysDiary) {
  $scope.onBack = function() {
    TodaysDiary.saveUpdates();
    $ionicHistory.goBack();
  }
})

.controller('ActionListController', function($window, $scope, $ionicPopup, TodaysDiary) {
  $scope.todaysActions = TodaysDiary.getActions();

  $scope.tapAction = function(actionId) {
    $window.location.href = '#/tab/editAction/' + actionId;
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

.controller('ActionsController', function($scope, $state, $filter, $ionicPopup, LocalStorage, TodaysDiary, ActionList, SkillRatings, IdGenerator) {
  var id = $state.params.aId;
  var curAction = TodaysDiary.getActionById(id, null);

  var actionPromise = ActionList.get();
  actionPromise.then(function(result){
    $scope.actionList = result;
  });
  var skillRatingPromise = SkillRatings.get();
  skillRatingPromise.then(function(result){
    $scope.skillRatings = result;
  });

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
})

.controller('EmotionsController', function($scope, $state, TodaysDiary, EmotionList) {
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

  $scope.onEmotionChange = function(emotionName, strength) {
    TodaysDiary.editEmotion({
        name: emotionName,
        strength: strength
      });
  };
})

.controller('CopingController', function($scope, TodaysDiary, SkillList) {
  var copingPromise = SkillList.get();
  copingPromise.then(function(result){
    for (var entry in result) {
      var rawCategory = result[entry];
      if (TodaysDiary.getCopingSkillCategoryByName(rawCategory.name, null) == null) {
        // Category doesn't exist so safe to assume no underlying skills do either. Build the category then add it to the diary.
        var category = {name: rawCategory.name, skills: []};
        for (var skill in rawCategory.skills) {
          category.skills.push({
            name: skill.name,
            used: false
          })
        }
        TodaysDiary.addCopingSkillCategory(category);        
      }
      else {
        for (var skill in rawCategory.skills) {
          var rawSkill = rawCategory[skill];
          if (TodaysDiary.getCopingSkillByName(rawCategory.name, rawSkill.name, null) == null) {
            TodaysDiary.addCopgingSkill(rawCategory.name, {
              name: rawSkill.name,
              used: false
            });
          }
        }
      }
    }
  })

  $scope.copingSkills = TodaysDiary.getCopingSkills();

  $scope.onSkillChange = function(categoryName, skillName, used) {
    TodaysDiary.editCopingSkill(categoryName, {
      name: skillName,
      used: used
    });
  };

  $scope.toggleCategory = function(category) {
    if ($scope.isCategoryShown(category)) {
      $scope.shownCopingCategory = null;
    } else {
      $scope.shownCopingCategory = category;
    }
  };

  $scope.isCategoryShown = function(category) {
    return $scope.shownCopingCategory === category;
  };
})

.controller('HistoryController', function($scope) {})

.controller('SettingsController', function($scope) {});
