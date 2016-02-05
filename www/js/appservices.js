var app = angular.module('taskMasterApp.services', []);

app.factory('UtilityService', function() {

    self = {};    
    self.cloneAnObject = function(objectreference) {
        // sort of a homemade factory! Returns an object clone of the object reference passed in.
        self = {}
        self.turnReferenceIntoObject = function(reference){
            var objectUndone = JSON.parse(JSON.stringify(reference));
            return objectUndone;        
        }
        self.shinyNewObjectThatIsNotAReference = new self.turnReferenceIntoObject(objectreference);
        return self.shinyNewObjectThatIsNotAReference;
    };
    
    self.updateObject = function(theObject,allrecordsarray) {
        localDB.get(theObject._id).then(function(doc, err) {
            for (var i = 0; i < allrecordsarray.length; i++) {
                if (allrecordsarray[i]._id === theObject._id) {
                    allrecordsarray.splice(i, 1, doc);
                }
            }
        });
    }
    
    self.checkIfRevIsMostRecent = function(objectreference, dbrecord) {
        var objectRevisionNumber = objectreference._rev;
        var recordRevisionNumber = dbrecord._rev;
        if (objectRevisionNumber < recordRevisionNumber || objectRevisionNumber > recordRevisionNumber) {
            return false;
        } else if (objectRevisionNumber === recordRevisionNumber) {
            return true;
        }
    }
    
    return self;
});

app.factory('AppService', function(PouchDBListener, UtilityService) {
    
    function log(x){console.log(x)}
    
    var self = {
        allrecords : [],
        currentMember : {},
        family : {},
        sponsor : {},
        familyMembers: [],
        currentRecordIndex: 0,
        mychores: [],
        chorestore: []
    };
    
    
    self.setAllRecords = function() {
        // get all the records from the database [TEMPORARILY FROM STATIC JS FILE]
//        self.allrecords = tempRecordsList;
        self.allrecords = [];
        localDB.allDocs({include_docs:true}).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {
                self.allrecords.push(result.rows[i].doc);
            } 
            self.setCurrentMember();
            console.log('OK - HERE IS THE CURRENT ALLRECORDS ARRAY');
            console.log(self.allrecords);
            self.populateChores();
            log('HERE IS THE MYCHORES ARRAY');
            log(self.mychores);
            self.getCurrentStats();
            log('currentStats are: ');
            log(self.currentStats);
            self.getChoreStore();
            log('chorestore is:');
            log(self.chorestore);
        })
    }
    
    self.setCurrentMember = function() {
        // somehow remember who was logged in. A cookie, perhaps?
        /////USE RANDOM FAMILY MEMBER FOR NOW
        var familySize = 0;
        for (var i = 0; i < self.allrecords.length; i++) {
            record = self.allrecords[i];
            if (record.type === 'person') {
                self.familyMembers.push(record);
                familySize++;
            }
        }
//        var randomFamilyMember = Math.floor(Math.random() * familySize);
        self.currentMember = self.familyMembers[0];
        log('the currentMember\'s name is ' + self.currentMember.name);
//        var tempNameHolder = self.currentMember.name;
//        log(self.currentMember.name + '\'s _id is ' + self.currentMember._id);
//        self.currentMember.name = 'Crabby Malone';
//        log('Uh oh! ' + tempNameHolder + '\'s name is now ' + self.currentMember.name + '!');
    }
    
    self.setFamily = function() {
        // set the family info
        for (var i = 0; i < self.allrecords.length; i++) {
            var record = self.allrecords[i];
            if (record.type === 'info') {
                self.family = record;
            }
        }
        log('the family\'s email is: ' + self.family.name);
        log('this is the family:');
        log(self.family);
        
    }
    
    self.setSponsor = function() {
        // get the Sponsor record from allRecords
        for (var i = 0; i < self.allrecords.length; i++) {
            var record = self.allrecords[i];
            if (record.type === 'sponsor') {
                self.sponsor = record;
            }
        }
        log('the sponsor is ' + self.sponsor.name);
        log(self.sponsor);
        self.sponsor.name = 'happy fun bank';
        log(self.sponsor.name);
        log(self.allrecords);
            
    }

    self.currentMemberName = self.currentMember.name;

    self.currentStats = {
        incompleteChores: 0,
        alltimechores: 0,
        alltimeearnings: 0,
        curretgoals: 0,
        balance: 0,
        owed: 0
    }

    self.getCurrentStats = function() {
//        alert('hi');
        for (var i = 0; i < self.allrecords.length; i++) {
            console.log('howdy');
            var record = self.allrecords[i];
            log('current record is:');
            log(record);
            if ( record.type === 'chore' && record.complete === false ) {
                self.currentStats.incompleteChores  = self.currentStats.incompleteChores + 1;
            }
            if ( record.type === 'chore' && record.complete === true ) {
                self.currentStats.alltimechores = self.currentStats.alltimechores + 1;
                self.currentStats.alltimeearnings = self.currentStats.alltimeearnings + Number(record.value);
            }
        }
    }
    
    self.getChoreStore = function() {
        self.chorestore = [];
        for (var i = 0; i < self.allrecords.length; i++) {
            record = self.allrecords[i];
            if ( record.type === 'chore' && record.assigned === 'Chore Store' ) {
                var record = self.allrecords[i];
                self.chorestore.push(record);
            }
        }
    }
    
