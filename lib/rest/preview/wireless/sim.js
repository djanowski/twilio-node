'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../base/Page');
var UsageList = require('./sim/usage').UsageList;
var deserialize = require('../../../base/deserialize');
var values = require('../../../base/values');


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Wireless.SimList
 * @description Initialize the SimList
 *
 * @param {Twilio.Preview.Wireless} version - Version of the resource
 */
/* jshint ignore:end */
function SimList(version) {
  /* jshint ignore:start */
  /**
   * @function sims
   * @memberof Twilio.Preview.Wireless
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Preview.Wireless.SimContext}
   */
  /* jshint ignore:end */
  function SimListInstance(sid) {
    return SimListInstance.get(sid);
  }

  SimListInstance._version = version;
  // Path Solution
  SimListInstance._solution = {};
  SimListInstance._uri = _.template(
    '/Sims' // jshint ignore:line
  )(SimListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams SimInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Preview.Wireless.SimList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.status] - The status
   * @param {string} [opts.iccid] - The iccid
   * @param {string} [opts.ratePlan] - The rate_plan
   * @param {string} [opts.eId] - The e_id
   * @param {string} [opts.simRegistrationCode] - The sim_registration_code
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
  SimListInstance.each = function each(opts, callback) {
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
   * @description Lists SimInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Preview.Wireless.SimList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.status] - The status
   * @param {string} [opts.iccid] - The iccid
   * @param {string} [opts.ratePlan] - The rate_plan
   * @param {string} [opts.eId] - The e_id
   * @param {string} [opts.simRegistrationCode] - The sim_registration_code
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
  SimListInstance.list = function list(opts, callback) {
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
   * Retrieve a single page of SimInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Preview.Wireless.SimList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.status] - The status
   * @param {string} [opts.iccid] - The iccid
   * @param {string} [opts.ratePlan] - The rate_plan
   * @param {string} [opts.eId] - The e_id
   * @param {string} [opts.simRegistrationCode] - The sim_registration_code
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  SimListInstance.page = function page(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'Status': _.get(opts, "status", undefined),
      'Iccid': _.get(opts, "iccid", undefined),
      'RatePlan': _.get(opts, "ratePlan", undefined),
      'EId': _.get(opts, "eId", undefined),
      'SimRegistrationCode': _.get(opts, "simRegistrationCode", undefined),
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
      deferred.resolve(new SimPage(
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
   * Constructs a sim
   *
   * @function get
   * @memberof Twilio.Preview.Wireless.SimList
   * @instance
   *
   * @param {string} sid - The sid
   *
   * @returns {Twilio.Preview.Wireless.SimContext}
   */
  /* jshint ignore:end */
  SimListInstance.get = function get(sid) {
    return new SimContext(
      this._version,
      sid
    );
  };

  return SimListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Wireless.SimPage
 * @augments Page
 * @description Initialize the SimPage
 *
 * @param {Twilio.Preview.Wireless} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns SimPage
 */
/* jshint ignore:end */
function SimPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
}

_.extend(SimPage.prototype, Page.prototype);
SimPage.prototype.constructor = SimPage;

/* jshint ignore:start */
/**
 * Build an instance of SimInstance
 *
 * @function getInstance
 * @memberof Twilio.Preview.Wireless.SimPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns SimInstance
 */
/* jshint ignore:end */
SimPage.prototype.getInstance = function getInstance(payload) {
  return new SimInstance(
    this._version,
    payload
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Wireless.SimInstance
 * @description Initialize the SimContext
 *
 * @property {string} sid - The sid
 * @property {string} uniqueName - The unique_name
 * @property {string} accountSid - The account_sid
 * @property {string} ratePlanSid - The rate_plan_sid
 * @property {string} friendlyName - The friendly_name
 * @property {string} iccid - The iccid
 * @property {string} eId - The e_id
 * @property {string} status - The status
 * @property {string} commandsCallbackUrl - The commands_callback_url
 * @property {string} commandsCallbackMethod - The commands_callback_method
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} url - The url
 * @property {string} links - The links
 *
 * @param {Twilio.Preview.Wireless} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid_like} sid - The sid
 */
/* jshint ignore:end */
function SimInstance(version, payload, sid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.uniqueName = payload.unique_name; // jshint ignore:line
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.ratePlanSid = payload.rate_plan_sid; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.iccid = payload.iccid; // jshint ignore:line
  this.eId = payload.e_id; // jshint ignore:line
  this.status = payload.status; // jshint ignore:line
  this.commandsCallbackUrl = payload.commands_callback_url; // jshint ignore:line
  this.commandsCallbackMethod = payload.commands_callback_method; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.url = payload.url; // jshint ignore:line
  this.links = payload.links; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    sid: sid || this.sid,
  };
}

Object.defineProperty(SimInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new SimContext(
        this._version,
        this._solution.sid
      );
    }

    return this._context;
  }
});

