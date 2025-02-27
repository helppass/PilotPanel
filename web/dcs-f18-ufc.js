app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.dcs.dcsF18Ufc", {
        name: "dcsF18Ufc",
        url: "/dcs/f18/ufc",
        controller: "dcsF18Ufc" + "Controller",
        templateUrl: "dcs-f18-ufc.html",
    });
});

app.controller("dcsF18Ufc" + "Controller", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$timeout",
    "$interval",
    function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {

        console.log($scope);

        $scope.initPanel = function (name, aircraft) {
            if (aircraft != "FA-18C_hornet")
                return;
            // 
            aircraft = aircraft.trim();
            console.info("aircraft", ">>" + aircraft + "<<");
            //
            $scope.watchData("comm_1_display", { type: 'string', address: 0x7424, maxLength: 2 }, (name, value) => $scope.comm1 = value);
            $scope.watchData("comm_2_display", { type: 'string', address: 0x7426, maxLength: 2 }, (name, value) => $scope.comm2 = value);
            // 
            $scope.watchData("option_cueing_1", { type: 'string', address: 0x7428, maxLength: 1 });
            $scope.watchData("option_cueing_2", { type: 'string', address: 0x742a, maxLength: 1 });
            $scope.watchData("option_cueing_3", { type: 'string', address: 0x742c, maxLength: 1 });
            $scope.watchData("option_cueing_4", { type: 'string', address: 0x742e, maxLength: 1 });
            $scope.watchData("option_cueing_5", { type: 'string', address: 0x7430, maxLength: 1 });
            // 
            $scope.watchData("option_display_1", { type: 'string', address: 0x7432, maxLength: 4 });
            $scope.watchData("option_display_2", { type: 'string', address: 0x7436, maxLength: 4 });
            $scope.watchData("option_display_3", { type: 'string', address: 0x743a, maxLength: 4 });
            $scope.watchData("option_display_4", { type: 'string', address: 0x743e, maxLength: 4 });
            $scope.watchData("option_display_5", { type: 'string', address: 0x7442, maxLength: 4 });
            // 
            $scope.watchData("scratchpad_string_1", { type: 'string', address: 0x744e, maxLength: 2 }, $scope.onScratchpadChange);
            $scope.watchData("scratchpad_string_2", { type: 'string', address: 0x7450, maxLength: 2 }, $scope.onScratchpadChange);
            $scope.watchData("scratchpad_number", { type: 'string', address: 0x7446, maxLength: 8 }, $scope.onScratchpadChange);
            // 
            $scope.watchData("comm1_freq", { type: 'string', address: 0x7592, maxLength: 7 });
            $scope.watchData("comm2_freq", { type: 'string', address: 0x759a, maxLength: 7 });
        };

        $scope.watchData("aircraft", null, $scope.initPanel);

        $scope.onScratchpadChange = function () {
            s1 = $scope['scratchpad_string_1'];
            s2 = $scope['scratchpad_string_2'];
            s3 = $scope['scratchpad_number'];
            if (s1 == null || s2 == null || s3 == null)
                return;
            text = s1 + s2 + s3;
            text = text.replace("@", "°");
            $scope.scratchpad_text = text.split("");
        }

    },
]);
