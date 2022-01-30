import IsNull from './IsNull';

export default (val, decimals = 2) => {
  if (IsNull(val)) return '';
  if (isNaN(val)) return val;
  const exponent = Math.pow(10, decimals);
  const finalVal = Math.round((val + Number.EPSILON)* exponent) / exponent;
  return Number(finalVal).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
