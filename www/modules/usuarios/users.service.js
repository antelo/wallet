(function () {
    'use strict';
    angular.module('starter')
        .factory("usersService", ["$http", "$q", "CONFIG", "store", function ($http, $q, CONFIG, store) {
            return {
                getUser: function getUser(id) {
                    if (id) {
                        id = '/' + id;
                    } else {
                        id = '';
                    }
                    var deferred = $q.defer(),
                        promise = $http({
                            method: 'GET',
                            skipAuthorization: false,
                            url: CONFIG.APIURL + 'users/user' + id
                        }).then(function (res) {
                            if (!id) {
                                store.set('my_user', res.data.response);
                            }
                            if (res.data.token) {
                                store.set('token', res.data.token);
                            }
                            deferred.resolve(res.data.response);
                        }, function (error) {
                            if (!id) {
                                var my_user = store.get("my_user") || null;
                                if (my_user) {
                                    deferred.resolve(my_user);
                                } else {
                                    deferred.reject('El servicio no está disponible, comprueba tu conexión a internet');
                                }
                            }
                        });
                    return deferred.promise;
                }
            };
        }]);
}());
