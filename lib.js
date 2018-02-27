import 'babel-polyfill';

import Parser from './src/parser';
import Info from './src/info';
import OAB from './src/oab';
import Processos from './src/processos';
import ExceptionCodes, * as exceptions from './src/exceptions';
import CalculateCNJ from './src/calculate-cnj';
import WebService from './src/client/web-service';
import Push from './src/client/push';

Object.assign(Processos, {
  Processos,
  CalculateCNJ,
  exceptions: Object.assign(ExceptionCodes, exceptions),
  Parser,
  Info,
  OAB,
  WebService,
  Push,
});

export default Processos;
