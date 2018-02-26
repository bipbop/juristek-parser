'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopDefault(ex) {
  return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
}

require('babel-polyfill');
var cheerio = _interopDefault(require('cheerio'));
var _ = _interopDefault(require('lodash'));
var ExtendableError = _interopDefault(require('es6-error'));
var changeCase = _interopDefault(require('change-case'));
var numeral = _interopDefault(require('numeral'));
var moment = _interopDefault(require('moment'));
var iso7064 = _interopDefault(require('iso-7064'));
var pad = _interopDefault(require('pad'));
var _request = _interopDefault(require('request-promise'));
var querystring = _interopDefault(require('querystring'));
var Promise = _interopDefault(require('bluebird'));

var JuristekException = function (_ExtendableError) {
  _inherits(JuristekException, _ExtendableError);

  function JuristekException() {
    _classCallCheck(this, JuristekException);

    return _possibleConstructorReturn(this, (JuristekException.__proto__ || Object.getPrototypeOf(JuristekException)).apply(this, arguments));
  }

  return JuristekException;
}(ExtendableError); /* Erros de */


var errorCodes = {
  E_TABLE_NOT_FOUND: 1, // Tipo de consulta inexistente
  E_DATABASE_NOT_FOUND: 1, // Tribunal não suportado
  E_NOT_FOUND: 2, // Consulta não encontrada
  E_INVALID_ARGUMENT: 3, // Parâmetro de consulta inválido
  E_SYNTAX_ERROR: 3, // Erro de sintaxe
  E_MISSING_ARGUMENT: 4, // Parâmetro de consulta obrigatório inexistente
  E_MULTIPLE_RESULTS_FOUND: 5, // Consulta com múltiplos resultados
  E_BLOCKED_IP: 6, // IP do robô bloqueado
  E_UNEXPECTED_HTTP_CODE: 7, // Erro inesperado durante consulta ao site
  E_TIMEOUT: 7, // Ocorreu timeout durante a consulta
  E_LOAD_PAGE_FAILED: 7, // Erro de carregamento de página
  E_PROXY_CONFIGURATION_ERROR: 7, // Erro de configuração de proxy
  E_REMOTE_SITE_UNDER_MAINTENANCE: 8, // Site sob manutenção
  E_AUTHENTICATION_FAILURE: 9, // Erro ao logar no site
  E_INTERNAL_SERVER_ERROR: 11,
  E_INTERNAL_ERROR: 11, // Erro interno
  E_QUERY_LIMIT: 12, // Limite de consulta atingido
  E_PASSWORD_REQUIRED: 20, //
  E_JUSTICE_SECRET: 21,
  E_EXPECTED_DATA_NOT_FOUND: 24, // Erro durante a obtenção dos dados
  E_CAPTCHA_BREAK_FAILED: 25, // Não foi possível quebrar o captcha
  E_OUTDATED: 1522,
  E_ARCHIVED_PROCESS: 1522,
  E_WITHOUT_PROCEEDINGS: 1523, // Processos sem andamentos Office
  E_UNKNOWN: 0
};

var name = "juristek-parser";
var version = "1.1.2";
var description = "Parser de XML do BIPBOP Juristek para NodeJS.";
var main = "index.js";
var browser = "dist/browser.js";
var scripts = { "test": "echo \"Error: no test specified\" && exit 1" };
var repository = { "type": "git", "url": "https://github.com/bipbop/juristek-parser.git" };
var author = "";
var license = "ISC";
var bugs = { "url": "https://github.com/bipbop/juristek-parser/issues" };
var homepage = "https://github.com/bipbop/juristek-parser#readme";
var dependencies = { "@babel/register": "^7.0.0-beta.40", "babel-polyfill": "^6.26.0", "basic-logger": "^0.4.4", "bluebird": "^3.5.1", "body-parser": "^1.18.2", "change-case": "^3.0.1", "cheerio": "^1.0.0-rc.2", "es6-error": "^4.1.1", "express": "^4.16.2", "gulp-babel": "^7.0.1", "iso-7064": "^1.0.0", "lodash": "^4.17.5", "moment": "^2.20.1", "numeral": "^2.0.6", "pad": "^2.0.3", "request": "^2.83.0", "request-promise": "^4.2.2", "rollup-plugin-babel": "^3.0.3", "rollup-plugin-json": "^2.3.0", "rollup-plugin-multi-entry": "^2.0.2", "rollup-stream": "^1.24.1", "tinydb": "^0.1.0", "underscore": "^1.8.3" };
var devDependencies = { "babel-core": "^6.26.0", "babel-eslint": "^8.2.1", "babel-loader": "^7.1.2", "babel-plugin-external-helpers": "^6.22.0", "babel-preset-env": "^1.6.1", "babel-preset-stage-0": "^6.24.1", "babel-register": "^6.26.0", "babelify": "^8.0.0", "browserify": "^15.2.0", "eslint": "^4.15.0", "eslint-config-airbnb-base": "^12.1.0", "eslint-plugin-flowtype": "^2.41.0", "eslint-plugin-import": "^2.8.0", "gulp": "^3.9.1", "gulp-load-plugins": "^1.5.0", "gulp-uglyfly": "^1.4.2", "uglifyify": "^4.0.5", "vinyl-buffer": "^1.0.1", "vinyl-source-stream": "^2.0.0" };
var p = {
  name: name,
  version: version,
  description: description,
  main: main,
  browser: browser,
  scripts: scripts,
  repository: repository,
  author: author,
  license: license,
  bugs: bugs,
  homepage: homepage,
  dependencies: dependencies,
  devDependencies: devDependencies
};

