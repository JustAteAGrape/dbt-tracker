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
  
  var diary = rawDiary == null ? {actions: [], emotions: []} : angular.fromJson(rawDiary);

  var changesMade = false;

  return {
    getActions: function() {
      return diary.actions;
    },
    getActionById: function(id, defaultValue) {
      for (var i in diary.actions) {
        if (diary.actions[i].id == id) {
          return diary.actions[i];
        }
      }
      return defaultValue;
    },
    addAction: function(action) {
      diary.actions.push(action);
      changesMade = true;
    },
    editAction: function(action) {
      for (var i in diary.actions) {
        if (diary.actions[i].id == action.id) {
          diary.actions[i].name = action.name;
          diary.actions[i].date = action.date;
          diary.actions[i].urge = action.urge;
          diary.actions[i].actedOn = action.actedOn;
          diary.actions[i].skillRating = action.skillRating;
          diary.actions[i].notes = action.notes;
          break;
        }        
      }
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
      for (var entry in diary.emotions) {
        var emotion = diary.emotions[entry];
        if (emotion.name == name) {
          return emotion;
        }
      }
    },
    addEmotion: function(emotion) {
      diary.emotions.push(emotion);
      changesMade = true;
    },
    editEmotion: function(emotion) {
      for (var i in diary.emotions) {
        if (diary.emotions[i].name == emotion.name) {
          diary.emotions[i].strength = emotion.strength;
          break;
        }        
      }
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
});

.factory('SkillList', function($http) {
  // Might use a resource here that returns a JSON array
  var getCopingSkills = function() {
    return $http.get("data/copingSkills.json").then(function(response){
      return response.data;
    });
  };
  return { get: getCopingSkills };
});