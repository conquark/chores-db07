var app = angular.module('taskMasterApp.controllers', []);

app.controller('AppCtrl', function($scope, AppService) {
    
    // set all of the app services up
    AppService.setAllReords();
    AppService.setCurrentMember();
    AppService.setFamilyEmail();
    AppService.setSponsor();
});

