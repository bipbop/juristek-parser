import each from 'lodash/each';
import camelCase from 'camel-case';

import mapValues from 'lodash/mapValues';
import flattenDeep from 'lodash/flattenDeep';
import map from 'lodash/map';
import moment from 'moment';
import CalculateCNJ from 'validate-cnj';
import fixUtf8 from 'fix-utf8';
import objectAssign from 'object-assign';
import numeral from 'numeral';

import Parser from './parser';
import phpMoment from './php-moment';

const numeroRegex = /numero/i;
const dataRegex = /data(?!base)/i;

numeral.locale('pt-br');

function camelObject(from) {
  const obj = {};
  each(from, (v, k) => {
    obj[camelCase(k)] = v;
  });
  return obj;
}

export function formatNumeroProcesso(proc) {
  if (!proc.numeroProcesso) return proc;

  const ret = proc;

  try {
    const cnj = CalculateCNJ.load(ret.numeroProcesso);
    ret.numeroProcesso = cnj.generate(true); /* cnj mask */
    ret.cnj = cnj.pieces;
  } catch (e) {
    /* pass */
  }

  return ret;
}


export default class Processo extends Parser {
  constructor(elementProcesso, $) {
    super($);
    this.elementProcesso = elementProcesso;
  }

  static formatItem(v, k, dump) {
    if (Array.isArray(v)) return v.map(n => this.formatItem(n, k, dump));
    if (typeof v === 'object') return Processo.format(v);
    if (k === 'numeroProcesso') return v;
    if (k === 'numeroAntigo') return v;
    if (['valorCausa', 'instancia'].indexOf(k) !== -1 || numeroRegex.test(k)) return numeral(v).value();
    if (k === 'eletronico') return v === '1';
    if (dataRegex.test(k) || ['inscricao', 'transitoJulgado', 'ajuizamento', 'autuacao', 'distribuicao', 'andamentoInicial', 'dataValorCausa'].indexOf(k) !== -1) {
      const n = moment(v, phpMoment(dump.format || (dump[`${k}Attributes`] ? dump[`${k}Attributes`].format : null) || 'd/m/Y'));
      return n.isValid() ? n.toDate() : v;
    }

    return v;
  }

  static format(dump) {
    let ret = mapValues(dump, (v, k) => Processo.formatItem(v, k, dump));
    ret = formatNumeroProcesso(ret);
    return ret;
  }

  getter(name, attributes = {}, df = null) {
    const { $ } = this;
    const element = $(this.elementProcesso).children(name);
    if (!element.length) return df;
    const textValue = element.text();
    objectAssign(attributes, element.get().attribs);
    return fixUtf8(textValue);
  }

  attributes(name, df = null) {
    const { $ } = this;
    const element = $(this.elementProcesso).children(name);
    if (!element.length) return df;
    const { attribs } = element.get();
    return attribs ? mapValues(camelObject(attribs), v => fixUtf8(v)) : df;
  }

  get dadosCaptura() { return this.elementProcesso.attribs; }

  get adicional() { return this.getter('adicional'); }

  get ajuizamento() { return this.getter('ajuizamento'); }

  get area() { return this.getter('area'); }

  get assunto() { return this.getter('assunto'); }

  get atas() { return this.getter('atas'); }

  get cartorio() { return this.getter('cartorio'); }

  get codigoReu() { return this.getter('codigo_reu'); }

  get comarcaInicial() { return this.getter('comarca_inicial'); }

  get decisao() { return this.getter('decisao'); }

  get foro() { return this.getter('foro'); }

  get inscricao() { return this.getter('inscricao'); }

  get localizacao() { return this.getter('localizacao'); }

  get localizacaoImovel() { return this.getter('localizacao_imovel'); }

  get nome() { return this.getter('nome'); }

  get numeroDivida() { return this.getter('numero_divida'); }

  get numeroVara() { return this.getter('numero_vara'); }

  get observacao() { return this.getter('observacao'); }

  get orgao() { return this.getter('orgao'); }

  get origemProcesso() { return this.getter('origem_processo'); }

  get rito() { return this.getter('rito'); }

  get solucao() { return this.getter('solucao'); }

  get acao() { return this.getter('acao'); }

  get andamentoInicial() { return this.getter('andamento_inicial'); }

  get autuacao() { return this.getter('autuacao'); }

  get classe() { return this.getter('classe'); }

  get comarca() { return this.getter('comarca'); }

  get dataValorCausa() { return this.getter('data_valor_causa'); }

  get descricao() { return this.getter('descricao'); }

  get distribuicao() { return this.getter('distribuicao'); }

  get fase() { return this.getter('fase'); }

  get incidente() { return this.getter('incidente'); }

  get instancia() { return this.getter('instancia'); }

  get natureza() { return this.getter('natureza'); }

  get numeroAntigo() { return this.getter('numero_antigo'); }

  get numeroProcesso() { return this.getter('numero_processo'); }

  get numeroProtocolo() { return this.getter('numero_protocolo'); }

  get eletronico() { return this.getter('eletronico'); }

  get situacao() { return this.getter('situacao'); }

  get status() { return this.getter('status'); }

  get valorCausa() { return this.getter('valor_causa'); }

