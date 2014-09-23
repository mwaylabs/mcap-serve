angular.module('todos')
    .controller('TodosCtrlNew', function($scope, $stateParams, $state, todosService) {
        // Set the title
        $scope.name = 'New Todos';

        var detailModel = null;
        /**
         * Create a new TodoModel with the current
         */
        detailModel = new TodosModel({}, {collection: todosService});

        $scope.todo = detailModel.attributes;

        /**
         * First update the model with the $scope variables,
         * then call save.
         * Redirect afterwards to the tab.todosDetail view (the detail-view)
         */
        $scope.save = function() {
            detailModel.save();
            $state.go('tab.todos');
        };

        /**
         * Get rid of the $scope variables,
         * redirect to detail-view
         */
        $scope.cancel = function() {
            $scope.todo = '';
            detailModel = null;
            $state.go('tab.todos');
        };

    });