import cheerio from 'cheerio';
import pickBy from 'lodash/pickBy';

import { Exception } from './exceptions';
import p from '../package.json';

export default class Parser {
  constructor(cherrioObject) {
    this.$ = cherrioObject;
  }

  assertDocument() {
    const exception = this.$('BPQL > header > exception');
    if (!exception.length) return;
    throw new Exception({
      message: exception.text(),
      source: exception.attr('source'),
      push: exception.attr('push') !== 'false',
      code: parseInt(exception.attr('code'), 10) || 0,
      log: exception.attr('log'),
    });
  }

  static openString(str, ParserClass = Parser) {
    return new ParserClass(cheerio.load(str, {
      normalizeWhitespace: true,
      xmlMode: true,
    }));
  }

  load() {
    this.assertDocument();
    return this.parse();
  }

  parse() {
    let dump = this.dump();
    if (Array.isArray(dump) || typeof dump !== 'object') dump = { response: dump };
    return Object.assign(dump, { _parserLoaded: new Date(), _parser: pickBy(p, 'version', 'name', 'repository') });
  }

  dump() {
    return this.$;
  }
}
