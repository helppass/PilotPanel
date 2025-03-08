
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.xp", {
        name: 'xp',
        controller: 'xpController',
    })
});

app.controller('xpController',
    ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$interval',
        function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {
            // 
            root = $("body")[0];
            $rootScope.panelWidth = root.clientWidth;
            $rootScope.panelHeight = root.clientHeight;
            console.log("panel size", $scope.panelWidth, $scope.panelHeight);
            // 
            $scope.clientWs = new WebSocket("/api/xp/ws");
            $scope.aircraft = null;
            $scope.datarefs = {};
            // 
            $scope.clientWs.onmessage = function (evt) {
                let msg = evt.data;
                try {
                    msg = JSON.parse(msg);
                } catch (error) {
                    return;
                }
                type = msg["type"];
                if (type == "heartbeat") {
                    return;
                }
                if (type == "update_values") {
                    try {
                        data = msg["data"];
                        // 
                        nodes = data.filter(node => node.name == 'aircraft')
                        if (nodes.length > 0) {
                            node = nodes[0]
                            aircraft = node.value;
                            console.log("set aircraft: ", aircraft);
                            $scope.initPanel(aircraft);
                        }
                        // 
                        needSort = false;
                        timestamp = new Date().getTime();
                        angular.forEach(data, function (node) {
                            key = node.name;
                            value = node.value;
                            // 
                            console.debug("datareft update", key, value);
                            $scope.datarefs[key] = value;
                        });
                        $scope.$apply();
                        // 
                    } catch (error) {
                        console.error(error);
                    }
                }
            };

            $scope.clientWs.onclose = function () {
            };

            $scope.clientWs.onopen = function () {
            };

            $scope.$on("$destroy", function () {
                $scope.clientWs.close();
            });

            $scope.initPanel = function (aircraft) {
                console.log(">>initPanel", aircraft);
                $scope.aircraft = aircraft;
            };

            $scope.watchDataref = function (key, callback, ...args) {
                $scope.$watch('datarefs["' + key + '"]', (newValue, oldValue) => {
                    params = [];
                    params.push(key);
                    params.push(newValue);
                    params.push(oldValue);
                    params = params.concat(args)
                    callback.apply(null, params)
                });
                // 
                if (key in $scope.datarefs) {
                    params = [];
                    params.push(key);
                    params.push(value);
                    params.push(value);
                    params = params.concat(args)
                    callback.apply(null, params)
                    // value = $scope.datarefs[key];
                    // callback(key, value, value);
                } else {
                    // sub datarefs     
                    req = {
                        cmd: "subscribe",
                        names: [key]
                    }
                    $scope.clientWs.send(JSON.stringify(req));
                }
            };

            $scope.buttonClick = function (btn, down = 1) {
                if (down == 1)
                    if ('vibrate' in navigator)
                        navigator.vibrate(50);

                command = btn.command;
                if (command == null)
                    return;
                console.log("submit command: ", command);
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
            };
        }
    ]
);
