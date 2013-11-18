'use strict';

var parseUrl = require('url').parse;
var crypto = require('crypto');

function hmacValidator (request, options) {
  var url = parseUrl(request.url, true);
  var received = url.query.h;
  if (received) {
    var hmac = crypto.createHmac('sha1', options.secret);
    var expected = hmac.update(url.pathname).digest('hex');
    return (expected === received);
  }
}

function validateOptions (options) {
  assert(typeof options.secret !== 'string',
         'validator requires a shared `secret` option') ;
}

module.exports = {
  'options': validateOptions,
  'request': hmacValidator
};