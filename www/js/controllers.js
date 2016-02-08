function log(x){console.log(x)}

angular.module('taskMasterApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $window, $ionicSideMenuDelegate, $state, AppService, PouchDBListener, PersonService, UtilityService) {

    $scope.service = AppService;
    $scope.utility = UtilityService;
window.dollarscope = $scope;
window.AppService = AppService;    

    
  $scope.currentMemberCookie = $scope.utility.getCookie('currentMemberName');
 
//  alert($scope.currentMemberCookie);
      
  $scope.$on('add', function(event,doc) {
      UtilityService.updateObject(doc, AppService.allrecords);
  });

// set all of the app services up
    AppService.setAllRecords();
 
// this is a hack - it should actually *wait* for the allrecords to be setup instead of assuming it will all be ok after a 1.5 sec delay.
    $timeout(function(){
        $scope.sponsor = AppService.sponsor;
        $scope.currentMember = AppService.currentMember;
        if ($scope.currentMember){
            $scope.currentMember.pin = AppService.currentMember.pin;            
        }
        $scope.familyMembers = AppService.familyMembers;
        $scope.familySize = AppService.familySize;
        $scope.chorestoresize = AppService.chorestoresize;
        log('FAMILYSIZE IS: ' + $scope.familySize);        
    },1500);
    
  $scope.setupCompleteCookie = getCookie('setupComplete');
//  alert('the setupComplete cookie is: ' + $scope.setupCompleteCookie);
    
  $scope.cookiereload = function() {
      if ($scope.setupCompleteCookie === "") {
          setCookie('setupComplete', 'true', 7000);
          $timeout(function(){
              $window.location.reload(true);
          }, 3000);
      }
  }
  
  $scope.cookiereload();
    
  $scope.loginData = {};
  
  $scope.newUser = {
      _id: "",
      name: "",
      admin: true,
      pin: "",
      type: "person"
  }
  
  $scope.pinverify = "";
  ////////SETUP///////////
        $ionicModal.fromTemplateUrl('templates/setup.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.setupmodal = modal;
        });
    
        $scope.closeSetup = function() {
            $scope.setupmodal.hide();
            $ionicSideMenuDelegate.toggleLeft();
        }
        
        $scope.setup = function() {
            $scope.setupmodal.show();
        }
        
        $scope.saveNewUser = function() {
            $scope.newUser._id = $scope.newUser.name;
            localDB.put($scope.newUser).then(function() {
                $timeout(function(){
                    $scope.familySize = 1;
                    AppService.setAllRecords();
                    $scope.closeSetup();
                }, 1500);
            $window.location.reload();
            });
//            var newFamilyInfo = {
//                _id = 
//            }
        }
    /////////END SETUP/////////

  ////////Add user///////////
        $ionicModal.fromTemplateUrl('templates/addfamilymember.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.newusermodal = modal;
        });
    
        $scope.closeAddUser = function() {
            $scope.newusermodal.hide();
        }
        
        $scope.addUser = function() {
            $scope.newusermodal.show();
        }
        
        $scope.saveNewSecondaryUser = function() {
            $scope.newUser._id = $scope.newUser.name;
            if($scope.newUser.admin === true) {
                $scope.newUser.pin = $scope.currentMember.pin;                
            }
            localDB.put($scope.newUser).then(function() {
                AppService.setAllRecords();
                $scope.closeAddUser();
                $window.location.reload();
            });
        }
    /////////END add user/////////
        
    ////////SET CURRENT MEMBER (LOGIN)//////
        
        
        
        
        
    ////////SET CURRENT MEMBER (LOGIN)//////
        
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
  $scope.setCurrentMember = function($index) {
      log('current members pin is: ' + AppService.currentMember.pin);
    if($scope.familyMembers[$index].pin.toString().length > 0) {
        var pinprompt = prompt("To log in as an admin user, please enter your pin","");
        if ($scope.familyMembers[$index].pin == pinprompt) {
            console.log('Doing login', $scope.loginData);
            console.log('$index.name is: ' + $index.name);
            console.log('$index is:');
            console.log($index);
            $scope.currentMember = AppService.setCurrentMember($scope.familyMembers[$index].name);
            log('$scope.familyMembers[$index] is: ');
            log($scope.familyMembers[$index]);
            log('current family member is' + $scope.currentMember.name);
            setCookie('currentMemberName', $scope.currentMember.name, 7000);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
              $scope.closeLogin();
            }, 1000);        
        } else {
//            alert('sorry - that didn\'t work');    
        }
    } else {
            console.log('Doing login', $scope.loginData);
            console.log('$index.name is: ' + $index.name);
            console.log('$index is:');
            console.log($index);
            $scope.currentMember = AppService.setCurrentMember($scope.familyMembers[$index].name);
//            $scope.currentMember = $scope.familyMembers[$index];
            log('$scope.familyMembers[$index] is: ');
            log($scope.familyMembers[$index]);
            log('current family member is' + $scope.currentMember.name);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
              $scope.closeLogin();
            }, 1000);                
    }

  };
})

