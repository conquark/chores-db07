app = angular.module('tmSetup.services', [])

.factory('LoginService', function($scope, $timeout) {
    self = {
        email: '',
        pin: '',
        dbname: '',
        sponsorcode: '',
        name: ''
    }
});