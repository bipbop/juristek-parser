const Parser = require('./parser');

module.exports = class Info extends Parser {
  dump() {
    const { $ } = this;
    return $('database').map((i, databaseNode) => $('table', databaseNode).map((it, tableNode) => ({
      table: tableNode.attribs,
      database: databaseNode.attribs,
      fields: $('field', tableNode).map((fi, fieldNode) => Object.assign(fieldNode.attribs, {
        options: $('option', fieldNode).map((oi, optionNode) => Object.assign(optionNode.attribs, {
          text: $(optionNode).text(),
        })).get(0),
      })).get(),
    })).get()).get();
  }
};
