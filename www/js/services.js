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
  var diary = null;

  diary = LocalStorage.get($filter('date')(Date.Now, 'yyyyMMdd'));

  if (!(diary == null)) {
    actions = angular.fromJson(diary);  
  }  

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
    }
  };
});
