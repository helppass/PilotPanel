
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("panels.xp-datas", {
        name: 'xp-datas',
        url: '/xp-datas',
        controller: 'xpData' + 'Controller',
        templateUrl: 'xp-datas.html',
    })
});

app.controller('xpData' + 'Controller',
    ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$interval',
        function ($scope, $rootScope, $state, $stateParams, $timeout, $interval) {
            // 
            root = $(".p-root")[0];
            $rootScope.panelWidth = root.clientWidth;
            $rootScope.panelHeight = root.clientHeight;
            console.log("panel size", $scope.panelWidth, $scope.panelHeight);
            $scope.pause = 0;
            $scope.sortBy = 1; // 1 time, 2 key
            // 
            $scope.clientWs = new WebSocket("/api/ws");
            $scope.datas = {}
            $scope.dataList = []
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
                            $scope.datas = {}
                            $scope.dataList = []
                            $scope.initPanel(aircraft);
                        }
                        // 
                        needSort = false;
                        timestamp = new Date().getTime();
                        angular.forEach(data, function (node) {
                            key = node.name;
                            value = node.value;
                            node = $scope.datas[key];
                            console.log("update", key, value, node);
                            if (node == null) {
                                node = {
                                    key: key,
                                    value: value,
                                    timemark: 0
                                }
                                $scope.datas[key] = node;
                                $scope.dataList.push(node);
                                needSort = true;
                            } else {
                                node.timemark = 1;
                            }
                            node.value = value;
                            node.timestamp = timestamp;
                            // console.log("update value", key, value);
                        });
                        // 
                        $scope.sortDataList(needSort)
                        //
                        $scope.$apply();
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
                // sub datarefs     
                req = {
                    cmd: "subscribe",
                    names: []
                }
                names = req.names;
                names.push("sim/cockpit2/annunciators/autopilot_disconnect")
                names.push("sim/cockpit2/annunciators/autopilot")
                names.push("sim/cockpit2/annunciators/autopilot_trim_fail")
                names.push("sim/cockpit2/annunciators/autopilot_trim_down")
                names.push("sim/cockpit2/annunciators/autopilot_trim_up")
                names.push("sim/cockpit2/annunciators/autopilot_bank_limit")
                names.push("sim/cockpit2/annunciators/autopilot_soft_ride")
                names.push("sim/cockpit2/autopilot/autopilot2_avail")
                names.push("sim/cockpit2/autopilot/master_flight_director")
                names.push("sim/cockpit2/autopilot/flight_director_command_bars_pilot")
                names.push("sim/cockpit2/autopilot/flight_director_command_bars_copilot")
                names.push("sim/cockpit2/autopilot/flight_director_master_pilot")
                names.push("sim/cockpit2/autopilot/flight_director_master_copilot")
                names.push("sim/cockpit2/autopilot/autopilot_electric_master")
                names.push("sim/cockpit2/autopilot/autopilot_source")
                names.push("sim/cockpit2/autopilot/autothrottle_enabled")
                names.push("sim/cockpit2/autopilot/autothrottle_on")
                names.push("sim/cockpit2/autopilot/autothrottle_arm")
                names.push("sim/cockpit2/autopilot/electric_trim_on")
                names.push("sim/cockpit2/autopilot/pitch_mistrim")
                names.push("sim/cockpit2/autopilot/otto_fail_warn")
                names.push("sim/cockpit2/autopilot/otto_ready")
                names.push("sim/cockpit2/autopilot/downgrade")
                names.push("sim/cockpit2/autopilot/autopilot_disconnect")
                names.push("sim/cockpit2/autopilot/autopilot_trim_fail")
                names.push("sim/cockpit2/autopilot/heading_mode")
                names.push("sim/cockpit2/autopilot/altitude_mode")
                names.push("sim/cockpit2/autopilot/flight_director_mode")
                names.push("sim/cockpit2/autopilot/flight_director2_mode")
                names.push("sim/cockpit2/autopilot/flight_director3_mode")
                names.push("sim/cockpit2/autopilot/autopilot_has_power")
                names.push("sim/cockpit2/autopilot/autopilot_on")
                names.push("sim/cockpit2/autopilot/autopilot2_on")
                names.push("sim/cockpit2/autopilot/autopilot3_on")
                names.push("sim/cockpit2/autopilot/autopilot_on_or_cws")
                names.push("sim/cockpit2/autopilot/autopilot2_on_or_cws")
                names.push("sim/cockpit2/autopilot/autopilot3_on_or_cws")
                names.push("sim/cockpit2/autopilot/servos_on")
                names.push("sim/cockpit2/autopilot/servos2_on")
                names.push("sim/cockpit2/autopilot/servos3_on")
                names.push("sim/cockpit2/autopilot/airspeed_is_mach")
                names.push("sim/cockpit2/autopilot/alt_vvi_is_showing_vvi")
                names.push("sim/cockpit2/autopilot/vnav_armed")
                names.push("sim/cockpit2/autopilot/vnav_spd_armed")
                names.push("sim/cockpit2/autopilot/altitude_hold_armed")
                names.push("sim/cockpit2/autopilot/hnav_armed")
                names.push("sim/cockpit2/autopilot/glideslope_armed")
                names.push("sim/cockpit2/autopilot/backcourse_on")
                names.push("sim/cockpit2/autopilot/airspeed_dial_kts_mach")
                names.push("sim/cockpit2/autopilot/airspeed_dial_kts")
                names.push("sim/cockpit2/autopilot/heading_dial_deg_mag_pilot")
                names.push("sim/cockpit2/autopilot/heading_dial_deg_mag_copilot")
                names.push("sim/cockpit2/autopilot/heading_is_gpss")
                names.push("sim/cockpit2/autopilot/trk_fpa")
                names.push("sim/cockpit2/autopilot/vvi_dial_fpm")
                names.push("sim/cockpit2/autopilot/fpa")
                names.push("sim/cockpit2/autopilot/altitude_dial_ft")
                names.push("sim/cockpit2/autopilot/altitude_hold_ft")
                names.push("sim/cockpit2/autopilot/altitude_vnav_ft")
                names.push("sim/cockpit2/autopilot/barometer_setting_in_hg_alt_preselector")
                names.push("sim/cockpit2/autopilot/altitude_readout_preselector")
                names.push("sim/cockpit2/autopilot/climb_adjust")
                names.push("sim/cockpit2/autopilot/des_adjust")
                names.push("sim/cockpit2/autopilot/sync_hold_pitch_deg")
                names.push("sim/cockpit2/autopilot/sync_hold_roll_deg")
                names.push("sim/cockpit2/autopilot/set_roll_deg")
                names.push("sim/cockpit2/autopilot/turn_rate_deg_sec")
                names.push("sim/cockpit2/autopilot/flight_director_pitch_deg")
                names.push("sim/cockpit2/autopilot/flight_director_roll_deg")
                names.push("sim/cockpit2/autopilot/flight_director2_pitch_deg")
                names.push("sim/cockpit2/autopilot/flight_director2_roll_deg")
                names.push("sim/cockpit2/autopilot/TOGA_pitch_deg")
                names.push("sim/cockpit2/autopilot/roll_status")
                names.push("sim/cockpit2/autopilot/attitude_status")
                names.push("sim/cockpit2/autopilot/rate_status")
                names.push("sim/cockpit2/autopilot/heading_status")
                names.push("sim/cockpit2/autopilot/heading_hold_status")
                names.push("sim/cockpit2/autopilot/track_status")
                names.push("sim/cockpit2/autopilot/runway_status")
                names.push("sim/cockpit2/autopilot/runway_track_status")
                names.push("sim/cockpit2/autopilot/nav_status")
                names.push("sim/cockpit2/autopilot/gpss_status")
                names.push("sim/cockpit2/autopilot/rollout_status")
                names.push("sim/cockpit2/autopilot/flare_status")
                names.push("sim/cockpit2/autopilot/backcourse_status")
                names.push("sim/cockpit2/autopilot/TOGA_lateral_status")
                names.push("sim/cockpit2/autopilot/pitch_status")
                names.push("sim/cockpit2/autopilot/vvi_status")
                names.push("sim/cockpit2/autopilot/fpa_status")
                names.push("sim/cockpit2/autopilot/speed_status")
                names.push("sim/cockpit2/autopilot/altitude_hold_status")
                names.push("sim/cockpit2/autopilot/glideslope_status")
                names.push("sim/cockpit2/autopilot/vnav_status")
                names.push("sim/cockpit2/autopilot/vnav_speed_status")
                names.push("sim/cockpit2/autopilot/fms_vnav")
                names.push("sim/cockpit2/autopilot/TOGA_status")
                names.push("sim/cockpit2/autopilot/approach_status")
                names.push("sim/cockpit2/autopilot/dead_reckoning")
                names.push("sim/cockpit2/autopilot/alt_hold_is_alt_sel_any")
                names.push("sim/cockpit2/autopilot/alts_armed")
                names.push("sim/cockpit2/autopilot/altv_armed")
                names.push("sim/cockpit2/autopilot/alts_captured")
                names.push("sim/cockpit2/autopilot/altv_captured")
                names.push("sim/cockpit2/autopilot/vnav_speed_window_open")
                names.push("sim/cockpit2/autopilot/vnav_speed_armed")
                names.push("sim/cockpit2/autopilot/ap_ref_waiting")
                names.push("sim/cockpit2/autopilot/vnav_descent_speed_range")
                names.push("sim/cockpit2/autopilot/st55_hdg")
                names.push("sim/cockpit2/autopilot/st55_rdy")
                names.push("sim/cockpit2/autopilot/st55_nav")
                names.push("sim/cockpit2/autopilot/st55_cws")
                names.push("sim/cockpit2/autopilot/st55_apr")
                names.push("sim/cockpit2/autopilot/st55_fail")
                names.push("sim/cockpit2/autopilot/st55_gpss")
                names.push("sim/cockpit2/autopilot/st55_rev")
                names.push("sim/cockpit2/autopilot/st55_trim")
                names.push("sim/cockpit2/autopilot/st55_alt")
                names.push("sim/cockpit2/autopilot/st55_gs")
                names.push("sim/cockpit2/autopilot/st55_vs")
                names.push("sim/cockpit2/autopilot/st360_display")
                names.push("sim/cockpit2/autopilot/st360_tenths")
                names.push("sim/cockpit2/autopilot/st360_ent")
                names.push("sim/cockpit2/autopilot/st360_alt")
                names.push("sim/cockpit2/autopilot/st360_sel")
                names.push("sim/cockpit2/autopilot/st360_alr")
                names.push("sim/cockpit2/autopilot/st360_dh")
                names.push("sim/cockpit2/autopilot/st360_vs")
                names.push("sim/cockpit2/autopilot/st360_baro")
                
                $scope.clientWs.send(JSON.stringify(req));
            };

            $scope.onTouchstart = function (event) {
                event.stopPropagation();
            };
            $scope.onTouchmove = function (event) {
                event.stopPropagation();
                // s = document.querySelector(".datas");
                // v1 = s.scrollTop;
                // v2 = s.scrollHeight - s.clientHeight;
                // if (v1 == 0 || v1 == v2) {

                // } else {
                //     event.stopPropagation();
                // }
            };
            $scope.onTouchend = function (event) {
                event.stopPropagation();
            };

            $scope.clickData = function (data) {
                data.timemark = 1;
                data.timestamp = new Date().getTime();
                if ($scope.sortBy == 1) {
                    if ($scope.pause == 0) {
                        $scope.dataList.sort(function (a, b) {
                            v = b.timestamp - a.timestamp;
                            if (v == 0)
                                v = a.key.localeCompare(b.key);
                            return v;
                        });
                    }
                }
            };

            $scope.sortDataList = function (force = false) {
                if ($scope.sortBy == 1) {
                    if ($scope.pause == 0 || force == true) {
                        $scope.dataList.sort(function (a, b) {
                            v = b.timestamp - a.timestamp;
                            if (v == 0)
                                v = a.key.localeCompare(b.key);
                            return v;
                        });
                    }
                } else {
                    if (force) {
                        $scope.dataList.sort(function (a, b) {
                            return a.key.localeCompare(b.key);
                        });
                    }
                }
            };

            $scope.updateTimemark = function () {
                delta = 1.0 / 20;
                for (var i = 0; i < $scope.dataList.length; i++) {
                    node = $scope.dataList[i];
                    node.timemark -= delta;
                }
            };

            // $scope.updateTimemarkJob = $interval($scope.updateTimemark, 1000 / 20);

            // $scope.$on("$destroy", function () {
            //     $interval.cancel($scope.updateTimemarkJob);
            // });

            // $scope.dataStyle = function (data) {
            //     let style = {};
            //     r = data.timemark;
            //     style['background-color'] = "rgb(51 255 0 / " + r.toFixed(5) + ")";
            //     return style;
            // };

            $scope.pauseSort = function (s) {
                $scope.pause = s;
            };

            $scope.setSortBy = function (s) {
                $scope.sortBy = s;
                $scope.sortDataList(true);
            };
        }
    ]
);