.controller('MeCtrl', function($scope, AppService) {
    $scope.service = AppService;
    $scope.currentMember = AppService.currentMember;
    $scope.currentStats = AppService.currentStats;
})

.controller('ChoreStoreCtrl', function($scope, $ionicModal, $window, AppService) {
    $scope.service = AppService;
    $scope.chorestore = AppService.chorestore;
//    $scope.assignToPerson = false;
    $scope.$on('ionicView.enter', function(e) {
       $scope.doRefresh(); 
    });
    
//    $scope.$watch(AppService.allrecords, function() {
//        alert('all records changed');
//    });
//    
//    $scope.$watch(AppService.chorestoresize, function() {
//        alert('chorestoresize changed');
//    });
    
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
        $scope.service.populateChores();
    $scope.saveNewChore = function() {
        $scope.newChore._id = new Date().toISOString();
        $scope.newChore.assignedby = $scope.service.currentMember.name;
//        alert('newChore.assigned value is: ' + $scope.newChore.assigned);
        $scope.chorestore.push($scope.newChore);
        localDB.put($scope.newChore).then(function(doc, err) {
            $scope.newChore = {};
            $scope.service.populateChores();
            $scope.service.getChoreStore();
            $scope.doRefresh();
            $scope.closeAddChore();
//            $window.location.reload();
        }).catch(function(err) {
            console.log('there was an error updating the chore. Error was: ' + err);
        });
        
    }
    
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        AppService.getChoreStore();
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
})


.controller('MyGoalsCtrl', function($scope, AppService, UtilityService, $ionicModal, $ionicHistory) {
    $scope.service = AppService;
    $scope.currentMember = AppService.currentMember;
    $scope.mygoals = AppService.mygoals;
    $scope.$on('$ioicView.enter', function(e) {
        $scope.doRefresh();
    });
    
    $scope.newGoal = {
        _id: "",
        name: "",
        type: "goal",
        description: "",
        owner: "",
        cost: "",
        duedate: "",
        complete: false
    }
    
    $scope.newGoal.owner = $scope.currentMember.name;
    
    //    $scope.service = AppService;
//    $scope.currentMember = $scope.service.currentMember;
//    $scope.mygoals = $scope.service.mygoals;
//    $scope.$on('$ionicView.enter', function(e) {
//       $scope.doRefresh(); 
//    });
//    
//    $scope.newGoal = {
//        _id: "",
//        name: "",
//        type: "goal",
//        description: "",
//        owner: $scope.service.currentMember.name,
//        cost: "",
//        duedate: "",
//        complete: false,
//    };
//
//    console.log('newGoal is: ');
//    console.log($scope.newGoal);
//    
        $scope.doRefresh = function() {
            $scope.service.setAllRecords();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };
    
        $ionicModal.fromTemplateUrl('templates/addgoal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addmodal = modal;
        });
    
        $scope.addGoal = function() {
            $scope.addmodal.show();
        };
    
        $scope.closeAddGoal = function() {
            $scope.addmodal.hide();
        };
    
        $scope.saveNewGoal = function() {
          $scope.newGoal._id = new Date().toISOString();
            localDB.put($scope.newGoal).then(function(doc,err) {
                $ionicHistory.clearCache();
                $scope.closeAddGoal();
                $scope.mygoals = $scope.service.mygoals;
                $scope.doRefresh();
            }).catch(function(err) {
                console.log('there was an error creating the goal. Erro was: ' + err);
            });
        ;}
        
        $scope.service.getGoals();
//        $scope.mygoals = $scope.service.mygoals;
    
//    $scope.doRefresh = function() {
//        AppService.setAllRecords();
//        $scope.$broadcast('scroll.refreshComplete');
//        $scope.$apply();
//    };
//    
//    for (var i = 0; i < AppService.allrecords.length; i++) {
//        var record = AppService.allrecords[i];
//        if (record._id === 1) {
//            $scope.goal = record;
//            $scope.doRefresh();
//            console.log('this is goalclone');  
//            console.log($scope.goalClone);
//        }
//    }
//    
//    $scope.saveNewGoal = function() {
//        $scope.newGoal._id = new Date().toISOString();
//        localDB.put($scope.newGoal).then(function(doc, err) {
//            $ionicHistory.clearCache();
//            $scope.closeAddGoal();
//        }).catch(function(err) {
//            console.log('there was an error creating the goal. Error was: ' + err);
//        });
//    };
//    
//    $ionicModal.fromTemplateUrl('templates/addgoal.html', {
//        scope : $scope
//    }).then(function(modal) {
//        $scope.addmodal = modal;
//    });
//    
//    $scope.closeAddGoal = function() {
//        $scope.addmodal.hide();
//    };
//
//  // Open the login modal
//    $scope.addGoal = function() {
//        $scope.addmodal.show();
//    };
//    
//    AppService.getGoals();
})

