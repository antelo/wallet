
var pagarCtrl = function ($scope, store, $ionicListDelegate, $ionicNavBarDelegate) {
    'use strict';
    $scope.$on('$ionicView.enter', function () {
        $scope.empresasFavoritasStorage = store.get('empresasFavoritasStorage') || [];
    });
};


var pagarCercanosCtrl = function ($scope, Geoloc, leafletEvents, leafletData, store, $ionicScrollDelegate, $ionicListDelegate, $timeout, Pagar, $ionicLoading) {


    'use strict';
    var timer  = false,
        marcas = {},
        milat  = 43.365280999999996,
        milng  = -8.411569;

    $scope.centerMap      = {};
    $scope.centerMap.lat  = "";
    $scope.centerMap.lng  = "";
    $scope.centerMap.zoom = 18;

    /*var onSuccess = function(position) {
        var milat = position.coords.latitude;
        var milng = position.coords.longitude;
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');

    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);*/


    /*
    Recogemos los datos de la posicion del usuario
     */

    $scope.marcar = function (id, tip) {

        if (tip === 0) {
            /*
            Boramos todas los hover de las marcas
             */
            marcas = $scope.markers;
            marcas.forEach(function (elemento, index) {
                var sectorOtros            = $scope.markers[index].sector;
                $scope.markers[index].icon = local_icons_per[sectorOtros];
            });

            var sector               = $scope.markers[id].sector + '_hover';
            $scope.markers[id].icon  = local_icons_per[sector]; //Cambiamos el icono al marker
            $scope.markers[id].focus = true; //Ponemos el foco en el marker
            $scope.centerMap.lat     = $scope.markers[id].lat; //Centramos el mapa en latitud
            $scope.centerMap.lng     = $scope.markers[id].lng; //centramos el mapa en longitud
            //$scope.centerMap.zoom  = 17; //Hacemos zoom sobre el centro del mapa
            $ionicScrollDelegate.scrollTop(true); //Vamos al top de la pagina
        } else {
            $scope.markers[id].icon  = local_icons.default_icon;
            $scope.markers[id].focus = true;
        }
    };

    /*
    Datos que se envian al mapa

     */
    var data = function () {

        $scope.cargando = false;

        $ionicLoading.show({
            template: 'Loading...',
            noBackdrop: true
        });

        if (timer) {
            $timeout.cancel(timer);
        }

        timer = $timeout(function () {

          

            var response = Geoloc.get($scope.centerMap);

            response.then(function (obj) {

                var marcas   = obj.marcas, //Recogo el listado de empresas
                    yo = new L.LatLng(milat, milng);//Recogo el objeto de mi posicion para calcular el disanceTo

                /*
                Recorremos todas las marcars para calcular su distancia respecto a la posicion del usuario
                 */
                var empresa = function (i) {

                    var marca           = marcas[i],
                        sector          = marcas[i].sector,
                        loc             = new L.LatLng(marca.lat, marca.lng);

                    marcas[i].icon      = local_icons_per[sector];
                    marcas[i].distancia = (yo.distanceTo(loc)) / 1000;

                    marcas[i].message   = '<strong>' + marcas[i].razon_social + '</strong><br><span class="positive" style="font-style: italic;"><i class="icon ion-ios-home"></i> <small><em>' + marcas[i].direccion + '</em></small></span><br><i class="icon ion-gear-a"></i> ' + marcas[i].actividad;

                };

                for (var i = 0; i < marcas.length; i++) {

                    var lat = marcas[i].lat;
                    var lng = marcas[i].lng;

                    leafletData.getMap('mapa').then(empresa(i));
                };
                /*
                Fin de modificacion de marcas para calcular la distancia
                 */

                $scope.markers = marcas; //Envio las empresas al scope
                $scope.cargando = true;
                $ionicLoading.hide();
            });
        }, 1500);



    }

    /*
    Sección de enventos
     */

    $scope.$on('leafletDirectiveMap.locationfound', function(event){
       /* leafletData.getMap('mapa').then(function(map) {
        });*/
    });
    $scope.$on('leafletDirectiveMap.zoomend', function(event){
        //console.log($scope.centerMap.zoom );
        data(); //Cargamos los nuevos datos cuando se modifica el zoom
    });
    $scope.$on('leafletDirectiveMap.dragend', function(event){
        data();
       // data();//Cargamos los nuevos datos cuando se mueve en el mapa
    });
    /*$scope.$on('leafletDirectiveMarker.mouseover', function(event, args){
        $scope.markers[args.markerName].icon=local_icons.red_icon; //Cambiamos el icono al hacer mouseover
    });
    $scope.$on('leafletDirectiveMarker.mouseout', function(event, args){
        $scope.markers[args.markerName].icon=local_icons.default_icon; //Cambiamos el icono al hacer mouseout
    });*/
    $scope.$on('leafletDirectiveMarker.click', function(event, args){
        /*marcas = $scope.markers;
        marcas.forEach(function (elemento, index) {
        var sectorOtros            = $scope.markers[index].sector;
                $scope.markers[index].icon = local_icons_per[sectorOtros];
            });

        var sector               = $scope.markers[args.markerName].sector + '_hover';
        $scope.markers[args.markerName].icon  = local_icons_per[sector]; //Cambiamos el icono al marker
        $scope.markers[args.markerName].focus  = true; //Cambiamos el icono al marker  */

       //console.log('anchor'+args.markerName);//Al ejecutar click sobre una marca

    });

    var local_icons = {
        default_icon: {

        }
    };

    /*
    Configuración general del mapa
     */
    var markers = L.markerClusterGroup({ disableClusteringAtZoom: 17 });

    angular.extend($scope, {
        icons: local_icons_per,// Definimos el tipo de iconos para el mapa. Se generan en el ficherio iconos.leaftleft.js
        centerMap: {
            lat:0,
            lng:0,
            zoom: 18,
            autoDiscover : true
        },
        defaults: {
            minZoom: 9,
            scrollWheelZoom: false
        },
        events: {
            markers: {
                enable: leafletEvents.getAvailableMarkerEvents()
            }
        },
        markers: marcas,
        layers: {
            baselayers: {
                googleRoadmap: {
                    name: 'Google Streets',
                    layerType: 'ROADMAP',
                    type: 'google'
                },
                /*googleTerrain: {
                    name: 'Google Terrain',
                    layerType: 'TERRAIN',
                    type: 'google'
                },
                googleHybrid: {
                    name: 'Google Hybrid',
                    layerType: 'HYBRID',
                    type: 'google'
                }*/
            }
        }

    });

    $scope.$on('$ionicView.enter', function(){
        $scope.empresasFavoritasStorage = store.get('empresasFavoritasStorage') || [];
    });

    /*-añado ids de las empresas favoritas a la memoria cache-*/
    $scope.AddEmpresaFavorita = function(id, empresasFavoritasStorage){
       if(empresasFavoritasStorage.length > 19) alert('20 son lo máximo');
       else
       {
            $scope.empresasFavoritasStorage = Pagar.AddEmpresaFavorita(id, empresasFavoritasStorage)
       }

        $ionicListDelegate.closeOptionButtons();
    }





    // Revisar envendos disponibles

    /*
    var markerEvents = leafletEvents.getAvailableMarkerEvents();
    for (var k in markerEvents) {
        var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
        $scope.$on(eventName, function(event, args){
            $scope.eventStatus = event.name;

          // console.log("Got " + event.name);
           //console.log( args);
        });
    }
    */

}