var Parser = function () {
  function Parser(cherrioObject) {
    _classCallCheck(this, Parser);

    this.$ = cherrioObject;
  }

  _createClass(Parser, [{
    key: 'assertDocument',
    value: function assertDocument() {
      var exception = this.$('BPQL > header > exception');
      if (!exception.length) return;
      throw new JuristekException({
        message: exception.text(),
        source: exception.attr('source'),
        code: parseInt(exception.attr('code'), 10) || 0,
        log: exception.attr('log')
      });
    }
  }, {
    key: 'load',
    value: function load() {
      this.assertDocument();
      return this.parse();
    }
  }, {
    key: 'parse',
    value: function parse() {
      return Object.assign(this.dump(), { _parserLoaded: new Date(), _parser: _.pickBy(p, 'version', 'name', 'repository') });
    }
  }, {
    key: 'dump',
    value: function dump() {
      return this.$;
    }
  }], [{
    key: 'openString',
    value: function openString(str) {
      var ParserClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Parser;

      return new ParserClass(cheerio.load(str, {
        normalizeWhitespace: true,
        xmlMode: true
      }));
    }
  }]);

  return Parser;
}();

var Info = function (_Parser) {
  _inherits(Info, _Parser);

  function Info() {
    _classCallCheck(this, Info);

    return _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).apply(this, arguments));
  }

  _createClass(Info, [{
    key: 'dump',
    value: function dump() {
      var $ = this.$;

      return $('database').map(function (i, databaseNode) {
        return $('table', databaseNode).map(function (it, tableNode) {
          return {
            table: tableNode.attribs,
            database: databaseNode.attribs,
            fields: $('field', tableNode).map(function (fi, fieldNode) {
              return Object.assign(fieldNode.attribs, {
                options: $('option', fieldNode).map(function (oi, optionNode) {
                  return Object.assign(optionNode.attribs, {
                    text: $(optionNode).text()
                  });
                }).get(0)
              });
            }).get()
          };
        }).get();
      }).get();
    }
  }]);

  return Info;
}(Parser);

var formatMap = {
  d: 'DD',
  D: 'ddd',
  j: 'D',
  l: 'dddd',
  N: 'E',
  S: function S() {
    return '[' + this.format('Do').replace(/\d*/g, '') + ']';
  },

  w: 'd',
  z: function z() {
    return this.format('DDD') - 1;
  },

  W: 'W',
  F: 'MMMM',
  m: 'MM',
  M: 'MMM',
  n: 'M',
  t: function t() {
    return this.daysInMonth();
  },
  L: function L() {
    return this.isLeapYear() ? 1 : 0;
  },

  o: 'GGGG',
  Y: 'YYYY',
  y: 'YY',
  a: 'a',
  A: 'A',
  B: function B(moment$$1) {
    var thisUTC = moment$$1.clone().utc();
    var swatch = (thisUTC.hours() + 1) % 24 + thisUTC.minutes() / 60 + thisUTC.seconds() / 3600;
    return Math.floor(swatch * 1000 / 24);
  },

  g: 'h',
  G: 'H',
  h: 'hh',
  H: 'HH',
  i: 'mm',
  s: 'ss',
  u: '[u]', // not sure if moment has this
  e: '[e]', // moment does not have this
  I: function I(moment$$1) {
    return moment$$1.isDST() ? 1 : 0;
  },

  O: 'ZZ',
  P: 'Z',
  T: '[T]', // deprecated in moment
  Z: function Z(moment$$1) {
    return parseInt(moment$$1.format('ZZ'), 10) * 36;
  },

  c: 'YYYY-MM-DD[T]HH:mm:ssZ',
  r: 'ddd, DD MMM YYYY HH:mm:ss ZZ',
  U: 'X'
};

