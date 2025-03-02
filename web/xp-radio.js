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


        $scope.com1Apply = {
            command: 'sim/radios/com1_standy_flip',
            duration: 0.1,
        };
        $scope.com2Apply = {
            command: 'sim/radios/com2_standy_flip',
            duration: 0.1,
        }
        $scope.nav1Apply = {
            command: 'sim/radios/nav1_standy_flip',
            duration: 0.1,
        }
        $scope.nav2Apply = {
            command: 'sim/radios/nav2_standy_flip',
            duration: 0.1,
        }

        $scope.initPanel = function (aircraft) {
            console.log("initPanel test", aircraft);
            // 
            if (aircraft == null)
                return;

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

            // 挨个发起注册
            freqs.forEach(freq => {
                $scope.watchDataref(freq.key, $scope.onFreqChanged, freq);
            });
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

        $scope.inputText = "";

        $scope.numClick = function (s) {
            if ('vibrate' in navigator)
                navigator.vibrate(50);

            s = String(s)
            if (s == "CLR") {
                $scope.inputText = "";
                return;
            }
            let text = $scope.inputText.trim();
            if (s == "DEL") {
                text = $scope.inputText.substr(0, $scope.inputText.length - 1);
            } else if (s == "CLR") {
                text = "";
            } else if (s === '.') {
                if (text.indexOf('.') === -1) {
                    if (text.length == 0) {
                        text = "0.";
                    } else {
                        text = text + s;
                    }
                }
            } else if (s.match(/^\d$/)) {
                const parts = text.split('.');
                if (parts.length > 1 && parts[1].length >= 3) {

                }
                else if (text.length === 3 && text.indexOf('.') === -1) {
                    text += '.' + s;
                }
                else if (text.length < 7) {
                    text += s;
                }
            }
            text = text.padStart(7, " ");
            $scope.inputText = text;
        }

        $scope.freqClick = function (freq, event) {
            if ($scope.inputText == null || $scope.inputText.trim().length == 0) {
                $scope.inputText = freq.text;
                return;
            }
            if ('vibrate' in navigator)
                navigator.vibrate(50);
            // 
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
        }

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
                freq = 100.000;
            // 
            const parts = freq.toFixed(3).split('.');
            $scope.freqPart0 = parts[0].padStart(3, '0');
            $scope.freqPart1 = parts[1].padStart(3, '0');
            $scope.freqInitValue = Number(type == 1 ? parts[0] : parts[1]);

            $scope.inputText = $scope.freqPart0 + "." + $scope.freqPart1;
        };

        $scope.onFreqTouchMove = function (type, event) {
            // data = null;
            event.stopPropagation();
            event.preventDefault();
            // 
            if (type == 1)
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
                if (type == 2) {
                    if (freq < 0)
                        freq += 1000;
                    else if (freq >= 1000)
                        freq -= 1000;
                    if (freq % 100 == 95)
                        freq += deltaFreq;
                }
                console.log("freq: ", $scope.freqInitValue, deltaFreq, freq);
                if (freq < 0)
                    freq = 1000 - step;
                else if (freq >= 1000)
                    freq = 0;
                // 
                $scope.freqInitValue = freq;
                // 
                if (type == 1) {
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

        $scope.$watch("aircraft", $scope.initPanel);

    },
]);
