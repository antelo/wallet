var Pagar = function($rootScope, $state, $http, $location, store){
  /*return $http({
                url: APIURL+"servidor_rest/datos_economicos_usuario/troco/dgonzalez@circulogacela.com/11111111"
            }).success(function(data){

            }).error(function(){

            });*/
  return {
    AddEmpresaFavorita: function(id, empresasFavoritasStorage){
            empresasFavoritasStorage.push(id);
            store.set('empresasFavoritasStorage', empresasFavoritasStorage);
            return empresasFavoritasStorage;

    }
  }
}

var Geoloc = function($q, $http, CONFIG){

  var get = function (loc) {
        var deferred = $q.defer();
        $http({
                url:     CONFIG.APIURL+"geoloc",
                method:  "POST",
                data :   "lat="+loc.lat+"&lng="+loc.lng+"&zoom="+loc.zoom,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data) {
            deferred.resolve(data.response);
        })
        .error(function(data) {
            deferred.reject(status);
        });
        return deferred.promise;
    };

    return {
        get : get
    };

}

angular.module('starter.pagar')
  .factory('Pagar', Pagar)
  .factory('Geoloc', Geoloc)
