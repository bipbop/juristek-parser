const Parser = require('./parser');
const changeCase = require('change-case');
const { Processo } = require('./processos');
const _ = require('lodash');

module.exports = class OAB extends Parser {
  readNode(key, node) {
    const { $ } = this;

    return _.pickBy(Object.assign({}, node.attribs, {
      [key]: $(node).text().trim(),
    }), v => !!v);
  }

  childrenDump(node, children = false) {
    const { $ } = this;

    const element = $(node);
    const nodeChildren = element.children();

    if (children) {
      return this.readNode(changeCase.camelCase(node.name), node);
    }

    return Object.assign(...nodeChildren.map((ip, e) => {
      const key = changeCase.camelCase(e.name);

      const elementChildren = $(e).children();
      if (elementChildren.length) {
        return { [`${key}`]: elementChildren.map((i, n) => this.childrenDump(n, true)).get() };
      }

      return this.readNode(key, e);
    }).get());
  }

  static formatQuery(proc) {
    const ret = proc;
    ret.query = `SELECT FROM '${proc.tribunalNome}'.'${proc.tribunalConsulta}'`;
    if (proc.parametros && proc.parametros.length) {
      ret.query += ` WHERE ${proc.parametros.map(({ name, parametro }) => `'${name}' = '${parametro}'`).join(' AND ')}`;
    }
    return ret;
  }

  dump() {
    const { $ } = this;
    return $('body advogado processos processo').map((i, processoNode) =>
      OAB.formatQuery(Processo.formatNumeroProcesso(this.childrenDump(processoNode)))).get()[0];
  }
};
