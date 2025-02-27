app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.dcs.dcsJF17Ufc", {
        name: "dcsJF17Ufc",
        url: "/dcs/jf17/ufc",
        controller: "dcsJF17Ufc" + "Controller",
        templateUrl: "dcs-jf17-ufc.html",
    });
});

app.controller("dcsJF17Ufc" + "Controller", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$timeout",
    "$interval",
    function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {

        console.log($scope);

        $scope.initPanel = function (name, aircraft) {
            if (aircraft != "JF-17")
                return;
            // 
            aircraft = aircraft.trim();
            console.info("aircraft", ">>" + aircraft + "<<");
            //
            $scope.watchData("display_line_1", { type: 'string', address: 0x4886, maxLength: 8 }, $scope.onDisplayChange, 1);
            $scope.watchData("display_line_2", { type: 'string', address: 0x488e, maxLength: 8 }, $scope.onDisplayChange, 2);
            $scope.watchData("display_line_3", { type: 'string', address: 0x4896, maxLength: 8 }, $scope.onDisplayChange, 3);
            $scope.watchData("display_line_4", { type: 'string', address: 0x489e, maxLength: 8 }, $scope.onDisplayChange, 4);
            // 
            $scope.watchData("comm1_freq", { type: 'string', address: 0x48b6, maxLength: 7 });
            $scope.watchData("comm2_freq", { type: 'string', address: 0x48be, maxLength: 7 });
            // 
            $scope.watchData("light_1", { type: 'integer', address: 0x4810, mask: 0x0200, shift: 9, maxValue: 1 });
            // 
            console.log("xxxxx", $scope.ws);
        };

        $scope.watchData("aircraft", null, $scope.initPanel);

        $scope.onDisplayChange = function (name, value, oldValue, idx) {
            console.log("onDisplayChange", name, value, idx);
            if (value == null)
                return;
            $scope['display_chars_' + idx] = value.split("");
        };

    },
]);
