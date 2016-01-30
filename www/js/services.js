angular.module('starter.services', [])

.factory('ActionLog', function() {
  var actionLog = [{
    name: 'Drugs'
  }];

  return {
    all: function() {
      return actionLog;
    },
    add: function(action) {
      actionLog.push(action);
    }
  }
})

.factory('ActionList', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var actions = [{
    id: 0,
    name: 'Heroin'
  }, {
    id: 1,
    name: 'Cutting'
  }, {
    id: 2,
    name: 'Risky Sex'
  }, {
    id: 3,
    name: 'Suicide'
  }, {
    id: 4,
    name: 'Aggression'
  }];

  return {
    all: function() {
      return actions;
    },
    remove: function(chat) {
      actions.splice(actions.indexOf(chat), 1);
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
