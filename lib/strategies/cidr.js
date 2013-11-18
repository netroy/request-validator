'use strict';

var assert = require('assert');
var cidr = require('cidr_match').cidr_match;

function cidrValidator (request, options) {
  var headers = request.headers;
  var connection = request.connection;
  var remoteIP = headers['x-forwarded-for'] || connection.remoteAddress;
  var whitelist = options.whitelist;

  return whitelist.some(function (range) {
    return cidr(remoteIP, range);
  });
}

var ip4CIDRRegexp = /^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\/(\d|[1-2]\d|3[0-2]))?$/;
function validateOptions (options) {
  var whitelist = options.whitelist;
  assert(whitelist instanceof Array,
        'validator requires a `whitelist` option');
  assert(whitelist.length > 0);
  whitelist.forEach(function (range) {
    assert(typeof range === 'string');
    assert(ip4CIDRRegexp.test(range));
  });
}

module.exports = {
  'options': validateOptions,
  'request': cidrValidator
};