//    self.getCurrentStats = function(){
////        alert('calculating...');
//        for (var i = 0; i < self.allrecords.length; i++) {
//            alert('howdy');
//        }
//            alert('hi');
//            var record = self.allrecords[i];
//            log('current record is:');
//            log(record);
//            if ( record.type === 'chore' && record.complete === false ) {
//                self.currentStats.incompleteChores  = self.currentStats.incompleteChores + 1;
//            }
//            if ( record.type === 'chore' && record.complete === true ) {
//                self.currentStats.alltimechores = self.currentStats.alltimechores + 1;
//                self.currentStats.alltimeearings = self.currentStats.alltimeearnings + record.value;
//            }
        
//            alert('everything calculated');
            // TODO: calculate balance
//    };
    

    
    self.populateChores = function() {
        self.mychores.length = 0;      
        for ( var i = 0; i < self.allrecords.length; i++) {
//            log('iterating...');
            var record = self.allrecords[i];
//            log('this is the record');
//            log(record);
//            if (record.type === 'chore' && record.assigned === self.currentMemberName) {
            if (record.type === 'chore' && record.assigned === self.currentMember.name) {
                self.mychores.push(record);
            }
        }
    };
    
    self.addChore = function(choreobject) {
        var idFromDate = new Date().toISOString();
        choreobject._id = idFromDate;
        
        localDB.put(choreobject).then(function(doc, err) {
            console.log('tried to add a chore');
//            AppService.allrecords.push(doc);
        }).catch(function(err) {
            alert('Sorry - unable to add chore.');
        });
    }
    
    self.updateChore = function(chorerecord) {
        localDB.get(chorerecord._id).then(function(chorerecord){
            console.log('revision before update: ' + chorerecord._rev);
            console.log('and this is the chore record we are trying to update:');
            console.log(chorerecord);
            localDB.put(chorerecord).then(function(doc,err){
                var choreIndex = self.findIndexOfRecord(doc);
                console.log('this is "doc":');
                console.log(doc);
                alert('the choreIndex is: ' + choreIndex);
            }).catch(function(err) {
                alert('unable to update chore :(  | the error was: ' + err);
            })
        }).catch(function(err) {
            console.log('there was a problem with the get, apparently. Line 265.');
            console.log('the error was ' + err);
        })
    }
    
//    updateChoreTest = function() {
//        localDB.get("2016-02-03T19:51:31.354Z").then(function(doc) {
//            doc.name = "Polish the dinosaur";
//            localDB.put(doc).then(function(doc, err) {
//                alert('hooray! successfully updated!');
//            }).catch(function(err) {
//                alert('boo! not successfully updated!')
//            });
//        });
//    }
//    
//    updateChoreTest();
    
    self.deleteChore = function(chorerecord) {
        localDB.get(chorerecord._id).then(function(doc, err) {
            doc._deleted = true;
            localDB.put(doc).then(function(doc, err) {
                alert('record successfully deleted!');
            }).catch(function(doc, err) {
                alert('bummer! record was not deleted.');
            });
        }).catch(function(doc, err) {
            alert('pity - we were unable to fetch the document for deletion.');
        });
    }
    
