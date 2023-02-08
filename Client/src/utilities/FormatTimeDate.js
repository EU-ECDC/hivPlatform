import PadWithZero from "./PadWithZero";

export default (timeDate, formatString = 'dd/mm/yyyy') => {
  var day = timeDate.getDate(),
    month = timeDate.getMonth(),
    year = timeDate.getFullYear(),
    hour = timeDate.getHours(),
    minute = timeDate.getMinutes(),
    second = timeDate.getSeconds(),
    miliseconds = timeDate.getMilliseconds(),
    hh = PadWithZero(hour),
    mm = PadWithZero(minute),
    ss = PadWithZero(second),
    dd = PadWithZero(day),
    M = month + 1,
    MM = PadWithZero(M),
    yyyy = year + "",
    yy = yyyy.substring(2, 2)
    ;
  return formatString
    .replace('hh', hh).replace('h', hour)
    .replace('mm', mm).replace('m', minute)
    .replace('ss', ss).replace('s', second)
    .replace('S', miliseconds)
    .replace('dd', dd).replace('d', day)
    .replace('MM', MM).replace('M', M)
    .replace('yyyy', yyyy)
    .replace('yy', yy)
    ;
}
