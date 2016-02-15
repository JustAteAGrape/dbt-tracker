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

.factory('TodaysActions', function($http, $filter, $window, $ionicHistory, LocalStorage) {
  var actions = [];
  var diary = LocalStorage.get($filter('date')(Date.now(), 'yyyyMMdd'), null);

  // $window.localStorage.clear();
  //   $ionicHistory.clearCache();
  //   $ionicHistory.clearHistory();

  if (!(diary == null)) {
    actions = angular.fromJson(diary);  
  }  

  return {
    all: function() {
      return actions;
    },
    get: function(id, defaultValue) {
      for (var i in actions) {
        if (actions[i].id == id) {
          return actions[i];
        }
      }
      return defaultValue;
    },
    add: function(action) {
      actions.push(action);
    },
    edit: function(action) {
      for (var i in actions) {
        if (actions[i].id == action.id) {
          actions[i].name = action.name;
          actions[i].date = action.date;
          actions[i].urge = action.urge;
          actions[i].actedOn = action.actedOn;
          actions[i].notes = action.notes;
          break;
        }
      }
    },
    remove: function(action) {
      actions.splice(actions.indexOf(action), 1);
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
});
