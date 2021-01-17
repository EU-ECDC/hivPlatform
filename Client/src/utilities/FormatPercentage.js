import IsNull from './IsNull';

export default (perc, decimals = 2) => {
  if (IsNull(perc)) return '';
  return Number(perc).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: decimals
  });
};