var formatEx = /[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g;

function phpMoment(format, moment$$1) {
  return format.replace(formatEx, function (phpStr) {
    return typeof formatMap[phpStr] === 'function' ? formatMap[phpStr](moment$$1) : formatMap[phpStr];
  });
}

var CalculateCNJError = function (_ExtendableError2) {
  _inherits(CalculateCNJError, _ExtendableError2);

  function CalculateCNJError() {
    _classCallCheck(this, CalculateCNJError);

    return _possibleConstructorReturn(this, (CalculateCNJError.__proto__ || Object.getPrototypeOf(CalculateCNJError)).apply(this, arguments));
  }

  return CalculateCNJError;
}(ExtendableError);

var SIZES = [7, 2, 4, 1, 2, 4];
var NOT_NUMBERS = /[^0-9]/g;

var CalculateCNJ = function () {
  function CalculateCNJ() {
    _classCallCheck(this, CalculateCNJ);

    for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
      parameters[_key] = arguments[_key];
    }

    var args = parameters.map(function (v, i) {
      var r = v;
      if (typeof r === 'number') r = r.toString();
      if (typeof r !== 'string') return r;
      if (!SIZES[i]) return r;
      return pad(SIZES[i], r, '0');
    });

    var _args = _slicedToArray(args, 6),
        proc = _args[0],
        dv = _args[1],
        year = _args[2],
        justice = _args[3],
        number = _args[4],
        court = _args[5];

    var firstStep = iso7064.compute(proc).toString();
    var secondStep = iso7064.compute(firstStep + year + justice + number).toString();
    var thirdStep = iso7064.compute(secondStep + court + '00').toString();

    var ndv = 98 - thirdStep % 97;
    this.dv = pad(2, ndv.toString(), '0');

    if (dv !== null && dv !== this.dv) {
      throw new CalculateCNJError();
    }

    this.proc = proc;
    this.year = year;
    this.justice = justice;
    this.number = number;
    this.court = court;
  }

  _createClass(CalculateCNJ, [{
    key: 'generate',
    value: function generate() {
      var mask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      return !mask ? this.proc + this.dv + this.year + this.justice + this.number + this.court : [this.proc, [this.dv, this.year, this.justice, this.number, this.court].join('.')].join('-');
    }
  }, {
    key: 'pieces',
    get: function get() {
      return {
        proc: this.proc,
        year: this.year,
        justice: this.justice,
        number: this.number,
        court: this.court
      };
    }
  }], [{
    key: 'factory',
    value: function factory(proc, _ref, year) {
      var justice = _ref.justice,
          number = _ref.number,
          court = _ref.court;

      return new CalculateCNJ(proc, null, year, justice, number, court);
    }
  }, {
    key: 'load',
    value: function load(cnj) {
      var numcnj = cnj.replace(NOT_NUMBERS, '');
      var pos = 0;
      return new (Function.prototype.bind.apply(CalculateCNJ, [null].concat(_toConsumableArray(SIZES.map(function (i) {
        var substr = numcnj.substr(pos, i);
        pos += i;
        return substr;
      })))))();
    }
  }]);

  return CalculateCNJ;
}();

require('numeral/locales/pt-br');

numeral.locale('pt-br');
var numeroRegex = /numero/i;
var dataRegex = /data/i;

function camelObject(from) {
  var obj = {};
  _.each(from, function (v, k) {
    obj[changeCase.camelCase(k)] = v;
  });
  return obj;
}