.controller('GoalDetailsCtrl', function($scope,AppService, UtilityService, $stateParams, $ionicModal, $ionicHistory, $state) {
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    $scope.service = AppService;
    $scope.goal = {};
    $scope.goalClone = {};
    $scope.currentMember = AppService.currentMember;
    $scope.sponsor = AppService.sponsor;
    
    $scope.getGoalClone = function() {
        localDB.get($scope.goal._id).then(function(doc, err) {
            $scope.goalClone = doc;
            console.log('this is the new goalClone');
            console.log(doc);
        });
    };
    
    for (var i = 0; i < AppService.allrecords.length; i++) {
        var record = AppService.allrecords[i];
        if (record._id === $stateParams.id) {
            $scope.goal = record;
            $scope.getGoalClone();
            console.log('this is goalclone');  
            console.log($scope.goalClone);
        }
    }
    
    
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
    $ionicModal.fromTemplateUrl('templates/editgoal.html', {
        scope : $scope
    }).then(function(modal) {
        $scope.editmodal = modal;
    });
    
      // Triggered in the login modal to close it
    $scope.closeEditGoal = function() {
        $scope.editmodal.hide();
    };

    
    $scope.editGoal = function() {
        $scope.editmodal.show();
    };
    
    $scope.saveGoalRecord = function() {
            localDB.put($scope.goalClone).then(function(doc, err) {
                $ionicHistory.clearCache();
                $scope.goal = $scope.goalClone;
                $scope.closeEditGoal();
            }).catch(function(err) {
                console.log('there was an error updating the goal. Error was: ' + err);
            });            
    };
    
    $scope.deleteGoal = function() {
        $scope.goalClone._deleted = true;
        localDB.put($scope.goalClone).then(function(doc, err) {
            $ionicHistory.clearCache();
            $scope.goal = $scope.goalClone;
            $ionicHistory.goBack();
        }).catch(function(err) {
            console.log('unable to delete record. error was: ' + err);
        });
    };
    
    $scope.service.getGoals();
})

.controller('MyChoresCtrl', function($scope, AppService) {
    window.chorescope = $scope;
    $scope.service = AppService;
    $scope.currentMember = AppService.currentMember;
    $scope.completedchores =  AppService.completedchores;
    $scope.incompletechores = AppService.incompletechores;
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    // populate empty array with list of passed in chores
    
    $scope.service.populateChores();
})

.controller('ChoreDetailsCtrl', function($scope,$rootScope, $window, AppService, UtilityService, $stateParams, $ionicModal, $ionicHistory, $state) {
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    $scope.service = AppService;
    $scope.choreclaimed = false;
    $scope.choredeleted = false;
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
        $scope.choreClone.assignedby = 
            $scope.currentMember.name;
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
    
    $scope.delete = function() {
        $ionicHistory.clearCache().then(function() {
        $scope.chore.type = "null"; // this is just to filter it out
        $scope.choredeleted = true; // ditto
            localDB.get($scope.chore._id).then(function(doc, err) {
                var dbChore = doc;
                dbChore._deleted = true;
                chore = dbChore;
                localDB.put(dbChore).then(function() {
                    $ionicHistory.goBack();
                    $window.location.reload();
                }).catch(function(err) {
                    console.log('unable to delete chore. Error was: ' + err);
                });
            });    
        }).catch(function(err) {
                 console.log('unable to GET chore for deletion. Error was: ' + err);
        });
    }
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
