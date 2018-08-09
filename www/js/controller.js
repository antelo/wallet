angular.module('starter.controller')
    .controller('appCtrl', [ '$scope', '$stateParams', '$ionicScrollDelegate', '$ionicSideMenuDelegate', '$ionicNavBarDelegate', '$window', 'store', function($scope, $stateParams, $ionicScrollDelegate, $ionicSideMenuDelegate, $ionicNavBarDelegate, $window, store){

        var resizeFn = function(){
            $scope.heightW = (screen.height)/2;
        }

        resizeFn();

        angular.element($window).bind('resize', function(){
            $scope.$apply(resizeFn());
        });

        $scope.appClose = function(){
            ionic.Platform.exitApp();
        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.logout = function () {
            store.remove('token');
        }

        /*$scope.setNavTitle = function(title) {
            $ionicNavBarDelegate.title(title);
        }*/

    }]);

