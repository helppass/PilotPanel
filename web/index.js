var app = angular.module('app', ['ui.router']);

app.directive('gBtn', function () {
    return {
        scope: {
            title: "@title",
            title2: "@title2",
            hasLight: "@hasLight",
            lightOn: "=lightOn",
        },
        restrict: 'E',
        // transclude: true,
        controller: 'gBtn' + 'Controller',
        templateUrl: 'g-btn.html',
        link: function (scope, element, attrs, controllers) {
            // element.on('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); });
            // element.on('touchend', (e) => { e.preventDefault(); e.stopPropagation(); });
        }
    };
});

app.controller('gBtn' + 'Controller',
    ['$scope', '$rootScope', '$state', '$stateParams', '$element', '$attrs',
        function ($scope, $rootScope, $state, $stateParams, $element, $attrs) {
            // $scope.lightOn2 = function () {
                // console.log($scope.lightOn);
                // return $scope.lightOn;
            // }
        }
    ]
);

app.directive('gLed', function () {
    return {
        scope: {
            text: "=text",
        },
        restrict: 'E',
        // transclude: true,
        controller: 'gLed' + 'Controller',
        templateUrl: 'g-led.html',
        link: function (scope, element, attrs, controllers) {
            // if (attrs.lightOn == "true") {
            //     scope.lightOn = true;
            // }
        }
    };
});

app.controller('gLed' + 'Controller',
    ['$scope', '$rootScope', '$state', '$stateParams', '$element', '$attrs',
        function ($scope, $rootScope, $state, $stateParams, $element, $attrs) {
            $scope.$watch("text", function (newValue, oldValue) {
                if (newValue == null)
                    $scope.chars = [];
                else
                    $scope.chars = newValue.split("");
            });

            $scope.getCharStyle = function (c) {
                // background-position: calc(2px - var(--s)* 4) calc(1px - var(--s)* 0);
                let style = {};
                const cs = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*+-\\/()[]{}<>=?^!#%^&°.:,|_'\"";
                let idx = cs.indexOf(c);
                let x = 0;
                let y = 0;
                if (idx >= 0) {
                    x = idx % 8;
                    y = Math.floor(idx / 8);
                } else {
                    console.log("unknown char", c);
                    return style;
                }
                style['background-position'] = "calc(-1px - var(--s)* " + x + ") calc(1px - var(--s)* " + y + ")";
                return style;
            };
        }
    ]
);

app.config(function ($stateProvider, $urlRouterProvider, $rootScopeProvider) {

    $urlRouterProvider
        .when('xxxx', 'manager/operatorInfo')
        .otherwise('about');
    // $stateProvider.state("about", {
    //     name: 'about',
    //     url: '/about',
    //     // controller: 'headController',
    //     templateUrl: 'about.html',
    // })

    $stateProvider.state("panels", {
        name: 'panels',
        // url: '/panels',
        controller: 'panelsController',
    })

    // async function loadScript() {
    // }
    // console.log("xxxxxx", $ocLazyLoad)
    // loadScript();
});

app.controller('panelsController',
    ['$scope', '$rootScope', '$state', '$stateParams',
        function ($scope, $rootScope, $state, $stateParams) {
            $scope.msg1 = 'Msg1';
            // 
            $scope.panels = [
                {
                    name: 'panels.about',
                    title: 'Setting',
                    enabled: 1
                },
                {
                    name: 'panels.xp.cdu',
                    title: 'Xplane12-CDU',
                    enabled: 1
                },
                {
                    name: 'panels.xp.radio',
                    title: 'Xplane12-Radio',
                    enabled: 1
                },
                {
                    name: 'panels.xp.autopilot',
                    title: 'Xplane12-Autopilot',
                    enabled: 1
                },
                {
                    name: 'panels.dcs.dcsF18Ufc',
                    title: 'DCS-F18-UFC',
                    enabled: 1
                },
                {
                    name: 'panels.dcs.dcsJF17Ufc',
                    title: 'DCS-JF17-UFC',
                    enabled: 1
                },
                // {
                //     name: 'panels.indicator',
                //     title: 'Xplane12-Indicator',
                //     enabled: 1
                // },
                // {
                //     name: 'panels.xp-datas',
                //     title: 'Xplane12-Datas',
                //     enabled: 1
                // },
                {
                    name: 'panels.xp.test',
                    title: 'Xplane12-Test',
                    enabled: 1
                },
            ]
            // 
            for (let i = 0; i < $scope.panels.length; i++) {
                panel = $scope.panels[i];
                key = panel.name + ".enabled";
                enabled = localStorage.getItem(key);
                if (enabled == 0) {
                    enabled = 0;
                } else {
                    enabled = 1;
                }
                panel.enabled = enabled;
            }
            // 
            $scope.goNextPanel = function (delta = 1) {
                let currentName = $state.$current.name;
                let currentIdx = $scope.panels[0];
                for (let i = 0; i < $scope.panels.length; i++) {
                    if ($scope.panels[i].name == currentName) {
                        currentIdx = i
                        break
                    }
                }
                // 
                nextIdx = currentIdx;
                for (let i = 0; i < $scope.panels.length; i++) {
                    nextIdx = nextIdx + delta;
                    if (nextIdx < 0)
                        nextIdx += $scope.panels.length;
                    nextIdx = nextIdx % $scope.panels.length;
                    node = $scope.panels[nextIdx];
                    if (node.enabled == 1) {
                        $state.go(node.name, {}, { location: false });
                        return;
                    }
                }
            }
            // 
            threshold = 100;
            $scope.onTouchstart = function (e) {
                $scope.touchStart = e.touches[0].clientY;
                $scope.touchDist = 0;
            }
            $scope.onTouchmove = function (e) {
                if ($scope.touchStart == null)
                    return;
                $scope.touchDist = e.touches[0].clientY - $scope.touchStart;
                if (Math.abs($scope.touchDist) > threshold) {
                    $scope.touchDist = Math.sign($scope.touchDist) * threshold;
                }
                e.currentTarget.style.transform = 'translateY(' + $scope.touchDist + 'px)';
            }
            $scope.onTouchend = function (e) {
                if ($scope.touchStart == null)
                    return;
                e.currentTarget.style.transform = null;
                // 
                if (Math.abs($scope.touchDist) >= threshold) {
                    if ($scope.touchDist < 0) {
                        $scope.goNextPanel(+1);
                    } else {
                        $scope.goNextPanel(-1);
                    }
                }
                $scope.touchStart = null;
            }

            $scope.getBtnStyles = function (btn) {
                console.log("getBtnStyles", btn);
                console.log("getBtnStyles panelWidth", $scope.panelWidth, $scope.panelHeight);
                let style = {};
                style.left = (btn.left / $scope.panelWidth * 100) + '%';
                style.width = (btn.width / $scope.panelWidth * 100) + '%';
                style.top = (btn.top / $scope.panelHeight * 100) + '%';
                style.height = (btn.height / $scope.panelHeight * 100) + '%';
                return style;
                // let info = $scope.imageInfos[id];
                // if (info == null) {
                //     return {};
                // }
                // let style = {};
                // style.width = info.width * $scope.imageScale + "px";
                // return style;
            };

        }]);
