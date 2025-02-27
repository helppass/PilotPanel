app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.xp.radio", {
        name: "xpRadio",
        url: "/xp/radio",
        controller: "xpRadio" + "Controller",
        templateUrl: "xp-radio.html",
    });
});

app.controller("xpRadio" + "Controller", [
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    "$timeout",
    "$interval",
    function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {
        $scope.inputText = "";

        $scope.com1Pwd = {
            title: "COM1",
            // hasLight: true,
            // lightOn: true,
            // command: 'laminar/B738/rtp_L/freq_txfr/sel_switch',
            // duration: 0.05,
        };
        $scope.com1Apply = {
            title: '<<<',
            command: 'sim/radios/com1_standy_flip',
            duration: 0.1,
        };
        $scope.com2Pwd = {
            title: "COM2",
            // hasLight: true,
            // lightOn: true,
            // command: 'laminar/B738/rtp_L/freq_txfr/sel_switch',
            // duration: 0.1,
        };
        $scope.com2Apply = {
            title: '<<<',
            command: 'sim/radios/com2_standy_flip',
            duration: 0.1,
        }
        $scope.nav1Pwd = {
            title: 'NAV1',
            // hasLight: true,
            // lightOn: true,
            // command: 'laminar/B738/rtp_L/freq_txfr/sel_switch',
            // duration: 0.1,
        };
        $scope.nav1Apply = {
            title: '<<<',
            command: 'sim/radios/nav1_standy_flip',
            duration: 0.1,
        }
        $scope.nav2Pwd = {
            title: 'NAV2',
            // hasLight: true,
            // lightOn: true,
            // command: 'laminar/B738/rtp_L/freq_txfr/sel_switch',
            // duration: 0.1,
        };
        $scope.nav2Apply = {
            title: '<<<',
            command: 'sim/radios/nav2_standy_flip',
            duration: 0.1,
        }
        $scope.adf1Pwd = {
            title: 'ADF1',
            // hasLight: true,
            // lightOn: true,
            // command: 'laminar/B738/rtp_L/freq_txfr/sel_switch',
            // duration: 0.1,
        };
        $scope.adf2Pwd = {
            title: 'ADF2',
            // hasLight: true,
            // lightOn: true,
            // command: 'laminar/B738/rtp_L/freq_txfr/sel_switch',
            // duration: 0.1,
        };
        // 
        $scope.com1Freq = {
            key: 'sim/cockpit2/radios/actuators/com1_frequency_hz_833',
            value: null,
            bits: 3
        };
        $scope.com1StandbyFreq = {
            key: 'sim/cockpit2/radios/actuators/com1_standby_frequency_hz_833',
            value: null,
            bits: 3
        };
        $scope.com2Freq = {
            key: 'sim/cockpit2/radios/actuators/com2_frequency_hz_833',
            value: null,
            bits: 3
        };
        $scope.com2StandbyFreq = {
            key: 'sim/cockpit2/radios/actuators/com2_standby_frequency_hz_833',
            value: null,
            bits: 3
        };
        $scope.nav1Freq = {
            key: 'sim/cockpit2/radios/actuators/nav1_frequency_hz',
            value: null,
            bits: 2
        };
        $scope.nav1StandbyFreq = {
            key: 'sim/cockpit2/radios/actuators/nav1_standby_frequency_hz',
            value: null,
            bits: 2
        };
        $scope.nav2Freq = {
            key: 'sim/cockpit2/radios/actuators/nav2_frequency_hz',
            value: null,
            bits: 2
        };
        $scope.nav2StandbyFreq = {
            key: 'sim/cockpit2/radios/actuators/nav2_standby_frequency_hz',
            value: null,
            bits: 2
        };
        $scope.adf1Freq = {
            key: 'sim/cockpit2/radios/actuators/adf1_frequency_hz',
            value: null,
            bits: 0
        };
        $scope.adf2Freq = {
            key: 'sim/cockpit2/radios/actuators/adf2_frequency_hz',
            value: null,
            bits: 0
        };

        $scope.initPanel = function (aircraft) {
            if (aircraft == null)
                return;
            // 
            if (aircraft == "Boeing 737-800") {
                $scope.com1Apply.command = 'laminar/B738/rtp_L/freq_txfr/sel_switch';
            } else {
                $scope.com1Apply.command = 'sim/radios/com1_standy_flip';
            }
            // 
            freqs = [
                $scope.com1Freq,
                $scope.com1StandbyFreq,
                $scope.com2Freq,
                $scope.com2StandbyFreq,
                $scope.nav1Freq,
                $scope.nav1StandbyFreq,
                $scope.nav2Freq,
                $scope.nav2StandbyFreq,
                $scope.adf1Freq,
                $scope.adf2Freq,
            ];

            freqs.forEach(freq => {
                $scope.watchDataref(freq.key, $scope.onFreqChanged, freq);
            });
        };

        $scope.$watch("aircraft", $scope.initPanel);

        $scope.onFreqChanged = function (key, newValue, oldValue, freq) {
            if (freq == null)
                return;
            console.log("onFreqChanged changed: ", key, newValue, oldValue, freq);
            if (newValue == null) {
                freq.value = null;
                return;
            }
            // 
            if (freq.bits == null) {
                freq.value = newValue;
                return;
            }
            // 
            v = Number(newValue);
            v = v / Math.pow(10, freq.bits);
            v = v.toFixed(freq.bits);
            freq.value = v;
        };

        $scope.freqClick = function (freq) {
            if (freq == null)
                return;
            if ($scope.inputText.length == 0) {
                $scope.inputText = freq.value;
                return;
            }
            if ('vibrate' in navigator)
                navigator.vibrate(50);
            let v1 = $scope.inputText;
            if (v1 == freq.value)
                return;
            let v2 = Number(v1);
            v2 = v2 * Math.pow(10, freq.bits);
            v2 = v2.toFixed(0);
            // 
            console.log("set freq: ", freq, v2);
            req = {
                cmd: "dataref_set_values",
                data: [{
                    name: freq.key,
                    value: Number(v2)
                }]
            }
            $scope.clientWs.send(JSON.stringify(req));
        };


        // CLR
        $scope.clrClick = function (btn) {
            if ('vibrate' in navigator)
                navigator.vibrate(50);

            $scope.inputText = '';
        };

        //DEL
        $scope.delClick = function (btn) {
            if ('vibrate' in navigator)
                navigator.vibrate(50);

            let v1 = $scope.inputText;
            if (v1.length == 0)
                return;
            let v2 = v1.substring(0, v1.length - 1);
            console.log("del click: ", v1, v2);
            $scope.inputText = v2;
        };

        // NUM
        $scope.numClick = function (s) {
            if ('vibrate' in navigator)
                navigator.vibrate(50);

            let v1 = $scope.inputText;
            s = String(s)
            // Handle number input with auto decimal insertion
            if (s.match(/^\d$/)) {
                // Check if already has 3 decimal places
                const parts = v1.split('.');
                if (parts.length > 1 && parts[1].length >= 3) {
                    return; // Ignore input if already has 3 decimal digits
                }
                // If input has exactly 3 digits and no decimal, add decimal before new digit
                if (v1.length === 3 && v1.indexOf('.') === -1) {
                    v1 += '.';
                }
                $scope.inputText = v1 + s;
            } else if (s === '.') {
                // Handle decimal point input
                if (v1.indexOf('.') === -1) {
                    if (v1.length == 0) {
                        $scope.inputText = "0.";
                    } else {
                        $scope.inputText = v1 + s;
                    }
                }
            }
            console.log("num click:", v1, s, $scope.inputText);
        };

        $scope.onFreqTouchStart = function (type, event) {
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
            freq = Number($scope.inputText);
            if (Number.isFinite(freq) == false || freq == 0)
                freq = 50.000;
            // 
            const parts = freq.toFixed(3).split('.');
            $scope.freqPart0 = parts[0].padStart(3, '0');
            $scope.freqPart1 = parts[1].padStart(3, '0');
            $scope.freqInitValue = Number(type == 0 ? parts[0] : parts[1]);

            $scope.inputText = $scope.freqPart0 + "." + $scope.freqPart1;
        };

        $scope.onFreqTouchMove = function (type, event) {
            // data = null;
            event.stopPropagation();
            event.preventDefault();
            // 
            if (type == 0)
                step = 1;
            else
                step = 5;
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
            threshold = 10;
            k = 1.5;
            rate = Math.abs(distance) / threshold;
            rate = k * rate + (1 - k);
            rate = Math.round(rate)
            // 
            // console.log("move: start", $scope.freqTouchStart, "distance", distance, "rate", rate);
            while (Math.abs(distance) >= threshold) {
                
                if ('vibrate' in navigator)
                    navigator.vibrate(50);

                sign = Math.sign(distance);
                distance -= sign * threshold;
                if ($scope.freqTouchDirect == 1)
                    deltaFreq = sign * step * rate;
                else
                    deltaFreq = -sign * step * rate;
                // 
                $scope.freqTouchStart += sign * threshold;
                freq = $scope.freqInitValue + deltaFreq;
                if (freq < 0)
                    freq = 1000 - step;
                else if (freq >= 1000)
                    freq = 0;
                // 
                $scope.freqInitValue = freq;
                // 
                if (type == 0) {
                    $scope.freqPart0 = freq.toFixed(0).padStart(3, '0');
                } else {
                    $scope.freqPart1 = freq.toFixed(0).padStart(3, '0');
                }
                $scope.inputText = $scope.freqPart0 + "." + $scope.freqPart1;
            }
        };

        $scope.onFreqTouchEnd = function (step, event) {
            console.log("onFreqTouchEnd", step, event);
            event.stopPropagation();
            event.preventDefault();
        };
    },
]);
