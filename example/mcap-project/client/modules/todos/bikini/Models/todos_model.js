(function(global) {
    'use strict';

    var Model  = mCAP.Model.extend(Bikini.Model);

    global.TodosModel = Bikini.Model.extend({
        idAttribute: '_id'
    });

})(window);
