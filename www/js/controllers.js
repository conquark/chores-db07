angular.module('taskMasterApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, AppService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
    console.log(this.AppService);
//    // set all of the app services up
    AppService.setAllRecords();
    AppService.setCurrentMember();
    AppService.setFamily();
    AppService.setSponsor();
    
    $scope.sponsor = AppService.sponsor;
    
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MyChoresCtrl', function($scope, MyChoresService, AppService) {
    $scope.service = MyChoresService;
    $scope.currentMember = AppService.currentMember;
    
    // populate empty array with list of passed in chores
    $scope.service.populateChores();
    console.log('chores object:');
    console.log($scope.service.mychores);
})

.controller('ChoreDetailsCtrl', function($scope, MyChoresService, AppService, $stateParams, $ionicModal, $ionicHistory) {
    $scope.chore = {};
    $scope.sponsor = AppService.sponsor;
    $scope.currentMember = AppService.currentMember;
    console.log('here we go');
    for (var i = 0; i < MyChoresService.mychores.length; i++) {
        console.log('howdy');
        console.log($stateParams.id);
        var record = MyChoresService.mychores[i];
        if (record._id === $stateParams.id) {
            $scope.chore = record;
        }
    }
    
    $ionicModal.fromTemplateUrl('templates/editchore.html', {
        scope : $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
      // Triggered in the login modal to close it
      $scope.closeEdit = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.edit = function() {
          $scope.tempName = $scope.chore.name;
          $scope.tempDescription = $scope.chore.description;
        $scope.modal.show();
      };
    
    $scope.saveRecord = function() {
//        $scope.chore.name = document.getElementById('chorename').value;
//        $scope.chore.description = document.getElementById('description').value;
        $scope.closeEdit();
    };
    
    $scope.cancel = function() {
        $scope.closeEdit();
        $scope.chore.name = $scope.tempName;
        $scope.chore.description = $scope.tempDescription;
    };
    $scope.returnchore = function() {
//        $scope.closeEdit();
        $scope.chore.assigned = 'Chore Store';
        $ionicHistory.goBack();
    };

    $scope.markcomplete = function() {
//        $scope.closeEdit();
        $scope.chore.complete = true;
        $ionicHistory.goBack();
    };

    $scope.markincomplete = function() {
//        $scope.closeEdit();
        $scope.chore.complete = false;
        $ionicHistory.goBack();
    };
    
//    $scope.return = function() {
//        $scope.closeEdit();
//        $scope.chore.assigned = 'Chore Store';
//        console.log('trying to return this thing');
//    };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
