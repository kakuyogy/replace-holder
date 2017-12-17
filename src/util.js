const _typeof = function(o, type) {
  return typeof o === type;
};

const _toString = function(o) {
  return toString.call(o);
};

export const is = {
  undef: o => _typeof(o, 'undefined'),
  string: s => _typeof(s, 'string'),
  number: n => _typeof(n, 'number'),
  function: f => _typeof(f, 'function'),
  array: arr => _toString(arr) === '[object Array]',
  arraylike: arr => arr != null && typeof arr != 'function' && is.number(arr.length),
  object: obj => obj != null && !is.array(obj) && !is.arraylike(obj) && _typeof(obj, 'object'),
};