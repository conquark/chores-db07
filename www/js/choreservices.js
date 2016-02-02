var app = angular.module('taskMasterApp.services', []);

app.factory('MyChoresService', function(AppService){
  var currentMemberName = AppService.currentMember.name;

// Set chores property to an empty array
  var self = {
    'mychores': []
  };

// function to fill the empty chores array with the currentMember's chores
  self.populateChores = function() {
    self.mychores.length = 0;
      
    //  Get allrecords array from AppService,
    //  iterate through all of the docs we retrieved from the database
    //  and if they are of type 'chore' and they are assigned to the
    //  currentMember, push them into the chores array.
    for ( var i = 0; i < AppService.allrecords.length; i++) {
      var record = AppService.allrecords[i];
        if (record.type === 'chore' && record.assigned === currentMemberName) {
        self.mychores.push(record);
      }
    }
  }

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
