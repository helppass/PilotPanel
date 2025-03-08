app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.dcs", {
        name: 'dcs',
        controller: 'dcsController',
    })
});

app.controller('dcsController',
    ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$interval',
        function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {
            // 
            root = $("body")[0];
            $rootScope.panelWidth = root.clientWidth;
            $rootScope.panelHeight = root.clientHeight;
            console.log("panel size", $scope.panelWidth, $scope.panelHeight);
            // 
            $scope.clientWs = new WebSocket("/api/dcs/ws");
            $scope.aircraft = null;
            $scope.database = {};
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
                        angular.forEach(data, function (node) {
                            key = node.name;
                            value = node.value;
                            // 
                            console.debug("datareft update", key, value);
                            $scope.database[key] = value;
                            $scope[key] = value;
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
                $scope.watchData("aircraft", { type: 'string', address: 0x0000, maxLength: 24 }, (name, newValue, oldValue) => {
                    $scope.aircraft = newValue;
                });
            };

            $scope.$on("$destroy", function () {
                $scope.clientWs.close();
            });

            $scope.watchData = function (name, item, callback, ...args) {
                if (callback != null) {
                    $scope.$watch('database["' + name + '"]', (newValue, oldValue) => {
                        params = [];
                        params.push(name);
                        params.push(newValue);
                        params.push(oldValue);
                        params = params.concat(args);
                        callback.apply(null, params);
                    });
                }
                // 
                if (name in $scope.database) {
                    value = $scope.database[name];
                    if (callback != null) {
                        params = [];
                        params.push(name);
                        params.push(value);
                        params.push(value);
                        params = params.concat(args)
                        callback.apply(null, params)
                    }
                } else if (item != null) {
                    req = {
                        cmd: "subscribe",
                        name: name,
                        item: item
                    }
                    $scope.clientWs.send(JSON.stringify(req));
                }
            };

            $scope.sendCommand = function (command) {
                console.log("submit command: ", command);
                req = {
                    cmd: "command",
                    command: command
                }
                $scope.clientWs.send(JSON.stringify(req));
            };
        }
    ]
);