/* jshint ignore:start */
/**
 * fetch a SimInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Wireless.SimInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SimInstance
 */
/* jshint ignore:end */
SimInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * update a SimInstance
 *
 * @function update
 * @memberof Twilio.Preview.Wireless.SimInstance
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.uniqueName] - The unique_name
 * @param {string} [opts.callbackMethod] - The callback_method
 * @param {string} [opts.callbackUrl] - The callback_url
 * @param {string} [opts.friendlyName] - The friendly_name
 * @param {string} [opts.ratePlan] - The rate_plan
 * @param {string} [opts.status] - The status
 * @param {string} [opts.commandsCallbackMethod] - The commands_callback_method
 * @param {string} [opts.commandsCallbackUrl] - The commands_callback_url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SimInstance
 */
/* jshint ignore:end */
SimInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};

/* jshint ignore:start */
/**
 * Access the usage
 *
 * @function usage
 * @memberof Twilio.Preview.Wireless.SimInstance
 * @instance
 *
 * @returns {Twilio.Preview.Wireless.SimContext.UsageList}
 */
/* jshint ignore:end */
SimInstance.prototype.usage = function usage() {
  return this._proxy.usage;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Preview.Wireless.SimContext
 * @description Initialize the SimContext
 *
 * @property {Twilio.Preview.Wireless.SimContext.UsageList} usage - usage resource
 *
 * @param {Twilio.Preview.Wireless} version - Version of the resource
 * @param {sid_like} sid - The sid
 */
/* jshint ignore:end */
function SimContext(version, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    sid: sid,
  };
  this._uri = _.template(
    '/Sims/<%= sid %>' // jshint ignore:line
  )(this._solution);

  // Dependents
  this._usage = undefined;
}

/* jshint ignore:start */
/**
 * fetch a SimInstance
 *
 * @function fetch
 * @memberof Twilio.Preview.Wireless.SimContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SimInstance
 */
/* jshint ignore:end */
SimContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new SimInstance(
      this._version,
      payload,
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

/* jshint ignore:start */
/**
 * update a SimInstance
 *
 * @function update
 * @memberof Twilio.Preview.Wireless.SimContext
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.uniqueName] - The unique_name
 * @param {string} [opts.callbackMethod] - The callback_method
 * @param {string} [opts.callbackUrl] - The callback_url
 * @param {string} [opts.friendlyName] - The friendly_name
 * @param {string} [opts.ratePlan] - The rate_plan
 * @param {string} [opts.status] - The status
 * @param {string} [opts.commandsCallbackMethod] - The commands_callback_method
 * @param {string} [opts.commandsCallbackUrl] - The commands_callback_url
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed SimInstance
 */
/* jshint ignore:end */
SimContext.prototype.update = function update(opts, callback) {
  if (_.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var deferred = Q.defer();
  var data = values.of({
    'UniqueName': _.get(opts, "uniqueName", undefined),
    'CallbackMethod': _.get(opts, "callbackMethod", undefined),
    'CallbackUrl': _.get(opts, "callbackUrl", undefined),
    'FriendlyName': _.get(opts, "friendlyName", undefined),
    'RatePlan': _.get(opts, "ratePlan", undefined),
    'Status': _.get(opts, "status", undefined),
    'CommandsCallbackMethod': _.get(opts, "commandsCallbackMethod", undefined),
    'CommandsCallbackUrl': _.get(opts, "commandsCallbackUrl", undefined)
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new SimInstance(
      this._version,
      payload,
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

Object.defineProperty(SimContext.prototype,
  'usage', {
  get: function() {
    if (!this._usage) {
      this._usage = new UsageList(
        this._version,
        this._solution.sid
      );
    }
    return this._usage;
  }
});

module.exports = {
  SimList: SimList,
  SimPage: SimPage,
  SimInstance: SimInstance,
  SimContext: SimContext
};