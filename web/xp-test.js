app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.xp.test", {
        name: "xpTest",
        url: "/xp/test",
        controller: "xpTest" + "Controller",
        templateUrl: "xp-test.html",
    });
});

app.controller("xpTest" + "Controller", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$timeout",
    "$interval",
    function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {
        console.log("xpTestController init");

        console.log($scope);

        $scope.initPanel = function (aircraft) {
            // console.log(":::", aircraft, "::", a, "::", b, "::", c);
            if (aircraft == null)
                return;
            // console.log(":::", aircraft, "::", a, "::", b, "::", c);
            // $scope.watchDataref("sim/cockpit2/radios/actuators/com2_standby_frequency_hz_833", $scope.test);
            // $scope.watchDataref("sim/cockpit2/radios/actuators/com2_standby_frequency_hz_833", $scope.test);
            $scope.watchDataref("sim/cockpit2/radios/actuators/com1_frequency_hz_833", $scope.comFreqChanged, $scope.com1Freq, 3);
            $scope.watchDataref("sim/cockpit2/radios/actuators/com2_frequency_hz_833", $scope.comFreqChanged, $scope.com2Freq, 3);
            //
        };

        $scope.$watch("aircraft", $scope.initPanel);

        $scope.test = function (key, newValue, oldValue) {
            if (newValue == null) return;
            console.log("on changed: ", key, newValue, oldValue);
        };

        $scope.com1Freq = {
            key: "sim/cockpit2/radios/actuators/com1_frequency_hz_833",
            bits: 3,
            value: "118.500"
        };

        $scope.com2Freq = {
            keys: "sim/cockpit2/radios/actuators/com2_frequency_hz_833",
            bits: 3,
            value: "125.500"
        };

        $scope.com1FreqChanged = function (key, newValue, oldValue, p1, p2, p3) {
            if (newValue == null)
                return;
            console.log("com1FreqChanged changed: ", key, newValue, oldValue, p1, p2, p3);
        };

        $scope.com2FreqChanged = function (key, newValue, oldValue, p1, p2, p3) {
            if (newValue == null)
                return;
            console.log("com1FreqChanged changed: ", key, newValue, oldValue, p1, p2, p3);
        };

        $scope.comFreqChanged = function (key, newValue, oldValue, comFreq, bits) {
            console.log("com1FreqChanged changed: ", key, newValue, oldValue, comFreq, bits);
            if (newValue == null)
                return;
            v = Number(newValue);
            v = v / Math.pow(10, bits);
            v = v.toFixed(bits);
            comFreq.value = v;
        };

        $scope.com1Pwd = {
            title: "COM1",
            hasLight: true,
            lightOn: true,
        }

        $scope.com2Pwd = {
            title: "COM2",
            hasLight: true,
            lightOn: false,
        }

    },
]);
