angular.module('todos')
    .controller('TodosCtrlEdit', function($scope, $stateParams, $state, todosService) {
        // Set the title
        $scope.name = 'Edit  Todo';
   
        var detailModel = null;
        detailModel = todosService.get($stateParams.todoId);



        // Create a new ContactsModel with the current
        if(!detailModel){
            detailModel = new TodosModel({_id : $stateParams.todoId}, {collection: todosService});
            detailModel.fetch();
            todosService.fetch();

            // Create a deep-copy of the model to make sure we can revert if the action is canceled.
            // This has also the advantage that if someone changes the model from outside, the current changes won't be overridden
            detailModel.on('sync', function() {
                $scope.todo = JSON.parse(JSON.stringify(detailModel));
                $scope.$apply();
            });
        }

        $scope.todo = JSON.parse(JSON.stringify(detailModel));

        /**
         * First update the model with the $scope variables,
         * then call save.
         * Redirect afterwards to the tab.todosDetail view (the detail-view)
         */
        $scope.save = function() {
            detailModel.set($scope.todo);
            detailModel.save();
            $state.go('tab.todosDetail');
        };

        /**
         * Get rid of the $scope variables,
         * redirect to detail-view
         */
        $scope.cancel = function() {
            $scope.todo = '';
            $state.go('tab.todosDetail');
        };

    });