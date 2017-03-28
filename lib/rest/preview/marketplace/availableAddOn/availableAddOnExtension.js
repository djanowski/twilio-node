'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var values = require('../../../../base/values');


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionList
 * @description Initialize the AvailableAddOnExtensionList
 *
 * @param {Twilio.Preview.Marketplace} version - Version of the resource
 * @param {string} availableAddOnSid - The available_add_on_sid
 */
/* jshint ignore:end */
function AvailableAddOnExtensionList(version, availableAddOnSid) {
  /* jshint ignore:start */
  /**
   * @function extensions
   * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionContext}
   */
  /* jshint ignore:end */
  function AvailableAddOnExtensionListInstance(sid) {
    return AvailableAddOnExtensionListInstance.get(sid);
  }

  AvailableAddOnExtensionListInstance._version = version;
  // Path Solution
  AvailableAddOnExtensionListInstance._solution = {
    availableAddOnSid: availableAddOnSid
  };
  AvailableAddOnExtensionListInstance._uri = _.template(
    '/AvailableAddOns/<%= availableAddOnSid %>/Extensions' // jshint ignore:line
  )(AvailableAddOnExtensionListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams AvailableAddOnExtensionInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  AvailableAddOnExtensionListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /* jshint ignore:start */
  /**
   * @description Lists AvailableAddOnExtensionInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  AvailableAddOnExtensionListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of AvailableAddOnExtensionInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  AvailableAddOnExtensionListInstance.page = function page(opts, callback) {
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new AvailableAddOnExtensionPage(
        this._version,
        payload,
        this._solution
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Constructs a available_add_on_extension
   *
   * @function get
   * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionList
   * @instance
   *
   * @param {string} sid - The unique Extension Sid
   *
   * @returns {Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionContext}
   */
  /* jshint ignore:end */
  AvailableAddOnExtensionListInstance.get = function get(sid) {
    return new AvailableAddOnExtensionContext(
      this._version,
      this._solution.availableAddOnSid,
      sid
    );
  };

  return AvailableAddOnExtensionListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionPage
 * @augments Page
 * @description Initialize the AvailableAddOnExtensionPage
 *
 * @param {Twilio.Preview.Marketplace} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns AvailableAddOnExtensionPage
 */
/* jshint ignore:end */
function AvailableAddOnExtensionPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
}

_.extend(AvailableAddOnExtensionPage.prototype, Page.prototype);
AvailableAddOnExtensionPage.prototype.constructor = AvailableAddOnExtensionPage;

/* jshint ignore:start */
/**
 * Build an instance of AvailableAddOnExtensionInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns AvailableAddOnExtensionInstance
 */
/* jshint ignore:end */
AvailableAddOnExtensionPage.prototype.getInstance = function
    getInstance(payload) {
  return new AvailableAddOnExtensionInstance(
    this._version,
    payload,
    this._solution.availableAddOnSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionInstance
 * @description Initialize the AvailableAddOnExtensionContext
 *
 * @property {string} sid - A string that uniquely identifies this Extension
 * @property {string} availableAddOnSid - The available_add_on_sid
 * @property {string} friendlyName - A human-readable description of this Extension
 * @property {string} productName -
 *          A human-readable description of the Extension's Product
 * @property {string} uniqueName -
 *          The string that uniquely identifies this Extension
 * @property {string} url - The url
 *
 * @param {Twilio.Preview.Marketplace} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} availableAddOnSid - The available_add_on_sid
 * @param {sid} sid - The unique Extension Sid
 */
/* jshint ignore:end */
function AvailableAddOnExtensionInstance(version, payload, availableAddOnSid,
                                          sid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.availableAddOnSid = payload.available_add_on_sid; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.productName = payload.product_name; // jshint ignore:line
  this.uniqueName = payload.unique_name; // jshint ignore:line
  this.url = payload.url; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    availableAddOnSid: availableAddOnSid,
    sid: sid || this.sid,
  };
}

Object.defineProperty(AvailableAddOnExtensionInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new AvailableAddOnExtensionContext(
        this._version,
        this._solution.availableAddOnSid,
        this._solution.sid
      );
    }

    return this._context;
  }
});

/* jshint ignore:start */
/**
 * fetch a AvailableAddOnExtensionInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed AvailableAddOnExtensionInstance
 */
/* jshint ignore:end */
AvailableAddOnExtensionInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionContext
 * @description Initialize the AvailableAddOnExtensionContext
 *
 * @param {Twilio.Preview.Marketplace} version - Version of the resource
 * @param {sid} availableAddOnSid - The available_add_on_sid
 * @param {sid} sid - The unique Extension Sid
 */
/* jshint ignore:end */
function AvailableAddOnExtensionContext(version, availableAddOnSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    availableAddOnSid: availableAddOnSid,
    sid: sid,
  };
  this._uri = _.template(
    '/AvailableAddOns/<%= availableAddOnSid %>/Extensions/<%= sid %>' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a AvailableAddOnExtensionInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Marketplace.AvailableAddOnContext.AvailableAddOnExtensionContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed AvailableAddOnExtensionInstance
 */
/* jshint ignore:end */
AvailableAddOnExtensionContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new AvailableAddOnExtensionInstance(
      this._version,
      payload,
      this._solution.availableAddOnSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  AvailableAddOnExtensionList: AvailableAddOnExtensionList,
  AvailableAddOnExtensionPage: AvailableAddOnExtensionPage,
  AvailableAddOnExtensionInstance: AvailableAddOnExtensionInstance,
  AvailableAddOnExtensionContext: AvailableAddOnExtensionContext
};