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
  var diary = null;

  if (!(rawDiary == null)) {
    diary = angular.fromJson(rawDiary);
  }

  if (diary == null) {
    diary = {
      actions: [],
      emotions: []
    }
  }


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
      LocalStorage.set($filter('date')(Date.now(), 'yyyyMMdd'), angular.toJson(diary));
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
      LocalStorage.set($filter('date')(Date.now(), 'yyyyMMdd'), angular.toJson(diary));
    },
    removeAction: function(action) {
      diary.actions.splice(diary.actions.indexOf(action), 1);
    }
  }
})

.factory('SkillRatings', function($http) {
  // Might use a resource here that returns a JSON array
  var skillRatings = [];
  $http.get("data/copingSkills.json").success(function(data){
    skillRatings = data;
  })
  return {
    all: function() {
      return skillRatings;
    },
    get: function(id, defaultValue) {
      for (var i in skillRatings) {
        if (skillRatings[i].id == id) {
          return skillRatings[i];
        }
      }
      return defaultValue;
    }
  };
})

.factory('ActionList', function($http) {
  // Might use a resource here that returns a JSON array
  var actions = [];
  $http.get("data/actions.json").success(function(data){
    actions = data;
  })
  return {
    all: function() {
      return actions;
    }
  };
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
