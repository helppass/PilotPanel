app.directive('dcsBtn', function () {
    return {
        scope: {
            title: "@title",
            title2: "@title2",
            cmd: "@cmd",
            down: "@down",
            up: "@up",
        },
        restrict: 'E',
        controller: 'dcsBtn' + 'Controller',
        templateUrl: 'dcs-btn.html',
        link: function (scope, element, attrs, controllers) {
            element.on('touchstart', (e) => { scope.onClick(e, 1); });
            element.on('touchend', (e) => { scope.onClick(e, 0); });
        }
    };
});

app.controller('dcsBtn' + 'Controller',
    ['$scope', '$rootScope', '$state', '$stateParams', '$element', '$attrs',
        function ($scope, $rootScope, $state, $stateParams, $element, $attrs) {

            $scope.onClick = function (e, down) {
                e.stopPropagation();
                e.preventDefault();

                if (e.type == 'touchstart')
                    if ('vibrate' in navigator)
                        navigator.vibrate(80);

                if ($scope.cmd == null)
                    return;
                // 
                command = null;
                if (down == 1 && $scope.down != null)
                    command = $scope.cmd + " " + $scope.down;
                else if (down == 0 && $scope.up != null)
                    command = $scope.cmd + " " + $scope.up;
                else
                    return;
                // 
                $scope.$parent.sendCommand(command);
                // 
            };
        }
    ]
);

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
