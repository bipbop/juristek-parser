const path = require('path');
const fs = require('fs');
const JuristekParser = require('../lib/index.js');

describe('read processos', () => {
  it('parse processo.xml', () => {
    const processoStr = fs.readFileSync(path.join(__dirname, './info.xml'));
    const processos = JuristekParser.Parser.openString(processoStr, JuristekParser.Info);
    console.log(JSON.stringify(processos.dump(), null, 4));
  });
});