var Processo = function (_Parser2) {
  _inherits(Processo, _Parser2);

  function Processo(elementProcesso, $) {
    _classCallCheck(this, Processo);

    var _this4 = _possibleConstructorReturn(this, (Processo.__proto__ || Object.getPrototypeOf(Processo)).call(this, $));

    _this4.elementProcesso = elementProcesso;
    return _this4;
  }

  _createClass(Processo, [{
    key: 'getter',
    value: function getter(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var df = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var $ = this.$;

      var element = $(this.elementProcesso).children(name);
      if (!element.length) return df;
      var textValue = element.text();
      Object.assign(attributes, element.get().attribs);
      return textValue;
    }
  }, {
    key: 'attributes',
    value: function attributes(name) {
      var df = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var $ = this.$;

      var element = $(this.elementProcesso).children(name);
      if (!element.length) return df;

      var _element$get = element.get(),
          attribs = _element$get.attribs;

      return attribs ? camelObject(attribs) : df;
    }
  }, {
    key: 'dump',
    value: function dump() {
      var _this5 = this;

      var items = _.map(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this)), function (v, key) {
        if (typeof v.get !== 'function') return null;
        var value = v.get.apply(_this5);
        if (!value) return null;
        return _defineProperty({}, changeCase.camelCase(key), value);
      }).filter(function (x) {
        return !!x;
      });
      if (!items.length) return {};
      return Processo.format(Object.assign.apply(Object, _toConsumableArray(items)));
    }
  }, {
    key: 'adicional',
    get: function get() {
      return this.getter('adicional');
    }
  }, {
    key: 'ajuizamento',
    get: function get() {
      return this.getter('ajuizamento');
    }
  }, {
    key: 'area',
    get: function get() {
      return this.getter('area');
    }
  }, {
    key: 'assunto',
    get: function get() {
      return this.getter('assunto');
    }
  }, {
    key: 'atas',
    get: function get() {
      return this.getter('atas');
    }
  }, {
    key: 'cartorio',
    get: function get() {
      return this.getter('cartorio');
    }
  }, {
    key: 'codigoReu',
    get: function get() {
      return this.getter('codigo_reu');
    }
  }, {
    key: 'comarcaInicial',
    get: function get() {
      return this.getter('comarca_inicial');
    }
  }, {
    key: 'decisao',
    get: function get() {
      return this.getter('decisao');
    }
  }, {
    key: 'foro',
    get: function get() {
      return this.getter('foro');
    }
  }, {
    key: 'inscricao',
    get: function get() {
      return this.getter('inscricao');
    }
  }, {
    key: 'localizacao',
    get: function get() {
      return this.getter('localizacao');
    }
  }, {
    key: 'localizacaoImovel',
    get: function get() {
      return this.getter('localizacao_imovel');
    }
  }, {
    key: 'nome',
    get: function get() {
      return this.getter('nome');
    }
  }, {
    key: 'numeroDivida',
    get: function get() {
      return this.getter('numero_divida');
    }
  }, {
    key: 'numeroVara',
    get: function get() {
      return this.getter('numero_vara');
    }
  }, {
    key: 'observacao',
    get: function get() {
      return this.getter('observacao');
    }
  }, {
    key: 'orgao',
    get: function get() {
      return this.getter('orgao');
    }
  }, {
    key: 'origemProcesso',
    get: function get() {
      return this.getter('origem_processo');
    }
  }, {
    key: 'rito',
    get: function get() {
      return this.getter('rito');
    }
  }, {
    key: 'solucao',
    get: function get() {
      return this.getter('solucao');
    }
  }, {
    key: 'acao',
    get: function get() {
      return this.getter('acao');
    }
  }, {
    key: 'andamentoInicial',
    get: function get() {
      return this.getter('andamento_inicial');
    }
  }, {
    key: 'autuacao',
    get: function get() {
      return this.getter('autuacao');
    }
  }, {
    key: 'classe',
    get: function get() {
      return this.getter('classe');
    }
  }, {
    key: 'comarca',
    get: function get() {
      return this.getter('comarca');
    }
  }, {
    key: 'dataValorCausa',
    get: function get() {
      return this.getter('data_valor_causa');
    }
  }, {
    key: 'descricao',
    get: function get() {
      return this.getter('descricao');
    }
  }, {
    key: 'distribuicao',
    get: function get() {
      return this.getter('distribuicao');
    }
  }, {
    key: 'fase',
    get: function get() {
      return this.getter('fase');
    }
  }, {
    key: 'incidente',
    get: function get() {
      return this.getter('incidente');
    }
  }, {
    key: 'instancia',
    get: function get() {
      return this.getter('instancia');
    }
  }, {
    key: 'natureza',
    get: function get() {
      return this.getter('natureza');
    }
  }, {
    key: 'numeroAntigo',
    get: function get() {
      return this.getter('numero_antigo');
    }
  }, {
    key: 'numeroProcesso',
    get: function get() {
      return this.getter('numero_processo');
    }
  }, {
    key: 'numeroProtocolo',
    get: function get() {
      return this.getter('numero_protocolo');
    }
  }, {
    key: 'eletronico',
    get: function get() {
      return this.getter('eletronico');
    }
  }, {
    key: 'situacao',
    get: function get() {
      return this.getter('situacao');
    }
  }, {
    key: 'status',
    get: function get() {
      return this.getter('status');
    }
  }, {
    key: 'valorCausa',
    get: function get() {
      return this.getter('valor_causa');
    }
  }, {
    key: 'vara',
    get: function get() {
      return this.getter('vara');
    }
  }, {
    key: 'justiceSecret',
    get: function get() {
      return this.getter('justiceSecret');
    }
  }, {
    key: 'transitoJulgado',
    get: function get() {
      return this.getter('transitoJulgado');
    }
  }, {
    key: 'urlProcesso',
    get: function get() {
      return this.getter('url_processo');
    }
  }, {
    key: 'adicionalAttributes',
    get: function get() {
      return this.attributes('adicional');
    }
  }, {
    key: 'ajuizamentoAttributes',
    get: function get() {
      return this.attributes('ajuizamento');
    }
  }, {
    key: 'areaAttributes',
    get: function get() {
      return this.attributes('area');
    }
  }, {
    key: 'assuntoAttributes',
    get: function get() {
      return this.attributes('assunto');
    }
  }, {
    key: 'atasAttributes',
    get: function get() {
      return this.attributes('atas');
    }
  }, {
    key: 'cartorioAttributes',
    get: function get() {
      return this.attributes('cartorio');
    }
  }, {
    key: 'codigoReuAttributes',
    get: function get() {
      return this.attributes('codigo_reu');
    }
  }, {
    key: 'comarcaInicialAttributes',
    get: function get() {
      return this.attributes('comarca_inicial');
    }
  }, {
    key: 'decisaoAttributes',
    get: function get() {
      return this.attributes('decisao');
    }
  }, {
    key: 'foroAttributes',
    get: function get() {
      return this.attributes('foro');
    }
  }, {
    key: 'inscricaoAttributes',
    get: function get() {
      return this.attributes('inscricao');
    }
  }, {
    key: 'localizacaoAttributes',
    get: function get() {
      return this.attributes('localizacao');
    }
  }, {
    key: 'localizacaoImovelAttributes',
    get: function get() {
      return this.attributes('localizacao_imovel');
    }
  }, {
    key: 'nomeAttributes',
    get: function get() {
      return this.attributes('nome');
    }
  }, {
    key: 'numeroDividaAttributes',
    get: function get() {
      return this.attributes('numero_divida');
    }
  }, {
    key: 'numeroVaraAttributes',
    get: function get() {
      return this.attributes('numero_vara');
    }
  }, {
    key: 'observacaoAttributes',
    get: function get() {
      return this.attributes('observacao');
    }
  }, {
    key: 'orgaoAttributes',
    get: function get() {
      return this.attributes('orgao');
    }
  }, {
    key: 'origemProcessoAttributes',
    get: function get() {
      return this.attributes('origem_processo');
    }
  }, {
    key: 'ritoAttributes',
    get: function get() {
      return this.attributes('rito');
    }
  }, {
    key: 'solucaoAttributes',
    get: function get() {
      return this.attributes('solucao');
    }
  }, {
    key: 'acaoAttributes',
    get: function get() {
      return this.attributes('acao');
    }
  }, {
    key: 'andamentoInicialAttributes',
    get: function get() {
      return this.attributes('andamento_inicial');
    }
  }, {
    key: 'autuacaoAttributes',
    get: function get() {
      return this.attributes('autuacao');
    }
  }, {
    key: 'classeAttributes',
    get: function get() {
      return this.attributes('classe');
    }
  }, {
    key: 'comarcaAttributes',
    get: function get() {
      return this.attributes('comarca');
    }
  }, {
    key: 'dataValorCausaAttributes',
    get: function get() {
      return this.attributes('data_valor_causa');
    }
  }, {
    key: 'descricaoAttributes',
    get: function get() {
      return this.attributes('descricao');
    }
  }, {
    key: 'distribuicaoAttributes',
    get: function get() {
      return this.attributes('distribuicao');
    }
  }, {
    key: 'faseAttributes',
    get: function get() {
      return this.attributes('fase');
    }
  }, {
    key: 'incidenteAttributes',
    get: function get() {
      return this.attributes('incidente');
    }
  }, {
    key: 'instanciaAttributes',
    get: function get() {
      return this.attributes('instancia');
    }
  }, {
    key: 'naturezaAttributes',
    get: function get() {
      return this.attributes('natureza');
    }
  }, {
    key: 'numeroAntigoAttributes',
    get: function get() {
      return this.attributes('numero_antigo');
    }
  }, {
    key: 'numeroProcessoAttributes',
    get: function get() {
      return this.attributes('numero_processo');
    }
  }, {
    key: 'numeroProtocoloAttributes',
    get: function get() {
      return this.attributes('numero_protocolo');
    }
  }, {
    key: 'eletronicoAttributes',
    get: function get() {
      return this.attributes('eletronico');
    }
  }, {
    key: 'situacaoAttributes',
    get: function get() {
      return this.attributes('situacao');
    }
  }, {
    key: 'statusAttributes',
    get: function get() {
      return this.attributes('status');
    }
  }, {
    key: 'valorCausaAttributes',
    get: function get() {
      return this.attributes('valor_causa');
    }
  }, {
    key: 'varaAttributes',
    get: function get() {
      return this.attributes('vara');
    }
  }, {
    key: 'justiceSecretAttributes',
    get: function get() {
      return this.attributes('justiceSecret');
    }
  }, {
    key: 'transitoJulgadoAttributes',
    get: function get() {
      return this.attributes('transitoJulgado');
    }
  }, {
    key: 'urlProcessoAttributes',
    get: function get() {
      return this.attributes('url_processo');
    }
  }, {
    key: 'advogados',
    get: function get() {
      var $ = this.$;

      return $('advogados advogado', this.elementProcesso).map(function (i, advogado) {
        return Object.assign({}, camelObject(advogado.attribs), {
          nome: $(advogado).text().trim()
        });
      }).get();
    }
  }, {
    key: 'partes',
    get: function get() {
      var $ = this.$;

      return $('partes parte', this.elementProcesso).map(function (i, parte) {
        return Object.assign({}, camelObject(parte.attribs), {
          nome: $(parte).text().trim()
        });
      }).get();
    }
  }, {
    key: 'andamentos',
    get: function get() {
      var $ = this.$;

      return $('andamentos andamento', this.elementProcesso).map(function (i, andamento) {
        return Object.assign.apply(Object, _toConsumableArray(_.flattenDeep($(andamento).children().map(function (ik, k) {
          return [_defineProperty({}, changeCase.camelCase(k.name), $(k).text()), k.attribs || {}];
        }).get())));
      }).get();
    }
  }, {
    key: 'tags',
    get: function get() {
      var $ = this.$;

      var tags = $('tags tag', this.elementProcesso).map(function (i, tag) {
        return _defineProperty({}, $(tag).text().trim(), camelObject(tag.attribs));
      }).get();
      if (!tags.length) return [];
      return Object.assign.apply(Object, _toConsumableArray(tags));
    }
  }], [{
    key: 'formatItem',
    value: function formatItem(v, k, dump) {
      var _this6 = this;

      if (Array.isArray(v)) return v.map(function (n) {
        return _this6.formatItem(n, k, dump);
      });
      if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') return Processo.format(v);
      if (k === 'numeroProcesso') return v;
      if (k === 'numeroAntigo') return v;
      if (['valorCausa', 'instancia'].indexOf(k) !== -1 || numeroRegex.test(k)) return numeral(v).value();
      if (k === 'eletronico') return v === '1';
      if (dataRegex.test(k) || ['inscricao', 'transitoJulgado', 'ajuizamento', 'autuacao', 'distribuicao', 'autuacao', 'andamentoInicial', 'dataValorCausa'].indexOf(k) !== -1) {
        return moment(v, phpMoment(dump.format || (dump[k + 'Attributes'] ? dump[k + 'Attributes'].format : null) || 'd/m/Y')).toDate();
      }

      return v;
    }
  }, {
    key: 'format',
    value: function format(dump) {
      var ret = _.mapValues(dump, function (v, k) {
        return Processo.formatItem(v, k, dump);
      });
      ret = Processo.formatNumeroProcesso(ret);
      return ret;
    }
  }, {
    key: 'formatNumeroProcesso',
    value: function formatNumeroProcesso(proc) {
      if (!proc.numeroProcesso) return proc;

      var ret = proc;

      try {
        var cnj = CalculateCNJ.load(ret.numeroProcesso);
        ret.numeroProcesso = cnj.generate(true); /* cnj mask */
        ret.cnj = cnj.pieces;
      } catch (e) {
        /* pass */
      }

      return ret;
    }
  }]);

  return Processo;
}(Parser);

