function log(x){console.log(x)}
function info(x){console.info(x)}


// The family database is used to save info about the family's chore database, and whether anyone has logged into the app previousy (if not, then we do setup).
//var familyDB = new PouchDB('family');
//familyDB.allDocs({include_docs:true}).then(function(result){
//    for (var i = 0; i < result.rows.length; i++) {
//        self.allinforecords.push(result.rows[i].doc);
//    }
//    self.crabbyPants = self.allinforecords[0].name;
//}).catch(function(err) {
//    log('there was an error getting allDocs. error was: ' + err + '\n\nThis is the expected behavior for the first time app is opened. We\'re specifically trying to figure out if there is a family database created. If so, things are already set up, continue as usual. If not, set things up!');
//});

var app = angular.module('tmSetup', ['ionic', 'tmSetup.controllers', 'tmSetup.services']);

app.run(function($ionicPlatform) {
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

    .state('appy', {
    url: '/appy',
    abstract: true,
    templateUrl: 'templates/setupp/setup1.html',
    controller: 'LoginCtrl'
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
    

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/supersetup');
});
