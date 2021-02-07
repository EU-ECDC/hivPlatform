import EnsureArray from './EnsureArray';

export default (arr, idxs) => {
  idxs = EnsureArray(idxs);
  const newArr = arr.filter((value, index) => idxs.indexOf(index) === -1);

  return newArr;
};