var Processos$1 = function (_Parser3) {
  _inherits(Processos$1, _Parser3);

  function Processos$1() {
    _classCallCheck(this, Processos$1);

    return _possibleConstructorReturn(this, (Processos$1.__proto__ || Object.getPrototypeOf(Processos$1)).apply(this, arguments));
  }

  _createClass(Processos$1, [{
    key: 'dump',
    value: function dump() {
      var $ = _get(Processos$1.prototype.__proto__ || Object.getPrototypeOf(Processos$1.prototype), 'dump', this).call(this);
      return { processos: $('body > processo').map(function (i, p) {
          return new Processo(p, $).parse();
        }).get() };
    }
  }]);

  return Processos$1;
}(Parser);

var OAB = function (_Parser4) {
  _inherits(OAB, _Parser4);

  function OAB() {
    _classCallCheck(this, OAB);

    return _possibleConstructorReturn(this, (OAB.__proto__ || Object.getPrototypeOf(OAB)).apply(this, arguments));
  }

  _createClass(OAB, [{
    key: 'readNode',
    value: function readNode(key, node) {
      var $ = this.$;


      return _.pickBy(Object.assign({}, node.attribs, _defineProperty({}, key, $(node).text().trim())), function (v) {
        return !!v;
      });
    }
  }, {
    key: 'childrenDump',
    value: function childrenDump(node) {
      var _this9 = this;

      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var $ = this.$;


      var element = $(node);
      var nodeChildren = element.children();

      if (children) {
        return this.readNode(changeCase.camelCase(node.name), node);
      }

      return Object.assign.apply(Object, _toConsumableArray(nodeChildren.map(function (ip, e) {
        var key = changeCase.camelCase(e.name);

        var elementChildren = $(e).children();
        if (elementChildren.length) {
          return _defineProperty({}, '' + key, elementChildren.map(function (i, n) {
            return _this9.childrenDump(n, true);
          }).get());
        }

        return _this9.readNode(key, e);
      }).get()));
    }
  }, {
    key: 'dump',
    value: function dump() {
      var _this10 = this;

      var $ = this.$;

      return $('body advogado processos processo').map(function (i, processoNode) {
        return OAB.formatQuery(Processo.formatNumeroProcesso(_this10.childrenDump(processoNode)));
      }).get()[0];
    }
  }], [{
    key: 'formatQuery',
    value: function formatQuery(proc) {
      var ret = proc;
      ret.query = 'SELECT FROM \'' + proc.tribunalNome + '\'.\'' + proc.tribunalConsulta + '\'';
      if (proc.parametros && proc.parametros.length) {
        ret.query += ' WHERE ' + proc.parametros.map(function (_ref6) {
          var name = _ref6.name,
              parametro = _ref6.parametro;
          return '\'' + name + '\' = \'' + parametro + '\'';
        }).join(' AND ');
      }
      return ret;
    }
  }]);

  return OAB;
}(Parser);