  get vara() { return this.getter('vara'); }

  get justiceSecret() { return this.getter('justiceSecret'); }

  get transitoJulgado() { return this.getter('transitoJulgado'); }

  get urlProcesso() { return this.getter('url_processo'); }

  get adicionalAttributes() { return this.attributes('adicional'); }

  get ajuizamentoAttributes() { return this.attributes('ajuizamento'); }

  get areaAttributes() { return this.attributes('area'); }

  get assuntoAttributes() { return this.attributes('assunto'); }

  get atasAttributes() { return this.attributes('atas'); }

  get cartorioAttributes() { return this.attributes('cartorio'); }

  get codigoReuAttributes() { return this.attributes('codigo_reu'); }

  get comarcaInicialAttributes() { return this.attributes('comarca_inicial'); }

  get decisaoAttributes() { return this.attributes('decisao'); }

  get foroAttributes() { return this.attributes('foro'); }

  get inscricaoAttributes() { return this.attributes('inscricao'); }

  get localizacaoAttributes() { return this.attributes('localizacao'); }

  get localizacaoImovelAttributes() { return this.attributes('localizacao_imovel'); }

  get nomeAttributes() { return this.attributes('nome'); }

  get numeroDividaAttributes() { return this.attributes('numero_divida'); }

  get numeroVaraAttributes() { return this.attributes('numero_vara'); }

  get observacaoAttributes() { return this.attributes('observacao'); }

  get orgaoAttributes() { return this.attributes('orgao'); }

  get origemProcessoAttributes() { return this.attributes('origem_processo'); }

  get ritoAttributes() { return this.attributes('rito'); }

  get solucaoAttributes() { return this.attributes('solucao'); }

  get acaoAttributes() { return this.attributes('acao'); }

  get andamentoInicialAttributes() { return this.attributes('andamento_inicial'); }

  get autuacaoAttributes() { return this.attributes('autuacao'); }

  get classeAttributes() { return this.attributes('classe'); }

  get comarcaAttributes() { return this.attributes('comarca'); }

  get dataValorCausaAttributes() { return this.attributes('data_valor_causa'); }

  get descricaoAttributes() { return this.attributes('descricao'); }

  get distribuicaoAttributes() { return this.attributes('distribuicao'); }

  get faseAttributes() { return this.attributes('fase'); }

  get incidenteAttributes() { return this.attributes('incidente'); }

  get instanciaAttributes() { return this.attributes('instancia'); }

  get naturezaAttributes() { return this.attributes('natureza'); }

  get numeroAntigoAttributes() { return this.attributes('numero_antigo'); }

  get numeroProcessoAttributes() { return this.attributes('numero_processo'); }

  get numeroProtocoloAttributes() { return this.attributes('numero_protocolo'); }

  get eletronicoAttributes() { return this.attributes('eletronico'); }

  get situacaoAttributes() { return this.attributes('situacao'); }

  get statusAttributes() { return this.attributes('status'); }

  get valorCausaAttributes() { return this.attributes('valor_causa'); }

  get varaAttributes() { return this.attributes('vara'); }

  get justiceSecretAttributes() { return this.attributes('justiceSecret'); }

  get transitoJulgadoAttributes() { return this.attributes('transitoJulgado'); }

  get urlProcessoAttributes() { return this.attributes('url_processo'); }

  get advogados() {
    const { $ } = this;
    return $('advogados advogado', this.elementProcesso).map((i, advogado) => objectAssign({}, camelObject(advogado.attribs), {
      nome: $(advogado).text().trim(),
    })).get();
  }

  get partes() {
    const { $ } = this;
    return $('partes parte', this.elementProcesso).map((i, parte) => objectAssign(
      {},
      mapValues(camelObject(parte.attribs), v => fixUtf8(v)), {
        nome: fixUtf8($(parte).text().trim()),
      },
    )).get();
  }

  get documentos() {
    const { $ } = this;
    return $('documentos documento', this.elementProcesso).map((i, andamento) => objectAssign(...flattenDeep($(andamento).children().map((ik, k) => [{ [camelCase(k.name)]: fixUtf8($(k).text()) }, k.attribs || {}]).get()))).get();
  }


  get andamentos() {
    const { $ } = this;
    return $('andamentos andamento', this.elementProcesso).map((i, andamento) => objectAssign(...flattenDeep($(andamento).children().map((ik, k) => [{ [camelCase(k.name)]: fixUtf8($(k).text()) }, k.attribs || {}]).get()))).get()
      .reduce((obj, item) => objectAssign(obj, { [item.hash]: item }), {});
  }

  get tags() {
    const { $ } = this;
    const tags = $('tags tag', this.elementProcesso).map((i, tag) => ({ [$(tag).text().trim()]: camelObject(tag.attribs) })).get();
    if (!tags.length) return {};
    return objectAssign(...tags);
  }

  dump() {
    const items = map(
      Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this)),
      (v, key) => {
        if (typeof v.get !== 'function') return null;
        const value = v.get.apply(this);
        if (!value) return null;
        return { [camelCase(key)]: value };
      },
    ).filter(x => !!x);
    if (!items.length) return {};
    return Processo.format(objectAssign({}, ...items));
  }
}
