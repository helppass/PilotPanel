//路由定义
define("bzexam.router", ["app"], function (a) {
	a.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$filterProvider', '$provide', '$qProvider', '$compileProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $controllerProvider, $filterProvider, $provide, $qProvider, $compileProvider, $httpProvider) {
		$qProvider.errorOnUnhandledRejections(false);
		a.registerController = $controllerProvider.register;
		a.registerFilter = $filterProvider.register;
		a.registerFactory = $provide.factory;
		a.registerDirective = $compileProvider.directive;
		$httpProvider.defaults.withCredentials = true;
		a.loadJs = function (js) {
			return function ($rootScope, $q) {
				var def = $q.defer(),
					deps = [];
				if (angular.isArray(js) == true) {
					deps = js;
				} else {
					deps.push(js);
				}
				require(deps, function () {
					$rootScope.$apply(function () {
						def.resolve();
					});
				});
				return def.promise;
			};
		};
		var getResolve = function (js, flag) {
			return {
				data: ['loginService', function (loginService) {
					if (flag) {
						return {
							errno: 0
						};
					} else {
						return loginService.getCurrentLogin();
					}

				}],
				deps: a.loadJs(js)
			};
		};

		/* 使用when来对一些不合法的路由进行重定向 */
		$urlRouterProvider
			.when('xxxx', 'manager/operatorInfo')
			.otherwise('home');


		//客服列表
		$stateProvider.state('home', {
			templateUrl: 'template/home/index.html'
		}).state('home.index', {
			url: '/home',
			resolve: getResolve([
				'js/controller/home/homeController',
				'js/controller/home/menuController',
				'js/controller/home/headController'
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/home/homeBody.html',
					controller: 'homeController',
				},
			}
		});

		$stateProvider.state('scan', {
			templateUrl: 'template/home/index.html'
		}).state('scan.images', {
			url: '/scan/images?x',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
				'template/scan/scanImagesController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/scan/scanImagesBody.html',
					controller: 'scanImagesController',
				},
			}
		}).state('scan.exportComposition', {
			url: '/scan/exportComposition?x',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
				'template/scan/exportCompositionController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/scan/exportCompositionBody.html',
					controller: 'exportCompositionController',
				},
			}
		}).state('scan.scanExamList', {
			url: '/scan/exam/list?x',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
				'template/scan/' + 'scanExamList',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/scan/' + 'scanExamList' + '.html',
					controller: 'scanExamList' + 'Controller',
				},
			}
		}).state('scan.scanExamList.info', {
			url: '/info?examId',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
				'template/scan/' + 'scanExamInfo',
			], false),
			templateUrl: 'template/scan/' + 'scanExamInfo' + '.html',
			controller: 'scanExamInfo' + 'Controller',
		}).state('scan.scanExamList.info.examUser', {
			url: '/examUser',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
				'template/scan/' + 'scanExamUser',
			], false),
			templateUrl: 'template/scan/' + 'scanExamUser' + '.html',
			controller: 'scanExamUser' + 'Controller',
		}).state('scan.scanExamList.info.scanMain', {
			url: '/scanMain',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
				'template/scan/' + 'scanScanMain',
			], false),
			templateUrl: 'template/scan/' + 'scanScanMain' + '.html',
			controller: 'scanScanMain' + 'Controller',
		});

		$stateProvider.state('exam', {
			url: '/exam',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
			templateUrl: 'template/home/index.html'
		})
			.state('exam.fixExamCard', {
				url: '/fixExamCard?examId&examCardId',
				resolve: getResolve([
					'template/exam/' + 'fixExamCard',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/exam/' + 'fixExamCard' + '.html',
						controller: 'fixExamCard' + 'Controller',
					},
				}
			})
			.state('exam.base', {
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/home/base.html',
					},
				}
			})
			.state('exam.base.empty', {
				url: '/empty',
				resolve: getResolve([
					'template/exam/' + 'empty',
				], false),
				templateUrl: 'template/exam/' + 'empty' + '.html',
				controller: 'empty' + 'Controller',
			})
			.state('exam.base.moveSchool', {
				url: '/moveSchool?codes&schoolId',
				resolve: getResolve([
					'template/exam/' + 'moveSchool',
				], false),
				templateUrl: 'template/exam/' + 'moveSchool' + '.html',
				controller: 'moveSchool' + 'Controller',
			})
			.state('exam.base.listByScan', {
				url: '/listByScan',
				resolve: getResolve([
					'template/exam/' + 'listByScan',
				], false),
				templateUrl: 'template/exam/' + 'listByScan' + '.html',
				controller: 'listByScan' + 'Controller',
			})
			.state('exam.base.examCardColumns', {
				url: '/examCardColumns?examId&examCardId',
				resolve: getResolve([
					'template/exam/' + 'examCardColumns',
				], false),
				templateUrl: 'template/exam/' + 'examCardColumns' + '.html',
				controller: 'examCardColumns' + 'Controller',
			})
			.state('exam.base.info', {
				url: '/info?examId',
				resolve: getResolve([
					'template/exam/' + 'examInfo',
				], true),
				templateUrl: 'template/exam/' + 'examInfo' + '.html',
				controller: 'examInfo' + 'Controller',
			}).state('exam.base.info.examSummary', {
				url: '/summary',
				resolve: getResolve([
					'template/exam/' + 'examSummary',
				], true),
				templateUrl: 'template/exam/' + 'examSummary' + '.html',
				controller: 'examSummary' + 'Controller',
			}).state('exam.base.info.examUser', {
				url: '/examUser',
				resolve: getResolve([
					'template/exam/' + 'examUser',
				], true),
				templateUrl: 'template/exam/' + 'examUser' + '.html',
				controller: 'examUser' + 'Controller',
			})
			.state('exam.base.info.scanMain', {
				url: '/scanMain',
				resolve: getResolve([
					'template/exam/' + 'scanMain',
				], true),
				templateUrl: 'template/exam/' + 'scanMain' + '.html',
				controller: 'scanMain' + 'Controller',
			})
			.state('exam.base.info.scanBatchList', {
				url: '/scanBatchList',
				resolve: getResolve([
					'template/exam/' + 'scanBatchList',
				], true),
				templateUrl: 'template/exam/' + 'scanBatchList' + '.html',
				controller: 'scanBatchList' + 'Controller',
			})
			.state('exam.base.info.examCardList', {
				url: '/examCardList',
				resolve: getResolve([
					'template/exam/' + 'examCardList',
				], true),
				templateUrl: 'template/exam/' + 'examCardList' + '.html',
				controller: 'examCardList' + 'Controller',
			})
			.state('exam.base.info.examCorrectItems', {
				url: '/examCorrectItems',
				resolve: getResolve([
					'template/exam/' + 'examCorrectItems',
				], true),
				templateUrl: 'template/exam/' + 'examCorrectItems' + '.html',
				controller: 'examCorrectItems' + 'Controller',
			})
			.state('exam.base.syncQuestion', {
				url: '/syncQuestion?srcEid&dstEid',
				resolve: getResolve([
					'template/exam/' + 'syncQuestion',
				], false),
				templateUrl: 'template/exam/' + 'syncQuestion' + '.html',
				controller: 'syncQuestion' + 'Controller',
			});

		$stateProvider.state('ocr', {
			url: '/ocr',
			templateUrl: 'template/home/index.html'
		}).state('ocr.base', {
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/home/base.html',
				},
			}
		}).state('ocr.base.summary', {
			url: '/summary',
			resolve: getResolve([
				'template/ocr/' + 'summary',
			], false),
			templateUrl: 'template/ocr/' + 'summary' + '.html',
			controller: 'summary' + 'Controller',
		}).state('ocr.base.recordList', {
			url: '/record/list?examId&ocrType&label&pageOffset&pageSize',
			resolve: getResolve([
				'template/ocr/' + 'recordList',
			], false),
			templateUrl: 'template/ocr/' + 'recordList' + '.html',
			controller: 'recordList' + 'Controller',
		});

		// .state('scan.scanExamList.info', {
		// 	url: '/info?examId',
		// 	resolve: getResolve([
		// 		'js/controller/home/menuController',
		// 		'js/controller/home/headController',
		// 		'template/scan/' + 'scanExamInfo',
		// 	], false),
		// 	templateUrl: 'template/scan/' + 'scanExamInfo' + '.html',
		// 	controller: 'scanExamInfo' + 'Controller',
		// }).state('scan.scanExamList.info.examUser', {
		// 	url: '/examUser',
		// 	resolve: getResolve([
		// 		'js/controller/home/menuController',
		// 		'js/controller/home/headController',
		// 		'template/scan/' + 'scanExamUser',
		// 	], false),
		// 	templateUrl: 'template/scan/' + 'scanExamUser' + '.html',
		// 	controller: 'scanExamUser' + 'Controller',
		// }).state('scan.scanExamList.info.scanMain', {
		// 	url: '/scanMain',
		// 	resolve: getResolve([
		// 		'js/controller/home/menuController',
		// 		'js/controller/home/headController',
		// 		'template/scan/' + 'scanScanMain',
		// 	], false),
		// 	templateUrl: 'template/scan/' + 'scanScanMain' + '.html',
		// 	controller: 'scanScanMain' + 'Controller',
		// });

		$stateProvider.state('oss', {
			templateUrl: 'template/home/index.html'
		}).state('oss.list', {
			url: '/oss/list?x',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
				'template/oss/ossListController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/oss/ossListBody.html',
					controller: 'ossListController',
				},
			}
		});

		$stateProvider.state('trace', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		}).state('trace.mark_list', {
			url: '/trace/mark/list?x',
			resolve: getResolve([
				'template/trace/traceMarkListController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/traceMarkListBody.html',
					controller: 'traceMarkListController',
				},
			}
		}).state('trace.mark_edit', {
			url: '/trace/mark/edit?id',
			resolve: getResolve([
				'template/trace/traceMarkEditController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/traceMarkEditBody.html',
					controller: 'traceMarkEditController',
				},
			}
		}).state('trace.history_list', {
			url: '/trace/history/list?code&userId',
			resolve: getResolve([
				'template/trace/traceHistoryListController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/traceHistoryListBody.html',
					controller: 'traceHistoryListController',
				},
			}
		}).state('trace.history_flow', {
			url: '/trace/history/flow?code&userId',
			resolve: getResolve([
				'template/trace/traceHistoryFlowController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/traceHistoryFlowBody.html',
					controller: 'traceHistoryFlowController',
				},
			}
		}).state('trace.nginx_flow', {
			url: '/trace/nginx/flow',
			resolve: getResolve([
				'template/trace/nginxFlowController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/nginxFlowBody.html',
					controller: 'nginxFlowController',
				},
			}
		}).state('trace.nginx_stat', {
			url: '/trace/nginx/stat?timeA&timeB&domain',
			resolve: getResolve([
				'template/trace/nginxStatController',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/nginxStatBody.html',
					controller: 'nginxStatController',
				},
			}
		}).state('trace.nginx_query', {
			url: '/trace/nginx/query?timeA&timeB&domain&perfix',
			resolve: getResolve([
				'template/trace/nginxQuery',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/nginxQuery.html',
					controller: 'nginxQueryController',
				},
			}
		}).state('trace.nginx_push', {
			url: '/trace/nginx/push',
			resolve: getResolve([
				'template/trace/nginxPush' + 'Controller',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/trace/' + 'nginxPush' + 'Body.html',
					controller: 'nginxPush' + 'Controller',
				},
			}
		});

		$stateProvider
			.state('live', {
				url: '/live?v',
				templateUrl: 'template/live/index.html'
			});

		$stateProvider
			.state('play', {
				url: '/play?v',
				resolve: getResolve([
					'template/live/play',
				], false),
				templateUrl: 'template/live/play.html',
				controller: 'playController',
			});


		$stateProvider
			.state('school', {
				templateUrl: 'template/home/index.html'
			})
			.state('school.' + 'classUpgrade', {
				url: '/school/' + 'classUpgrade' + '?x',
				resolve: getResolve([
					'js/controller/home/menuController',
					'js/controller/home/headController',
					'template/school/' + 'classUpgrade',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/school/' + 'classUpgrade' + '.html',
						controller: 'classUpgrade' + 'Controller',
					},
				}
			});

		$stateProvider
			.state('system', {
				templateUrl: 'template/home/index.html'
			})
			.state('system.' + 'tableSpace', {
				url: '/system/' + 'tableSpace' + '?x',
				resolve: getResolve([
					'js/controller/home/menuController',
					'js/controller/home/headController',
					'template/system/' + 'tableSpace',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/system/' + 'tableSpace' + '.html',
						controller: 'tableSpace' + 'Controller',
					},
				}
			});

		$stateProvider.state('ocren', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		})
			.state('ocren.exam', {
				url: '/ocren/exam?examId',
				resolve: getResolve([
					'template/ocren/' + 'exam',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/ocren/' + 'exam' + '.html',
						controller: 'exam' + 'Controller',
					},
				}
			})
			.state('ocren.exam.list', {
				url: '/list',
				resolve: getResolve([
					'template/ocren/' + 'examList',
				], false),
				controller: 'examList' + 'Controller',
				templateUrl: 'template/ocren/' + 'examList' + '.html'
			})
			.state('ocren.exam.info', {
				url: '/info',
				resolve: getResolve([
					'template/ocren/' + 'examInfo',
				], false),
				controller: 'examInfo' + 'Controller',
				templateUrl: 'template/ocren/' + 'examInfo' + '.html'
			})
			.state('ocren.exam.report', {
				url: '/report',
				resolve: getResolve([
					'template/ocren/' + 'examReport',
				], false),
				controller: 'examReport' + 'Controller',
				templateUrl: 'template/ocren/' + 'examReport' + '.html'
			})
			.state('ocren.exam.setting', {
				url: '/setting',
				resolve: getResolve([
					'template/ocren/' + 'examSetting',
				], false),
				controller: 'examSetting' + 'Controller',
				templateUrl: 'template/ocren/' + 'examSetting' + '.html'
			})
			.state('ocren.exam.process', {
				url: '/process',
				resolve: getResolve([
					'template/ocren/' + 'examProcess',
				], false),
				controller: 'examProcess' + 'Controller',
				templateUrl: 'template/ocren/' + 'examProcess' + '.html'
			})
			.state('ocren.exam.result', {
				url: '/result',
				resolve: getResolve([
					'template/ocren/' + 'examResult',
				], false),
				controller: 'examResult' + 'Controller',
				templateUrl: 'template/ocren/' + 'examResult' + '.html'
			})
			// .state('txen.exam.question', {
			// 	url: '/question',
			// 	resolve: getResolve([
			// 		'template/txen/' + 'examQuestion',
			// 	], false),
			// 	controller: 'examQuestion' + 'Controller',
			// 	templateUrl: 'template/txen/' + 'examQuestion' + '.html'
			// }).state('txen.exam.region', {
			// 	url: '/region',
			// 	resolve: getResolve([
			// 		'template/txen/' + 'examRegion',
			// 	], false),
			// 	controller: 'examRegion' + 'Controller',
			// 	templateUrl: 'template/txen/' + 'examRegion' + '.html'
			// }).state('txen.exam.regionExt', {
			// 	url: '/regionExt',
			// 	resolve: getResolve([
			// 		'template/txen/' + 'examRegionExt',
			// 	], false),
			// 	controller: 'examRegionExt' + 'Controller',
			// 	templateUrl: 'template/txen/' + 'examRegionExt' + '.html'
			// }).state('txen.exam.proc', {
			// 	url: '/proc',
			// 	resolve: getResolve([
			// 		'template/txen/' + 'examProc',
			// 	], false),
			// 	controller: 'examProc' + 'Controller',
			// 	templateUrl: 'template/txen/' + 'examProc' + '.html'
			// }).state('txen.exam.result', {
			// 	url: '/result',
			// 	resolve: getResolve([
			// 		'template/txen/' + 'examResult',
			// 	], false),
			// 	controller: 'examResult' + 'Controller',
			// 	templateUrl: 'template/txen/' + 'examResult' + '.html'
			// })
			;

		$stateProvider.state('txen', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		}).state('txen.exam', {
			url: '/txen/exam?examId&itemId',
			resolve: getResolve([
				'template/txen/' + 'exam',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/txen/' + 'exam' + '.html',
					controller: 'exam' + 'Controller',
				},
			}
		}).state('txen.exam.list', {
			url: '/list',
			resolve: getResolve([
				'template/txen/' + 'examList',
			], false),
			controller: 'examList' + 'Controller',
			templateUrl: 'template/txen/' + 'examList' + '.html'
		}).state('txen.exam.info', {
			url: '/info',
			resolve: getResolve([
				'template/txen/' + 'examInfo',
			], false),
			controller: 'examInfo' + 'Controller',
			templateUrl: 'template/txen/' + 'examInfo' + '.html'
		}).state('txen.exam.question', {
			url: '/question',
			resolve: getResolve([
				'template/txen/' + 'examQuestion',
			], false),
			controller: 'examQuestion' + 'Controller',
			templateUrl: 'template/txen/' + 'examQuestion' + '.html'
		}).state('txen.exam.region', {
			url: '/region',
			resolve: getResolve([
				'template/txen/' + 'examRegion',
			], false),
			controller: 'examRegion' + 'Controller',
			templateUrl: 'template/txen/' + 'examRegion' + '.html'
		}).state('txen.exam.regionExt', {
			url: '/regionExt',
			resolve: getResolve([
				'template/txen/' + 'examRegionExt',
			], false),
			controller: 'examRegionExt' + 'Controller',
			templateUrl: 'template/txen/' + 'examRegionExt' + '.html'
		}).state('txen.exam.proc', {
			url: '/proc',
			resolve: getResolve([
				'template/txen/' + 'examProc',
			], false),
			controller: 'examProc' + 'Controller',
			templateUrl: 'template/txen/' + 'examProc' + '.html'
		}).state('txen.exam.result', {
			url: '/result',
			resolve: getResolve([
				'template/txen/' + 'examResult',
			], false),
			controller: 'examResult' + 'Controller',
			templateUrl: 'template/txen/' + 'examResult' + '.html'
		});

		$stateProvider
			.state('vote', {
				templateUrl: 'template/home/index.html'
			})
			.state('vote.list', {
				url: '/vote/list?x',
				resolve: getResolve([
					'js/controller/home/menuController',
					'js/controller/home/headController',
					'template/vote/voteListController',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/vote/voteListBody.html',
						controller: 'voteListController',
					},
				}
			})
			.state('vote.stat', {
				url: '/vote/stat?x',
				resolve: getResolve([
					'js/controller/home/menuController',
					'js/controller/home/headController',
					'template/vote/voteStatController',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/vote/voteStatBody.html',
						controller: 'voteStatController',
					},
				}
			});

		$stateProvider.state('xyk', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		})
			.state('xyk.deviceList', {
				url: '/xyk/deviceList',
				resolve: getResolve([
					'template/xyk/' + 'deviceList',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/xyk/' + 'deviceList' + '.html',
						controller: 'deviceList' + 'Controller',
					},
				}
			});

		$stateProvider.state('scanner', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		})
			.state('scanner.showCard', {
				url: '/scanner/showCard?uCardId&sCardId&examId&examCardId',
				resolve: getResolve([
					'template/scanner/' + 'showCard',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'showCard' + '.html',
						controller: 'showCard' + 'Controller',
					},
				}
			})
			.state('scanner.list', {
				url: '/scanner/list',
				resolve: getResolve([
					'template/scanner/' + 'scannerList',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'scannerList' + '.html',
						controller: 'scannerList' + 'Controller',
					},
				}
			})
			.state('scanner.edit', {
				url: '/scanner/edit?id',
				resolve: getResolve([
					'template/scanner/' + 'scannerEdit',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'scannerEdit' + '.html',
						controller: 'scannerEdit' + 'Controller',
					},
				}
			})
			.state('scanner.batchList', {
				url: '/scanner/batchList?scannerId&schoolId&gradeNum&status',
				resolve: getResolve([
					'template/scanner/' + 'scanBatchList',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'scanBatchList' + '.html',
						controller: 'scanBatchList' + 'Controller',
					},
				}
			})
			.state('scanner.scanMonitor', {
				url: '/scanner/scanMonitor',
				resolve: getResolve([
					'template/scanner/' + 'scanMonitor',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'scanMonitor' + '.html',
						controller: 'scanMonitor' + 'Controller',
					},
				}
			})
			.state('scanner.batchItems', {
				url: '/scanner/batchItems?batchId',
				resolve: getResolve([
					'template/scanner/' + 'scanBatchItems',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'scanBatchItems' + '.html',
						controller: 'scanBatchItems' + 'Controller',
					},
				}
			})
			.state('scanner.paperList', {
				url: '/scanner/paperList?scannerId&batchId',
				resolve: getResolve([
					'template/scanner/' + 'scanPaperList',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'scanPaperList' + '.html',
						controller: 'scanPaperList' + 'Controller',
					},
				}
			})
			.state('scanner.paperInfo', {
				url: '/scanner/paperInfo?paperId',
				resolve: getResolve([
					'template/scanner/' + 'scanPaperInfo',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'scanPaperInfo' + '.html',
						controller: 'scanPaperInfo' + 'Controller',
					},
				}
			})
			.state('scanner.fixCardCode', {
				url: '/scanner/fixCardCode?batchId',
				resolve: getResolve([
					'template/scanner/' + 'fixCardCode',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'fixCardCode' + '.html',
						controller: 'fixCardCode' + 'Controller',
					},
				}
			})
			.state('scanner.fixExamId', {
				url: '/scanner/fixExamId?codes&examId',
				resolve: getResolve([
					'template/scanner/' + 'fixExamId',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'fixExamId' + '.html',
						controller: 'fixExamId' + 'Controller',
					},
				}
			})
			.state('scanner.seuApiDiff', {
				url: '/scanner/seuApiDiff?type&batchId',
				resolve: getResolve([
					'template/scanner/' + 'seuApiDiff',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'seuApiDiff' + '.html',
						controller: 'seuApiDiff' + 'Controller',
					},
				}
			})
			.state('scanner.seuEnTest', {
				url: '/scanner/seuEnTest?group',
				resolve: getResolve([
					'template/scanner/' + 'seuEnTest',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'seuEnTest' + '.html',
						controller: 'seuEnTest' + 'Controller',
					},
				}
			})
			.state('scanner.autoCorrectBatch', {
				url: '/scanner/autoCorrectBatch',
				resolve: getResolve([
					'template/scanner/' + 'autoCorrectBatch',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'autoCorrectBatch' + '.html',
						controller: 'autoCorrectBatch' + 'Controller',
					},
				}
			})
			.state('scanner.autoCorrectResult', {
				url: '/scanner/autoCorrectResult?examId&regionId',
				resolve: getResolve([
					'template/scanner/' + 'autoCorrectResult',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'autoCorrectResult' + '.html',
						controller: 'autoCorrectResult' + 'Controller',
					},
				}
			})
			.state('scanner.sampleList', {
				url: '/scanner/sampleList?paperId',
				resolve: getResolve([
					'template/scanner/' + 'sampleList',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/scanner/' + 'sampleList' + '.html',
						controller: 'sampleList' + 'Controller',
					},
				}
			});

		$stateProvider.state('word', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		})
			.state('word.historyList', {
				url: '/word/historyList',
				resolve: getResolve([
					'template/word/' + 'historyList',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/word/' + 'historyList' + '.html',
						controller: 'historyList' + 'Controller',
					},
				}
			})
			.state('word.questionList', {
				url: '/word/questionList?examId',
				resolve: getResolve([
					'template/word/' + 'questionList',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/word/' + 'questionList' + '.html',
						controller: 'questionList' + 'Controller',
					},
				}
			});
		$stateProvider.state('test', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		})
			.state('test.cke01', {
				url: '/test/cke01',
				resolve: getResolve([
					'template/test/' + 'cke01',
				], false),
				views: {
					'head': {
						templateUrl: 'template/home/head.html',
						controller: 'headController',
					},
					'menu': {
						templateUrl: 'template/home/menu.html',
						controller: 'menuController',
					},
					'body': {
						templateUrl: 'template/test/' + 'cke01' + '.html',
						controller: 'cke01' + 'Controller',
					},
				}
			});

		$stateProvider.state('ecs', {
			templateUrl: 'template/home/index.html',
			resolve: getResolve([
				'js/controller/home/menuController',
				'js/controller/home/headController',
			], false),
		}).state('ecs.whiteList', {
			url: '/ecs/whiteList',
			resolve: getResolve([
				'template/system/' + 'ecsWhiteList',
			], false),
			views: {
				'head': {
					templateUrl: 'template/home/head.html',
					controller: 'headController',
				},
				'menu': {
					templateUrl: 'template/home/menu.html',
					controller: 'menuController',
				},
				'body': {
					templateUrl: 'template/system/' + 'ecsWhiteList' + '.html',
					controller: 'ecsWhiteList' + 'Controller',
				},
			}
		});
	}]);
});
define("app", ["angular", "ui.router", "ui.router.state.events"], function (e) {
	return e.module("bzexam-web", ["ui.router", "ui.router.state.events"])
		.run(function ($rootScope, $state, $q, $window, $location, $timeout) {
			$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
				$rootScope.topShow = true;
				var redirectUri = encodeURIComponent($location.absUrl());
				// console.log("redirectUri", $location);
				// console.log("redirectUri", $location.absUrl());
				var gateUrl = "http://gate-alpha.wxy100.com";
				var host = $location.host();
				if (host.indexOf("konsole.wxy100.com") >= 0) {
					gateUrl = "https://gate.wxy100.com";
				} else if (host.indexOf("konsole-alpha.wxy100.com") >= 0) {
					gateUrl = "http://gate-alpha.wxy100.com";
				} else if (host.indexOf("konsole-local.wxy100.com") >= 0) {
					gateUrl = "http://gate-local.wxy100.com";
				} else {
					gateUrl = "http://gate-alpha.wxy100.com";
				}
				if (!$rootScope.userInfo) {
					var url = gateUrl + "/enter.do?client_id=10005&redirect_uri=" + redirectUri;
					location.href = url;
				}
				$rootScope.curState = toState.name;
				console.log("curState", toState.name);
			});
		});
});
define("bzexam", ["angular", "app", "bzexam.router"], function (e) {
	e.element(document).ready(function () {
		e.bootstrap(document, ["bzexam-web"]);
	});
});
require(['bzexam'], function (b) { });