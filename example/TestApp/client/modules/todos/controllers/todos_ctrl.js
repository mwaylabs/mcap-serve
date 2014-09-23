angular.module('todos')
    .controller('TodosCtrl', function($scope, $stateParams, $state, todosService) {
        // Set the title
        $scope.name = 'Todos';

        // if there are initially no models, call fetch()
        if(!todosService.models.length) {
                todosService.fetch();
        }
        // assign the models to the scope-variable todos
        $scope.todos = todosService.models;

        $scope.newEntry = function() {
            $state.go('tab.todosNew');
        }

    });