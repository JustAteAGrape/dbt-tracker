angular.module('starter.services', [])

.factory('TodaysActions', function($http, $filter) {
  var actions = [];
  var logExists = false;
  //Consider using JSONP request instead for async
  //Diary cards are stored by date
  $http.get("data/diaryCards-" + $filter('date')(new Date(), "yyyyMMdd") + ".json")
    .success(function(data){
      logExists = true;
      actions = data.actions;
    })
    .error(function(){
      console.log("No diary card found");
    })

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
