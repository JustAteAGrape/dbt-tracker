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
  var diaryService = {};
  var rawData = LocalStorage.get('dbt-diary', null);
  // TODO: rename to diary
  var diaryData = rawData == null ? {diary: []} : angular.fromJson(rawData);

  // diaryData.sort(function(a,b){
  //   return new Date(b.date) - new Date(a.date);
  // });

  // // TODO: Allow the size of the diary view to be configurable from the server side by the therapist
  // var spliceSize = diaryData.length > 7 ? diaryData.length - 7 : 0;
  // diaryData.splice(0, spliceSize);

  // var changesMade = spliceSize > 0;

  var changesMade = false;

  var getEntryByDate = function(date) {
    return diaryData[date];
  };

  // Diary Service contains business logic for accessing and manipulating the diary entries
  diaryService.getDiarySummary = function() {
    var diarySummary = [];
    var test = Date.now();
    angular.forEach(diaryData, function(entry, key) {
      diarySummary.push({
        date: key,
        dateFormatted: $filter('date')(key, 'EEEE, MMM d, yyyy'),
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

  diaryService.saveUpdates = function() {
    if (changesMade) {
      LocalStorage.set('dbt-diary', angular.toJson(diaryData));
      // TODO: Push changes to web service
    }
    changesMade = false;
  };

  return diaryService;
})

.factory('TodaysDiary', function($filter, LocalStorage) {
  var rawData = LocalStorage.get('dbt-diary', null);
  var diaryData = rawData == null ? {diary: []} : angular.fromJson(rawData);
  var todaysEntry = null;

  // diaryData.diary.sort(function(a,b){
  //   return new Date(b.date) - new Date(a.date);
  // });

  // if (diaryData.diary[diaryData.diary.length - 1].date === $filter('date')(Date.now(), 'yyyyMMdd')) {
  //   todaysEntry = diaryData.diary[diaryData.diary.length - 1];
  // }

  // // TODO: Allow the size of the diary view to be configurable from the server side by the therapist
  // var spliceSize = 0;
  // if (todaysEntry == null) {
  //   todaysEntry = {date: $filter('date')(Date.now(), 'yyyyMMdd'), actions: [], emotions: [], copingSkills: []};
  //   spliceSize = diaryData.diary.length > 6 ? diaryData.diary.length - 6 : 0;
  // }
  // else {
  //   spliceSize = diaryData.diary.length > 7 ? diaryData.diary.length - 7 : 0;
  // }
  // diaryData.diary.splice(0, spliceSize);

  // var changesMade = spliceSize > 0;

  var changesMade = false;

  return {
    getActions: function() {
      return todaysEntry.actions;
    },
    getActionById: function(id, defaultValue) {
      var actionReturn = defaultValue;
      angular.forEach(todaysEntry.actions, function(action, index){
        if (action.id == id){
          actionReturn = action;
        }
      });
      return actionReturn;
    },
    addAction: function(action) {
      todaysEntry.actions.push(action);
      changesMade = true;
    },
    editAction: function(action) {
      angular.forEach(todaysEntry.actions, function(diaryAction, index){
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
      todaysEntry.actions.splice(todaysEntry.actions.indexOf(action), 1);
      changesMade = true;
    },
    getEmotions: function() {
      return todaysEntry.emotions;
    },
    getEmotionByName: function(name, defaultValue) {
      var emotionReturn = defaultValue;
      angular.forEach(todaysEntry.emotions, function(diaryEmotion, index){
        if (diaryEmotion.name == name) {
          emotionReturn = diaryEmotion;
        }
      });
      return emotionReturn;
    },
    addEmotion: function(emotion) {
      todaysEntry.emotions.push(emotion);
      changesMade = true;
    },
    editEmotion: function(emotion) {
      angular.forEach(todaysEntry.emotions, function(diaryEmotion, index){
        if (diaryEmotion.name == emotion.name) {
          diaryEmotion.strength = emotion.strength;
        }
      });
      changesMade = true;
    },
    getCopingSkillCategoryByName: function(categoryName, defaultValue) {
      copingSkillCategoryReturn = defaultValue;
      angular.forEach(todaysEntry.copingSkills, function(diaryCopingSkillCategory, index){
        if (diaryCopingSkillCategory.name == categoryName) {
          copingSkillCategoryReturn = diaryCopingSkillCategory;
        }
      });
      return copingSkillCategoryReturn;
    },
    addCopingSkillCategory: function(category) {
      todaysEntry.copingSkills.push(category);
      changesMade = true;
    },
    getCopingSkillByName: function(categoryName, skillName, defaultValue) {
      var copingSkillReturn = defaultValue;
      angular.forEach(todaysEntry.copingSkills, function(diaryCopingSkillCategory, index){
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
      angular.forEach(todaysEntry.copingSkills, function(diaryCopingSkillCategory, index){
        if (diaryCopingSkillCategory.name == categoryName) {
          diaryCopingSkillCategory.skills.push(skill);
          changesMade = true;
        }
      });
    },
    getCopingSkills: function() {
      return todaysEntry.copingSkills;
    },
    editCopingSkill: function(categoryName, skill) {
      angular.forEach(todaysEntry.copingSkills, function(diaryCopingSkillCategory, index){
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