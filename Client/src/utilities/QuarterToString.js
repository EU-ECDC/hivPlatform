import FloatToQuarter from './FloatToQuarter';

export default num => Math.floor(num) + 'Q' + FloatToQuarter(num);
