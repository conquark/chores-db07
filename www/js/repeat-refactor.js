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
        
        var currentDueDate;
        log('REPEATINGCHOREOBJECT.dueDate is: ');
        log(repeatingchoreobject.dueDate);
        
        if (repeatingchoreobject.dueDate) {
            currentDueDate = new Date();
            currentDueDate.setTime(Date.parse(repeatingchoreobject.dueDate));            
        }
        
        // NEW IDEA:
        // START ITERATING THROUGH FUTURE DAYS STARTING WITH TOMORROW
        // FOR EACH DAY, GET ITS DAY NUMBER (0-6)
        // IF THAT DAY NUMBER IS IN THE ARRAY, IT IS THE NEXT DUE DATE
        // TADA

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
        if (numberofrepeatingdays === 1 && false) {
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
            
            var findNextDueDate = function(theArrayOfFlaggedDays, recordDueDate) {
                var daysArray = theArrayOfFlaggedDays;
                var originalDate = new Date();
                originalDate.setTime(Date.parse(recordDueDate);
                var currentDate = new Date();
                var nextDueDate
                for (var i = 0; i < 7; i++) {
                    var nextDate = addDays(originalDate, i);
                    var nextDateDayNumber = nextDate.getDay();
                    for (var j = 0; j < daysArray.length; j++) {
                        var element = daysArray[j];
                        if (element === nextDateDayNumber) {
                            nextDueDate = nextDate;
                            return nextDueDate;
                        }
                    }
                    return null;
                }
            }
            
            findNextDueDate(arrayOfFlaggedDays, repeatingchoreobject.dueDate);
            
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
    
    return self;
});