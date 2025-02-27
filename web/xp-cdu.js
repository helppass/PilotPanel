app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.xp.cdu", {
        name: "xpCdu",
        url: "/xp/cdu",
        controller: "xpCdu" + "Controller",
        templateUrl: "xp-cdu.html",
    });
});

app.controller("xpCdu" + "Controller", [
    "$element",
    "$scope",
    "$rootScope",
    "$state",
    "$stateParams",
    '$http',
    "$timeout",
    "$interval",
    function ($element, $scope, $rootScope, $state, $stateParams, $http, $timeout, $interval) {

        $scope.chars = []
        $scope.lines = []
        for (y = 0; y < 16; y++) {
            line = []
            for (x = 0; x < 24; x++) {
                c = { x: x, y: y, v: ' ', style: {} };
                line.push(c);
                $scope.chars.push(c);
            }
            $scope.lines.push(line);
        }

        $scope.initPanel = function (aircraft) {
            if (aircraft == null)
                return;
            // 
            src = null;
            cfg = null;
            if (aircraft == "Boeing 737-800") {
                src = './images/737-cdu-01.png'
                cfg = './images/737-cdu-01.json'
            } else if (aircraft == "McDonnell Douglas MD-82") {
                src = './images/737-cdu-01.png'
                cfg = './images/737-cdu-01.json'
            } else if (aircraft == "Airbus A330-300") {
                src = './images/330-cdu-01.png'
                cfg = './images/330-cdu-01.json'
            } else {
                src = './images/737-cdu-01.png'
                cfg = './images/737-cdu-01.json'
                return;
            }
            // 
            root = $(".p-root")[0];
            root.style['background-image'] = "url('" + src + "')";
            // 
            $http.get(cfg)
                .then(function (resp) {
                    return resp.data;
                })
                .then(function (config) {
                    $scope.config = config;
                    // 
                    imageWidth = config.width;
                    imageHeight = config.height;
                    rate = root.clientWidth / imageWidth;
                    config.rate = rate;
                    // 
                    $scope.buttons = config.buttons;
                    angular.forEach($scope.buttons, function (btn) {
                        btn.style = {
                            "width": Math.round(btn.width * rate) + "px",
                            "height": Math.round(btn.height * rate) + "px",
                            "left": Math.round(btn.left * rate) + "px",
                            "top": Math.round(btn.top * rate) + "px",
                        };
                    });
                    // 
                    light = config.light;
                    if (light != null) {
                        $scope.light = light;
                        light.status = 0;
                        light.style = {
                            "width": Math.round(light.width * rate) + "px",
                            "height": Math.round(light.height * rate) + "px",
                            "left": Math.round(light.left * rate) + "px",
                            "top": Math.round(light.top * rate) + "px",
                        };
                        $scope.watchDataref("sim/cockpit2/radios/indicators/fms_exec_light_pilot", $scope.onLightChanged, light);
                    }
                    // 
                    lineConfig = config.lineCfg;
                    $scope.lineConfig = lineConfig;
                    x0 = lineConfig.left * rate;
                    y0 = lineConfig.top * rate;
                    dx = lineConfig.dx * rate;
                    dy = lineConfig.dy * rate;
                    angular.forEach($scope.chars, function (c) {
                        // c.v = 'D'
                        x = x0 + dx * c.x;
                        y = y0 + dy * c.y;
                        c.style = {
                            "width": Math.round(dx) + "px",
                            "height": Math.round(dy) + "px",
                            "left": Math.round(x) + "px",
                            "top": Math.round(y) + "px",
                            'font-size': dx + 4
                        };
                    });
                    // 
                    for (i = 0; i < 16; i++) {
                        line = $scope.lines[i];
                        $scope.watchDataref("sim/cockpit2/radios/indicators/fms_cdu1_text_line" + i, $scope.onCduTextChanged, line);
                        $scope.watchDataref("sim/cockpit2/radios/indicators/fms_cdu1_style_line" + i, $scope.onCduStyleChanged, line);
                    }
                })
        };

        $scope.$watch("aircraft", $scope.initPanel);

        $scope.onClickDown = function (btn, down, event) {
            event.stopPropagation();
            event.preventDefault();

            command = btn.command;
            if (command == null)
                return;
            
            if (event.type == 'touchstart')
                if ('vibrate' in navigator)
                    navigator.vibrate(50);

            console.log("submit command: ", command, down);
            req = {
                cmd: "command",
                command: btn.command,
                down: down,
            }
            if (btn.duration != null) {
                if (down == 1) {
                    req['duration'] = btn.duration;
                }
            }
            $scope.clientWs.send(JSON.stringify(req));
        }

        $scope.onLightChanged = function (key, newValue, oldValue, light) {
            if (light != null)
                light.status = newValue == 1 ? 1 : 0;
        };

        $scope.onCduTextChanged = function (key, newValue, oldValue, line) {
            if (newValue == null)
                return;
            if (line == null)
                return;
            //
            const binaryStr = atob(newValue);
            newValue = decodeURIComponent(escape(binaryStr));
            for (i = 0; i < 24; i++) {
                c = line[i];
                c.v = newValue[i];
            }
        };

        $scope.onCduStyleChanged = function (key, newValue, oldValue, line) {
            if (newValue == null)
                return;
            if (line == null)
                return;
            //
            const binaryStr = atob(newValue);
            dx = $scope.lineConfig.dx * $scope.config.rate;
            for (let i = 0; i < binaryStr.length; i++) {
                // 获取每个字符的 Unicode 编码，并添加到数值数组中
                v = binaryStr.charCodeAt(i);
                c = line[i];
                c.styleCode = v;
                // 
                styleSize = v & (1 << 7);
                c.styleInv = v & (1 << 6);
                c.styleFlash = v & (1 << 5);
                c.styleUnder = v & (1 << 4);
                c.styleColor = v & 15;
                //
                if (c.styleSize == 0)
                    c.style['font-size'] = Math.round((dx + 4) * 0.8);
                else
                    c.style['font-size'] = dx + 4;
                //
                switch (c.styleColor) {
                    case 0:
                        c.style['color'] = 'black';
                        break;
                    case 1:
                        c.style['color'] = 'cyan';
                        break;
                    case 2:
                        c.style['color'] = 'red';
                        break;
                    case 3:
                        c.style['color'] = 'yellow';
                        break;
                    case 4:
                        c.style['color'] = '#00ff00';
                        break;
                    case 5:
                        c.style['color'] = 'magenta';
                        break;
                    case 6:
                        c.style['color'] = '#ff8400';
                        break;
                    case 7:
                        c.style['color'] = 'white';
                        break;
                    default:
                        c.style['color'] = 'white';
                        break;
                }
            }
        }
    },
]);
