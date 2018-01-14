const exceptions = require('./exceptions');
const cheerio = require('cheerio');

module.exports = class Parser {
  constructor(cherrioObject, defaultErrorMessage = 'A classe de Parser não foi configurada') {
    this.$ = cherrioObject;
    this.defaultErrorMessage = defaultErrorMessage;
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
    return this.dump();
  }

  dump() {
    throw new exceptions.Parser(this.defaultErrorMessage);
  }
};