var pagaRecientesCtrl = function($scope, store, Pagar, $ionicListDelegate){
    'use strict';
    /*-listado de empresas-*/
    $scope.empresasRecientes = [];
    var empresa = {};

    var receintes_empresa = function(position){

        var mi_position      = new L.LatLng(position.coords.latitude, position.coords.longitude);
        var empresa_position = new L.LatLng(43.065280999999996,  -8.311569);
        var distancia        = mi_position.distanceTo(empresa_position)/1000;

        for (var i = 0; i <= 15; i++)
        {
            empresa = {
                id : i+100,
                nombre : 'Demos SA ' + i,
                distancia : distancia,
                actividad : 'Restaurantes y bares',
                pedido_maximo : 1570,
                valoracion : Math.floor((Math.random() * 5) + 1),
                ver_mas : 'ver_mas/' + i,
                pagar : 'pagar/' + i
            }

            $scope.empresasRecientes.push(empresa);
        };
    };

    navigator.geolocation.getCurrentPosition(receintes_empresa);




    $scope.$on('$ionicView.enter', function(){
        $scope.empresasFavoritasStorage = store.get('empresasFavoritasStorage') || [];
    });

    /*-añado ids de las empresas favoritas a la memoria cache-*/
    $scope.AddEmpresaFavorita = function(id, empresasFavoritasStorage){
       if(empresasFavoritasStorage.length > 19) alert('20 son lo máximo');
       else
       {
            $scope.empresasFavoritasStorage = Pagar.AddEmpresaFavorita(id, empresasFavoritasStorage)
       }

        $ionicListDelegate.closeOptionButtons();
    }
}

