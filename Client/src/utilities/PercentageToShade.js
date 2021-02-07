import HSLtoHEX from './HSLtoHEX';

export default (percent, hue) => HSLtoHEX(hue, 40 + percent * 60, 95 - percent * 40);
