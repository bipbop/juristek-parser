const formatMap = {
  d: 'DD',
  D: 'ddd',
  j: 'D',
  l: 'dddd',
  N: 'E',
  S() {
    return `[${this.format('Do').replace(/\d*/g, '')}]`;
  },
  w: 'd',
  z() {
    return this.format('DDD') - 1;
  },
  W: 'W',
  F: 'MMMM',
  m: 'MM',
  M: 'MMM',
  n: 'M',
  t() {
    return this.daysInMonth();
  },
  L() {
    return this.isLeapYear() ? 1 : 0;
  },
  o: 'GGGG',
  Y: 'YYYY',
  y: 'YY',
  a: 'a',
  A: 'A',
  B(moment) {
    const thisUTC = moment.clone().utc();
    const swatch = ((thisUTC.hours() + 1) % 24) + (thisUTC.minutes() / 60)
      + (thisUTC.seconds() / 3600);
    return Math.floor((swatch * 1000) / 24);
  },
  g: 'h',
  G: 'H',
  h: 'hh',
  H: 'HH',
  i: 'mm',
  s: 'ss',
  u: '[u]', // not sure if moment has this
  e: '[e]', // moment does not have this
  I(moment) {
    return moment.isDST() ? 1 : 0;
  },
  O: 'ZZ',
  P: 'Z',
  T: '[T]', // deprecated in moment
  Z(moment) {
    return parseInt(moment.format('ZZ'), 10) * 36;
  },
  c: 'YYYY-MM-DD[T]HH:mm:ssZ',
  r: 'ddd, DD MMM YYYY HH:mm:ss ZZ',
  U: 'X',
};

const formatEx = /[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g;

export default function phpMoment(format, moment) {
  return format.replace(formatEx, (phpStr) => (typeof formatMap[phpStr] === 'function' ? formatMap[phpStr](moment) : formatMap[phpStr]));
}
