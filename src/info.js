import objectAssign from 'object-assign';

import Parser from './parser';

export default class Info extends Parser {
  static compatible(info, procNumber, fieldName = 'numero_processo') {
    return info.filter(({ fields }) => fields
      .filter(({ name }) => (name === fieldName)).filter(({ otherMasks, mask }) => {
        const masks = [mask].concat(otherMasks);
        return masks.map(x => new RegExp(`^${x
          .replace(/(\.)/g, '\\$1')
          .replace(/N+/g, '\\d+')
          .replace(/[A-Z]/g, '\\d')}$`).test(procNumber)).find(x => (x === true));
      }).length);
  }

  dump() {
    const { $ } = this;
    return $('database').map((i, databaseNode) => $('table', databaseNode).map((it, tableNode) => ({
      table: tableNode.attribs,
      database: databaseNode.attribs,
      fields: $('field', tableNode).map((fi, fieldNode) => objectAssign(fieldNode.attribs, {
        otherMasks: $('alternative_mask', fieldNode).map((oi, optionNode) => $(optionNode).text()).get(),
        options: $('option', fieldNode).map((oi, optionNode) => objectAssign(optionNode.attribs, {
          text: $(optionNode).text(),
        })).get(),
      })).get(),
    })).get()).get();
  }
}
