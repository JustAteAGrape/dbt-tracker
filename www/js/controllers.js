angular.module('starter.controllers', [])

.controller('NavBarController', function($scope, $ionicHistory, DiaryService) {
  $scope.onBack = function() {
    DiaryService.saveUpdates();
    $ionicHistory.goBack();
  }
})

.controller('ActionListController', function($location, $scope, $state, $ionicPopup, DiaryService) {
  var date = $state.params.aDate;
  date = (date == null || date === "") ? Date.now() : date;
  $scope.actionList = DiaryService.getActionsByDate(date);

  $scope.tapAction = function(actionId) {
    $location.url().includes('diary') ?
      $location.url('/tab/diary/action/edit/' + date + '/' + actionId) :
      $location.url('/tab/today/action/edit/' + date + '/' + actionId);
  };

  $scope.removeAction = function(action) {
    var confirm = $ionicPopup.confirm({
      title: 'Delete Action',
      template: 'Are you sure you want to delete this action?'
    });
    confirm.then(function(res) {
      if(res) {
        DiaryService.removeAction(date, action);
      } else {
        console.log("user canceld action delete");
      }
    });
  };

  $scope.newAction = function() {
    $location.url().includes('diary') ?
      $location.url('/tab/diary/action/new/' + date) :
      $location.url('/tab/today/action/new/' + date);
  };
})

.controller('ActionsController', function($scope, $state, $filter, $ionicPopup, $ionicHistory, DiaryService, ActionTypeList, SkillRatings, IdGenerator) {
  var id = $state.params.aId;
  var date = $state.params.aDate;
  date = (date == null || date === "") ? Date.now() : date;
  var curAction = DiaryService.getActionById(date, id, null);

  var actionPromise = ActionTypeList.get();
  actionPromise.then(function(result){
    $scope.actionTypeList = result;
  });
  var skillRatingPromise = SkillRatings.get();
  skillRatingPromise.then(function(result){
    $scope.skillRatings = result;
  });

  if (curAction == null) {
    $scope.title = "New Action"
    $scope.myAction = {
      displayDate: $filter('date')(Date.now(), 'EEEE, MMM d, yyyy'),
      date: Date.now().toString(),
      urge: 0,
      actedOn: false,
      skillRating: SkillRatings.get(0, null)
    }
  } else {
    $scope.title = "Edit Action"
    $scope.myAction = {
      id: curAction.id,
      name: curAction.name,
      displayDate: $filter('date')(curAction.date, 'EEEE, MMM d, yyyy'),
      date: curAction.date,
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
        DiaryService.addAction(date, {
          id: IdGenerator.getNextId(),
          name: $scope.myAction.name,
          date: $scope.myAction.date,
          urge: $scope.myAction.urge,
          actedOn: $scope.myAction.actedOn,
          skillRating: $scope.myAction.skillRating,
          notes: $scope.myAction.notes
        });
      } else {
        DiaryService.editAction(date, {
          id: id,
          name: $scope.myAction.name,
          date: $scope.myAction.date,
          urge: $scope.myAction.urge,
          actedOn: $scope.myAction.actedOn,
          skillRating: $scope.myAction.skillRating,
          notes: $scope.myAction.notes
        });
      }
      $ionicHistory.goBack();
    }
  };
})

.controller('EmotionsController', function($scope, $state, DiaryService, EmotionList) {
  var date = $state.params.eDate;
  date = (date == null || date === "") ? Date.now() : date;
  var emotionPromise = EmotionList.get();
  emotionPromise.then(function(result){
    angular.forEach(result, function(rawEmotion, index){
      if (DiaryService.getEmotionByName(date, rawEmotion.name, null) == null) {
        DiaryService.addEmotion(date, {
          name: rawEmotion.name,
          src: rawEmotion.src,
          strength: 0
        });
      }
    });
    
    $scope.emotions =  DiaryService.getEmotionsByDate(date);
  });

  $scope.onEmotionChange = function(emotionName, strength) {
    DiaryService.editEmotion(date, {
        name: emotionName,
        strength: strength
      });
  };
})

.controller('CopingController', function($scope, $state, DiaryService, SkillList) {
  var date = $state.params.cDate;
  date = (date == null || date === "") ? Date.now() : date;
  var copingPromise = SkillList.get();
  copingPromise.then(function(result){
    angular.forEach(result, function(rawCategory, index){
      if (DiaryService.getCopingSkillCategoryByName(date, rawCategory.name, null) == null) {
        // Category doesn't exist so safe to assume no underlying skills do either. Build the category then add it to the diary.
        var category = {name: rawCategory.name, skills: []};
        angular.forEach(rawCategory.skills, function(rawSkill, index){
          category.skills.push({
            name: rawSkill.name,
            used: false
          });
        });
        DiaryService.addCopingSkillCategory(date, category);        
      }
      else {
        angular.forEach(rawCategory.skills, function(rawSkill, index){
          if (DiaryService.getCopingSkillByName(date, rawCategory.name, rawSkill.name, null) == null) {
            DiaryService.addCopgingSkill(date, rawCategory.name, {
              name: rawSkill.name,
              used: false
            });
          }
        });
      }
    });
  })

  $scope.copingSkills = DiaryService.getCopingSkillsByDate(date);

  $scope.onSkillChange = function(categoryName, skillName, used) {
    DiaryService.editCopingSkill(date, categoryName, {
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

.controller('DiaryController', function($location, $scope, DiaryService) {
  $scope.diarySummary = DiaryService.getDiarySummary();

  $scope.tapAction = function(date) {
    $location.url('/tab/diary/actions/' + date);
  };

  $scope.tapEmotion = function(date) {
    $location.url('/tab/diary/emotions/' + date);
  };

  $scope.tapCoping = function(date) {
    $location.url('/tab/diary/coping/' + date);
  };

  $scope.toggleEntry = function(entry) {
    if ($scope.isEntryShown(entry)) {
      $scope.shownSummaryEntry = null;
    } else {
      $scope.shownSummaryEntry = entry;
    }
  };

  $scope.isEntryShown = function(entry) {
    return $scope.shownSummaryEntry === entry;
  };
})

.controller('SettingsController', function($scope) {});
