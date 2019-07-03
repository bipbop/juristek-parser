import numeral from 'numeral';

try {
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
} catch (e) {}

numeral.locale('pt-br');

export default numeral;
