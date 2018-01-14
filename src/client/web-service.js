const request = require('request-promise');
const querystring = require('querystring');
const Promise = require('bluebird');
const Parser = require('../parser');

const FREE_APIKEY = '6057b71263c21e4ada266c9d4d4da613';

const DEFAULT_ENDPOINT = {
  protocol: 'https:',
  host: 'irql.bipbop.com.br',
  hostname: 'irql.bipbop.com.br',
};

module.exports = class BIPBOPWebService {
  constructor(apiKey = FREE_APIKEY) {
    this.apiKey = apiKey;
  }

  request(q, requestOptions = {}, urlParameters = {}, endpoint = {}, UseParser = Parser) {
    this.fuck = 1;
    return request(Object.assign({
      method: 'POST',
    }, requestOptions, {
      url: Object.assign({
        query: querystring.stringify(Object.assign({}, urlParameters, {
          q,
          apiKey: this.apiKey,
        })),
      }),
    }, endpoint, DEFAULT_ENDPOINT)).then(r => new UseParser(r));
  }
};
