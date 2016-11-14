"use strict";

var angular = require('angular');
var css = require("./multi-select.scss");

var util = {
    filterModel: function(model, keyWord) {
        angular.forEach(model, function(node) {
            if (RegExp(keyWord).test(node.name))
                node.filtered = true;
            else
                node.filtered = false;
        });

        return model;
    },

    getSelected: function(model) {
        var selected = [];
        angular.forEach(model, function(node) {
            if (node.selected)
                selected.push(node.name);
        });

        return selected;
    }
};


function controller($scope, $element) {
    var self = this;
    var lastSelects = [];
    angular.bind(this, init)();

    this.toggleDropDown = function($event) {
        $scope.toggled = !$scope.toggled;
        if ($scope.toggled) this.toggleOpen();
        else this.toggleClose();
    };

    this.toggleOpen = function() {
        lastSelects = util.getSelected($scope.model);
        angular.element( document ).on( 'keydown', this.keyboardListener );
        angular.element( document ).on( 'click', this.externalClickListener );
    };

    this.toggleClose = function() {
        angular.element( document ).off( 'keydown', this.keyboardListener );
        angular.element( document ).off( 'click', this.externalClickListener );
        if (self.onClose) {
            self.onClose({
                key: self.key,
                selected: util.getSelected($scope.model)
            });
        }
    };

    this.keyboardListener = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if ( key === 27 ) {
            e.preventDefault();
            e.stopPropagation();
            self.toggleDropDown( e );
        }

        $scope.$digest();
    };

    this.externalClickListener = function(e) {
        var targetsArr = $element.find( e.target.tagName );
        for (var i = 0; i < targetsArr.length; i++) {
            if ( e.target === targetsArr[i] ) {
                return;
            }
        }
        self.toggleDropDown();
        $scope.$digest();
    };

    this.onSearchChange = function($event) {
        $scope.model = util.filterModel($scope.model, $scope.searchKey);
    };

    this.deleteInput = function() {
        $scope.searchKey = '';
        $scope.model = util.filterModel($scope.model, $scope.searchKey);
    }

    function selectionChanges() {
        $scope.selected = util.getSelected($scope.model);
        if (self.onSelectChange) {
            self.onSelectChange({
                key: self.key,
                selected: angular.copy($scope.selected)
            });
        }
    }

    this.onSelectItem = function(node) {
        node.selected = !node.selected;

        selectionChanges();
    };

    this.onSelectAll = function() {
        angular.forEach($scope.model, function(node) {
            if (node.filtered) node.selected = true;
        });
        selectionChanges();
    }

    this.onSelectNone = function() {
        angular.forEach($scope.model, function(node) {
            node.selected = false;
        });
        selectionChanges();
    }

    this.onReset = function() {
        var lastSelectsDict = {};
        angular.forEach(lastSelects, function(s) {
            lastSelectsDict[s] = 1;
        });
        angular.forEach($scope.model, function(node) {
            if (lastSelectsDict[node.name])
                node.selected = true;
            else
                node.selected = false;
        });
        selectionChanges();
    }

    this.buttonText = function() {
        if ($scope.selected && $scope.selected.length > 0)
            return $scope.selected.length + " items";
        else
            return '';
    };

    function init() {
        $scope.searchKey = '';
        $scope.toggled = false;
        $scope.model = [];
        $scope.showSelected = false;
        $scope.selected = null;
        angular.forEach(this.data, function(node) {
            $scope.model.push({
                name: node,
                selected: false,
                filtered: true,
            });
        });
    };
};

module.exports = {
    template: require('./multiSelect.html'),
    controller: ['$scope', '$element', controller],
    bindings: {
        key: "<",
        data: "<",
        onSelectChange: "&",
        onClose: "&",
        prefix: "<",
        powerSearch: "<",
        powerSelect: "<",
    }
};
