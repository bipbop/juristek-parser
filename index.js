import "babel-polyfill";

import Parser from './src/parser';
import Info from './src/info';
import OAB from './src/oab';
import Processos from './src/processos';
import Exceptions from './src/exceptions';
import CalculateCNJ from './src/calculate-cnj';
import WebService from './src/client/web-service';
import Push from './src/client/push';

Object.assign(Processos, {
  Processos,
  CalculateCNJ,
  exceptions: Exceptions,
  Parser,
  Info,
  OAB,
  WebService,
  Push,
});

export default Processos;
