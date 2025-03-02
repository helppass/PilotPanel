
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
        //
        $scope.cmdPwd = {
            key: 'sim/cockpit2/annunciators/autopilot',
            title: 'CMD',
            hasLight: true,
            lightOn: false,
            command: 'laminar/B738/autopilot/cmd_a_press',
            duration: 0.1
        };
        $scope.disPwd = {
            key: 'laminar/B738/autopilot/disconnect_pos',
            title: 'DISCONNECT',
            hasLight: true,
            lightOn: false,
            command: 'laminar/B738/autopilot/disconnect_toggle',
            duration: 0.1
        };
        // 
        $scope.curValue = {
            key: 'sim/cockpit/radios/nav1_obs_degm',
            value: null,
            bits: 0,
            ints: 3,
            minValue: 0,
            maxValue: 359,
            step: 1,
            loop: true,
        };
        $scope.curPwd = {
            title: 'CUR',
            hasLight: false,
        };
        // 
        $scope.spdValue = {
            key: 'sim/cockpit2/autopilot/airspeed_dial_kts',
            value: null,
            bits: 0,
            ints: 3,
            minValue: 0,
            maxValue: 600,
            step: 1,
            loop: false,
        };
        $scope.spdPwd = {
            title: 'SPD',
            hasLight: true,
            lightOn: true,
            key: 'sim/cockpit2/autopilot/autothrottle_enabled',
            command: 'laminar/B738/autopilot/speed_press',
            duration: 0.1
        };
        // 
        $scope.hdgValue = {
            key: 'sim/cockpit2/autopilot/heading_dial_deg_mag_pilot',
            value: null,
            bits: 0,
            ints: 3,
            minValue: 0,
            maxValue: 359,
            step: 1,
            loop: true,
        };
        $scope.hdgPwd = {
            title: 'HDG',
            hasLight: true,
            lightOn: false,
            key: 'sim/cockpit2/autopilot/heading_mode',
            command: 'laminar/B738/autopilot/hdg_sel_press',
            duration: 0.1
        };
        // 
        $scope.altValue = {
            key: 'sim/cockpit2/autopilot/altitude_dial_ft',
            // key: 'sim/flightmodel2/position/pressure_altitude', 
            value: null,
            bits: 0,
            minValue: 0,
            step: 100,
            loop: false,
        };
        $scope.altPwd = {
            title: 'ALT',
            hasLight: true,
            lightOn: false,
            key: 'sim/cockpit2/autopilot/altitude_mode',
            command: 'laminar/B738/autopilot/alt_hld_press',
            duration: 0.1
        };
        // 
        $scope.vviValue = {
            key: 'sim/cockpit2/autopilot/vvi_dial_fpm',
            value: null,
            bits: 0,
            step: 50,
        };
        $scope.vviPwd = {
            title: 'V/S',
            hasLight: true,
            lightOn: false,
            key: 'sim/cockpit2/autopilot/altitude_mode',
            command: 'laminar/B738/autopilot/vs_press',
            duration: 0.1
        };

        $scope.initPanel = function (aircraft) {
            console.log("initPanel test", aircraft);
            // 
            if (aircraft == null)
                return;

            freqs = [
                $scope.curValue,
                $scope.spdValue,
                $scope.hdgValue,
                $scope.altValue,
                $scope.vviValue,
            ];

            freqs.forEach(freq => {
                $scope.watchDataref(freq.key, $scope.onFreqChanged, freq);
            });
            // 
            $scope.watchDataref($scope.cmdPwd.key, $scope.onCmdChanged, $scope.cmdPwd);
            $scope.watchDataref($scope.disPwd.key, $scope.onDisChanged, $scope.disPwd);
            $scope.watchDataref($scope.spdPwd.key, $scope.onSpdChanged, $scope.spdPwd);
            $scope.watchDataref($scope.hdgPwd.key, $scope.onHdgChanged, $scope.hdgPwd);
            $scope.watchDataref($scope.altPwd.key, $scope.onAltChanged, $scope.altPwd);
            $scope.watchDataref($scope.vviPwd.key, $scope.onVviChanged, $scope.vviPwd);
        };

        $scope.onFreqChanged = function (key, newValue, oldValue, freq) {
            if (newValue == null)
                return;
            v = Number(newValue);
            v = v / Math.pow(10, freq.bits);
            t = v.toFixed(freq.bits);
            t = t.padStart(7, " ");
            freq.value = v;
            freq.text = t
            console.log("onFreqChanged changed: ", key, newValue, oldValue, freq);
        };
        $scope.onCmdChanged = function (key, newValue, oldValue, btn) {
            if (btn == null)
                return;
            btn.lightOn = newValue == 1;
            console.log("onCmdChanged", btn, btn.lightOn)
        };

        $scope.onDisChanged = function (key, newValue, oldValue, btn) {
            if (btn == null)
                return;
            btn.lightOn = newValue == 1;
        };

        $scope.onSpdChanged = function (key, newValue, oldValue, btn) {
            if (btn == null)
                return;
            btn.lightOn = newValue == 1;
        };

        $scope.onHdgChanged = function (key, newValue, oldValue, btn) {
            if (btn == null)
                return;
            btn.lightOn = newValue == 1;
        };

        $scope.onAltChanged = function (key, newValue, oldValue, btn) {
            if (btn == null)
                return;
            btn.lightOn = newValue == 6;
        };

        $scope.onVviChanged = function (key, newValue, oldValue, btn) {
            if (btn == null)
                return;
            btn.lightOn = newValue == 4;
        };


        $scope.onFreqTouchStart = function (data, event) {
            event.stopPropagation();
            event.preventDefault();
            // 
            if ('vibrate' in navigator)
                navigator.vibrate(50);
            // 
            $scope.freqTouchStartX = event.touches[0].clientX;
            $scope.freqTouchStartY = event.touches[0].clientY;
            $scope.freqTouchDirect = null;
            // 
            freq = Number(data.value);
            if (Number.isFinite(freq) == false)
                freq = 0;
            freq = Math.round(freq / data.step) * data.step;
            $scope.freqInitValue = freq;
            data.value = freq;
        };

        $scope.onFreqTouchMove = function (data, event) {
            event.stopPropagation();
            event.preventDefault();
            // 
            if ($scope.freqTouchDirect == null) {
                curX = event.touches[0].clientX;
                curY = event.touches[0].clientY;
                if (Math.abs(curX - $scope.freqTouchStartX) > 10) {
                    $scope.freqTouchDirect = 1;
                    $scope.freqTouchStart = $scope.freqTouchStartX;
                } else if (Math.abs(curY - $scope.freqTouchStartY) > 10) {
                    $scope.freqTouchDirect = 2;
                    $scope.freqTouchStart = $scope.freqTouchStartY;
                }
                else
                    return;
            }
            //
            if ($scope.freqTouchDirect == 1) {
                distance = event.touches[0].clientX - $scope.freqTouchStart;
            } else {
                distance = event.touches[0].clientY - $scope.freqTouchStart;
            }
            // 
            threshold = 5;
            k = 0.5;
            rate = Math.abs(distance) / threshold;
            rate = k * rate + (1 - k);
            // 
            // console.log("move: start", $scope.freqTouchStart, "distance", distance, "rate", rate);
            while (Math.abs(distance) >= threshold) {
                // 
                if ('vibrate' in navigator)
                    navigator.vibrate(50);
                // 
                sign = Math.sign(distance);
                distance -= sign * threshold;
                if ($scope.freqTouchDirect == 1)
                    deltaFreq = sign * data.step;
                else
                    deltaFreq = -sign * data.step;
                // 
                $scope.freqTouchStart += sign * threshold;
                freq = $scope.freqInitValue + deltaFreq;
                if (data.minValue != null && freq < data.minValue) {
                    if (data.loop)
                        freq = data.maxValue;
                    else
                        freq = data.minValue;
                } else if (data.maxValue != null && freq > data.maxValue) {
                    if (data.loop)
                        freq = data.minValue;
                    else
                        freq = data.maxValue;
                }
                // 
                data.value = freq;
                $scope.freqInitValue = freq;
                // 
                req = {
                    cmd: "dataref_set_values",
                    data: [{
                        name: data.key,
                        value: Number(freq)
                    }]
                }
                $scope.clientWs.send(JSON.stringify(req));
            }

            // deltaFreq = Math.round(distance / threshold) * stepFreq;
            // if (step == 1) {
            // } else {
            //     freq = Math.floor($scope.freqInitValue) + deltaFreq;
            // }
        };

        $scope.onFreqTouchEnd = function (step, event) {
            console.log("onFreqTouchEnd", step, event);
            event.stopPropagation();
            event.preventDefault();
        };

        $scope.$watch("aircraft", $scope.initPanel);

    },
]);