//    testDeleteChore = function() {
//        localDB.get("2016-02-03T19:51:31.354Z").then(function(doc, err) {
//            self.deleteChore(doc);
//        }).catch(function(err) {
//            alert('something went wrong with the test');
//        });
//    }
//    
//    testDeleteChore();

    self.findIndexOfRecord = function(updateobject) {
        var theRecordIndex = 'sad trombone';
        for (i = 0; i < self.allrecords.length; i++) {
            if (update._id === self.allrecords[i]) {
                alert('found it!');
                theRecordIndex = i;
            }
        }
        return theRecordIndex;
    }    
    
    return self;
});


app.factory('PouchDBListener', ['$rootScope', function($rootScope, AppService) {

 localDB.changes({live: true})
  .on('change', function(change) {
//            alert('something changed in the db.');
//            console.log('something changed in the db. id was: ' + change.id);
            
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    localDB.get(change.id, function(err, doc) {
                        $rootScope.$apply(function(AppService) {
                            if (err) console.log(err);
                            $rootScope.$broadcast('add', doc);
//                            console.log('make sure you splice out and push back in the record with this id: ' + doc._id);
                        })
                    });
                })
            } else {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('delete', change.id);
                });
            }
        });
    return true;
     
}]);


app.factory('PersonService', function(PouchDBListener) {
    
    self = {}
    
    self.addFamilyMember = function(familymemberobject) {
        // TODO: check if person name already exists
        
        var idFromDate = new Date().toISOString();
        console.log('this is the idFromDate;');
        console.log(idFromDate);
        localDB.put({
            _id: familymemberobject.name,
            name: familymemberobject.name,
            admin: familymemberobject.admin
        }).then(function(doc, err) {
            console.log('added new family member.');
        }).catch(function(err) {
            alert('That name already exists. Please pick a unique name!');
        });//test
    }
    
    self.deleteFamilyMember = function(memberrecord) {
        localDB.get(memberrecord._id).then(function(doc) {
            doc._deleted = true;
            return localDB.put(doc);
        });
    }
    
    self.updateFamilyMember = function(memberrecord) {
        localDB.get(memberrecord._id).then(function(doc) {
            // DON'T USE THIS YET
            //// may need to individually assign fields.
            //// also - need to check against revision number
            ////    and handle any errors with a message:
            ////    "there's already a newer version of this
            ////    record that has been saved" or some such
            doc = memberrecord;
            localDB.put(doc);
        });
    }
    
//    var newMemberTest = {
//        name: "Jimmy",
//        admin: false
//    }
//    
//    var updateMemberTest = function() {
//        localDB.get('Jimmy').then(function(doc, err) {
//            if (doc.admin === true) {
//                doc.admin = false;
//            } else {
//                doc.admin = true;                
//            }//test
//
//            localDB.put(doc).then(function(doc, err) {
//                console.log('tried to update Jimmy');
//            }).catch(function(err) {
//                alert('failed to update. hrrrm.');
//            });
//        })
//    }
//    
//    updateMemberTest();
//    
//    self.addFamilyMember(newMemberTest);
     
    return self;

})

//.factory('FindIndexService', function(AppService) {
//    self = {}
//    
//    self.findIndexOfRecord = function(updateobject) {
//        var theRecordIndex = 'sad trombone';
//        for (i = 0; i < AppService.allrecords.length; i++) {
//            if (update._id === AppService.allrecords[i]) {
//                alert('found it!');
//                theRecordIndex = i;
//            }
//        }
//        return theRecordIndex;
//    }
//    
//    return self;
//})

