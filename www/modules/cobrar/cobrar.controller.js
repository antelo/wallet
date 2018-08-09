var cobrarCtrl = function ($scope, store, $ionicListDelegate) {
    'use strict';
    
    
};

var cobrarPendientesCtrl = function ($scope, store, $ionicListDelegate, $ionicLoading, PedidosPendientes) {
	'use strict';
    $scope.cargarMasDatos = false;
    $scope.pedidos = {};
    $scope.totalPaginas = 0;
	$scope.total_pedidos = 0;
	$scope.pedidos = [];
    $scope.cargarMasDatosPendientes = false;
    var pagina = 0;
    $scope.pagina = 0;
	
	$scope.cargando = false;
    
    
	$scope.getPendientes = function () {
        
        $ionicLoading.show({
            template: 'Loading...',
            noBackdrop: true
        });

        var pedidos = PedidosPendientes.get($scope.pagina);
	
        pedidos.then(function (obj) {
            
            pagina++;
            
            if (obj.total > 0) {
                
                $scope.pagina = pagina * parseInt(10);
                $scope.totalPaginas = parseInt(obj.total);
                console.log($scope.pagina);
                console.log($scope.totalPaginas);

                if ($scope.pagina > $scope.totalPaginas) {

                    $scope.cargarMasDatosPendientes = false;

                } else {

                    $scope.cargarMasDatosPendientes = true;

                }

                Array.prototype.push.apply($scope.pedidos, obj.solicitudes);
                $scope.$broadcast('scroll.infiniteScrollComplete');

            
              //  $scope.pedidos = obj.solicitudes;
            }
            $scope.total_pedidos = obj.total;

            $scope.cargando = true;
            $ionicLoading.hide();
        });
      
    };
	
    $scope.$on('$stateChangeSuccess', function () {
        //$scope.getPendientes();
    });
    
    
    $scope.getPendientes();
	
};

var cobrarVerPedidoCtrl = function ($scope, store, $ionicListDelegate, $ionicLoading, Pedido, $stateParams) {
	'use strict';

    $scope.pedido = false;
	$scope.cargando = false;
    
	$ionicLoading.show({
        template: 'Loading...',
        noBackdrop: true
    });
	
	var pedido = Pedido.get($stateParams.id);
	
	pedido.then(function (obj) {
		
        $scope.pedido = obj.solicitud;
		
        $scope.cargando = true;
        $ionicLoading.hide();
	});
    
    $scope.rateFunction = function (e) {};

};

var cobrarDevolucionCtrl = function ($scope, store, $ionicListDelegate, $ionicLoading, $stateParams, Pedido) {
    'use strict';
    var datosPedido = {};
    $scope.acciones = true;
    $scope.pedido = false;
	$scope.cargando = false;
    $scope.devolucionAcciones = true;
    $scope.devolucionMotivos = false;
    $scope.devolucionFinalizada = false;
	
    /*
     Realizamos la valoración del pedido
    */
    $scope.valorarPedido = function (e) {
    
        datosPedido.id = $stateParams.id;
        datosPedido.valoracion = parseInt(e) * parseInt(2);
    
        var valorarPedido = Pedido.valorar(datosPedido);

        valorarPedido.then(function (obj) {

            $scope.pedido = obj.solicitud;
            
            $scope.cargando = true;
            $ionicLoading.hide();
            
        });
    };
    
    /*
     Mostramos los motivos posibles para una devolucion
    */
    $scope.mostrarMotivos = function (e) {
        $scope.devolucionAcciones = false; //Ocultamos la capa de acciones
        $scope.devolucionMotivos = true; //Mostramos la acapa de movitivos
    };
    
    /*
     Ejecutamos la devolución del pedido
    */
    $scope.enviarDevolucion = function (motivo) {
       
        $ionicLoading.show({
			template: 'Loading...',
			noBackdrop: true
        });

        var datosPedido = {};
        datosPedido.id = $stateParams.id;
        datosPedido.tipo = motivo.id;
        datosPedido.motivo = motivo.motivoDevolucion;
        
        var pedido = Pedido.devolucion(datosPedido); //Enviamos un put a api/v1/pedidos/pedido con el id de l pedido, el tipo de devolucion y el motivo expuesto
        
        pedido.then(function (obj) {

            $scope.pedido = obj.solicitud;
            $scope.cargando = true;
            $ionicLoading.hide();
            $scope.devolucionAcciones = false; //ocultamos la capa de acciones
            $scope.devolucionMotivos = false; //ocultamo la capa de motivos
            $scope.devolucionFinalizada = true; //mostramos la capa de ok
        });
    };
    
    
    /*
     Cargamos los datos del pedido
    */
    
    var cargarPedido = function () {
        
        $ionicLoading.show({
            template: 'Loading...',
            noBackdrop: true
        });
        
        var pedido = Pedido.get($stateParams.id);
	
        pedido.then(function (obj) {

            $scope.pedido = obj.solicitud;

            $scope.cargando = true;
            $ionicLoading.hide();
        });
        
    };
        
    cargarPedido();

};

