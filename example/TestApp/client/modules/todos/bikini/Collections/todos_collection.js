
(function (global) {
    'use strict';

    global.TodosCollection = Bikini.Collection.extend({
        model: TodosModel,
        entity: 'Todos',
        url: window.mCAPConfig.getBaseUrl() + '/Todo',
        store: new Bikini.BikiniStore({
            useLocalStore: YES
        })
    });   
})(window);
