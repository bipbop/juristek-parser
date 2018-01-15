const request = require('request-promise');
const querystring = require('querystring');
const Promise = require('bluebird');
const Parser = require('../parser');

const FREE_APIKEY = '6057b71263c21e4ada266c9d4d4da613';

const DEFAULT_ENDPOINT = {
  protocol: 'https:',
  host: 'irql.bipbop.com.br',
  hostname: 'irql.bipbop.com.br',
  pathname: '/',
};

module.exports = class BIPBOPWebService {
  constructor(apiKey = FREE_APIKEY) {
    this.apiKey = apiKey;
  }

  default(defaultParser = null, ...args) {
    return this.request(...args)
      .then(data => Parser.openString(data, defaultParser || Parser))
      .then(parser => parser.load());
  }

  request(q, form = {}, options = {}, urlParameters = {}, endpoint = {}) {
    const urlData = Object.assign({
      query: querystring.stringify(Object.assign({}, urlParameters, {
        q,
        apiKey: this.apiKey,
      })),
    }, endpoint, DEFAULT_ENDPOINT);

    urlData.search = `?${urlData.query}`;

    const requestOptions = Object.assign({
      method: 'POST',
      form,
    }, options, {
      url: urlData,
    });

    return Promise.resolve()
      .then(() => request(requestOptions))
      .catch((e) => {
        if (e && e.response && e.response.body) Parser.openString(e.response.body).assertDocument();
        throw e;
      });
  }
};
