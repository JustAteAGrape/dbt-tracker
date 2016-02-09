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

.factory('TodaysActions', function($http, $filter, LocalStorage) {
  var actions = [];
  var logExists = false;

  // actions.push({name: LocalStorage.get('test', 'LOSER')})

  return {
    all: function() {
      return actions;
    },
    add: function(action) {
      actions.push(action);
    }
  }
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
    },
    get: function(chatId) {
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].id === parseInt(chatId)) {
          return actions[i];
        }
      }
      return null;
    }
  };
});
