function log(x){console.log(x)}

angular.module('taskMasterApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $window, $ionicSideMenuDelegate, $state, PouchDBListener, PersonService, UtilityService, AppService) {
    
//    (function() {
//        AppService.setInfoRecords();
//        $timeout(function() {
//            
//        }, 750);
//    }())
//    
//        $scope.destroy = function() {
//        familyDB.destroy().then(function() {
//            alert('destroyed! Mwahahahahaha!!!!');
//        }).catch(function(err) {
//            alert('Mwahahah...wait a second. there was a problem: ' + err);
//        });
//    }
    
//    $scope.info = AppService.allinforecords;
//    
//    $timeout(function() {
//        $scope.crabbyPants = AppService.crabbyPants;
//    },250);
//    
//    $timeout(function() {
//        if ($scope.info.length < 1) {
//            alert('First time here? Let\'s get you set up!');
//            var rando = Math.floor(Math.random() * 150);
//            var thename = 'CrabbyPants' + rando;
//            var the_id = new Date().toISOString();
//            var newbogusrecord = {};
//            newbogusrecord._id = the_id;
//            newbogusrecord.name = thename;
//            alert('I dub thee: ' + newbogusrecord.name);
//            familyDB.put(newbogusrecord).then(function() {
//                AppService.setInfoRecords();
//                alert('Ok - I think you\'re all set up!');
//            }).catch(function(err) {
//                alert('hrrrrm. was not able to insert the record. error was ' + err);
//            });
//        } else {
//            alert('Welcome, back, ' + $scope.crabbyPants + '!');
//        }        
//    }, 750);
    
    $scope.service = AppService;
    $scope.utility = UtilityService;
    $scope.dbname = dbname;
    
    $timeout(function() {
        $scope.service.setFamilyMembers();
        $scope.familyMembers = AppService.familyMembers;
        $scope.currentMember = AppService.currentMember;
        $scope.currentStats = AppService.getCurrentStats();         
    }, 1300);
    

window.dollarscope = $scope;
window.AppService = AppService;    

//    $scope.$on('ionicView.enter', function(e) {
//       $scope.doRefresh(); 
//    });    
    
    $scope.doRefresh = function() {
//        $window.location.reload();
        AppService.setAllRecords();
        $timeout(function() {
            $scope.service.setFamilyMembers();
            $scope.familyMembers = AppService.familyMembers;
            $scope.currentMember = AppService.currentMember;
            $scope.currentStats = AppService.getCurrentStats();         
        }, 800);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
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
            $scope.newUser._id = new Date().toISOString();
//            $scope.newUser._id = $scope.newUser.name;
            if($scope.newUser.admin === true) {
                $scope.newUser.pin = $scope.currentMember.pin;                
            }
            $scope.newUser.savings = 0;
            $scope.newUser.spendingmoneyalltime = 0;
            $scope.newUser.earningsalltime = 0;
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
    $scope.doRefresh();
      $timeout(function() {
        $scope.service.setFamilyMembers();
        $scope.familyMembers = AppService.familyMembers;
        $scope.currentMember = AppService.currentMember;
        $scope.currentStats = AppService.getCurrentStats();
              $scope.modal.show();
    }, 800);

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

.controller('DashCtrl', function($scope, $ionicModal, $timeout, $http, $window, $ionicSideMenuDelegate, $state, AppService, PouchDBListener, PersonService, UtilityService) {
//alert('hi');
    $scope.service = AppService;
    $scope.utility = UtilityService;
    
    $timeout(function() {
        $scope.currentMember = AppService.currentMember;
        $scope.currentStats = AppService.getCurrentStats();
        $scope.familyMembers = AppService.familyMembers;
    }, 1300);

window.dashscope = $scope;

    $scope.$on('ionicView.enter', function(e) {
       $scope.doRefresh(); 
    });    
    
    $scope.doRefresh = function() {
//        $window.location.reload();
        AppService.setAllRecords();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
})


.controller('MeCtrl', function($scope, $timeout, AppService) {
    window.mescope = $scope;
    
    $scope.service = AppService;
    
    $timeout(function() {
        $scope.currentMember = AppService.currentMember;
        $scope.currentStats = AppService.getCurrentStats();        
    }, 300);


    $scope.$on('ionicView.enter', function(e) {
       $scope.doRefresh(); 
    });    
    
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };    
})

.controller('ChoreStoreCtrl', function($scope, $ionicModal, $window, AppService, UtilityService) {
    $scope.service = AppService;
    $scope.chorestore = AppService.chorestore;
//    $scope.assignToPerson = false;
    $scope.$on('ionicView.enter', function(e) {
       $scope.doRefresh(); 
    });
    
    $scope.newChore = UtilityService.newChoreFactory();
    
        $scope.service.populateChores();
        $scope.saveNewChore = function() {
            if ($scope.newChore.repeats) {
                  // set temporary due date for chore as today
                  $scope.newChore.dueDate = new Date();
                  var actualDueDate = UtilityService.calculateNextChoreRepeatDate($scope.newChore);
                  $scope.newChore.dueDate = actualDueDate;
                  $scope.newChore.dueDateMilliseconds = actualDueDate.valueOf();
              } else {
                  console.log('NEW CHORE DOES NOT REPEAT');
              }
                $scope.newChore._id = new Date().toISOString();
                $scope.newChore.assignedby = $scope.service.currentMember.name;
        //        alert('newChore.assigned value is: ' + $scope.newChore.assigned);
                $scope.newChore.dueDateMilliseconds = $scope.newChore.dueDate.valueOf();
                $scope.chorestore.push($scope.newChore);
                localDB.put($scope.newChore).then(function(doc, err) {
                    $scope.newChore = UtilityService.newChoreFactory();
                    $scope.service.populateChores();
                    $scope.service.getChoreStore();
                    $scope.doRefresh();
                    $scope.closeAddChore();
        //            $window.location.reload();
                }).catch(function(err) {
                    console.log('there was an error updating the chore. Error was: ' + err);
                });
        
    }
    
/////// DATEPICKER PLUGIN - SEE: https://github.com/rajeshwarpatlolla/ionic-datepicker
//        $scope.datepickerObject = {
//      titleLabel: 'Title',  //Optional
//      todayLabel: 'Today',  //Optional
//      closeLabel: 'Close',  //Optional
//      setLabel: 'Set',  //Optional
//      setButtonType : 'button-assertive',  //Optional
//      todayButtonType : 'button-assertive',  //Optional
//      closeButtonType : 'button-assertive',  //Optional
//      inputDate: new Date(),  //Optional
////      mondayFirst: true,  //Optional
////      disabledDates: disabledDates, //Optional
//      weekDaysList: weekDaysList, //Optional
//      monthList: monthList, //Optional
//      templateType: 'popup', //Optional
//      showTodayButton: 'true', //Optional
//      modalHeaderColor: 'bar-positive', //Optional
//      modalFooterColor: 'bar-positive', //Optional
//      from: new Date(2012, 8, 2), //Optional
//      to: new Date(2018, 8, 25),  //Optional
//      callback: function (val) {  //Mandatory
//        datePickerCallback(val);
//      },
//      dateFormat: 'dd-MM-yyyy', //Optional
//      closeOnSelect: false, //Optional
//    };
//        
    
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
    scope: $scope,
      focusFirstInput: true
  }).then(function(modal) {
    $scope.modal = modal;
  });


  // Triggered in the login modal to close it
  $scope.closeAddChore = function() {
    $scope.modal.remove();
     $ionicModal.fromTemplateUrl('templates/addchore.html', {
        scope: $scope,
          focusFirstInput: true
      }).then(function(modal) {
        $scope.modal = modal;
      });
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
            scope: $scope,
            focusFirstInput: true
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
                $scope.newGoal = UtilityService.newGoalFactory();
                $scope.newGoal.owner = $scope.currentMember.name;
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

.controller('PersonCtrl', function($scope, $ionicPopup, AppService,UtilityService, $stateParams, $ionicModal, $ionicHistory, $state) {
    window.personscope = $scope;
    
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    $scope.service = AppService;
    $scope.person = {};
    $scope.personName = '';
    $scope.personClone = {};
    $scope.currentMember = AppService.currentMember;
    $scope.sponsor == AppService.sponsor;
    $scope.personEarningsTotal = 0;
    $scope.personEarningsUnpaid = 0;
    $scope.addToSavings;
    $scope.addToSpendingMoney;
    $scope.totalPercentage = 0;
    $scope.savingsNumber = 0;
    $scope.spendingNumber = 0;
    $scope.numberTotal = 0;

    $scope.setTotalPercentage = function() {
//        alert('hi');
//        $scope.totalPercentage = $scope.personEarningsUnpaid;
        var spending = Number(document.getElementById("addtospendingmoney").value);
        var savings = Number(document.getElementById("addtosavings").value);
//        var spending = Number($scope.addToSpendingMoney);
        var unpaid = $scope.personEarningsUnpaid;
        
        $scope.totalPercentage = (savings + spending)/unpaid*100;
        $scope.savingsNumber = savings;
        $scope.spendingNumber = spending;
        $scope.numberTotal = savings + spending;
//        return (savings + spending)/unpaid*100;
    }

    $scope.getPersonClone = function() {
        localDB.get($scope.person._id).then(function(doc, err) {
            $scope.personClone = doc;
            console.log('this is the new personClone');
            console.log(doc);
//            alert('personClone savings is: ');
//            alert(personClone.savings);
//            alert('personClone savings plus 1 is');
//            alert(personClone.savings + 1);
        });
    };
    
    for (var i = 0; i < AppService.allrecords.length; i++) {
        var record = AppService.allrecords[i];
        if (record._id === $stateParams.id) {
            $scope.person = record;
            $scope.personName = record.name;
            $scope.getPersonClone();
            console.log('this is personClone');  
            console.log($scope.personClone);
        }
    }    
    
    for (var i = 0; i < AppService.allrecords.length; i++) {
        var record = AppService.allrecords[i];
        if (record.type = 'chore' && record.complete === true && record.assigned === $scope.person.name) {
            $scope.personEarningsTotal = $scope.personEarningsTotal + record.value;
        }
    }
    
//    for (var i = 0; i < AppService.allrecords.length; i++) {
//        var record = AppService.allrecords[i];
//        var completiondate, completiondatestring, completiondateweek;        
//            if (record.type === 'chore' && record.completiondate) {
//                completiondatestring = record.completiondate;
//                completiondate = new Date();
//                completiondate.setTime(Date.parse(completiondatestring));
//                completiondateweek = completiondate.getWeekNumber();
//                log('GOT COMPLETIONDATE WEEK - IT IS: ');
//                log(completiondateweek);
//            }
//        if (record.type = 'chore' && record.complete === true && record.assigned === $scope.person.name ) {
//            $scope.personEarningsTotal = $scope.personEarningsTotal + record.value;
//        }
//    }
    
    $scope.personEarningsUnpaid = $scope.personEarningsTotal - $scope.person.earningsalltime;
    
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
    $ionicModal.fromTemplateUrl('templates/editperson.html', {
        scope : $scope,
        focusFirstInput: true
    }).then(function(modal) {
        $scope.editPersonModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/bankreminder.html', {
        scope : $scope,
        focusFirstInput: true
    }).then(function(modal) {
        $scope.bankReminderModal = modal;
    });
    
      // Triggered in the login modal to close it
    $scope.closeEditPerson = function() {
        $scope.editPersonModal.hide();
    };

    
    $scope.editPerson = function() {
//        alert('hi');
        $scope.editPersonModal.show();
    };
    
    $scope.openBankReminder = function() {
        $scope.bankReminderModal.show();
    }
    
    $scope.closeBankReminder = function() {
        $scope.bankReminderModal.hide();
    }
    
    $scope.savePersonRecord = function() {
            localDB.put($scope.personClone).then(function(doc, err) {
                $ionicHistory.clearCache();
                $scope.doRefresh();
                $scope.person = $scope.personClone;
                $scope.closeEditPerson();
//                $state.go('app.dashboard/' + $scope.personClone.name);
            }).catch(function(err) {
                console.log('there was an error updating the person. Error was: ' + err);
            });            
    };
    
    $scope.payPerson = function() {
//        alert('personClone.savings is currently: ' + $scope.personClone.savings);
//        alert('savingsNumber is: ');
//        alert($scope.savingsNumber);
        $scope.personClone.savings = $scope.personClone.savings + $scope.savingsNumber;
//        alert('personClone.savings is now: ' + $scope.personClone.savings);
//        alert('personClone.spendingmoneyalltime is: ' + $scope.personClone.spendingmoneyalltime);
//        alert('spendingNumber is: ');
//        alert($scope.spendingNumber);
        $scope.personClone.spendingmoneyalltime = $scope.personClone.spendingmoneyalltime + $scope.spendingNumber;
//        alert('personClone.spendingmoneyalltime is now: ' + $scope.personClone.spendingmoneyalltime);
//        alert('personClone.earningsalltime is currently: ');
//        alert($scope.personClone.earningsalltime);
        $scope.personClone.earningsalltime = $scope.personClone.earningsalltime + $scope.numberTotal;
//        alert('personClone.earningsalltime is now: ');
//        alert($scope.personClone.earningsalltime);
        localDB.put($scope.personClone).then(function(doc, err) {
//            alert('tried to do the thing');
            $ionicHistory.clearCache();
            $scope.doRefresh();
            $scope.person = $scope.personClone;
            $scope.personEarningsUnpaid = 0;
            $scope.closeEditPerson();
            $scope.openBankReminder();
        }).catch(function(err) {
            console.log('there was an error paying the person. Error was: ' + err);
        });
    };
    
    $scope.deletePerson = function() {
        $scope.personClone._deleted = true;
        AppService.spliceFamilyMember($scope.person._id);
        AppService.spliceRecord($scope.person._id);
        localDB.put($scope.personClone).then(function(doc, err) {
            $ionicHistory.clearCache();
            $scope.doRefresh();
            $scope.person = $scope.personClone;
            $ionicHistory.goBack();
        }).catch(function(err) {
            console.log('unable to delete record. error was: ' + err);
        });
    };
    
     $scope.showConfirm = function() {
       var confirmPopup = $ionicPopup.confirm({
        title: 'Delete this user',
        template: 'Are you sure you want to remove ' + $scope.person.name + ' from the App? This will delete all of ' + $scope.person.name + '\'s chores, chore history, stats and goals, and cannot be undone!',
        buttons: [
            { text: 'Cancel' },
            {
                text: '<b>Yes, delete from app.</b>',
                type: 'button-assertive',
                onTap: function() {
                  $scope.deletePerson()
                }
            }
        ]
        });
     }
         
    $scope.showNoDeleteSelf = function() {
        var cannotDeleteSelfPopup = $ionicPopup.alert({
            title: 'Can\'t Delete Yourself',
            template: 'Sorry, you can\'t delete yourself. If you would like to delete your user account, log in as a different admin user, and delete your user account from there. (There always needs to be at least one admin user, and this prevents locking your family out of the app :)  )'
        });
    }
    
    
    $scope.startPersonWidget = function() {
        var shortname = $scope.personClone.name.substr(0,5);
        var d = new Date();
        var timestamp = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate()+ '-' + d.getHours() + d.getMinutes() + d.getSeconds();
        cloudinary.openUploadWidget({upload_preset: 'xisr5ror', 
                                     cropping:true, multiple:false,
                                      public_id: shortname + timestamp}, 
                                        function(error, result) {
                                console.log(error, result);
                                theresult = result;
                                $scope.personClone.personImageUrl = result[0].path;
                                $scope.savePersonRecord();
                                $scope.person.personImageUrl = result[0].path;
                                for (var i = 0; i < AppService.allrecords.length; i++) {
                                    var record = AppService.allrecords[i];
                                    if (record.name === $scope.person.name) {
                                        record.personImageUrl = $scope.personClone.personImageUrl;
                                        allrecords.splice(i,1);
                                    }
                                }
                                $scope.doRefresh();
                        });
    }

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
    
    $scope.startGoalWidget = function() {
        cloudinary.openUploadWidget({upload_preset: 'xisr5ror', 
                                     cropping:true, multiple:false}, 
                                        function(error, result) {
                                console.log(error, result);
                                theresult = result;
                                $scope.goalClone.goalimageurl = result[0].path;
                                $scope.saveGoalRecord();
                        });
    }
    
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
    $ionicModal.fromTemplateUrl('templates/editgoal.html', {
        scope : $scope,
        focusFirstInput: true
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
                $scope.doRefresh();
                $scope.closeEditGoal();
            }).catch(function(err) {
                console.log('there was an error updating the goal. Error was: ' + err);
            });            
    };
    
    $scope.markGoalComplete = function() {
        $scope.goalClone.complete = true;
        $scope.goalClone.completiondate = new Date().toISOString();
        localDB.put($scope.goalClone).then(function(doc, err) {
            $ionicHistory.clearCache();
            $scope.goal = $scope.goalClone;
            $ionicHistory.goBack();
        }).catch(function(err) {
            console.log('unable to mark goal complete. error was: ' + err);
        });
    }
    
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
    $scope.chores = AppService.mychores;
    $scope.currentMember = AppService.currentMember;
    $scope.completedchores =  AppService.completedchores;
    $scope.incompletechores = AppService.incompletechores;
    $scope.todaysDate = new Date().valueOf();
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        $scope.completedchores =  AppService.completedchores;
        $scope.incompletechores = AppService.incompletechores;
//        $timeout(function(){
//            $scope.completedchores =  AppService.completedchores;
//            $scope.incompletechores = AppService.incompletechores;
//        }, 1000);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    // populate empty array with list of passed in chores
    
    $scope.service.populateChores();
})

.controller('PersonChoresCtrl', function($scope, $state, $stateParams, AppService, UtilityService) {
    window.personchorescope = $scope;
    $scope.id = $stateParams.id;
    $scope.service = AppService;
    $scope.gotopersonchores = function() {
        $state.$go('app.personchores')
    }
    $scope.chores = UtilityService.makePersonChoresArray($scope.id, AppService.allrecords);
    $scope.currentMember = AppService.currentMember;
    console.log('these are the PersonChores');
    $scope.doRefresh = function() {
        AppService.setAllRecords();
        $scope.completedchores =  AppService.completedchores;
        $scope.incompletechores = AppService.incompletechores;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };
    
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    // populate empty array with list of passed in chores
    
    $scope.service.populateChores();
})


.controller('ChoreDetailsCtrl', function($scope,$rootScope, $window, $timeout, AppService, UtilityService, $stateParams, $ionicModal, $ionicHistory, $state) {
    $scope.$on('$ionicView.enter', function(e) {
        $scope.doRefresh();
    });
    $scope.service = AppService;
    $scope.choreclaimed = false;
    $scope.choredeleted = false;
    $scope.chore = {};
    $scope.choreClone = {};
    $scope.todaysDate = new Date();
    $scope.$on('add', function() {
//        alert('howdy');
    });
    $scope.getChoreClone = function() {
        log('trying to get choreClone of this chore:');
        log($scope.chore);
        localDB.get($scope.chore._id).then(function(doc, err) {
            $scope.choreClone = doc;
            console.log('this is the new choreClone');
            console.log(doc);
        });
    }
    
    $scope.returnChoreClone = function(thechore) {
        localDB.get(thechore._id).then(function(doc, err) {
            var theClone = doc;
            console.log('this is the new clone of the passed in chore');
            console.log(doc);
            return theClone;
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
    $scope.currentStats = AppService.currentStats;
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
            $timeout(function(){
                $ionicHistory.goBack();
            },1000);
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
//                $scope.chore = $scope.choreClone;
                $scope.doRefresh;
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
    
    $scope.createNextRepeatingChore = function(choreobject) {
        log('CREATING NEXT REPEATING CHORE USING THIS CHORE OBJECT');
        log(choreobject);
        log('the _id of the passed choreobject is: ' + choreobject._id);
        var clonedChore = $scope.choreClone;//$scope.returnChoreClone(choreobject);
          if (clonedChore.repeats && clonedChore.assigned !== 'Chore Store') {
              var nextDueDate = UtilityService.calculateNextChoreRepeatDate(clonedChore);
              clonedChore.dueDate = nextDueDate;
              clonedChore.complete = false; // duh!
              clonedChore.completiondate = '';
              clonedChore._id = new Date().toISOString();
              clonedChore._rev = '';
              log('the new _id of the new choreobject is: ' + clonedChore._id);
              log('ABOUT TO PUT NEW REPEATING CHORE IN');
                localDB.put(clonedChore).then(function(doc, err) {
                    log('PUTTING REPEATING CHORE IS COMPLETE!');
                        $timeout(function(){
                            $scope.doRefresh();
                            $ionicHistory.goBack();                            
                        },1550);              
                }); 
          }
              else {
              console.log('NEW CHORE DOES NOT REPEAT *or* chore is currently in the chore store');
          }
    }

    $scope.markcomplete = function() {
        $ionicHistory.clearCache().then(function(err) {
            localDB.get($scope.chore._id).then(function(doc, err) {
                var dbChore = doc;
                log('this is dbChore');
                log(dbChore);
        //        var updatedChore = UtilityService.cloneAnObject($scope.chore);
        //        updatedChore.complete = true;
                dbChore.complete = true;
                dbChore.completiondate = new Date().toISOString();
                $scope.chore.complete = true;
                $scope.chore.completiondate = new Date().toISOString();
                if(dbChore.repeats && dbChore.markedCompleteCount < 1) {
                    dbChore.markedCompleteCount = 1;
                    $scope.createNextRepeatingChore(dbChore);
                }
                localDB.put(dbChore).then(function(doc, err) {
                        $timeout(function(){
                            $scope.doRefresh();
                            $ionicHistory.goBack();                            
                        },250);
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
                        $timeout(function(){
                            $scope.doRefresh();
                            $ionicHistory.goBack();                            
                        },250);
//                            $scope.doRefresh();
//                            $ionicHistory.goBack();
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
                        $timeout(function(){
                            $scope.doRefresh();
                            $ionicHistory.goBack();                            
                        },250);
                }).catch(function(err) {
                    console.log('unable to delete chore. Error was: ' + err);
                });
            });    
        }).catch(function(err) {
                 console.log('unable to GET chore for deletion. Error was: ' + err);
        });
    }
})

.controller('LoginCtrl', function($scope, $ionicModal, $timeout, $http, $window, $ionicSideMenuDelegate, $state, PouchDBListener, PersonService, UtilityService, AppService) {
    
    $scope.info = AppService.allinforecords;
    
    AppService.setInfoRecords();
    
    $timeout(function() {
        $scope.crabbyPants = AppService.crabbyPants;
    },250);
    
    $scope.destroy = function() {
        familyDB.destroy().then(function() {
            alert('destroyed! Mwahahahahaha!!!!');
        }).catch(function(err) {
            alert('Mwahahah...wait a second. there was a problem: ' + err);
        });
    }
    
    $timeout(function() {
        if ($scope.info.length < 1) {
            alert('First time here? Let\'s get you set up!');
            var rando = Math.floor(Math.random() * 150);
            var thename = 'CrabbyPants' + rando;
            var the_id = new Date().toISOString();
            var newbogusrecord = {};
            newbogusrecord._id = the_id;
            newbogusrecord.name = thename;
            alert('I dub thee: ' + newbogusrecord.name);
            familyDB.put(newbogusrecord).then(function() {
                AppService.setInfoRecords();
                alert('Ok - I think you\'re all set up!');
            }).catch(function(err) {
                alert('hrrrrm. was not able to insert the record. error was ' + err);
            });
        } else {
            alert('Welcome, back, ' + $scope.crabbyPants + '!');
        }        
    }, 750);
    
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