var pagarFavoritosCtrl = function($scope, store, $ionicListDelegate){
    'use strict';
    /*--
        listado de empresas favoritas
        consigo sus ids de la cache de memoria y luego busco en la API
    -*/

    $scope.$on('$ionicView.enter', function(){
        $scope.empresasFavoritas = [];
        $scope.empresasFavoritasStorage = store.get('empresasFavoritasStorage') || [];

        if($scope.empresasFavoritasStorage.length > 0)
        {
            /*-aqui deberiamos llamar a la API pasandole el array de memoria con los ids y lo guardariamos en $scope.empresasFavoritas-*/

            for (var i = 0; i < $scope.empresasFavoritasStorage.length; i++)
            {
               $scope.empresasFavoritas.push({id: $scope.empresasFavoritasStorage[i], nombre: 'Demo '+i});
            };
        }

    });

    /*--
        quito ids de las empresas favoritas a la memoria cache
        quito la empresa del array de empresas favoritas del escope
    -*/
    $scope.deleteEmpresaFavorita = function(id, $index){
        for (var i = 0; i < $scope.empresasFavoritasStorage.length; i++)
        {
           if($scope.empresasFavoritasStorage[i] == id) $scope.empresasFavoritas.splice(i, 1);
        };
        $scope.empresasFavoritasStorage.splice($index, 1);
        store.set('empresasFavoritasStorage', $scope.empresasFavoritasStorage);

        $ionicListDelegate.closeOptionButtons();
    }
}


var buscarCtrl = function($scope, store){
    'use strict';
    /*-listado de empresas-*/
    $scope.empresasBuscar = [];

    $scope.$on('$ionicView.enter', function(){
        $scope.empresasFavoritasStorage = store.get('empresasFavoritasStorage') || [];
    });

    $scope.buscar = function(empresa){
        for (var i = 0; i <= 15; i++)
        {
            empresa = {
                id : i+100,
                nombre : 'Demos SA ' + i,
                distancia : 150 + (i*25),
                actividad : 'Restaurantes y bares',
                pedido_maximo : 1570,
                valoracion : Math.floor((Math.random() * 5) + 1),
                ver_mas : i,
                pagar : i,
            }

            $scope.empresasBuscar.push(empresa);
        };
    }

    /*-añado ids de las empresas favoritas a la memoria cache-*/
    $scope.AddEmpresaFavorita = function(id, empresasFavoritasStorage){
       if(empresasFavoritasStorage.length > 19) alert('20 son lo máximo');
       else
       {
            $scope.empresasFavoritasStorage = Pagar.AddEmpresaFavorita(id, empresasFavoritasStorage)
       }

        $ionicListDelegate.closeOptionButtons();
    }
}

