'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');


/* jshint ignore:start */
/**
 * @constructor Twilio.Accounts.V1.CredentialContext.PublicKeyList
 * @description Initialize the PublicKeyList
 *
 * @param {Twilio.Accounts.V1} version - Version of the resource
 */
/* jshint ignore:end */
function PublicKeyList(version) {
  /* jshint ignore:start */
  /**
   * @function publicKey
   * @memberof Twilio.Accounts.V1.CredentialContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Accounts.V1.CredentialContext.PublicKeyContext}
   */
  /* jshint ignore:end */
  function PublicKeyListInstance(sid) {
    return PublicKeyListInstance.get(sid);
  }

  PublicKeyListInstance._version = version;
  // Path Solution
  PublicKeyListInstance._solution = {};
  PublicKeyListInstance._uri = _.template(
    '/Credentials/PublicKeys' // jshint ignore:line
  )(PublicKeyListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams PublicKeyInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyList
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
  PublicKeyListInstance.each = function each(opts, callback) {
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
   * @description Lists PublicKeyInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyList
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
  PublicKeyListInstance.list = function list(opts, callback) {
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
   * Retrieve a single page of PublicKeyInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyList
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
  PublicKeyListInstance.page = function page(opts, callback) {
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
      deferred.resolve(new PublicKeyPage(
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
   * create a PublicKeyInstance
   *
   * @function create
   * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.publicKey - URL encoded representation of the public key
   * @param {string} [opts.friendlyName] -
   *          A human readable description of this resource
   * @param {string} [opts.accountSid] -
   *          The Subaccount this Credential should be associated with.
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed PublicKeyInstance
   */
  /* jshint ignore:end */
  PublicKeyListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.publicKey)) {
      throw new Error('Required parameter "opts.publicKey" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'PublicKey': _.get(opts, "publicKey", undefined),
      'FriendlyName': _.get(opts, "friendlyName", undefined),
      'AccountSid': _.get(opts, "accountSid", undefined)
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new PublicKeyInstance(
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
   * Constructs a public_key
   *
   * @function get
   * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyList
   * @instance
   *
   * @param {string} sid - Fetch by unique Credential Sid
   *
   * @returns {Twilio.Accounts.V1.CredentialContext.PublicKeyContext}
   */
  /* jshint ignore:end */
  PublicKeyListInstance.get = function get(sid) {
    return new PublicKeyContext(
      this._version,
      sid
    );
  };

  return PublicKeyListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Accounts.V1.CredentialContext.PublicKeyPage
 * @augments Page
 * @description Initialize the PublicKeyPage
 *
 * @param {Twilio.Accounts.V1} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns PublicKeyPage
 */
/* jshint ignore:end */
function PublicKeyPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
}

_.extend(PublicKeyPage.prototype, Page.prototype);
PublicKeyPage.prototype.constructor = PublicKeyPage;

/* jshint ignore:start */
/**
 * Build an instance of PublicKeyInstance
 *
 * @function getInstance
 * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns PublicKeyInstance
 */
/* jshint ignore:end */
PublicKeyPage.prototype.getInstance = function getInstance(payload) {
  return new PublicKeyInstance(
    this._version,
    payload
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Accounts.V1.CredentialContext.PublicKeyInstance
 * @description Initialize the PublicKeyContext
 *
 * @property {string} sid -
 *          A 34 character string that uniquely identifies this resource.
 * @property {string} accountSid - AccountSid the Credential resource belongs to
 * @property {string} friendlyName - A human readable description of this resource
 * @property {Date} dateCreated - The date this resource was created
 * @property {Date} dateUpdated - The date this resource was last updated
 * @property {string} url -
 *          The URI for this resource, relative to `https://accounts.twilio.com`
 *
 * @param {Twilio.Accounts.V1} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} sid - Fetch by unique Credential Sid
 */
/* jshint ignore:end */
function PublicKeyInstance(version, payload, sid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.url = payload.url; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    sid: sid || this.sid,
  };
}

Object.defineProperty(PublicKeyInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new PublicKeyContext(
        this._version,
        this._solution.sid
      );
    }

    return this._context;
  }
});

/* jshint ignore:start */
/**
 * fetch a PublicKeyInstance
 *
 * @function fetch
 * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PublicKeyInstance
 */
/* jshint ignore:end */
PublicKeyInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * update a PublicKeyInstance
 *
 * @function update
 * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyInstance
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.friendlyName] -
 *          A human readable description of this resource
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PublicKeyInstance
 */
/* jshint ignore:end */
PublicKeyInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};

/* jshint ignore:start */
/**
 * remove a PublicKeyInstance
 *
 * @function remove
 * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PublicKeyInstance
 */
/* jshint ignore:end */
PublicKeyInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Accounts.V1.CredentialContext.PublicKeyContext
 * @description Initialize the PublicKeyContext
 *
 * @param {Twilio.Accounts.V1} version - Version of the resource
 * @param {sid} sid - Fetch by unique Credential Sid
 */
/* jshint ignore:end */
function PublicKeyContext(version, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    sid: sid,
  };
  this._uri = _.template(
    '/Credentials/PublicKeys/<%= sid %>' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a PublicKeyInstance
 *
 * @function fetch
 * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PublicKeyInstance
 */
/* jshint ignore:end */
PublicKeyContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new PublicKeyInstance(
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
 * update a PublicKeyInstance
 *
 * @function update
 * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyContext
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.friendlyName] -
 *          A human readable description of this resource
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PublicKeyInstance
 */
/* jshint ignore:end */
PublicKeyContext.prototype.update = function update(opts, callback) {
  if (_.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var deferred = Q.defer();
  var data = values.of({
    'FriendlyName': _.get(opts, "friendlyName", undefined)
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new PublicKeyInstance(
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
 * remove a PublicKeyInstance
 *
 * @function remove
 * @memberof Twilio.Accounts.V1.CredentialContext.PublicKeyContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PublicKeyInstance
 */
/* jshint ignore:end */
PublicKeyContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
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
  PublicKeyList: PublicKeyList,
  PublicKeyPage: PublicKeyPage,
  PublicKeyInstance: PublicKeyInstance,
  PublicKeyContext: PublicKeyContext
};