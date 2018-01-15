const _ = require('underscore');
const Promise = require('bluebird');
const changeCase = require('change-case');

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

class Push {
  constructor(ws, pushController = 'PUSH') {
    this.ws = ws;
    this.pushController = pushController;
  }

  request(method, table, form = {}, parser = null, ...args) {
    const query = `${method} '${this.pushController}'.'${table}'`;
    return Promise.resolve()
      .then(() => this.ws.default(parser, query, form, ...args));
  }

  static filterPush(filter) {
    return Object.assign({}, ..._.map(filter, (v, k) => ({ [changeCase.camelCase(k.replace(PUSH_APPEND_REGEX, ''))]: v, [k]: v })));
  }

  static idOrLabel({ pushId, pushLabel }) {
    return Push.filterPush(_.pick({
      [parameter.id]: pushId,
      [parameter.label]: pushLabel,
    }, value => !!value));
  }

  deleteJob(parameters, ...args) {
    return this.request('DELETE FROM', 'JOB', Push.idOrLabel(parameters), ...args);
  }

  deleteJobs(...args) {
    return this.request('DELETE FROM', 'JOBS', ...args);
  }

  insertJob(parameters, ...args) {
    return this.request('INSERT INTO', 'JOB', parameters, ...args);
  }

  selectDeletedDocument(id, ...args) {
    return this.request('SELECT FROM', 'DELETEDDOCUMENT', id ? { id } : {}, ...args);
  }

  selectDeletedJob(id, ...args) {
    return this.request('SELECT FROM', 'DELETEDJOB', id ? { id } : {}, ...args);
  }

  selectDocument(parameters, ...args) {
    return this.request('SELECT FROM', 'DOCUMENT', Push.idOrLabel(parameters), ...args);
  }

  selectForceCallback(parameters, ...args) {
    return this.request('SELECT FROM', 'FORCECALLBACK', Push.idOrLabel(parameters), ...args);
  }

  selectFullReport(parameters, ...args) {
    return this.request('SELECT FROM', 'FULLREPORT', Push.filterPush(parameters), ...args);
  }

  selectHistory(id, ...args) {
    return this.request('SELECT FROM', 'HISTORY', { id }, ...args);
  }

  selectJob(parameters, ...args) {
    return this.request('SELECT FROM', 'JOB', Push.filterPush(parameters), ...args);
  }

  selectReport(parameters, ...args) {
    return this.request('SELECT FROM', 'REPORT', Push.filterPush(parameters), ...args);
  }

  selectReportRemoved(parameters, ...args) {
    return this.request('SELECT FROM', 'REPORTREMOVED', Push.filterPush(parameters), ...args);
  }

  updateJob(parameters, ...args) {
    return this.request('UPDATE', 'JOB', Push.filterPush(parameters), ...args);
  }
}

module.exports = Push;
module.exports.pushParameter = parameter;
