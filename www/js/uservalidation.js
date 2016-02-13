var success = false;
var fail = false;

var validcodes = 'horizons16';
var enteredcode = '';

var email1value = '';
var email2value = '';

var emailsmatch = false;

var emailerrordiv = document.getElementById('emailerrordiv');

var bankcodeinput = document.getElementById('bankcode');

bankcodeinput.addEventListener('keyup', function(e) {
    enteredcode = bankcodeinput.value;
});

var firstemail = document.getElementById('firstemail');
var secondemail = document.getElementById('secondemail');

firstemail.addEventListener('keyup', function(e) {
    email1value = firstemail.value;
});

secondemail.addEventListener('keyup', function(e) {
    email2value = secondemail.value;
    if (email1value !== email2value) {
        emailerrordiv.style.display = "block";
        emailmatchdiv.style.display = "none";
    } else {
        emailerrordiv.style.display = "none";
        emailmatchdiv.style.display ="block";
        emailsmatch = true;
    }
});

var validate = function() {
   if(email1value !== undefined && email1value !== ''){
    if (enteredcode === validcodes) {
        if(emailsmatch === true) {
//            alert('valid!');
            
            var replaceStep1 = email1value.replace(".", "(dot)");
            var dbname = replaceStep1.replace("@", "(at)");
//            alert('dbname is: ' + dbname);
            setCookie('dbname', dbname);
            document.getElementById('success').style.display = "block";
            document.getElementById('fail').style.display = "none";
            setTimeout(function() {
                location.href = 'index.html';
            }, 2000);
        } else {
//            alert('emails do not match. please try again');
            document.getElementById('success').style.display = "none";
            document.getElementById('fail').style.display = "block";
        }

    } else {
                    document.getElementById('success').style.display = "none";
            document.getElementById('fail').style.display = "block";
    }       
   } else {
//       alert('you must enter an email');
   }

}

var appnocode = function() {
    var randomNumber = Math.floor(Math.random() * 400000);
    var dateStamp = new Date().toISOString();
    var uniqueDB = dateStamp + randomNumber;
    setCookie('dbname', dbname);
    setTimeout(function() {
                location.href = 'index.html';
            }, 2000);
    document.getElementById('nocodesuccess').style.display = "block";
}