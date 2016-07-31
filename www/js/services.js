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

.factory('DiaryService', function($filter, LocalStorage) {
  var changesMade = false;
  var diaryService = {};
  var rawData = LocalStorage.get('dbt-diary', null);
  // TODO: rename to diary
  var diaryData = rawData == null ? [] : angular.fromJson(rawData);

  diaryData.sort(function(a,b){
    return b.date - a.date;
  });

  // TODO: Allow the size of the diary view to be configurable from the server side by the therapist

  var saveDiary = function() {
    if (changesMade) {
      LocalStorage.set('dbt-diary', angular.toJson(diaryData));
      // TODO: Push changes to web service
    }
    changesMade = false;
  };

  var getEntryByDate = function(date) {
    matchingEntry = null;
    angular.forEach(diaryData, function (entry, key) {
      if ($filter('date')(entry.date, 'yyyyMMdd') == 
          $filter('date')(date, 'yyyyMMdd'))
      {
        matchingEntry = entry;
      }
    })
    return matchingEntry;
  };

  var todaysEntry = getEntryByDate(Date.now())
  if (todaysEntry == null)
  {
    diaryData.push({
      date: Date.now().toString(),
      actions: [],
      emotions: [],
      copingSkills: []
    })
    changesMade = true;
    saveDiary();
  }

  // Diary Service contains business logic for accessing and manipulating the diary entries
  diaryService.saveUpdates = saveDiary; 

  diaryService.getDiarySummary = function() {
    var diarySummary = [];
    angular.forEach(diaryData, function(entry, key) {
      diarySummary.push({
        date: entry.date,
        dateFormatted: $filter('date')(entry.date, 'EEEE, MMM d, yyyy'),
        actionCount: entry.actions.length
      })
    });
    return diarySummary;
  }

  diaryService.getActionsByDate = function(date) {
    var entry = getEntryByDate(date);
    return entry.actions;
  };

  diaryService.getActionById = function(date, id, defaultValue) {
    var entry = getEntryByDate(date);
    var actionReturn = defaultValue;
    angular.forEach(entry.actions, function(action, index){
        if (action.id == id){
          actionReturn = action;
        }
      });
    return actionReturn;
  };

  diaryService.addAction = function(date, action) {
    var entry = getEntryByDate(date);
    entry.actions.push(action);
    changesMade = true;
  };

  diaryService.editAction = function(date, action) {
    var entry = getEntryByDate(date);
    angular.forEach(entry.actions, function(entryAction, index){
      if (entryAction.id == action.id) {
        entryAction.name = action.name;
        entryAction.date = action.date;
        entryAction.urge = action.urge;
        entryAction.actedOn = action.actedOn;
        entryAction.skillRating = action.skillRating;
        entryAction.notes = action.notes;
      }
    });
    changesMade = true;
  };

  diaryService.removeAction = function(date, action) {
    var entry = getEntryByDate(date);
    entry.actions.splice(entry.actions.indexOf(action), 1);
    changesMade = true;
  };

  diaryService.getEmotionsByDate = function(date) {
      var entry = getEntryByDate(date);
      return entry.emotions;
  };

  diaryService.getEmotionByName = function(date, name, defaultValue) {
    var entry = getEntryByDate(date);
    var emotionReturn = defaultValue;
    angular.forEach(entry.emotions, function(diaryEmotion, index){
      if (diaryEmotion.name == name) {
        emotionReturn = diaryEmotion;
      }
    });
    return emotionReturn;
  };

  diaryService.addEmotion = function(date, emotion) {
    var entry = getEntryByDate(date);
    entry.emotions.push(emotion);
    changesMade = true;
  };

  diaryService.editEmotion = function(date, emotion) {
    var entry = getEntryByDate(date);
    angular.forEach(entry.emotions, function(diaryEmotion, index) {
      if (diaryEmotion.name == emotion.name) {
        diaryEmotion.strength = emotion.strength;
      }
    });
    changesMade = true;
  };

  diaryService.getCopingSkillCategoryByName = function(date, categoryName, defaultValue) {
    var entry = getEntryByDate(date);
    copingSkillCategoryReturn = defaultValue;
    angular.forEach(entry.copingSkills, function(diaryCopingSkillCategory, index){
      if (diaryCopingSkillCategory.name == categoryName) {
        copingSkillCategoryReturn = diaryCopingSkillCategory;
      }
    });
    return copingSkillCategoryReturn;
  };

  diaryService.addCopingSkillCategory = function(date, category) {
    var entry = getEntryByDate(date);
    entry.copingSkills.push(category);
    changesMade = true;
  };

  diaryService.getCopingSkillByName = function(date, categoryName, skillName, defaultValue) {
    var entry = getEntryByDate(date);
    var copingSkillReturn = defaultValue;
    angular.forEach(entry.copingSkills, function(diaryCopingSkillCategory, index){
      if (diaryCopingSkillCategory.name == categoryName) {
        angular.forEach(diaryCopingSkillCategory.skills, function(diaryCopingSkill, index){
          if (diaryCopingSkill.name == skillName) {
            copingSkillReturn = diaryCopingSkill;
          }
        });
      }
    });
    return copingSkillReturn;
  };

  diaryService.addCopgingSkill = function(date, categoryName, skill) {
    var entry = getEntryByDate(date);
    angular.forEach(entry.copingSkills, function(diaryCopingSkillCategory, index) {
      if (diaryCopingSkillCategory.name == categoryName) {
        diaryCopingSkillCategory.skills.push(skill);
        changesMade = true;
      }
    });
  };

  diaryService.getCopingSkillsByDate = function(date) {
    var entry = getEntryByDate(date);
    return entry.copingSkills;
  };

  diaryService.editCopingSkill = function(date, categoryName, skill) {
    var entry = getEntryByDate(date);
    angular.forEach(entry.copingSkills, function(diaryCopingSkillCategory, index) {
      if (diaryCopingSkillCategory.name == categoryName) {
        angular.forEach(diaryCopingSkillCategory.skills, function(diaryCopingSkill, index) {
          if (diaryCopingSkill.name == skill.name) {
            diaryCopingSkill.used = skill.used;
          }
        });
      }
    });
    changesMade = true;
  };

  return diaryService;
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