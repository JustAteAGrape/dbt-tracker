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
  //var rawData = LocalStorage.get($filter('date')(Date.now(), 'yyyyMMdd'), null);
  var rawData = LocalStorage.get('dbt-diary', null);
  var diaryData = rawData == null ? {diary: []} : angular.fromJson(rawData);
  var todaysEntry = null;

  for (var i=0, len = diaryData.diary.length; i < len; i++) {
    var entry = diaryData.diary[i];
    if (entry.date === $filter('date')(Date.now(), 'yyyyMMdd')) {
      todaysEntry = entry;
      break;
    }
  }

  if (todaysEntry == null) {
    todaysEntry = {date: $filter('date')(Date.now(), 'yyyyMMdd'), actions: [], emotions: [], copingSkills: []};
  }

  var changesMade = false;

  return {
    getActions: function() {
      return todaysEntry.actions;
    },
    getActionById: function(id, defaultValue) {
      for (var i in todaysEntry.actions) {
        if (todaysEntry.actions[i].id == id) {
          return todaysEntry.actions[i];
        }
      }
      return defaultValue;
    },
    addAction: function(action) {
      todaysEntry.actions.push(action);
      changesMade = true;
    },
    editAction: function(action) {
      for (var i in todaysEntry.actions) {
        if (todaysEntry.actions[i].id == action.id) {
          todaysEntry.actions[i].name = action.name;
          todaysEntry.actions[i].date = action.date;
          todaysEntry.actions[i].urge = action.urge;
          todaysEntry.actions[i].actedOn = action.actedOn;
          todaysEntry.actions[i].skillRating = action.skillRating;
          todaysEntry.actions[i].notes = action.notes;
          break;
        }        
      }
      changesMade = true;
    },
    removeAction: function(action) {
      todaysEntry.actions.splice(todaysEntry.actions.indexOf(action), 1);
      changesMade = true;
    },
    getEmotions: function() {
      return todaysEntry.emotions;
    },
    getEmotionByName: function(name, defaultValue) {
      for (var entry in todaysEntry.emotions) {
        var emotion = todaysEntry.emotions[entry];
        if (emotion.name == name) {
          return emotion;
        }
      }
    },
    addEmotion: function(emotion) {
      todaysEntry.emotions.push(emotion);
      changesMade = true;
    },
    editEmotion: function(emotion) {
      for (var i in todaysEntry.emotions) {
        if (todaysEntry.emotions[i].name == emotion.name) {
          todaysEntry.emotions[i].strength = emotion.strength;
          break;
        }        
      }
      changesMade = true;
    },
    getCopingSkillCategoryByName: function(categoryName, defaultValue) {
      for (var i in todaysEntry.copingSkills) {
        var category = todaysEntry.copingSkills[i];
        if (category.name == categoryName) {
          return category;
        }
      }
      return defaultValue;
    },
    addCopingSkillCategory: function(category) {
      todaysEntry.copingSkills.push(category);
      changesMade = true;
    },
    getCopingSkillByName: function(categoryName, skillName, defaultValue) {
      for (var i in todaysEntry.copingSkills) {
        var category = todaysEntry.copingSkills[i];
        if (category.name == categoryName) {
          for (var j in category.skills) {
            var skill = category[j];
            if (skill.name == skillName) {
              return skill;
            }
          }
        }
      }
      return defaultValue;
    },
    addCopgingSkill: function(categoryName, skill) {
      for (var i in todaysEntry.copingSkills) {
        var category = todaysEntry.copingSkills[i];
        if (category.name == categoryName) {
          todaysEntry.copingSkills[i].skills.push(skill);
          changesMade = true;
        }
      }
    },
    getCopingSkills: function() {
      return todaysEntry.copingSkills;
    },
    saveUpdates: function() {
      if (changesMade) {
        for (var i=0, len = diaryData.diary.length; i < len; i++) {
          var entry = diaryData.diary[i];
          if (entry.date === $filter('date')(Date.now(), 'yyyyMMdd')) {
            diaryData.diary.splice(i,1);
            break;
          }
        }
        diaryData.diary.push(todaysEntry);
        LocalStorage.set('dbt-diary', angular.toJson(diaryData));
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