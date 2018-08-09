(function () {
    'use strict';
    angular.module('starter.inicio')
        .controller('inicioCtrl', ['$scope', 'usersService', '$state', function ($scope, appService, $state) {
            $scope.user = {};
            $scope.$on('$ionicView.enter', function () {
                var user = appService.getUser();
                user.then(function (data) {
                    $scope.user = data;
                });
            });
        }]);
}());
