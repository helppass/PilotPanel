app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.dcs.dcsF16Ufc", {
        name: "dcsF16Ufc",
        url: "/dcs/f16/ufc",
        controller: "dcsF16Ufc" + "Controller",
        templateUrl: "dcs-f16-ufc.html",
    });
});

app.controller("dcsF16Ufc" + "Controller", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$timeout",
    "$interval",
    function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {

        $scope.initPanel = function (name, aircraft) {
            if (aircraft != "F-16C_50")
                return;
            // 
            aircraft = aircraft.trim();
            console.info("aircraft", ">>" + aircraft + "<<");
            //
            $scope.watchData("ded_display_1", { type: 'string', address: 0x450a, maxLength: 29 });
            $scope.watchData("ded_display_2", { type: 'string', address: 0x450a, maxLength: 29 });
            $scope.watchData("ded_display_3", { type: 'string', address: 0x450a, maxLength: 29 });
            $scope.watchData("ded_display_4", { type: 'string', address: 0x450a, maxLength: 29 });
            $scope.watchData("ded_display_5", { type: 'string', address: 0x450a, maxLength: 29 });

            $scope.watchData("comm1_freq", { type: 'string', address: 0x45c8, maxLength: 7 });
            $scope.watchData("comm2_freq", { type: 'string', address: 0x45d0, maxLength: 7 });
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

        $scope['ded_display_1'] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $scope['ded_display_2'] = "0123456789";
        $scope['ded_display_3'] = "CONNECTING TO SERVER......";
        $scope['ded_display_4'] = "WAITING FOR NOTICE........";
    },
]);