var FREE_APIKEY = '6057b71263c21e4ada266c9d4d4da613';

var DEFAULT_ENDPOINT = {
  protocol: 'https:',
  host: 'irql.bipbop.com.br',
  hostname: 'irql.bipbop.com.br',
  pathname: '/'
};

var BIPBOPWebService = function () {
  function BIPBOPWebService() {
    var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : FREE_APIKEY;

    _classCallCheck(this, BIPBOPWebService);

    this.apiKey = apiKey;
  }

  _createClass(BIPBOPWebService, [{
    key: 'default',
    value: function _default() {
      var defaultParser = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this.request.apply(this, args).then(function (data) {
        return Parser.openString(data, defaultParser || Parser);
      }).then(function (parser) {
        return parser.load();
      });
    }
  }, {
    key: 'request',
    value: function request(q) {
      var form = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var urlParameters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var endpoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      var urlData = Object.assign({
        query: querystring.stringify(Object.assign({}, urlParameters, {
          q: q,
          apiKey: this.apiKey
        }))
      }, endpoint, DEFAULT_ENDPOINT);

      urlData.search = '?' + urlData.query;

      var requestOptions = Object.assign({
        method: 'POST',
        form: form
      }, options, {
        url: urlData
      });

      return Promise.resolve().then(function () {
        return _request(requestOptions);
      }).catch(function (e) {
        if (e && e.response && e.response.body) Parser.openString(e.response.body).assertDocument();
        throw e;
      });
    }
  }]);

  return BIPBOPWebService;
}();

