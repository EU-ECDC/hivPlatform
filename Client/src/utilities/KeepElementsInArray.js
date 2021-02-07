export default (arr, idxs) => {
  const newArr = arr.filter((value, index) => idxs.indexOf(index) !== -1);

  return newArr;
};
