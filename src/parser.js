const exceptions = require('./exceptions');
const cheerio = require('cheerio');
const p = require('../package.json');
const _ = require('underscore');

module.exports = class Parser {
  constructor(cherrioObject) {
    this.$ = cherrioObject;
  }

  assertDocument() {
    const exception = this.$('BPQL > header > exception');
    if (!exception.length) return;
    throw new exceptions.Exception({
      message: exception.text(),
      source: exception.attr('source'),
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
    return Object.assign(this.dump(), { _parserLoaded: new Date(), _parser: _.pick(p, 'version', 'name', 'repository') });
  }

  dump() {
    return this.$;
  }
};
