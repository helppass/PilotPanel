
app.config(function ($stateProvider, $urlRouterProvider, $rootScopeProvider) {
    VERSION = Math.random().toString(36).substring(7);
    $stateProvider.state("panels.about", {
        name: 'about',
        url: '/about',
        controller: 'aboutController',
        templateUrl: 'about.html', //+ '?v=' + VERSION,
        title: "About",
    })
});

app.controller('aboutController',
    ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$interval',
        // 'xpRadioController'
        function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {
            $scope.setPanelEnabled = function (panel) {
                let enabled = panel.enabled == 1 ? 0 : 1;
                if (panel.name == 'panels.about') {
                    enabled = 1;
                }
                panel.enabled = enabled;
                localStorage.setItem(panel.name + ".enabled", enabled);
            }
            // 
            $scope.navigator = navigator;
            $scope.isWakeLockSupported = 'wakeLock' in navigator;
            console.log("navigator: ", $scope.navigator);

            // 
            $scope.test01 = 0;
            $scope.job = $interval(function () {
                $scope.test01 += 1;
                b = $('#xxx');
                $scope.bbb = b != null;
                console.log("test01: ", $scope.test01, b);
                b.click();
            }, 1000);

            // 
            $scope.$on("$destroy", function () {
                $interval.cancel($scope.job);
            });
        }
    ]
);
