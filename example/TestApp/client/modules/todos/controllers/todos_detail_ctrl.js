angular.module('todos')
    .controller('TodosCtrlDetail', function($scope, $stateParams, $state, todosService) {
        // Set the title
        $scope.name = 'Todo';

        var detailModel = null;
        detailModel = todosService.get($stateParams.todoId);

        // workaround if your entry point is already a detail view
        if(!detailModel){
            detailModel = new TodosModel({_id:$stateParams.todoId}, {collection: todosService});
            detailModel.fetch();
            todosService.fetch();
        }

        // assign the single-model to the scope-variable contact
        $scope.todo = detailModel;

        /**
         * the edit-function redirects to the tabs.todosEdit view
         * @param id {String} todoId
         */
        $scope.edit = function(id) {
            $state.go('tab.todosEdit', {todoId: id});
        };

    });