var PUSH_APPEND_REGEX = /^push/i;

var parameter = {
  at: 'pushAt',
  document: 'pushDocument',
  documentCharset: 'pushDocumentCharset',
  documentContentType: 'pushDocumentContentType',
  everyCase: 'pushEveryCase',
  expire: 'pushExpire',
  id: 'pushId',
  interval: 'pushInterval',
  label: 'pushLabel',
  locked: 'pushLocked',
  maxCallbackTrys: 'pushMaxCallbackTrys',
  maxVersion: 'pushMaxVersion',
  priority: 'pushPriority',
  query: 'pushQuery',
  tags: 'pushTags',
  tryIn: 'pushTryIn',
  version: 'pushVersion',
  webSocketDeliver: 'pushWebSocketDeliver',
  weekdays: 'pushWeekdays'
};

var Push = function () {
  function Push(ws) {
    var pushController = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'PUSH';

    _classCallCheck(this, Push);

    this.ws = ws;
    this.pushController = pushController;
  }

  _createClass(Push, [{
    key: 'request',
    value: function request(method, table) {
      for (var _len3 = arguments.length, args = Array(_len3 > 4 ? _len3 - 4 : 0), _key3 = 4; _key3 < _len3; _key3++) {
        args[_key3 - 4] = arguments[_key3];
      }

      var _this11 = this;

      var form = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var parser = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var query = method + ' \'' + this.pushController + '\'.\'' + table + '\'';
      return Promise.resolve().then(function () {
        var _ws;

        return (_ws = _this11.ws).default.apply(_ws, [parser, query, form].concat(args));
      });
    }
  }, {
    key: 'deleteJob',
    value: function deleteJob(parameters) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return this.request.apply(this, ['DELETE FROM', 'JOB', Push.idOrLabel(parameters)].concat(args));
    }
  }, {
    key: 'deleteJobs',
    value: function deleteJobs() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return this.request.apply(this, ['DELETE FROM', 'JOBS'].concat(args));
    }
  }, {
    key: 'insertJob',
    value: function insertJob(parameters) {
      for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      return this.request.apply(this, ['INSERT INTO', 'JOB', parameters].concat(args));
    }
  }, {
    key: 'selectDeletedDocument',
    value: function selectDeletedDocument(id) {
      for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }

      return this.request.apply(this, ['SELECT FROM', 'DELETEDDOCUMENT', id ? { id: id } : {}].concat(args));
    }
  }, {
    key: 'selectDeletedJob',
    value: function selectDeletedJob(id) {
      for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        args[_key8 - 1] = arguments[_key8];
      }

      return this.request.apply(this, ['SELECT FROM', 'DELETEDJOB', id ? { id: id } : {}].concat(args));
    }
  }, {
    key: 'selectDocument',
    value: function selectDocument(parameters) {
      for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
        args[_key9 - 1] = arguments[_key9];
      }

      return this.request.apply(this, ['SELECT FROM', 'DOCUMENT', Push.idOrLabel(parameters)].concat(args));
    }
  }, {
    key: 'selectForceCallback',
    value: function selectForceCallback(parameters) {
      for (var _len10 = arguments.length, args = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
        args[_key10 - 1] = arguments[_key10];
      }

      return this.request.apply(this, ['SELECT FROM', 'FORCECALLBACK', Push.idOrLabel(parameters)].concat(args));
    }
  }, {
    key: 'selectFullReport',
    value: function selectFullReport(parameters) {
      for (var _len11 = arguments.length, args = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
        args[_key11 - 1] = arguments[_key11];
      }

      return this.request.apply(this, ['SELECT FROM', 'FULLREPORT', Push.filterPush(parameters)].concat(args));
    }
  }, {
    key: 'selectHistory',
    value: function selectHistory(id) {
      for (var _len12 = arguments.length, args = Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
        args[_key12 - 1] = arguments[_key12];
      }

      return this.request.apply(this, ['SELECT FROM', 'HISTORY', { id: id }].concat(args));
    }
  }, {
    key: 'selectJob',
    value: function selectJob(parameters) {
      for (var _len13 = arguments.length, args = Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
        args[_key13 - 1] = arguments[_key13];
      }

      return this.request.apply(this, ['SELECT FROM', 'JOB', Push.filterPush(parameters)].concat(args));
    }
  }, {
    key: 'selectReport',
    value: function selectReport(parameters) {
      for (var _len14 = arguments.length, args = Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
        args[_key14 - 1] = arguments[_key14];
      }

      return this.request.apply(this, ['SELECT FROM', 'REPORT', Push.filterPush(parameters)].concat(args));
    }
  }, {
    key: 'selectReportRemoved',
    value: function selectReportRemoved(parameters) {
      for (var _len15 = arguments.length, args = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
        args[_key15 - 1] = arguments[_key15];
      }

      return this.request.apply(this, ['SELECT FROM', 'REPORTREMOVED', Push.filterPush(parameters)].concat(args));
    }
  }, {
    key: 'updateJob',
    value: function updateJob(parameters) {
      for (var _len16 = arguments.length, args = Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
        args[_key16 - 1] = arguments[_key16];
      }

      return this.request.apply(this, ['UPDATE', 'JOB', Push.filterPush(parameters)].concat(args));
    }
  }], [{
    key: 'filterPush',
    value: function filterPush(filter) {
      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(_.map(filter, function (v, k) {
        var _ref7;

        return _ref7 = {}, _defineProperty(_ref7, changeCase.camelCase(k.replace(PUSH_APPEND_REGEX, '')), v), _defineProperty(_ref7, k, v), _ref7;
      }))));
    }
  }, {
    key: 'idOrLabel',
    value: function idOrLabel(_ref8) {
      var _$pickBy;

      var pushId = _ref8.pushId,
          pushLabel = _ref8.pushLabel;

      return Push.filterPush(_.pickBy((_$pickBy = {}, _defineProperty(_$pickBy, parameter.id, pushId), _defineProperty(_$pickBy, parameter.label, pushLabel), _$pickBy), function (value) {
        return !!value;
      }));
    }
  }]);

  return Push;
}();

Object.assign(Processos$1, {
  Processos: Processos$1,
  CalculateCNJ: CalculateCNJ,
  exceptions: errorCodes,
  Parser: Parser,
  Info: Info,
  OAB: OAB,
  WebService: BIPBOPWebService,
  Push: Push
});

module.exports = Processos$1;