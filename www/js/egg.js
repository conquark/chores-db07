//var currentCode = '';
//var validCode = 'ududlrlrba';
//
//var validCode = 'abrlrldudu';
//
//var adminMode = false;
//
//$(document).ready(function() {
//    
//    var up = $("#up");
//    
//    var toggleAdminMode = function() {
//        $scope.adminMode = !($scope.adminMode);
//        if ($adminMode) {
//            alert('admin mode active');
//            alert('proof: admin mode is: ' + $scope.adminMode);
//        } else {
//            alert('admin mode deactivated');
//        }
//    }
//
//    $('body').click(function(e) {
////        alert(e.target.id);
//        
//        currentCode = e.target.id.substring(0,1) + currentCode;
//        if (currentCode.length > validCode.length) {
//            console.log('slicing...');
//            currentCode =  currentCode.slice(0, currentCode.length - 1);
//        }
//        console.log('currentCode: ' + currentCode);
//        if (currentCode === validCode) {
//            currentCode = '';
//            toggleAdminMode();
//        }
//    });
//    
//    
//    
//});