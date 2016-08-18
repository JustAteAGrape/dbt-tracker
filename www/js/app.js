// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  // Today tab
  .state('tab.today', {
    url: '/today',
    views: {
      'tab-today': {
        templateUrl: 'templates/todaysDiary.html',
        controller: 'NavBarController'
      }
    }
  })
  .state('tab.actions', {
    url: '/today/actions/:aDate',
    views: {
      'tab-today': {
        templateUrl: 'templates/actionList.html',
        controller: 'ActionListController'
      }
    }
  })
  .state('tab.editAction', {
    url: '/today/action/edit/:aDate/:aId',
    views: {
      'tab-today': {
        templateUrl: 'templates/action.html',
        controller: 'ActionsController'
      },

    }
  })
  .state('tab.new', {
    url: '/today/action/new/:aDate',
    views: {
      'tab-today': {
        templateUrl: 'templates/action.html',
        controller: 'ActionsController'
      }
    }
  })
  .state('tab.emotions', {
    url: '/today/emotions/:eDate',
    views: {
      'tab-today': {
        templateUrl: 'templates/emotions.html',
        controller: 'EmotionsController'
      }
    }
  })
 .state('tab.coping', {
    url: '/today/coping/:cDate',
    views: {
      'tab-today': {
        templateUrl: 'templates/coping.html',
        controller: 'CopingController'
      }
    }
  })

  // Diary Tab
  .state('tab.diary', {
    url: '/diary',
    views: {
      'tab-diary': {
        templateUrl: 'templates/diary.html',
        controller: 'DiaryController'
      }
    }
  })
  .state('tab.diaryActions', {
    url: '/diary/actions/:aDate',
    views: {
      'tab-diary': {
        templateUrl: 'templates/actionList.html',
        controller: 'ActionListController'
      }
    }
  })
  .state('tab.editDiaryAction', {
    url: '/diary/action/edit/:aDate/:aId',
    views: {
      'tab-diary': {
        templateUrl: 'templates/action.html',
        controller: 'ActionsController'
      },

    }
  })
  .state('tab.newDiaryAction', {
    url: '/diary/action/new/:aDate',
    views: {
      'tab-diary': {
        templateUrl: 'templates/action.html',
        controller: 'ActionsController'
      }
    }
  })
  .state('tab.diaryEmotions', {
    url: '/diary/emotions/:eDate',
    views: {
      'tab-diary': {
        templateUrl: 'templates/emotions.html',
        controller: 'EmotionsController'
      }
    }
  })
 .state('tab.diaryCoping', {
    url: '/diary/coping/:cDate',
    views: {
      'tab-diary': {
        templateUrl: 'templates/coping.html',
        controller: 'CopingController'
      }
    }
  })
  

  // Settings tab
  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsController'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/today');

});
