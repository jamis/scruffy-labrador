require['utility'] = function() {

  var PRNG = require('prng').PRNG;
  var generator = new PRNG();

  function srand(seed) {
    generator = new PRNG(seed);
    return seed;
  }

  function random(lo, hi) {
    if (!lo) {
      return generator.random();
    }

    if (!hi) {
      hi = lo;
      lo = 0;
    }

    return lo + generator.random(hi - lo);
  }

  function sample(list) {
    return list[random(list.length)];
  }

  function shuffle(list) {
    for(var i = 0; i < list.length-1; i++) {
      var j = random(i+1, list.length);
      var temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }

    return list;
  }

  function select(list, fn) {
    if (list.filter)
      return list.filter(fn);
    else {
      var newList = [];

      for(var i = 0; i < list.length; i++) {
        if (fn(list[i]))
          newList.push(list[i]);
      }

      return newList;
    }
  }

  function reject(list, fn) {
    return select(list, function(n) { return !fn(n); });
  }

  function each(list, fn) {
    for(var i = 0; i < list.length; i++) {
      if (fn(list[i]) == false) break;
    }

    return list;
  }

  function all(list, fn) {
    for(var i = 0; i < list.length; i++) {
      if (fn(list[i]) == false) return false;
    }

    return true;
  }

  return {
    all: all,
    each: each,
    srand: srand,
    random: random,
    reject: reject,
    sample: sample,
    select: select,
    shuffle: shuffle,

    prng: generator
  };

}
