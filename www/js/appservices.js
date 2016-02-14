var app = angular.module('taskMasterApp.services', []);

app.factory('UtilityService', function() {
    function log(x){console.log(x)}
    function info(x){console.info(x)}
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
    
    self.newChoreFactory = function() {
        var newChore = {
            _id: "",
            name: "",
            type: "chore",
            description: "",
            assigned: "Chore Store",
            assignedby: "",
            value: "",
            valuecategory: "",
            duedate: "",
            complete: false,
            repeats: false,
            frequency: "",
            markedCompleteCount: 0,
            completiondate: '',
            createddate: '',
            assigneddate: ''
            };
        return newChore;
    }

    self.newGoalFactory = function() {
        var newGoal = {
            _id: "",
            name: "",
            type: "goal",
            description: "",
            owner: "",
            cost: "",
            duedate: "",
            complete: false
        };
        return newGoal;
    }
    
    self.makePersonChoresArray = function(person,array) {
        var theperson = person;
        var thearray = array;
        var newarray = [];
        for (var i = 0; i < thearray.length; i++) {
            var record = thearray[i];
            if (record.assigned === theperson) {
                newarray.push(record);
            }
        }
        return newarray();
    }

    self.updateObject = function(theObject,allrecordsarray) {
//        alert('attempting to update the in-memory database...i think');
        localDB.get(theObject._id).then(function(doc, err) {
            for (var i = 0; i < allrecordsarray.length; i++) {
                if (allrecordsarray[i]._id === theObject._id) {
//                    alert('splicing...');
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

    self.getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    self.setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    log('setting new cookie');
    document.cookie = cname + "=" + cvalue + "; " + expires;
        //    var theCookie = self.getCookie(cname);
    log('cookie set: ' + document.cookie);
    }

    self.startwidget = function() {
        theresult = {};
        cloudinary.openUploadWidget({upload_preset: 'xisr5ror', cropping:true, multiple:false}, 
      function(error, result) {
            console.log(error, result);
            theresult = result;
//            alert(result[0].url);
            console.log('this is the secure_url: ' + theresult[0].secure_url);
            if(error) {
                console.log('there was an error!!!!');
            }
            return theresult[0].secure_url;
        });
    }
    
    self.calculateNextChoreRepeatDate = function(repeatingchoreobject) {
        
        var addDays = function(date,days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        
        
        var getDayNumberFromDay = function(day) {
            var dayNumber = 0;
            
            switch(day) {
                case 'Sunday': 
                    dayNumber = 0;
                    break;
                case 'Monday': 
                    dayNumber = 1;
                    break;
                case 'Tuesday': 
                    dayNumber = 2;
                    break;
                case 'Wednesday': 
                    dayNumber = 3;
                    break;
                case 'Thursday': 
                    dayNumber = 4;
                    break;
                case 'Friday': 
                    dayNumber = 5;
                    break;
                case 'Saturday': 
                    dayNumber = 6;
                    break;
                default:
                    0;
            }
            
            return dayNumber;
        }        
        
        
        
        
        
        log('STARTING TO CALCULATE NEXT DATE////////');
        log('VALUE OF THE repeatingchoreobject.dueDate is: ');
        log(repeatingchoreobject.dueDate);
        // get the current duedate of the chore object
        var currentDueDate = new Date();
        currentDueDate.setTime(Date.parse(repeatingchoreobject.dueDate));
//        var currentDueDate = repeatingchoreobject.dueDate;
        var currentDay = currentDueDate.getDay();
//        var currentDayNumber = getDayNumberFromDay(currentDay);
        log('currentDueDate is: ' + currentDueDate);
        log('currentDay is: ' + currentDay);
//        log('currentDayNumber is: ' + currentDayNumber);
        
        // check to see if there is more than one repeat day per week
        var numberofrepeatingdays = Object.keys(repeatingchoreobject.repeatdays).length;
        log('calculated number of repeating days: ' + numberofrepeatingdays);
        log('well that\'s weird. this is the chore object we are looking at: ');
        log(repeatingchoreobject);
        
        // if it's just once a week, just get the date seven days from now
        if (numberofrepeatingdays === 1) {
            oneWeekFromNow = addDays(currentDueDate, 7);
            return oneWeekFromNow;
        } else {
            log('NOW THE REAL WORK BEGINS');
            var offsetDaysArray = [];

            log('putting the days in order starting from currentduedate of goal');
            /// put the days of the week in order, but starting with the number
            /// of the current day. i.e if the current day is Saturday, the
            /// first number in the array will be 6, and the second will be 0, etc.
            for (var i = 0; i < 7; i++) {
                var dayOffset = currentDay + i;
                var dayNumberToPush;
                if (dayOffset > 6) {
                    dayNumberToPush = dayOffset - 7;
                } else {
                    dayNumberToPush = dayOffset;
                }
                offsetDaysArray.push(dayNumberToPush);
            }

            log('getting the arrayOfFlaggedDays');
            //// now get an array of the days that are flagged true in the object
            var arrayOfFlaggedDays = [];

            if(repeatingchoreobject.repeatdays.Sunday === true) {
                arrayOfFlaggedDays.push(0);
            }
            if(repeatingchoreobject.repeatdays.Monday === true) {
                arrayOfFlaggedDays.push(1);
            }
            if(repeatingchoreobject.repeatdays.Tuesday === true) {
                arrayOfFlaggedDays.push(2);
            }
            if(repeatingchoreobject.repeatdays.Wednesday === true) {
                arrayOfFlaggedDays.push(3);
            }
            if(repeatingchoreobject.repeatdays.Thursday === true) {
                arrayOfFlaggedDays.push(4);
            }
            if(repeatingchoreobject.repeatdays.Friday === true) {
                arrayOfFlaggedDays.push(5);
            }
            if(repeatingchoreobject.repeatdays.Saturday === true) {
                arrayOfFlaggedDays.push(6);
            }
            
            log('this is the arrayOfFlaggedDays:');
            log(arrayOfFlaggedDays);
            
            /// now get the index of the currentDayNumber in the
            //  arrayOfFlaggedDays
            theIndex = arrayOfFlaggedDays.indexOf(currentDay);
            log('this is the index of the currentDay');
            log(theIndex);
            var theNextDayIndex;            
            if (theIndex !== -1 && repeatingchoreobject.complete === false && false) {
                log('repeating tasks start today. i.e. the "next day" is today. (this will only happen when creating new tasks)');
                return currentDueDate;
            } else {
                log('trying to get the next element');
                var nextElement;
                var nextElementIsSet = false;
                // cycle through the rest of the index
                for (var i = 0; i < arrayOfFlaggedDays.length; i++) {
                    log('cycle ' + i);
                    var element = arrayOfFlaggedDays[i];
                    log('element ' + i + ' is ' + element);
                    if (nextElementIsSet === false && element > currentDay) {
                        nextElement = element;
                        nextElementIsSet = true;
                        theNextDayIndex = i;
                        log('we have set theNextDayIndex to ' + i);
                    } else {
                        theNextDayIndex = 0;
                        log('we have set theNextDayIndex to the first element, i.e. 0');
                    }
                }
            }

//            if (arrayOfFlaggedDays.length > currentDayNumber + 1) {
//                theNextDayIndex = theIndex + 1;
//            } else {
//                theNextDayIndex = 0;
//            }
            
            theNextDayDayOfWeekNumber = arrayOfFlaggedDays[theNextDayIndex];
            
            var daysFromOriginal;
            
            if (theNextDayDayOfWeekNumber > currentDay) {
                daysFromOriginal = theNextDayDayOfWeekNumber - currentDay;
            } else {
                daysFromOriginal = 7 + theNextDayDayOfWeekNumber - currentDay;
            }
            log('daysFromOriginal has been calculated to be: ' + daysFromOriginal);
            
            var dateToReturn = addDays(currentDueDate, daysFromOriginal);
            log('the date we are returning for clonatizing is: ' );
            log(dateToReturn);
            
            return dateToReturn;
            
        }
    

    }

//upload image
//send result to save record with image method
    
    return self;
});

app.factory('AppService', function(PouchDBListener, UtilityService) {
    
    function log(x){console.log(x)}
    function info(x){console.info(x)}
    
    var self = {
        allrecords : [],
        currentMember : {},
        family : {},
        sponsor : {},
        familyMembers: [],
        familySize: 0,
        currentRecordIndex: 0,
        mychores: [],
        chorestore: [],
        chorestoresize: 0,
        completedchores: 0,
        incompletechores: 0,
        mygoals: [],
        thisweek: []
    };
    
    
    self.setAllRecords = function(currentMemberName) {
        info('STEP (2) START');
        // get all the records from the database [TEMPORARILY FROM STATIC JS FILE]
//        self.allrecords = tempRecordsList;
        self.allrecords = [];
        localDB.allDocs({include_docs:true}).then(function(result){
            for (var i = 0; i < result.rows.length; i++) {
                self.allrecords.push(result.rows[i].doc);
            }
            log('allrecords size is: ' + self.allrecords.length);
            info('STEP (2) END');
            self.setCurrentMember();
            self.setFamilyMembers();
            console.log('OK - HERE IS THE CURRENT ALLRECORDS ARRAY');
            console.log(self.allrecords);
            self.thisweek = self.setThisWeek();
            log('This week is week');
            log(self.thisweek);
            self.populateChores();
            log('HERE IS THE MYCHORES ARRAY');
            log(self.mychores);
            self.getGoals();
            log('mygoals is: ');
            log(self.mygoals);
            self.getCurrentStats();
            log('currentStats are: ');
            log(self.currentStats);
            self.getChoreStore();
            log('chorestore is:');
            log(self.chorestore);
            self.setSponsor();
            log('sponsor is: ');
            log(self.sponsor);
            log('incompletechores is: ' + self.incompletechores);
            log('completedchores is: ' + self.completedchores);
            log('familyMembers is: ');
            log(self.familyMembers);
        })
    }
    
    self.setCurrentMember = function(indexname) {
        // somehow remember who was logged in. A cookie, perhaps?
        info('STEP (3) START')

        var cookieMember = UtilityService.getCookie('currentMemberName');
        
        if (indexname) {
//            alert('got an indexname: ' + indexname);
            for (var i = 0; i < self.allrecords.length; i++) {
                var record = self.allrecords[i];
                if (record.name === indexname) {
                    self.currentMember = record;
                    log('current member is: ' + self.currentMember.name);
                    UtilityService.setCookie('currentMemberName', self.currentMember.name, 7000);
                }
            }        
        } else if (cookieMember !== ""){
            for (var i = 0; i < self.allrecords.length; i++) {
                var record = self.allrecords[i];
                if (record.name === cookieMember) {
                    self.currentMember = record;
                    log('current member is: ' + self.currentMember.name);
                }
            }
        } else {
            info('unable to set currentMember from cookie. Starting with OG user.')
            for (var i = 0; i < self.allrecords.length; i++) {
                var record = self.allrecords[i];
                if (record.type === 'person') {
                    self.currentMember = record;
                    UtilityService.setCookie('currentMemberName', self.currentMember.name);
                    log('current member is: ' + self.currentMember.name);
                    log('member cookie is: ' + UtilityService.getCookie('currentMemberName'));
                    info('STEP (3) END');
                    return;
                }
            }
        }
        info('STEP (3) END');
        
        return self.currentMember;

    }

    self.setFamilyMembers = function() {
        info('STEP (3F) START');
        self.familyMembers = [];
        for (var i = 0; i < self.allrecords.length; i++) {
            record = self.allrecords[i];
            if (record.type === 'person' && !record._deleted) {
                self.familyMembers.push(record);
                self.familySize = self.familySize + 1;
            }
        }
        log('familySize: ' + self.familySize);
        log('familyMembers structure: ' + self.familyMembers);
        info('STEP (3F) END');
    }
    
    self.spliceFamilyMember = function(memberid) {
        log('starting the spliceFamilyMember process')
        for (var i = 0; i < self.familyMembers.length; i++) {
            var record = self.familyMembers[i];
            if (record._id === memberid) {
                log('splicing ' + record.name);
                self.familyMembers.splice(i,1);
            }
        }
    }
    
    self.spliceRecord = function(recordid) {
        log('starting the record process')
        for (var i = 0; i < self.allrecords.length; i++) {
            var record = self.allrecords[i];
            if (record._id === recordid) {
                log('splicing ' + record.name);
                self.allrecords.splice(i,1);
            }
        }
    }

    self.populateChores = function() {
        info('STEP (4) START')
        self.mychores.length = 0;
        /// completed chores should have a cutoff of 7 days or so (i.e. these are the chores I've completed this week.) Then there should be an option to show "all time chores" somewhere in the app.
//        info('--setting completed and incompleted chores...')
        self.completedchores = 0;
        self.incompletechores = 0;
//        info('--looping through allrecords');
        for ( var i = 0; i < self.allrecords.length; i++) {
//            log('iterating...');
//            info('----loop' + i);
            var record = self.allrecords[i];
            var recordisthisweekornext = false;
            var duedate, duedatestring, duedateweek;

            if (record.type === 'chore' && record.dueDate) {
                duedatestring = record.dueDate;
                duedate = new Date();
                duedate.setTime(Date.parse(duedatestring));
                duedateweek = duedate.getWeekNumber();
                log('GOT DUEDATE WEEK - IT IS: ');
                log(duedateweek);
            }
            
            if (duedateweek >= self.thisweek && duedateweek < self.thisweek + 2) {
                recordisthisweekornext = true
            }

//            log('this is the record');
//            log(record);
//            if (record.type === 'chore' && record.assigned === self.currentMemberName) {
            if (record.type === 'chore' && record.assigned === self.currentMember.name && recordisthisweekornext) {
                self.mychores.push(record);
            }

//            if (record.type === 'chore' && record.assigned === self.currentMember.name) {
//                self.mychores.push(record);
//            }
            if (record.type === 'chore' && record.complete === true && record.assigned === self.currentMember.name) {
                self.completedchores = self.completedchores + 1;
            }
            
            if (record.type === 'chore' && record.complete === false && record.assigned === self.currentMember.name && recordisthisweekornext) {
                self.incompletechores = self.incompletechores + 1;
            }
        }
    };
    
    self.getGoals = function() {
        info('STEP (4) INTERMEDIATE - STARTING MYGOALS');
        self.mygoals = [];
        for (var i = 0; i < self.allrecords.length; i++) {
            record = self.allrecords[i];
            if (record.type === 'goal' && record.owner === self.currentMember.name) {
                self.mygoals.push(record);
            }
        }
        
        info('STEP (4) END');
        
        return self.mygoals;
    }
    
    
    // the following was used verbatim from accepted answer here:
    // http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php?answertab=active#tab-top
    Date.prototype.getWeekNumber = function(){
        var d = new Date(+this);
        d.setHours(0,0,0);
        d.setMilliseconds(0);
        d.setDate(d.getDate()+4-(d.getDay()||7));
        return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
    };
    
    self.setThisWeek = function() {
        var thisDay = new Date();
        var thisWeekNumber = thisDay.getWeekNumber();
        return thisWeekNumber;
    }

    self.getCurrentStats = function() {
        log('STEP (5) START');
        self.currentStats = {
            incompleteChores: 0,
            alltimechores: 0,
            alltimeearnings: 0,
            currentgoalname: '',
            currentgoals: 0,
            currentgoalscosttotal: 0,
            completedgoals: 0,
            completedgoalsvalue: 0,
            savings: 0,
            earnedthisweek: 0
        }
        for (var i = 0; i < self.allrecords.length; i++) {
//            console.log('howdy');
            var record = self.allrecords[i];
            var recordisthisweekornext = false;
            var duedate, duedatestring, duedateweek;
            var completiondate, completiondatestring, completiondateweek;

            if (record.type === 'chore' && record.dueDate) {
                duedatestring = record.dueDate;
                duedate = new Date();
                duedate.setTime(Date.parse(duedatestring));
                duedateweek = duedate.getWeekNumber();
                log('GOT DUEDATE WEEK - IT IS: ');
                log(duedateweek);
            }
            
            if (record.type === 'chore' && record.completiondate) {
                completiondatestring = record.completiondate;
                completiondate = new Date();
                completiondate.setTime(Date.parse(completiondatestring));
                completiondateweek = completiondate.getWeekNumber();
                log('GOT COMPLETIONDATE WEEK - IT IS: ');
                log(completiondateweek);
            }

            //// SET INCOMPLTE CHORES NUMBER
            if ( record.type === 'chore' && record.complete === false && record.assigned === self.currentMember.name ) {
                info('calculating incomplete chores');
                self.currentStats.incompleteChores  = self.currentStats.incompleteChores + 1;
                info('done calculating incomplete chores. total is: ' + self.currentStats.incompleteChores);
            }
            
            //// SET EARNEDTHISWEEK NUMBER
            if (record.type === 'chore' && record.complete === true && record.assigned === self.currentMember.name && completiondateweek === self.thisweek) {
                self.currentStats.earnedthisweek = self.currentStats.earnedthisweek + record.value;
            }

            
            ///// SET ALLTIME CHORES AND ALLTIME EARNINGS
            if ( record.type === 'chore' && record.complete === true && record.assigned === self.currentMember.name ) {
                info('calculating alltimechores')
                self.currentStats.alltimechores = self.currentStats.alltimechores + 1;
                self.currentStats.alltimeearnings = self.currentStats.alltimeearnings + Number(record.value);
                info('done calculating alltimechores. total is: ' + self.alltimechores);
                info('also done calculating alltime earnings. total is: ' + self.alltimeearnings);
            }
            ///// SET  NOPE- NUMBER OF CURRENT GOALS and COST
            ///// CHANGED TO SET NAME OF CURRENT GOAL AND ITS COST PER WARD 2016-02-10
            if ( record.type === 'goal' && record.complete === false && record.owner === self.currentMember.name ) {
                info('setting name of current goal and its cost');
//                self.currentStats.currentgoals = self.currentStats.currentgoals + 1;
                self.currentStats.currentgoalname = record.name;
                self.currentStats.currentgoalscosttotal = self.currentStats.currentgoalscosttotal + Number(record.cost);
                info('done setting name of current goal. it is: ' + self.currentStats.currentgoalname);
                info('also done setting total current goal cost. total is: ' + self.currentStats.currentgoalscosttotal);
            }
            ////// SET NUMBER OF COMPLETE GOALS AND THEIR VALUE
            if ( record.type === 'goal' && record.complete === true && record.owner === self.currentMember.name ) {
                info('setting number of complete goals and their value...');
                self.currentStats.completedgoals = self.currentStats.completedgoals + 1;
                self.currentStats.completedgoalsvalue = self.currentStats.completedgoalsvalue + Number(record.cost);
                info('done setting number of completed goals. total is: ' + self.currentStats.completedgoals);
                info('also done setting the total value of completed goals. total is: ' + self.currentStats.completedgoalsvalue);
            }            
            ///// SET CURRENT SAVINGS
            if ( record.type === 'chore' && record.complete === true && record.assigned === self.currentMember.name ) {
                info('setting current savings');
                self.savings = self.currentStats.alltimeearnings - self.currentStats.completedgoalsvalue;
                info('completed setting current savings. total is: ' + self.savings);
                info('completed all stats totals so far!');
            }            
            ///// SET OWED
            /// TODO set up chore complettion date
            /// TODO set up chore paid status
            ////TODO set up approval stuff
            ////TODO set up repeating chores
            ////TODO set up parent allocation of savings and pocket money
            ////TODO set up ability to designate a chore a "for pocket money" or "for savings"
            
            
        }
        return self.currentStats;
        log('STEP (5) END');
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
//        self.sponsor.name = 'happy fun bank';
        self.sponsor.name = 'Your Logo Here';
        log(self.sponsor.name);
        log(self.allrecords);
            
    }

    self.currentMemberName = self.currentMember.name;


    
    self.getChoreStore = function() {
        chorestoresize = 0;
        self.chorestore = [];
        for (var i = 0; i < self.allrecords.length; i++) {
            record = self.allrecords[i];
            if ( record.type === 'chore' && record.assigned === 'Chore Store' ) {
                var record = self.allrecords[i];
                self.chorestore.push(record);
                self.chorestoresize = self.chorestoresize + 1;
            }
        }
    }
    
//    self.getGoals = function() {
//        self.mygoals = [];
//        for (var i = 0; i < self.allrecords.length; i++) {
//            record = self.allrecords[i];
//            if ( record.type === 'goal' && record.owner === self.currentMember.name) {
//                self.mygoals.push(record);
//            }
//        }
//        
//        return self.mygoals;
//    }
    

    
    self.addChore = function(choreobject) {
        var idFromDate = new Date().toISOString();
        choreobject._id = idFromDate;
        
        localDB.put(choreobject).then(function(doc, err) {
            console.log('tried to add a chore');
//            AppService.allrecords.push(doc);
        }).catch(function(err) {
            // do something
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
//                alert('the choreIndex is: ' + choreIndex);
            }).catch(function(err) {
//                alert('unable to update chore :(  | the error was: ' + err);
            })
        }).catch(function(err) {
//            console.log('there was a problem with the get, apparently. Line 265.');
//            console.log('the error was ' + err);
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
//                alert('record successfully deleted!');
            }).catch(function(doc, err) {
//                alert('bummer! record was not deleted.');
            });
        }).catch(function(doc, err) {
//            alert('pity - we were unable to fetch the document for deletion.');
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
//                alert('found it!');
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
    
//    self.deleteFamilyMember = function(memberrecord) {
//        localDB.get(memberrecord._id).then(function(doc) {
//            doc._deleted = true;
//            return localDB.put(doc);
//        });
//    }
//    
//    self.updateFamilyMember = function(memberrecord) {
//        localDB.get(memberrecord._id).then(function(doc) {
//            // DON'T USE THIS YET
//            //// may need to individually assign fields.
//            //// also - need to check against revision number
//            ////    and handle any errors with a message:
//            ////    "there's already a newer version of this
//            ////    record that has been saved" or some such
//            doc = memberrecord;
//            localDB.put(doc);
//        });
//    }
    
     
    return self;

});



//.factory('CurrentMemberService', function(AppService,PersonService) {
//    self = {
//        incompleteChores: 0,
//        currentGoals: 0,
//        allTimeChoreTotal: 0,
//        currentBalance: 0,
//        currentOwed: 0,
//        
//    }
//    
//    self.allMyChores = AppService.mychores;
//    
//    self.setIncompleteChoreTotal = function() {
//        for (i = 0; i < self.allMyChores.length; i++) {
//            
//        }
//    }
//})
