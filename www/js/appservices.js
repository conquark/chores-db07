var app = angular.module('taskMasterApp.services', []);

app.factory('AppService', function(PouchDBListener) {
//    alert('i am here!');
    function log(x){console.log(x)}
    
    var self = {
        allrecords : [],
        currentMember : {},
        family : {},
        sponsor : {},
        familyMembers: []
    };
    
    
    self.setAllRecords = function() {
        // get all the records from the database [TEMPORARILY FROM STATIC JS FILE]
        self.allrecords = tempRecordsList;
        log('all records are');
        log(self.allrecords);
        
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
        var randomFamilyMember = Math.floor(Math.random() * familySize);
        self.currentMember = self.familyMembers[randomFamilyMember];
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
    
    return self;
})

.factory('MyChoresService', function(AppService){
  var currentMemberName = AppService.currentMember.name;
    
// Set chores property to an empty array
  var self = {
    'mychores': []
  };
console.log('self.mychores is:');
console.log(self.mychores);
// function to fill the empty chores array with the currentMember's chores
  self.populateChores = function() {
    console.log('populatin them chores');
    self.mychores.length = 0;
      
    //  Get allrecords array from AppService,
    //  iterate through all of the docs we retrieved from the database
    //  and if they are of type 'chore' and they are assigned to the
    //  currentMember, push them into the chores array.
    for ( var i = 0; i < AppService.allrecords.length; i++) {
     console.log('iteration ' + i);
    console.log('currentMember name is ' + currentMemberName);
      var record = AppService.allrecords[i];
        console.log('this record has a type of: ' + record.type);
        console.log('this record is assigned to: ' + record.assigned);
        if (record.type === 'chore' && record.assigned === currentMemberName) {
            self.mychores.push(record);
            console.log('PUTTING A CHORE IN MYCHORES!!!!');
            console.log('mychores.length is: ' + self.mychores.length);
      }
    }
  };

  //  Get an individual chore for the choredetails view
  self.getChore = function(choreId) {
    if (choreId !== null && choreId !=='') {
      for (var i = 0; i < self.mychores.length; i++) {
        var chore = self.mychores[i];
        if (chore._id === choreId) {
          return chore;
        }
      }
    }
    return null;
  };
    
  return self;

});


app.factory('PouchDBListener', ['$rootScope', function($rootScope) {

 localDB.changes({live: true})
  .on('change', function(change) {
            //alert('hi');
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    localDB.get(change.id, function(err, doc) {
                        $rootScope.$apply(function() {
                            if (err) console.log(err);
                            $rootScope.$broadcast('add', doc);
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
    
    self = {
        addFamilyMember,
        deleteFamilyMember,
        updateFamilyMember,
        payFamilyMember
    }
    
    self.addFamilyMember = function(familymemberobject) {
        var idFromDate = new Date().toISOString;
        localDB.put({
            _id: idFromDate,
            name: familymemberobject.name,
            admin: familymemberobject.admin
        })
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
})
