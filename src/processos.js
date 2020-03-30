
import Parser from './parser';
import Processo from './processo';

export default class Processos extends Parser {
  dump() {
    const $ = super.dump();
    return $('body > processo').map((_, p) => new Processo(p, $).parse()).get();
  }
}
