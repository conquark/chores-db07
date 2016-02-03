var localDB = new PouchDB('tmchores');
var remoteDB = new PouchDB('http://bturner:wallybear@127.0.0.1:5984/tmchores')
var app = angular.module('taskMasterApp', ['ionic', 'taskMasterApp.controllers', 'taskMasterApp.services']);

app.run(function($ionicPlatform) {
  localDB.sync(remoteDB, {live: true, retry: true});
  $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.welcome', {
    url: '/welcome',
    views: {
      'menuContent': {
        templateUrl: 'templates/welcome.html'
      }
    }
  })

  .state('app.mychores', {
    url: '/mychores',
    views: {
      'menuContent': {
        templateUrl: 'templates/mychores.html',
          controller: 'MyChoresCtrl'
      }
    }
  })
  
  .state('app.choredetails', {
    url: '/mychores/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/choredetails.html',
          controller: 'ChoreDetailsCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
