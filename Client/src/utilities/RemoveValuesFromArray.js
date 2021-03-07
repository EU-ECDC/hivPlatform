import EnsureArray from './EnsureArray';

export default (arr, vals) => {
  vals = EnsureArray(vals);
  const newArr = arr.filter(val => vals.indexOf(val) === -1);

  return newArr;
};
