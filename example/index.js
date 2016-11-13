var angular = require('angular');
var multiSelect = require('../multiSelect');


var app = angular.module('multiSelectExample', []);
app.component('multiSelect', multiSelect);

app.run(['$rootScope', function($rootScope) {

    $rootScope.onClose = function(key, selected) {
        console.log('select closed');
        console.log('key: ', key);
        console.log('selected: ', selected);
    }


    $rootScope.data = [
        'node1',
        'node2',
    ]

}]);
