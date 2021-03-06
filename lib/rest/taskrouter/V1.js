'use strict';

var _ = require('lodash');  /* jshint ignore:line */
var Version = require('../../base/Version');  /* jshint ignore:line */
var WorkspaceList = require('./v1/workspace').WorkspaceList;


/* jshint ignore:start */
/**
 * Initialize the V1 version of Taskrouter
 *
 * @constructor Twilio.Taskrouter.V1
 *
 * @property {Twilio.Taskrouter.V1.WorkspaceList} workspaces - workspaces resource
 *
 * @param {Twilio.Taskrouter} domain - The twilio domain
 */
/* jshint ignore:end */
function V1(domain) {
  Version.prototype.constructor.call(this, domain, 'v1');

  // Resources
  this._workspaces = undefined;
}

_.extend(V1.prototype, Version.prototype);
V1.prototype.constructor = V1;

Object.defineProperty(V1.prototype,
  'workspaces', {
  get: function() {
    this._workspaces = this._workspaces || new WorkspaceList(this);
    return this._workspaces;
  }
});

module.exports = V1;
