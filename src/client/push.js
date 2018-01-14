const _ = require('underscore');
const Promise = require('bluebird');
const Parser = require('../parser');

const PUSH_APPEND_REGEX = /^push/i;

const parameter = {
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
  weekdays: 'pushWeekdays',
};

module.exports.parameter = parameter;

module.exports = class Push {
  constructor(ws, pushController = 'PUSH') {
    this.ws = ws;
    this.pushController = pushController;
  }

  request(method, table, form = {}) {
    const query = `${method} '${this.pushController}'.'${table}'`;
    return Promise.resolve()
      .then(() => this.ws.request(query, { form }))
      .then(data => new Parser(data))
      .tap(parser => parser.assertDocument())
      .then(parser => parser.$);
  }

  static filterPush(filter) {
    return _.map(filter, (v, k) => ({ [k.replace(PUSH_APPEND_REGEX, '')]: v }));
  }

  static idOrLabel({ pushId, pushLabel }) {
    return Push.filterPush(_.pick({
      [parameter.id]: pushId,
      [parameter.label]: pushLabel,
    }, value => !!value));
  }

  deleteJob(parameters) {
    return this.request('DELETE FROM', 'Job', Push.idOrLabel(parameters));
  }

  deleteJobs() {
    return this.request('DELETE FROM', 'Jobs');
  }

  insertJob(parameters) {
    return this.request('INSERT INTO', 'Job', parameters);
  }

  selectDeletedDocument(id) {
    return this.request('SELECT FROM', 'DeletedDocument', id ? { id } : {});
  }

  selectDeletedJob(id) {
    return this.request('SELECT FROM', 'DeletedJob', id ? { id } : {});
  }

  selectDocument(parameters) {
    return this.request('SELECT FROM', 'Document', Push.idOrLabel(parameters));
  }

  selectForceCallback(parameters) {
    return this.request('SELECT FROM', 'ForceCallback', Push.idOrLabel(parameters));
  }

  selectFullReport(parameters) {
    return this.request('SELECT FROM', 'FullReport', Push.filterPush(parameters));
  }

  selectHistory(id) {
    return this.request('SELECT FROM', 'History', { id });
  }

  selectJob(parameters) {
    return this.request('SELECT FROM', 'Job', Push.filterPush(parameters));
  }

  selectReport(parameters) {
    return this.request('SELECT FROM', 'Report', Push.filterPush(parameters));
  }

  selectReportRemoved(parameters) {
    return this.request('SELECT FROM', 'ReportRemoved', Push.filterPush(parameters));
  }

  updateJob(parameters) {
    return this.request('UPDATE', 'Job', Push.filterPush(parameters));
  }
};
