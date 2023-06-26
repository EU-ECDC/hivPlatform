import EnsureArray from './EnsureArray';
import IsNull from './IsNull';

export default (arr, idxs) => {
  idxs = EnsureArray(idxs);
  let newArr = arr.filter((value, index) => idxs.indexOf(index) === -1);
  if (IsNull(newArr)) {
    newArr = [];
  }

  console.log(newArr);

  return newArr;
};
