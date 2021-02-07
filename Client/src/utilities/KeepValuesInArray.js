export default (arr, vals) => {
  const newArr = arr.filter(val => vals.indexOf(val) !== -1);

  return newArr;
};
