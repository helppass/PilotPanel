app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.dcs.test", {
        name: "dcsTest",
        url: "/dcs/test",
        controller: "dcsTest" + "Controller",
        templateUrl: "dcs-test.html",
    });
});

app.controller("dcsTest" + "Controller", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$timeout",
    "$interval",
    function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {

        console.log($scope);

        $scope.initPanel = function (aircraft) {
            // console.log(":::", aircraft, "::", a, "::", b, "::", c);
            if (aircraft == null)
                return;
            if (aircraft != "FA-18C_hornet")
                return;
            aircraft = aircraft.trim();
            console.info("aircraft", ">>" + aircraft + "<<");
            //
            $scope.watchData("comm_1_display", { type: 'string', address: 0x7424, maxLength: 2 }, $scope.testCallback);
            $scope.watchData("comm_2_display", { type: 'string', address: 0x7426, maxLength: 2 }, $scope.testCallback);
            // 
            $scope.watchData("option_cueing_1", { type: 'string', address: 0x7428, maxLength: 1 }, $scope.testCallback);
            $scope.watchData("option_cueing_2", { type: 'string', address: 0x742a, maxLength: 1 }, $scope.testCallback);
            $scope.watchData("option_cueing_3", { type: 'string', address: 0x742c, maxLength: 1 }, $scope.testCallback);
            $scope.watchData("option_cueing_4", { type: 'string', address: 0x742e, maxLength: 1 }, $scope.testCallback);
            $scope.watchData("option_cueing_5", { type: 'string', address: 0x7430, maxLength: 1 }, $scope.testCallback);
            // 
            $scope.watchData("option_display_1", { type: 'string', address: 0x7432, maxLength: 4 }, $scope.testCallback);
            $scope.watchData("option_display_2", { type: 'string', address: 0x7436, maxLength: 4 }, $scope.testCallback);
            $scope.watchData("option_display_3", { type: 'string', address: 0x743a, maxLength: 4 }, $scope.testCallback);
            $scope.watchData("option_display_4", { type: 'string', address: 0x743e, maxLength: 4 }, $scope.testCallback);
            $scope.watchData("option_display_5", { type: 'string', address: 0x7442, maxLength: 4 }, $scope.testCallback);
            // 
            // Output Type: string Address: 0x7446 Max. Length: 8 Description: Scratchpad Number Display
            $scope.watchData("scratchpad_number", { type: 'string', address: 0x7446, maxLength: 8 }, $scope.testCallback);
            // Output Type: string Address: 0x744e Max. Length: 2 Description: Scratchpad String 1 Display
            $scope.watchData("scratchpad_string_1", { type: 'string', address: 0x744e, maxLength: 2 }, $scope.testCallback);
            // Output Type: string Address: 0x7450 Max. Length: 2 Description: Scratchpad String 2 Display
            $scope.watchData("scratchpad_string_2", { type: 'string', address: 0x7450, maxLength: 2 }, $scope.testCallback);
        };

        $scope.$watch("aircraft", $scope.initPanel);

        $scope.testCallback = function (name, newValue, oldValue) {
            console.log("testCallback", name, newValue, oldValue);
        };


        $scope.btnNum1 = {
            title: '1',
            hasLight: false,
            command: 'UFC_1'
        };

        $scope.btnNum2 = {
            title: '2',
            hasLight: false,
            command: 'UFC_2'
        };
        $scope.btnNum3 = {
            title: '3',
            hasLight: false,
            command: 'UFC_3'
        };

        $scope.onClickDown = function (btn, down, event) {
            event.stopPropagation();
            event.preventDefault();

            command = btn.command;
            if (command == null)
                return;
            console.log("submit command: ", command, down);
            req = {
                cmd: "command",
                command: btn.command + " " + down
            }
            $scope.clientWs.send(JSON.stringify(req));
        }

    },
]);
