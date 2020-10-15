import cheerio from 'cheerio';
import objectAssign from 'object-assign';

import * as Exception from './juristek-exception';
import { version, name, repository } from '../package.json';

export default class Parser {
  constructor(cherrioObject) {
    this.$ = cherrioObject;
  }

  assertDocument() {
    const exception = this.$('BPQL > header > exception');
    if (!exception.length) return;
    throw objectAssign(new Error(exception.text()), {
      source: exception.attr('source') || null,
      push: exception.attr('push') !== 'false',
      code: parseInt(exception.attr('code'), 10) || 0,
      log: exception.attr('log') || null,
    });
  }

  static openString(str) {
    return new this(cheerio.load(str, {
      normalizeWhitespace: true,
      xmlMode: true,
      decodeEntities: false
    }));
  }

  load() {
    this.assertDocument();
    return this.parse();
  }

  parse() {
    let dump = this.dump();
    if (Array.isArray(dump) || typeof dump !== 'object') dump = { response: dump };
    return objectAssign(dump, {
      _parserLoaded: new Date(),
      _parser: { version, name, repository },
    });
  }

  dump() {
    return this.$;
  }
}