//.factory('ChoreService', function(AppService, FindIndexService) {
//    self = {}
//  
//    self.addChore = function(choreobject) {
//        var idFromDate = new Date().toISOString();
//        choreobject._id = idFromDate;
//        
//        localDB.put(choreobject).then(function(doc, err) {
//            console.log('tried to add a chore');
////            AppService.allrecords.push(doc);
//        }).catch(function(err) {
//            alert('Sorry - unable to add chore.');
//        });
//    }
//    
//    self.updateChore = function(chorerecord) {
//        localDB.get(chorerecord._id).then(function(chorerecord){
//            console.log('revision before update: ' + chorerecord._rev);
//            console.log('and this is the chore record we are trying to update:');
//            console.log(chorerecord);
//            localDB.put(chorerecord).then(function(doc,err){
//                var choreIndex = FindIndexService.findIndexOfRecord(doc);
//                console.log('this is "doc":');
//                console.log(doc);
//                alert('the choreIndex is: ' + choreIndex);
//            }).catch(function(err) {
//                alert('unable to update chore :(  | the error was: ' + err);
//            })
//        }).catch(function(err) {
//            console.log('there was a problem with the get, apparently. Line 265.');
//            console.log('the error was ' + err);
//        })
//    }
//    
////    updateChoreTest = function() {
////        localDB.get("2016-02-03T19:51:31.354Z").then(function(doc) {
////            doc.name = "Polish the dinosaur";
////            localDB.put(doc).then(function(doc, err) {
////                alert('hooray! successfully updated!');
////            }).catch(function(err) {
////                alert('boo! not successfully updated!')
////            });
////        });
////    }
////    
////    updateChoreTest();
//    
//    self.deleteChore = function(chorerecord) {
//        localDB.get(chorerecord._id).then(function(doc, err) {
//            doc._deleted = true;
//            localDB.put(doc).then(function(doc, err) {
//                alert('record successfully deleted!');
//            }).catch(function(doc, err) {
//                alert('bummer! record was not deleted.');
//            });
//        }).catch(function(doc, err) {
//            alert('pity - we were unable to fetch the document for deletion.');
//        });
//    }
//    
////    testDeleteChore = function() {
////        localDB.get("2016-02-03T19:51:31.354Z").then(function(doc, err) {
////            self.deleteChore(doc);
////        }).catch(function(err) {
////            alert('something went wrong with the test');
////        });
////    }
////    
////    testDeleteChore();
//    
//    
//    
//    return self;
//})

.factory('GoalService', function(PouchDBListener) {
    self = {}
  
    self.addGoal = function(goalobject) {
        var idFromDate = new Date().toISOString();
        goalobject._id = idFromDate;
        
        localDB.put(goalobject).then(function() {
            console.log('tried to add a goal');
        }).catch(function(err) {
            alert('Sorry - unable to add goal.');
        });
    }
    
//    addGoalTest = function() {
//        var newGoal = {
//            _id :       "just an empty string, so forlorn",
//            name:       "Get an awesome dinosaur!",
//            whosegoal:  "Jimmy",
//            cost:       140,
//            allocated:  22,
//            complete:   false,
//            picture:    "need to remember to add pictures"
//        }
//        
//        self.addGoal(newGoal);
//    }
//    
//    addGoalTest();
    
    self.updateGoal = function(goalrecord) {
        localDB.get(goalrecord._id).then(function(goalrecord){
            localDB.put(goalecord).then(function(doc,err){
                console.log('goal updated!');
            }).catch(function(err) {
                alert('unable to update goal :(');
            })
        })
    }
    
//    updateGoalTest = function() {
//        localDB.get("2016-02-03T20:15:53.439Z").then(function(doc) {
//            doc.name = "Forget dinos. I want a pet rock!";
//            localDB.put(doc).then(function(doc, err) {
//                alert('hooray! successfully updated!');
//            }).catch(function(err) {
//                alert('boo! not successfully updated!')
//            });
//        });
//    }
//    
//    updateGoalTest();
    
    self.deleteGoal = function(goalrecord) {
        localDB.get(goalrecord._id).then(function(doc, err) {
            doc._deleted = true;
            localDB.put(doc).then(function(doc, err) {
                alert('record successfully deleted!');
            }).catch(function(doc, err) {
                alert('bummer! record was not deleted.');
            });
        }).catch(function(doc, err) {
            alert('pity - we were unable to fetch the document for deletion.');
        });
    }
    
//    testDeleteGoal = function() {
//        localDB.get("2016-02-03T20:15:53.439Z").then(function(doc, err) {
//            self.deleteGoal(doc);
//        }).catch(function(err) {
//            alert('something went wrong with the test');
//        });
//    }
//    
//    testDeleteGoal();
    
    
    
    return self;
})

.factory('CurrentMemberService', function(AppService,PersonService) {
    self = {
        incompleteChores: 0,
        currentGoals: 0,
        allTimeChoreTotal: 0,
        currentBalance: 0,
        currentOwed: 0,
        
    }
    
    self.allMyChores = AppService.mychores;
    
    self.setIncompleteChoreTotal = function() {
        for (i = 0; i < self.allMyChores.length; i++) {
            
        }
    }
})
