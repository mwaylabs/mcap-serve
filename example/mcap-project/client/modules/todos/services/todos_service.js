'use strict';

angular.module('todos')
    .factory('todosService', function($rootScope, $ionicLoading) {

        var collection = null;

        $ionicLoading.show({
            template: '<div class="ion-ios7-reloading"></div>'
        });

        collection = new TodosCollection();

        collection.on('sync', function() {
            console.warn('sync was triggered');
            $rootScope.$apply();
            $ionicLoading.hide();
        });

        return collection;
    });
