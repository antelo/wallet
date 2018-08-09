angular.module('starter')
  .directive('starRating',
    function() {
      return {
        restrict : 'E',
        template : '<ul class="rating">'
             + '  <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
             + '<i class="ion-ios-star"></i>'
             + '</li>'
             + '</ul>',
        scope : {
          ratingValue : '=',
          max : '=',
          noUpdate : '=',
          onRatingSelected : '&'
        },
        link : function(scope, elem, attrs) {
          var updateStars = function() {
              scope.stars = [];
              for ( var i = 0; i < scope.max; i++) {
                scope.stars.push({
                  filled : i < scope.ratingValue
                });
              }
          };

          scope.toggle = function(index) {
            if(!scope.noUpdate)
            {
              scope.ratingValue = index + 1;
              scope.onRatingSelected({
                rating : index + 1
              });
            }
          };

          scope.$watch('ratingValue',
            function(oldVal, newVal) {
              if (newVal) {
                updateStars();
              }
            }
          );
        }
      };
    }
  ).directive('ionBack', function ($ionicHistory) {
   return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
        elem.bind('click', function() {
            $ionicHistory.goBack();
      });
    }
  }
});
