function log(x){console.log(x)}

angular.module('taskMasterApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, AppService, PouchDBListener, PersonService,  GoalService, UtilityService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.$on('add', function(event,doc) {
      UtilityService.updateObject(doc, AppService.allrecords);
  });
    //console.log(this.AppService);
//    // set all of the app services up
    AppService.setAllRecords();
//    AppService.setCurrentMember();
//    AppService.setFamily();
//    AppService.setSponsor();
    
    $scope.sponsor = AppService.sponsor;
    $scope.familyMembers = AppService.familyMembers; 
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

.controller('MeCtrl', function($scope, AppService) {
    $scope.service = AppService;
    $scope.currentMember = AppService.currentMember;
    $scope.currentStats = AppService.currentStats;
})

.controller('ChoreStoreCtrl', function($scope, $ionicModal, AppService) {
//    $scope.assignToPerson = false;
    $scope.$on('ionicView.enter', function(e) {
       $scope.doRefresh(); 
    });
    $scope.newChore = {
        _id: "",
        name: "",
        type: "chore",
        description: "",
        assigned: "Chore Store",
        assignedby: "",
        value: "",
        duedate: "",
        complete: false,
        repeats: false,
        frequency: ""
    };
    $scope.service = AppService;
    $scope.chorestore = AppService.chorestore;
        $scope.service.populateChores();;
    $scope.saveNewChore = function() {
        $scope.newChore._id = new Date().toISOString();
        $scope.newChore.assignedby = $scope.service.currentMember.name;
        alert('newChore.assigned value is: ' + $scope.newChore.assigned);
        localDB.put($scope.newChore).then(function(doc, err) {
            $scope.closeAddChore();
        }).catch(function(err) {
            console.log('there was an error updating the chore. Error was: ' + err);
        });
        
    }
    $scope.doRefresh = function() {
        AppService.setAllRecords();
//        AppService.populateChores();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };    
 // Form data for the login modal
  $scope.choreData = {};

  $ionicModal.fromTemplateUrl('templates/addchore.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


  // Triggered in the login modal to close it
  $scope.closeAddChore = function() {
    $scope.modal.hide();
  };


  // Open the login modal
  $scope.addChore = function() {
    $scope.modal.show();
  };

    $scope.service.populateChores();
    $scope.service.getChoreStore();
  // Perform the login action when the user submits the login form
//  $scope.doLogin = function() {
//    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
//    $timeout(function() {
//      $scope.closeLogin();
//    }, 1000);
  })

.controller('MyChoresCtrl', function($scope, AppService) {
    $scope.service = AppService;
    $scope.currentMember = $scope.service.currentMember;
    $scope.completedchores = $scope.service.completedchores;
    $scope.incompletechores = $scope.service.incompletechores;
    $scope.doRefresh = function() {
        AppService.setAllRecords();
//        AppService.populateChores();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
    // populate empty array with list of passed in chores
    
    $scope.service.populateChores();
})

.controller('ChoreDetailsCtrl', function($scope,$rootScope, AppService, UtilityService, $stateParams, $ionicModal, $ionicHistory, $state) {
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    $scope.choreclaimed = false;
    $scope.chore = {};
    $scope.choreClone = {};
    $scope.$on('add', function() {
//        alert('howdy');
    });
    $scope.getChoreClone = function() {
//        alert('trying to get choreClone');
        localDB.get($scope.chore._id).then(function(doc, err) {
            $scope.choreClone = doc;
            console.log('this is the new choreClone');
            console.log(doc);
        });
    }

    $scope.doRefresh = function() {
        AppService.setAllRecords();
//        AppService.populateChores();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    }; 
    
    $scope.sponsor = AppService.sponsor;
    $scope.currentMember = AppService.currentMember;
//    console.log('here we go');
    for (var i = 0; i < AppService.allrecords.length; i++) {
//        console.log('howdy');
//        console.log($stateParams.id);
        var record = AppService.allrecords[i];
        if (record._id === $stateParams.id) {
            $scope.chore = record;
            $scope.getChoreClone();
            console.log('this is choreclone');  
            console.log($scope.choreClone);
        }
    }
    
    $ionicModal.fromTemplateUrl('templates/editchore.html', {
        scope : $scope
    }).then(function(modal) {
        $scope.editmodal = modal;
    });
    
      // Triggered in the login modal to close it
      $scope.closeEditChore = function() {
        $scope.editmodal.hide();
      };
    
    $scope.claim = function() {
        $scope.choreclaimed = true;
        $scope.choreClone.assigned = $scope.currentMember.name;
        localDB.put($scope.choreClone).then(function(doc, err) {
            $scope.closeEditChore();
        }).catch(function(err) {
            console.log('there was an error updating the chore. Error was: ' + err);
        });        
    }

      // Open the login modal
      $scope.edit = function() {
          $scope.tempName = $scope.chore.name;
          $scope.tempDescription = $scope.chore.description;
        $scope.editmodal.show();
      };
    
    $scope.saveRecord = function() {
            localDB.put($scope.choreClone).then(function(doc, err) {
                $ionicHistory.clearCache();
                $scope.chore = $scope.choreClone;
                $scope.closeEditChore();
            }).catch(function(err) {
                console.log('there was an error updating the chore. Error was: ' + err);
            });            
    }
    
    
    $scope.cancel = function() {
        $scope.closeEdit();
        $scope.chore.name = $scope.tempName;
        $scope.chore.description = $scope.tempDescription;
    };
    $scope.returnchore = function() {
//        $scope.closeEdit();
        $scope.choreClone.assigned = 'Chore Store';
        localDB.put($scope.choreClone).then(function(doc, err) {
            $ionicHistory.goBack();
        }).catch(function(err) {
            console.log('there was an error updating assignment to "Chore Store" Here was the error: ' + err);
        });
    };

    $scope.markcomplete = function() {
        $ionicHistory.clearCache().then(function(err) {
            localDB.get($scope.chore._id).then(function(doc, err) {
                var dbChore = doc;
                log('this is dbChore');
                log(dbChore);
        //        var updatedChore = UtilityService.cloneAnObject($scope.chore);
        //        updatedChore.complete = true;
                dbChore.complete = true;
                $scope.chore.complete = true;
                localDB.put(dbChore).then(function(doc, err) {
                        $ionicHistory.goBack();
                }).catch(function(err) {
                    console.log('there was an error updating the chore. Error was: ' + err);
                });            
            }).catch(function(err) {
                log('encountered an error GETting from database. Error: ' + err);
            });            
        }).catch(function(err) {
            log('encountered an error clearing da cache. Error: ' + err);
        });


    };

    $scope.markincomplete = function() {
        $ionicHistory.clearCache().then(function(){
            localDB.get($scope.chore._id).then(function(doc, err) {
                var dbChore = doc;
                log('this is dbChore');
                log(dbChore);
        //        var updatedChore = UtilityService.cloneAnObject($scope.chore);
        //        updatedChore.complete = false;
                dbChore.complete = false;
                $scope.chore.complete = false;
                    localDB.put(dbChore).then(function() {
                            $ionicHistory.goBack();
                    }).catch(function(err) {
                        console.log('there was an error updating the chore. Error was: ' + err);
                    });
            }).catch(function(err) {
                log('encountered an error GETting from database. Error: ' + err);
            });            
        }).catch(function(err) {
            log('encountered an error clearing da cache. Error: ' + err);
        });

    };    
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
