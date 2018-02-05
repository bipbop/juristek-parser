const Parser = require('./src/parser');
const Info = require('./src/info');
const OAB = require('./src/oab');
const Processos = require('./src/processos');
const Exceptions = require('./src/exceptions');
const CalculateCNJ = require('./src/calculate-cnj');
const WebService = require('./src/client/web-service');
const Push = require('./src/client/push');

module.exports = Processos;
module.exports.Processos = Processos;
module.exports.CalculateCNJ = CalculateCNJ;
module.exports.exceptions = Exceptions;
module.exports.Parser = Parser;
module.exports.Info = Info;
module.exports.OAB = OAB;
module.exports.WebService = WebService;
module.exports.WebService.Push = Push;
