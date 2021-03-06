(function () {
    'use strict';
    angular.module('starter.login')
        .controller('loginCtrl', ['$scope', 'CONFIG', 'authFactory', 'jwtHelper', 'store', '$state', '$ionicLoading', '$location', 'pushService', function ($scope, CONFIG, authFactory, jwtHelper, store, $state, $ionicLoading, $location, pushService) {
            var token = store.get('token') || null,
                bool = true;
            if (token) {
                bool = jwtHelper.isTokenExpired(token);
                if (bool === false) {
                    $location.path('/inicio');
                    return false;
                }
            }
            $scope.user = {
                email: store.get('email') || '',
                password : ''
            };
            $scope.flash = '';
            $scope.login = function (form) {
                if (form.$valid) {
                    var device = ionic.Platform;
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                    authFactory.login($scope.user, device).then(function (res) {
                        $ionicLoading.hide();
                        if (res) {
                            store.set('token', res.token);
                            store.set('email', res.response.Email);
                            pushService.register();
                            $state.go('inicio');
                        }
                    }, function (error) {
                        $scope.flash = error;
                        $ionicLoading.hide();
                    });
                }
            };
        }]);
}());