var cobrarHistoricoCtrl = function ($scope, store, $ionicListDelegate, $ionicLoading, PedidosPendientes) {
	'use strict';
	$scope.total_pedidos = 0;
	$scope.pedidos = [];
	
	$scope.cargando = false;
    
	$ionicLoading.show({
        template: 'Loading...',
		noBackdrop: true
    });
	
	var pedidos = PedidosPendientes.get();
	
	pedidos.then(function (obj) {
		
		if (obj.total > 0) {
			$scope.pedidos = obj.solicitudes;
		}
		$scope.total_pedidos = obj.total;
		
        $scope.cargando = true;
        $ionicLoading.hide();
	});
  
};
var cobrarFiltrarCtrl = function ($scope, store, $ionicListDelegate, $filter, $ionicLoading, Pedidos) {
	'use strict';
    var pedidos = {},
        datosPedidos = {},
        d = new Date(),
        pagina = 0;
    
    d = $filter('date')(d, 'dd/mm/yyyy');
    $scope.pedidosB = {};
    $scope.pedidosB.desde = new Date(2014, 10, 1);
    $scope.pedidosB.hasta = new Date();
    $scope.pedidosB.importe_inicial = 0;
    $scope.pedidosB.importe_final = 0;
    $scope.cargando = false;
    $scope.pagina = 0;
    $scope.cargarMasDatos = false;
    $scope.pedidos = [];
    $scope.totalPaginas = 0;
    
    $scope.enviarBusqueda = function () {
        $scope.pedidos = [];
        $scope.enviarBusquedaMas();
    };
    
    $scope.enviarBusquedaMas = function () {
                
        $ionicLoading.show({
            template: 'Loading...',
            noBackdrop: true
        });
        var fecha_i = new Date($scope.pedidosB.desde),
            fecha_f = new Date($scope.pedidosB.hasta);
        
        datosPedidos.fecha_i = fecha_i.valueOf() / 1000;
        datosPedidos.fecha_f = fecha_f.valueOf() / 1000;
        datosPedidos.importe_i = $scope.pedidosB.importe_inicial;
        datosPedidos.importe_f = $scope.pedidosB.importe_final;
        datosPedidos.pagina = $scope.pagina;
    
        var filtrarPedidos = Pedidos.post(datosPedidos);

        filtrarPedidos.then(function (obj) {
            
            pagina ++;
            $scope.pagina = pagina * parseInt(10);
            $scope.totalPaginas = parseInt(obj.total);
            
            if ($scope.pagina > $scope.totalPaginas) {
                $scope.cargarMasDatos = false;
            } else {
                $scope.cargarMasDatos = true;
            }
            
            Array.prototype.push.apply($scope.pedidos, obj.solicitudes);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            //   $scope.pedidos = obj.solicitudes;
            
            $scope.cargando = true;
            $ionicLoading.hide();
            
            
            
        });
         //$scope.$broadcast('scroll.infiniteScrollComplete');
    };
    

    
    $scope.$on('$stateChangeSuccess', function () {
       // $scope.enviarBusqueda();
    });
    
    //$scope.pedidos = [];
   
};
	
angular.module('starter.cobrar')
    .controller('cobrarCtrl', cobrarCtrl)
    .controller('cobrarPendientesCtrl', cobrarPendientesCtrl)
    .controller('cobrarHistoricoCtrl', cobrarHistoricoCtrl)
    .controller('cobrarFiltrarCtrl', cobrarFiltrarCtrl)
    .controller('cobrarVerPedidoCtrl', cobrarVerPedidoCtrl)
    .controller('cobrarDevolucionCtrl', cobrarDevolucionCtrl);