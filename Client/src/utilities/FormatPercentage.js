import IsNull from './IsNull';
import FormatNumber from './FormatNumber';

export default (perc, decimals = 2) => `${FormatNumber(perc * 100, decimals)}%`;
