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

        $scope.initPanel = function (name, aircraft) {
            if (aircraft != "JF-17")
                return;
            // 
            aircraft = aircraft.trim();
            console.info("aircraft", ">>" + aircraft + "<<");
            //
            $scope.watchData("display_line_1", { type: 'string', address: 0x4886, maxLength: 8 });
            $scope.watchData("display_line_2", { type: 'string', address: 0x488e, maxLength: 8 });
            $scope.watchData("display_line_3", { type: 'string', address: 0x4896, maxLength: 8 });
            $scope.watchData("display_line_4", { type: 'string', address: 0x489e, maxLength: 8 });
            // 
            $scope.watchData("comm1_freq", { type: 'string', address: 0x48b6, maxLength: 7 });
            $scope.watchData("comm2_freq", { type: 'string', address: 0x48be, maxLength: 7 });
        };

        $scope.watchData("aircraft", null, $scope.initPanel);

        $scope.onTouch = function (cmd, cmd1, cmd0, $event) {
            eventType = $event.type;
            if (eventType == "touchstart") {
                if (cmd1 == null)
                    return;
                command = cmd + " " + cmd1;
            } else if (eventType == "touchend") {
                if (cmd0 == null)
                    return;
                command = cmd + " " + cmd0;
            } else {
                return;
            }
            $scope.sendCommand(command);
        }

    },
]);
