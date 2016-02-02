var thisapp = angular.module('taskMasterApp.controllers', []);

// Controls mychores.html and choredetails.html
thisapp.controller('MyChoresCtrl', function($scope, MyChoresService) {
    alert('hi');
//    $scope.service = MyChoresService;
//    
//    // populate empty array with list of passed in chores
//    $scope.service.populateChores();
//    console.log('chores object:');
//    console.log($scope.chores);
    
})

.controller('ChoreDetailsCtrl', function($scope, MyChoresService, $stateParams) {
    $scope.chore = {};
    
    for ( var i = 0; i < MyChoresService.chores.length; i++) {
        if (MyChoresService.chores[i]._id === $stateParams.choredetailid) {
            $scope.chore.push(MyChoresService.chores[i]);
            console.log('showing details for this chore:');
            console.log($scope.chore);
        }
    }
});