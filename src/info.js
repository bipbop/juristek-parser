import Parser from './parser';

export default class Info extends Parser {
  dump() {
    const { $ } = this;
    return $('database').map((i, databaseNode) => $('table', databaseNode).map((it, tableNode) => ({
      table: tableNode.attribs,
      database: databaseNode.attribs,
      fields: $('field', tableNode).map((fi, fieldNode) => Object.assign(fieldNode.attribs, {
        otherMasks: $('alternative_mask', fieldNode).map((oi, optionNode) => $(optionNode).text()).get(),
        options: $('option', fieldNode).map((oi, optionNode) => Object.assign(optionNode.attribs, {
          text: $(optionNode).text(),
        })).get(),
      })).get(),
    })).get()).get();
  }
}
