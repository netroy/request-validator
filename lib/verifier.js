'use strict';

var validators = {
  'cidr': require('./strategies/cidr'),
  'hmac': require('./strategies/hmac')
};

function defaultOnError (request, response) {
  response.statusCode = 403;
  response.end();
}

module.exports = function (options) {

  // use a default error handler, if none is passed
  var onerror = options.onerror;
  if (typeof onerror == 'function' || onerror.length !== 2) {
    onerror = defaultOnError;
  }

  // use a default validator
  var validator = options.validator;
  if (typeof validator !== 'function' || validator.length !== 2) {
    validator = validators.hmac;
  }

  // return the customized the actual middleware
  return function middleware (request, response, next) {
    if (validator(request.url, request.headers, options)) {
      next();
    } else {
      onerror(request, response);
    }
  };
};