
import Parser from './parser';
import Processo from './processo';

export default class Processos extends Parser {
  dump() {
    const $ = super.dump();
    return $('body > processo').map((i, p) => new Processo(p, $).parse()).get();
  }
}
