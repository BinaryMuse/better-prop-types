var PropTypes = require('prop-types');

var betterPropTypes = function(spec) {
  return processSpec(spec);
}

Object.keys(PropTypes).forEach(function(key) {
  if (!PropTypes.hasOwnProperty(key)) {
    return;
  }

  Object.defineProperty(betterPropTypes, key, {
    get: function() {
      var proxy = {
        proxyFor: key,
        isRequired: true,
        args: null,
        optional: function() {
          proxy.isRequired = false;
        },
      }

      var func = function() {
        proxy.args = Array.prototype.slice.call(arguments);
      }

      Object.defineProperty(func, '__bpt_proxy', {value: proxy, writable: false, enumerable: false});
      Object.defineProperty(func, 'opt', {get: function() {
        proxy.optional();
        return func;
      }});
      return func;
    }
  })
})

betterPropTypes.opt = function(spec) {
  return betterPropTypes.shape(spec).opt;
}

function processSpec(spec) {
  Object.keys(spec).forEach(function(key) {
    var propType = spec[key];
    spec[key] = transformProxyArg(spec[key]);
  });

  return spec;
}

function transformProxy(proxy) {
  var proxied = PropTypes[proxy.proxyFor];
  if (proxy.args) {
    var transformedArgs = proxy.args.map(transformProxyArg);
    proxied = proxied.apply(null, transformedArgs);
  }
  return proxy.isRequired ? proxied.isRequired : proxied;
}

function transformProxyArg(arg) {
  if (arg.__bpt_proxy) {
    return transformProxy(arg.__bpt_proxy);
  } else if (typeof arg === 'object' && !Array.isArray(arg)) {
    var innerSpec = betterPropTypes(arg);
    return PropTypes.shape(innerSpec).isRequired;
  } else {
    return arg;
  }
}

module.exports = betterPropTypes;
