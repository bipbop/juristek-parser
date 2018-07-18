import numeral from 'numeral';

numeral.register('locale', 'pt-br', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'mil',
    million: 'milhões',
    billion: 'b',
    trillion: 't',
  },
  ordinal() {
    return 'º';
  },
  currency: {
    symbol: 'R$',
  },
});

numeral.locale('pt-br');

export default numeral;
