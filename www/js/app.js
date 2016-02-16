
function log(x){console.log(x)}
function info(x){console.info(x)}

if (getCookie('dbname')) {
        var dbname =  getCookie('dbname');       
    } else {
        location.href = 'index2.html';
    }

var localDB;
var remoteDB;

var setupDatabases = function(dbname) {
    info('STEP (1) START');
    localDB = new PouchDB('dbname');
    remoteDB = new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/' + dbname);
}

setupDatabases(dbname);
//
//var localDB = new PouchDB('tmchores10');
//var remoteDB = new PouchDB('https://bturner:glasgow8mysoup@bturner.cloudant.com/tmchores10');
var app = angular.module('taskMasterApp', ['ionic', 'taskMasterApp.controllers', 'taskMasterApp.services','ngIOS9UIWebViewPatch']);

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    
    $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.welcome', {
    url: '/welcome',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/welcome.html'
      }
    }
  })

  .state('app.dashboard', {
    url: '/dashboard',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
          controller: 'DashCtrl'
      }
    }
  })
    
  .state('app.persondetails', {
    url: '/dashboard/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/persondetails.html',
        controller: 'PersonCtrl'
      }
    }
  })
    
  .state('app.personchores', {
    url: '/app/dashboard/nothing/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/personchores.html',
        controller: 'PersonChoresCtrl'
      }
    }
  })

  .state('app.mygoals', {
        url: '/mygoals',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/mygoals.html',
                controller: 'MyGoalsCtrl'
            }
        }
    })
    
  .state('app.goaldetails', {
        url: '/mygoals/:id',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/goaldetails.html',
                controller: 'GoalDetailsCtrl'
            }
        }
    })
    
  .state('app.mychores', {
    url: '/mychores',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/mychores.html',
          controller: 'MyChoresCtrl'
//          reload: true
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
    
  .state('app.chorestoredetails', {
    url: '/chorestore/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/chorestoredetails.html',
          controller: 'ChoreDetailsCtrl'
      }
    }
  })
    
  .state('app.me', {
    url: '/me',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/me.html',
          controller: 'AppCtrl'
      }
    }
  })

  .state('app.chorestore', {
    url: '/chorestore',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/chorestore.html',
          controller: 'ChoreStoreCtrl'
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
  $urlRouterProvider.otherwise('/app/welcome');
});
