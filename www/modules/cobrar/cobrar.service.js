var PedidosPendientes = function ($q, $http, CONFIG) {
	'use strict';

	var get = function (pagina) {
		
        var deferred = $q.defer();
		$http({
            url: CONFIG.APIURL + "pedidos",
            method: "GET",
            params: {pagina: pagina}
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data.response);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(status);
            });
		
        return deferred.promise;
    };
	
	var post = function (loc) {
        var deferred = $q.defer();
        $http({
            url:     CONFIG.APIURL + "pedidos",
            method:  "POST",
            data :   "lat=" + loc.lat + "&lng=" + loc.lng + "&zoom=" + loc.zoom,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {
                deferred.resolve(data.response);
            })
            .error(function (status) {
                deferred.reject(status);
            });
        return deferred.promise;
    };

    return {
        get : get,
		post : post
    };

};

var Pedido = function ($q, $http, CONFIG) {
    'use strict';
    var get = function (id) {
        var deferred = $q.defer();
        $http({
            url: CONFIG.APIURL + "pedidos/pedido",
            method: "GET",
            params: {id: id}
        })
            .success(function (data) {
                deferred.resolve(data.response);
            })
            .error(function (status) {
                deferred.reject(status);
            });
        return deferred.promise;
    };
    
    var devolucion = function (pedido) {
        console.log(pedido);
        var deferred = $q.defer();
        $http({
            url:     CONFIG.APIURL + "pedidos/pedido",
            method:  "PUT",
            //params: {id : pedido.id, tipo : pedido.tipo, motivo : pedido.motivo},
            data :   "id=" + pedido.id + "&tipo=" + pedido.tipo + "&motivo=" + pedido.motivo,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {
                deferred.resolve(data.response);
            })
            .error(function (status) {
                deferred.reject(status);
            });
        return deferred.promise;
    };
    
    var valorar = function (pedido) {
        console.log(pedido);
        var deferred = $q.defer();
        $http({
            url:     CONFIG.APIURL + "pedidos/pedido",
            method:  "PUT",
            //params: {id : pedido.id, tipo : pedido.tipo, motivo : pedido.motivo},
            data :   "id=" + pedido.id + "&valoracion=" + pedido.valoracion,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {
                deferred.resolve(data.response);
            })
            .error(function (status) {
                deferred.reject(status);
            });
        return deferred.promise;
    };
    
    return {
        get : get,
        devolucion : devolucion,
        valorar : valorar
    };
    

};

var Pedidos = function ($q, $http, CONFIG) {
    'use strict';
    
    var post = function (pedidos) {
        var deferred = $q.defer();
        $http({
            url:     CONFIG.APIURL + "pedidos",
            method:  "POST",
            //params: {id : pedido.id, tipo : pedido.tipo, motivo : pedido.motivo},
            data :   "fecha_i=" + pedidos.fecha_i + "&fecha_f=" + pedidos.fecha_f + "&importe_inicio=" + pedidos.importe_i + "&importe_fin=" + pedidos.importe_f + "&pagina=" + pedidos.pagina,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .success(function (data) {
                deferred.resolve(data.response);
            })
            .error(function (status) {
                deferred.reject(status);
            });
        return deferred.promise;
        };
    
        return {
            post : post,
           
        };
};

angular.module('starter.cobrar')
    .factory('Pedido', Pedido)
    .factory('Pedidos', Pedidos)
    .factory('PedidosPendientes', PedidosPendientes);

