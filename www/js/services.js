angular.module('starter.services', [])

.factory('LocalStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('IdGenerator', function(LocalStorage) {
  var id = LocalStorage.get("lastId", 0);

  return {
    getNextId: function() {
      id++;
      LocalStorage.set("lastId", id);
      return id;
    }
  };
})

.factory('TodaysDiary', function($filter, LocalStorage) {
  var rawDiary = LocalStorage.get($filter('date')(Date.now(), 'yyyyMMdd'), null);
  
  var diary = rawDiary == null ? {actions: [], emotions: [], copingSkills: []} : angular.fromJson(rawDiary);

  var changesMade = false;

  return {
    getActions: function() {
      return diary.actions;
    },
    getActionById: function(id, defaultValue) {
      var actionReturn = defaultValue;
      angular.forEach(diary.actions, function(action, index){
        if (action.id == id){
          actionReturn = action;
        }
      });
      return actionReturn;
    },
    addAction: function(action) {
      diary.actions.push(action);
      changesMade = true;
    },
    editAction: function(action) {
      angular.forEach(diary.actions, function(diaryAction, index){
        if (diaryAction.id == action.id) {
          diaryAction.name = action.name;
          diaryAction.date = action.date;
          diaryAction.urge = action.urge;
          diaryAction.actedOn = action.actedOn;
          diaryAction.skillRating = action.skillRating;
          diaryAction.notes = action.notes;
        }
      });
      changesMade = true;
    },
    removeAction: function(action) {
      diary.actions.splice(diary.actions.indexOf(action), 1);
      changesMade = true;
    },
    getEmotions: function() {
      return diary.emotions;
    },
    getEmotionByName: function(name, defaultValue) {
      var emotionReturn = defaultValue;
      angular.forEach(diary.emotions, function(diaryEmotion, index){
        if (diaryEmotion.name == name) {
          emotionReturn = diaryEmotion;
        }
      });
      return emotionReturn;
    },
    addEmotion: function(emotion) {
      diary.emotions.push(emotion);
      changesMade = true;
    },
    editEmotion: function(emotion) {
      angular.forEach(diary.emotions, function(diaryEmotion, index){
        if (diaryEmotion.name == emotion.name) {
          diaryEmotion.strength = emotion.strength;
        }
      });
      changesMade = true;
    },
    getCopingSkillCategoryByName: function(categoryName, defaultValue) {
      copingSkillCategoryReturn = defaultValue;
      angular.forEach(diary.copingSkills, function(diaryCopingSkillCategory, index){
        if (diaryCopingSkillCategory.name == categoryName) {
          copingSkillCategoryReturn = diaryCopingSkillCategory;
        }
      });
      return copingSkillCategoryReturn;
    },
    addCopingSkillCategory: function(category) {
      diary.copingSkills.push(category);
      changesMade = true;
    },
    getCopingSkillByName: function(categoryName, skillName, defaultValue) {
      var copingSkillReturn = defaultValue;
      angular.forEach(diary.copingSkills, function(diaryCopingSkillCategory, index){
        if (diaryCopingSkillCategory.name == categoryName) {
          angular.forEach(diaryCopingSkillCategory.skills, function(diaryCopingSkill, index){
            if (diaryCopingSkill.name == skillName) {
              copingSkillReturn = diaryCopingSkill;
            }
          });
        }
      });
      return copingSkillReturn;
    },
    addCopgingSkill: function(categoryName, skill) {
      angular.forEach(diary.copingSkills, function(diaryCopingSkillCategory, index){
        if (diaryCopingSkillCategory.name == categoryName) {
          diaryCopingSkillCategory.skills.push(skill);
          changesMade = true;
        }
      });
    },
    getCopingSkills: function() {
      return diary.copingSkills;
    },
    editCopingSkill: function(categoryName, skill) {
      angular.forEach(diary.copingSkills, function(diaryCopingSkillCategory, index){
        if (diaryCopingSkillCategory.name == categoryName) {
          angular.forEach(diaryCopingSkillCategory.skills, function(diaryCopingSkill, index){
            if (diaryCopingSkill.name == skill.name) {
              diaryCopingSkill.used = skill.used;
            }
          });
        }
      });
      changesMade = true;
    },
    saveUpdates: function() {
      if (changesMade) {
        LocalStorage.set($filter('date')(Date.now(), 'yyyyMMdd'), angular.toJson(diary));
        // TODO: Push changes to web service
      }
      changesMade = false;
    }
  }
})

.factory('SkillRatings', function($http) {
  // Might use a resource here that returns a JSON array
  var getSkillRatings = function() {
    return $http.get("data/copingUsage.json").then(function(response){
      return response.data;
    })
  };
  return { get: getSkillRatings };
})

.factory('ActionList', function($http) {
  // Might use a resource here that returns a JSON array
  var getActions = function() {
    return $http.get("data/actions.json").then(function(response){
      return response.data;
    })
  };
  return { get: getActions };
})

.factory('EmotionList', function($http) {
  // Might use a resource here that returns a JSON array
  var getEmotions = function() {
    return $http.get("data/emotions.json").then(function(response){
      return response.data;
    });
  };
  return { get: getEmotions };
})

.factory('SkillList', function($http) {
  // Might use a resource here that returns a JSON array
  var getCopingSkills = function() {
    return $http.get("data/copingSkills.json").then(function(response){
      return response.data;
    });
  };
  return { get: getCopingSkills };
});