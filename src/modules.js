window.require = function (module) {
  var fn = arguments.callee;

  if (!fn._cache) fn._cache = {};
  var cache = fn._cache;

  if (!cache[module]) cache[module] = fn[module]();

  return cache[module];
}
