(function () {
    'use strict';

    // Ionic Starter App

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
    // 'starter.services' is found in services.js
    // 'starter.controllers' is found in controllers.js
    angular.module('starter', [
        'ionic',
        'ngCordova',
        'angular-jwt',
        'angular-storage',
        'starter.controller',
        'starter.service',
        'starter.login',
        'starter.inicio',
        'starter.pagar',
        'starter.cobrar',
        'starter.mi_cuenta',
        'starter.valoraciones',
        'starter.devoluciones',
        'starter.configuracion',
        'starter.ayuda'
    ]);
    angular.module('starter.controller', []);
    angular.module('starter.service', []);
    angular.module('starter.login', ['ngMessages']);
    angular.module('starter.inicio', []);
    angular.module('starter.pagar', ["leaflet-directive"]);
    angular.module('starter.cobrar', []);
    angular.module('starter.mi_cuenta', []);
    angular.module('starter.valoraciones', []);
    angular.module('starter.devoluciones', []);
    angular.module('starter.configuracion', []);
    angular.module('starter.ayuda', []);

    /*--*/
    angular.module('starter')

        .constant('CONFIG', {
            APIURL : 'https://sandbox.trocobuy.com/api/v1/',
            BASEURL : 'http://192.168.0.72/trocowallet/www/'
        })

        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', "jwtInterceptorProvider", function ($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {

          //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        //en cada petición enviamos el token a través de los headers con el nombre Authorization
            jwtInterceptorProvider.tokenGetter =  ['config', function (config) {
                // Skip authentication for any requests ending in .html
                if (config.url.substr(config.url.length - 5) === '.html') {
                    return null;
                }
                return localStorage.getItem('token');
            }];
            $httpProvider.interceptors.push('jwtInterceptor');

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

              // setup an abstract state for the tabs directive
              /*.state('index', {
                url: "/index",
                abstract: true,
                templateUrl: "templates/template.html"
              })*/

              // Each tab has its own nav history stack:

                .state('login', {
                    url: '/login',
                    templateUrl: 'modules/login/login.html',
                    controller: 'loginCtrl'
                })

                .state('inicio', {
                    url: '/inicio',
                    templateUrl: 'modules/inicio/inicio.html',
                    controller: 'inicioCtrl',
                    authorization: true
                })

                .state('index', {
                    templateUrl: 'templates/template.html'
                })

                .state('index.pagar', {
                    url: '/pagar',
                    templateUrl: 'modules/pagar/views/pagar.html',
                    controller: 'pagarCtrl'
                })

                .state('index.pagar.cercanos', {
                    url: '/cercanos',
                    views: {
                        'cercanos': {
                            templateUrl: 'modules/pagar/views/cercanos.html',
                            controller: 'pagarCercanosCtrl'
                        }
                    }
                })

                .state('index.pagar.recientes', {
                    url: '/recientes',
                    views: {
                        'recientes': {
                            templateUrl: 'modules/pagar/views/recientes.html',
                            controller: 'pagarCtrl'
                        }
                    }
                })

                .state('index.pagar.favoritos', {
                    url: '/favoritos',
                    views: {
                        'favoritos': {
                            templateUrl: 'modules/pagar/views/favoritos.html',
                            controller: 'pagarCtrl'
                        }
                    }
                })

                .state('index.pagar.buscar', {
                    url: '/buscar',
                    views: {
                        'buscar': {
                            templateUrl: 'modules/pagar/views/buscar.html',
                            controller: 'pagarCtrl'
                        }
                    }
                })

                .state('index.cobrar', {
                    url: '/cobrar',
                    templateUrl: 'modules/cobrar/cobrar.html',
                    controller: 'cobrarCtrl'
                })

                .state('index.mi_cuenta', {
                    url: '/mi_cuenta',
                    templateUrl: 'modules/mi_cuenta/mi_cuenta.html',
                    controller: 'miCuentaCtrl'
                })

                .state('index.valoraciones', {
                    url: '/valoraciones',
                    templateUrl: 'modules/valoraciones/valoraciones.html',
                    controller: 'valoracionesCtrl'
                })

                .state('index.devoluciones', {
                    url: '/devoluciones',
                    templateUrl: 'modules/devoluciones/devoluciones.html',
                    controller: 'devolucionesCtrl'
                })

                .state('index.configuracion', {
                    url: '/configuracion',
                    templateUrl: 'modules/configuracion/configuracion.html',
                    controller: 'configuracionCtrl'
                })

                .state('ayuda', {
                    url: '/ayuda',
                    templateUrl: 'modules/ayuda/ayuda.html',
                    controller: 'ayudaCtrl'
                });

                // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/inicio');

        }])

        .run(['jwtHelper', 'store', '$ionicPlatform', '$rootScope', '$state', '$location', 'pushService', function (jwtHelper, store, $ionicPlatform, $rootScope, $state, $location, pushService) {
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (toState.name !== 'login') {
                    var token = store.get("token") || null,
                        bool = true;
                    if (!token) {
                        $location.path('/login');
                        return false;
                    }
                    bool = jwtHelper.isTokenExpired(token);
                    if (bool === true) {
                        $location.path('/login');
                        return false;
                    }
                }
            });
            $rootScope.$on("unauthenticated", function () {
                store.remove('token');
                $location.path('/login');
            });
            $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                console.log(notification);
                if (ionic.Platform.isAndroid()) {
                    pushService.handleNotification(event, notification);
                } else if (ionic.Platform.isIOS()) {
                    pushService.handleNotification(event, notification);
                    $scope.$apply(function () {
                        $scope.notifications.push(JSON.stringify(notification.alert));
                    });
                }
            });

            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                pushService.register();
                // Notification Received
            });
        }]);
}());
