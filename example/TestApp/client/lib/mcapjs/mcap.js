(function (root, Backbone, $, _) {
  'use strict';

  var sync = Backbone.sync,
    mCAP = {};

  Backbone.$.ajaxSetup({
    // send cookies
    xhrFields: { withCredentials: false }
  });

  Backbone.sync = function (method, model, options) {
    if (_.isUndefined(options.wait)) {
      options.wait = true;
    }
    return sync.apply(Backbone, [method, model, options]);
  };

  // INCLUDE PRIVATE VARS HERE
  /*jshint unused:false */
  var Filterable = function (collectionInstance, options) {
  
    options = options || {};
  
    var _collection = collectionInstance,
        _limit = options.limit,
        _offset = _limit ? options.offset : false,
        _page = options.page || 1,
        _perPage = options.perPage || 30,
        _initialFilterValues = angular.copy(options.filterValues),
        _filterDefinition = options.filterDefinition,
        _sortOrder = options.sortOrder,
        _totalAmount;
  
    this.filterValues = options.filterValues;
    this.customUrlParams = options.customUrlParams;
  
    this.getRequestParams = function (method, model, options) {
      options.params = options.params || {};
  
      if (method === 'read') {
        // Filter functionality
        var filter = this.getFilters();
        if (filter) {
          options.params.filter = filter;
        }
  
        // Pagination functionality
        if (_perPage && _page && (_limit || _.isUndefined(_limit))) {
          options.params.limit = _perPage;
  
          // Calculate offset
          options.params.offset = _page > 1 ? _perPage * (_page - 1) : 0;
        }
  
        // Sort order
        if (_sortOrder) {
          options.params.sortOrder = _sortOrder;
        }
  
        // Fallback to limit and offset if they're set manually, overwrites pagination settings
        if (_limit || _offset) {
          options.params.limit = _limit;
          options.params.offset = _offset;
        }
  
        // Custom URL parameters
        if (this.customUrlParams) {
          _.extend(options.params, this.customUrlParams);
        }
  
        return options;
      }
    };
  
    this.setTotalAmount = function (totalAmount) {
      _totalAmount = totalAmount;
    };
  
    this.getTotalAmount = function () {
      return _totalAmount;
    };
  
    this.loadPreviousPage = function () {
      _page -= 1;
      _collection.fetch({remove: false});
    };
  
    this.hasPreviousPage = function () {
      return _page >= 1;
    };
  
    this.loadNextPage = function () {
      _page += 1;
      _collection.fetch({remove: false});
    };
  
    this.hasNextPage = function () {
      return _totalAmount && _totalAmount > _collection.length;
    };
  
    this.getPage = function () {
      return _page;
    };
  
    this.getTotalPages = function () {
      return Math.floor(_totalAmount / _perPage);
    };
  
    this.setSortOrder = function (sortOrder) {
      // TODO: persist sortOrder here
      // ....
      _sortOrder = sortOrder;
    };
  
    this.getSortOrder = function () {
      return _sortOrder;
    };
  
    this.setFilters = function (filterMap) {
  
      _.forEach(filterMap, function (value, key) {
        if (_.has(this.filterValues, key)) {
          this.filterValues[key] = value;
        } else {
          throw new Error('Filter named \'' + key + '\' not found, did you add it to filterValues of the model?');
        }
      }, this);
    };
  
    this.getFilters = function () {
      if (_.isFunction(_filterDefinition)) {
        return _filterDefinition.apply(this);
      }
    };
  
    this.resetFilters = function () {
      this.filterValues = angular.copy(_initialFilterValues);
    };
  
    (function _main() {
      // TODO: load persisted filters into this.filterValues and sortOrder here
      // ....
  
      if (!_collection instanceof Backbone.Collection) {
        throw new Error('First parameter has to be the instance of a collection');
      }
  
    }());
  };
  /*jshint unused:false */
  
  var CollectionSelectable = function (collectionInstance, options) {
  
  
    var _collection = collectionInstance,
        _radio = options.radio === true;
  
    this.getSelectedModels = function () {
      var selected = [];
      _collection.models.forEach(function (model) {
        if (model.selectable && model.selectable.isSelected()) {
          selected.push(model);
        }
      });
      return selected;
    };
  
    this.getDisabledModels = function () {
      var disabled = [];
      _collection.models.forEach(function (model) {
        if (model.selectable && model.selectable.isDisabled()) {
          disabled.push(model);
        }
      });
      return disabled;
    };
  
    this.allModelsSelected = function () {
      var disabledModelsAmount = this.getDisabledModels().length;
      return this.getSelectedModels().length === _collection.length - disabledModelsAmount;
    };
  
    this.allModelsDisabled = function () {
      var allDisabled = true;
      _collection.models.forEach(function (model) {
        if (model.selectable && allDisabled) {
          allDisabled = model.selectable.isDisabled();
        }
      });
      return allDisabled;
    };
  
    this.toggleSelectAllModels = function () {
      if (this.allModelsSelected()) {
        this.unSelectAllModels();
      } else {
        this.selectAllModels();
      }
    };
  
    this.selectAllModels = function () {
      _collection.models.forEach(function (model) {
        if (model.selectable) {
          model.selectable.select();
        }
      });
    };
  
    this.unSelectAllModels = function () {
      this.getSelectedModels().forEach(function (model) {
        if (model.selectable) {
          model.selectable.unSelect();
        }
      });
    };
  
    this.isRadio = function () {
      return _radio;
    };
  
    (function _main () {
      if (!_collection instanceof Backbone.Collection) {
        throw new Error('First parameter has to be the instance of a collection');
      }
    }());
  
  };
  /*jshint unused:false */
  var ModelSelectable = function (modelInstance, options) {
  
    var _model = modelInstance,
        _selected = options.selected || false;
  
    this.isDisabled = function () {
      if (options.isDisabled) {
        return options.isDisabled.apply(modelInstance, arguments);
      }
      return false;
    };
  
    this.isSelected = function () {
      return _selected;
    };
  
    this.select = function () {
      if (!this.isDisabled()) {
        if (_model.collection && _model.collection.selectable.isRadio()) {
          _model.collection.selectable.unSelectAllModels();
        }
        _selected = true;
      } else {
        _selected = false;
      }
    };
  
    this.unSelect = function () {
      _selected = false;
    };
  
    this.toggleSelect = function () {
      if (this.isSelected()) {
        this.unSelect();
      } else {
        this.select();
      }
    };
  
    (function _main () {
      if (!_model instanceof Backbone.Model) {
        throw new Error('First parameter has to be the instance of a collection');
      }
    }());
  };
  /*jshint unused:false */
  var ModelSelectable = ModelSelectable || {},
      CollectionSelectable = CollectionSelectable || {};
  
  var SelectableFactory = function (instance, options) {
    if (instance instanceof Backbone.Model) {
      return new ModelSelectable(instance, options);
    } else if (instance instanceof Backbone.Collection) {
      return new CollectionSelectable(instance, options);
    }
  };

  // INCLUDE mCAP PUBLIC VARS HERE
  var SelectableFactory = SelectableFactory || {};
  
  var Model = Backbone.Model.extend({
  
    idAttribute: 'uuid',
    // default the model is selectable - set to false to turn selectable off
    selectable: true,
    selectableOptions: {},
    queryParameter: null,
    constructor: function () {
      // When a model gets removed, make sure to decrement the total count on the collection
      this.on('destroy', function () {
        if (this.collection && this.collection.filterable && this.collection.filterable.getTotalAmount() > 0) {
          this.collection.filterable.setTotalAmount(this.collection.filterable.getTotalAmount() - 1);
        }
      }, this);
  
      if (this.selectable) {
        this.selectable = new SelectableFactory(this,  _.result(this,'selectableOptions'));
      }
  
      if (typeof this.endpoint === 'string') {
        this.setEndpoint(this.endpoint);
      }
  
      // apply scope to _markToRevert
      _.bindAll(this, '_markToRevert', 'revert');
      // send the attributes or empty object
      this._markToRevert(arguments[0] || {});
  
      return Backbone.Model.prototype.constructor.apply(this, arguments);
    },
  
    setQueryParameter: function(attr,value){
      this.queryParameter = this.queryParameter || {};
      if(typeof attr === 'string'){
        this.queryParameter[attr]=value;
      }
    },
  
    removeQueryParameter: function(attr){
      if(this.queryParameter && attr && this.queryParameter[attr]){
        delete this.queryParameter[attr];
      }
    },
  
    setEndpoint: function (endpoint) {
      this.urlRoot = function () {
        if (mCAP.application.get('baseUrl').slice(-1) === '/' && endpoint[0] === '/') {
          return mCAP.application.get('baseUrl') + endpoint.substr(1);
        } else if (mCAP.application.get('baseUrl').slice(-1) !== '/' && endpoint[0] !== '/') {
          return mCAP.application.get('baseUrl') + '/' + endpoint;
        }
        return mCAP.application.get('baseUrl') + endpoint;
      };
    },
  
    parse: function (response) {
      // For standalone models, parse the response
      if (response && response.data && response.data.results && response.data.results.length >= 0 && typeof response.data.results[0] !== 'undefined') {
        return response.data.results[0];
        // If Model is embedded in collection, it's already parsed correctly
      } else {
        return response;
      }
    },
  
    url: function(){
      var url = Backbone.Model.prototype.url.apply(this,arguments);
      if(this.queryParameter){
        url+='?'+Backbone.$.param(this.queryParameter);
      }
      return url;
    },
  
    /**
     * Initialize the Backbone extended object
     * @returns {*}
     */
    initialize: function () {
      // DO NOT IMPLEMENT CODE HERE! THE USER SHOULDN'T CALL SUPER IN HIS OWN IMPL.
      return Backbone.Model.prototype.initialize.apply(this, arguments);
    },
  
    /**
     * Reverts a model to the latest saved state
     * @example
     * var model = new mCAP.Model({
     *  name: 'Max'
     * });
     * model.set('name', 'Maximilian');
     * console.log(model.get('name')); // Maximilian
     * model.revert();
     * console.log(model.get('name')); // Max
     */
    revert: function () {
      if (this._revertAttributes) {
        this.attributes = JSON.parse(JSON.stringify(this._revertAttributes));
      }
    },
  
    /**
     * Store attributes to enable a revert - useful for cancel for example
     */
    _markToRevert: function (data) {
      this._revertAttributes = JSON.parse(JSON.stringify(data || this.attributes));
    },
  
    /**
     * Check if the model is still in sync with the last saved state.
     * @returns {Boolean|boolean}
     */
    isInSync: function () {
      return _.isEqual(this._revertAttributes, this.attributes);
    },
  
    /**
     * Save the model to the server
     * @param key
     * @param val
     * @param options
     * @returns {*}
     */
    save: function (key, val, options) {
      var args = this._save(key, val, options);
      return Backbone.Model.prototype.save.apply(this, args);
    },
  
    /**
     * Handle stuff for a save
     * @param key
     * @param val
     * @param options
     * @returns {Array}
     * @private
     */
    _save: function (key, val, options) {
      // prepare options
      if (key === null || typeof key === 'object') {
        options = val;
      }
      // make sure options are defined
      options = _.extend({validate: true}, options);
      // cache success
      var success = options.success;
      // cache model
      var model = this;
  
      // overwrite success
      options.success = function (resp) {
        model._markToRevert();
        // call cached success
        if (success) {
          success(model, resp, options);
        }
      };
  
      // make sure options are the correct paramater
      if (key === null || typeof key === 'object') {
        val = options;
      }
  
      return [key, val, options];
    },
  
    /**
     * Fetch the model to the server
     * @param options
     * @returns {*}
     */
    fetch: function (options) {
      // implement own fetch callback
      var args = this._fetch(options);
      return Backbone.Model.prototype.fetch.apply(this, args);
    },
  
    /**
     * Adds markToRevert to successful fetch
     * @param options
     * @returns {*[]}
     * @private
     */
    _fetch: function (options) {
      options = options || {};
      // cache success
      var success = options.success;
      // cache model
      var model = this;
  
      // overwrite success
      options.success = function (resp) {
        model._markToRevert();
        // call cached success
        if (typeof success === 'function') {
          success(model, resp, options);
        }
      };
      return [options];
    }
  
  });
  
  mCAP.Model = Model;
  var Filterable = Filterable || {},
    SelectableFactory = SelectableFactory || {};
  
  var Collection = Backbone.Collection.extend({
  
    selectable: true,
    filterable: true,
    filterableOptions: {},
    selectableOptions: {},
  
    model: mCAP.Model,
  
    constructor: function () {
      if (this.selectable) {
        this.selectable = new SelectableFactory(this,  _.result(this,'selectableOptions'));
      }
  
      if (this.filterable) {
        this.filterable = new Filterable(this, _.result(this,'filterableOptions'));
      }
  
      if (this.endpoint) {
        this.setEndpoint(this.endpoint);
      }
  
      return Backbone.Collection.prototype.constructor.apply(this, arguments);
    },
  
    setEndpoint: function (endpoint) {
      this.url = function(){
        return mCAP.application.get('baseUrl') + '/' + endpoint;
      };
    },
  
    parse: function (response) {
      response.data = response.data || {};
      if (this.filterable) {
        this.filterable.setTotalAmount(response.data.total || 0);
      }
      return response.data.results;
    },
  
    sync: function (method, model, options) {
      if (this.filterable) {
        var params = this.filterable.getRequestParams.apply(this.filterable, arguments);
        options = params;
      }
      return Backbone.Collection.prototype.sync.apply(this, [method, model, options]);
    }
  
  });
  
  mCAP.Collection = Collection;
  
  
  var Filter = function () {
    // If it is an invalid value return null otherwise the provided object
    var returnNullOrObjectFor = function (value, object) {
      return (_.isUndefined(value) || value === null || value === '') ? null : object;
    };
  
    // See https://wiki.mwaysolutions.com/confluence/display/mCAPTECH/mCAP+REST+API#mCAPRESTAPI-Filter
    // for more information about mCAP filter api
    return {
      containsString: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'containsString',
          fieldName: fieldName,
          contains: value
        });
      },
  
      and: function (filters) {
        return this.logOp(filters, 'AND');
      },
  
      nand: function (filters) {
        return this.logOp(filters, 'NAND');
      },
  
      or: function (filters) {
        return this.logOp(filters, 'OR');
      },
  
      logOp: function (filters, operator) {
        filters = _.without(filters, null); // Removing null values from existing filters
  
        return filters.length === 0 ? null : { // Ignore logOps with empty filters
          type: 'logOp',
          operation: operator,
          filters: filters
        };
      },
  
      boolean: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'boolean',
          fieldName: fieldName,
          value: value
        });
      },
  
      like: function (fieldName, value) {
        return returnNullOrObjectFor(value, {
          type: 'like',
          fieldName: fieldName,
          like: value
        });
      }
    };
  
  };
  
  mCAP.Filter = Filter;
  var Application = mCAP.Model.extend({
  
    defaults: {
      'baseUrl': ''
    }
  
  });
  
  mCAP.application = new Application();
  var Authentication = mCAP.Model.extend({
  
    defaults: {
      'username': '',
      'organization': '',
      'password': ''
    },
  
    endpoint: 'gofer/security/rest/auth/',
  
    login: function (options) {
      var that = this;
      if (typeof options === 'string') {
        this.set('password', options);
      } else if (typeof options === 'object') {
        this.set(options);
      }
  
      return this.sync('create', this, {
        url: this.url() + 'login'
      }).always(function () {
        if (typeof options === 'string') {
          that.set('password', '');
        }
      });
    },
  
    logout: function () {
      return this.sync('create', this, {
        url: this.url() + 'logout'
      }).always(function () {
  
      });
    },
  
    parse: function (data) {
      var attributes = {};
      if (data) {
        if (data.user) {
          attributes.user = new mCAP.User(data.user);
        }
      }
      return attributes;
    }
  
  });
  
  mCAP.authentication = new Authentication();
  
  var User = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/users',
  
    defaults: {
      'uuid': '',
      'name': '',
      'salutation': null,
      'givenName': '',
      'surname': '',
      'position': null,
      'email': '',
      'phone': null,
      'country': null,
      'lastLoggedTime': 0,
      'passwordExpires': null,
      'locked': false,
      'activated': true,
      'version': null,
      'aclEntries': [],
      'preferences': {},
      'groups': [],
      'roles': []
    },
  
    parse: function(resp){
      return resp.data || resp;
    }
  
  });
  
  mCAP.User = User;
  
  var Users = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/users',
  
    model: mCAP.User,
  
    parse: function(resp){
      return resp.data.items;
    },
  
    filterableOptions: function(){
      return {
        sortOrder:'+name',
        filterValues: {
          name: ''
        },
        filterDefinition: function () {
          var filter = new mCAP.Filter();
          return filter.and([
            filter.containsString('name', this.filterValues.name)
          ]);
        }
      };
    }
  
  });
  
  mCAP.Users = Users;
  
  var Group = mCAP.Model.extend({
  
    endpoint: 'gofer/security/rest/groups',
  
    defaults: {
      uuid: '',
      name: '',
      organizationUuid: '',
      description: null,
      roles: [],
      members: [],
      aclEntries: [],
      effectivePermissions: '',
      sysRoles: [],
      systemPermission: false,
      bundle: null
    },
  
    parse: function (resp) {
      return resp.data || resp;
    }
  
  });
  
  mCAP.Group = Group;
  
  var Groups = mCAP.Collection.extend({
  
    endpoint: 'gofer/security/rest/groups',
  
    model: mCAP.Group,
  
    parse: function (resp) {
      return resp.data.items;
    },
  
    filterableOptions: function () {
      return {
        sortOrder: '+name',
        filterValues: {
          name: '',
          systemPermission: true
        },
        filterDefinition: function () {
          var filter = new mCAP.Filter();
  
          var filters = [
            filter.containsString('name', this.filterValues.name)
          ];
  
          if (this.filterValues.systemPermission !== true) {
            filters.push(filter.boolean('systemPermission', this.filterValues.systemPermission));
          }
          return filter.and(filters);
        }
      };
    }
  
  });
  
  mCAP.Groups = Groups;
  

  root.mCAP = mCAP;

}(this, Backbone, $, _));
