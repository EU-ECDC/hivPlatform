import EnsureArray from './EnsureArray';

export default (pattern, obj) => {
  let indices = EnsureArray(obj).map(str => parseFloat(str.replace(pattern, '')));
  let lastId = Math.max(0, Math.max.apply(null, indices.filter(el => !isNaN(el))))
  let nextId = lastId + 1;
  return nextId;
};
