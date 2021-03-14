import IsNull from './IsNull';

export default (num, decimals = 2) => {
  if (IsNull(num)) return '';
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2
  });
};
