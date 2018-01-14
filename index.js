const Parser = require('./src/parser');
const Processos = require('./src/processos');
const Exceptions = require('./src/exceptions');
const CalculateCNJ = require('./src/calculate-cnj');

module.exports = Processos;
module.exports.CalculateCNJ = CalculateCNJ;
module.exports.exceptions = Exceptions;
module.exports.Parser = Parser;