var pagarEmpresaCtrl = function($scope, $state, $stateParams, $ionicSlideBoxDelegate, $location, $ionicNavBarDelegate, $filter, $ionicGesture, store, Pagar){
    'use strict';

    $scope.empresasFavoritasStorage = store.get('empresasFavoritasStorage') || [];
    var id = $stateParams.id;

    $scope.empresa = {
                id : id,
                nombre : 'Demos SA ' + id,
                codigo_comercio : id,
                actividad : 'Restaurantes y bares',
                pedido_maximo : 1570,
                valoracion : Math.floor((Math.random() * 5) + 1),
                ver_mas : id,
                pagar : id,
                imgs: ['http://lorempixel.com/400/200/sports', 'http://lorempixel.com/400/200/city', 'http://lorempixel.com/400/200/people', 'http://lorempixel.com/400/200/nature', 'http://lorempixel.com/400/200/fashion', 'http://lorempixel.com/400/200/cats']
            };
    $scope.myActiveSlide = $stateParams.pago;

    $scope.pagarChange = function($index){
        /*-deshabilitamos el back y cambiamos el title-*/

    };


    $scope.goToPagar = function(){
        $ionicSlideBoxDelegate.next();
    }

    $scope.pagarTicket = function(importe){
        alert(importe);
    }

    /*-añado ids de las empresas favoritas a la memoria cache-*/
    $scope.AddEmpresaFavorita = function(id, empresasFavoritasStorage){
        if(empresasFavoritasStorage.length > 19) alert('20 son lo máximo');
        else $scope.empresasFavoritasStorage = Pagar.AddEmpresaFavorita(id, empresasFavoritasStorage)
    }

    /*--
        quito ids de las empresas favoritas a la memoria cache
        quito la empresa del array de empresas favoritas del escope
    -*/
    $scope.deleteEmpresaFavorita = function(id){
        for (var i = 0; i < $scope.empresasFavoritasStorage.length; i++)
        {
           if($scope.empresasFavoritasStorage[i] == id) $scope.empresasFavoritasStorage.splice(i, 1);
        };
        store.set('empresasFavoritasStorage', $scope.empresasFavoritasStorage);

    }

    $scope.$on('$ionicView.enter', function(){
        ionic.DomUtil.ready(function(){
            $ionicNavBarDelegate.showBar(true);
            $ionicNavBarDelegate.showBackButton(true);
            $ionicNavBarDelegate.title('Pedido máximo: <strong>' + $filter('currency')($scope.empresa.pedido_maximo, '€', 0) + '</strong>');

            var $galleryEmpresa = angular.element(document.querySelector('.gallerympresa'));


            var dragFinish = function(e) {
             console.log('fin');
             $ionicSlideBoxDelegate.enableSlide(true);
            };
            var releaseGesture = $ionicGesture.on('release', dragFinish, $galleryEmpresa);

            var dragInit = function(e) {
              console.log('init');
             $ionicSlideBoxDelegate.enableSlide(false);
            };
            var dragGesture = $ionicGesture.on('drag', dragInit, $galleryEmpresa);

            /*var dragHandlerInit = function(e) {
                console.log('dragHandlerInit');
                //$ionicSlideBoxDelegate.enableSlide(false);
            }
            var dragHandlerFinish = function(e) {
                console.log('dragHandlerFinish');
                //$ionicSlideBoxDelegate.enableSlide(true);
            }

            var dragGesture = $ionicGesture.on('drag', dragHandlerInit, $galleryEmpresa);
            var releaseGesture = $ionicGesture.on('release', dragHandlerFinish, $element);*/

            /*$scope.$on('$destroy', function () {
                console.log('asd');
              $ionicGesture.off(dragGesture, 'drag', function(){console.log('pppp');});
            });*/

        });
    });
}

var pagoCtrl = function($scope, $state, $stateParams){
    'use strict';
    console.dir($stateParams);
    console.dir($state);
    $scope.id = $stateParams.id;
    $scope.state = $state.current.name;

}


angular.module('starter.pagar')
    .controller('pagarCtrl', ['$scope', 'store', '$ionicListDelegate', '$ionicNavBarDelegate', pagarCtrl])
    .controller('pagarCercanosCtrl', ['$scope','Geoloc','leafletEvents', 'leafletData','store', '$ionicScrollDelegate', '$ionicListDelegate', '$timeout', 'Pagar', '$ionicLoading', pagarCercanosCtrl])
    .controller('pagarRecientesCtrl', ['$scope', 'store', 'Pagar', '$ionicListDelegate', pagaRecientesCtrl])
    .controller('pagarFavoritosCtrl', ['$scope', 'store', '$ionicListDelegate', pagarFavoritosCtrl])
    .controller('buscarCtrl', ['$scope', 'store', buscarCtrl])
    .controller('pagarEmpresaCtrl', ['$scope', '$state', '$stateParams', '$ionicSlideBoxDelegate', '$location', '$ionicNavBarDelegate', '$filter', '$ionicGesture', 'store', 'Pagar', pagarEmpresaCtrl])
    .controller('pagoCtrl', ['$scope', '$state', '$stateParams', pagoCtrl])


